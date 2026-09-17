from typing import Dict, List, Tuple

from backend.services.detection.detection_models import Detection


def redact_text(
    text: str,
    detections: List[Detection],
) -> Tuple[str, Dict[str, str]]:
    """
    Replace detected sensitive values with placeholders.

    Returns:
        sanitized_text:
            The prompt with sensitive values replaced.

        mapping:
            A private mapping from placeholders to original values.

    Example:
        John Smith -> [PERSON_001]

    The mapping is kept separately and is NOT part of the
    sanitized prompt sent to an external LLM.
    """

    if not text:
        return "", {}

    if not detections:
        return text, {}

    # Sort detections from left to right in the original text.
    sorted_detections = sorted(
        detections,
        key=lambda detection: (
            detection.start,
            detection.end,
        ),
    )

    # Placeholder counter for each entity type.
    counters: Dict[str, int] = {}

    # Maps the exact original value to its placeholder.
    # This ensures repeated occurrences use the same placeholder.
    value_to_placeholder: Dict[str, str] = {}

    # Maps placeholder -> original value.
    # This is the private mapping used later for rehydration.
    placeholder_to_value: Dict[str, str] = {}

    pieces: List[str] = []
    current_position = 0

    for detection in sorted_detections:

        # Skip invalid or overlapping detections.
        if detection.start < current_position:
            continue

        entity_type = detection.entity_type
        original_value = detection.text

        # Reuse the same placeholder when the exact same value
        # appears more than once in the prompt.
        if original_value in value_to_placeholder:
            placeholder = value_to_placeholder[original_value]

        else:
            counters[entity_type] = counters.get(
                entity_type,
                0,
            ) + 1

            placeholder = (
                f"[{entity_type}_{counters[entity_type]:03d}]"
            )

            value_to_placeholder[original_value] = placeholder
            placeholder_to_value[placeholder] = original_value

        # Add the normal text before the detected entity.
        pieces.append(
            text[current_position:detection.start]
        )

        # Add the placeholder instead of the sensitive value.
        pieces.append(placeholder)

        current_position = detection.end

    # Add the remaining text after the final detection.
    pieces.append(text[current_position:])

    sanitized_text = "".join(pieces)

    return sanitized_text, placeholder_to_value