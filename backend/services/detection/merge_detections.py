from typing import List

from .detection_models import Detection


def merge_detections(
    detections: List[Detection],
) -> List[Detection]:
    """
    Merge detections from Regex, Presidio, and Dictionary detectors.

    If multiple detectors identify the same text span, keep only one
    canonical detection.

    Selection priority:
        1. Higher confidence
        2. Longer span
        3. Detector priority as a deterministic tie-breaker
    """

    if not detections:
        return []

    # Detector priority is only used when confidence and span length
    # are identical.
    source_priority = {
        "regex": 3,
        "dictionary": 2,
        "presidio": 1,
    }

    # Sort so the strongest candidate for an overlapping region
    # appears first.
    sorted_detections = sorted(
        detections,
        key=lambda detection: (
            -detection.confidence,
            -detection.length,
            -source_priority.get(detection.source, 0),
        ),
    )

    selected: List[Detection] = []

    for candidate in sorted_detections:

        overlaps_existing = False

        for existing in selected:

            overlaps = (
                candidate.start < existing.end
                and candidate.end > existing.start
            )

            if overlaps:
                overlaps_existing = True
                break

        if not overlaps_existing:
            selected.append(candidate)

    # Restore original text order.
    selected.sort(
        key=lambda detection: (
            detection.start,
            detection.end,
        )
    )

    return selected