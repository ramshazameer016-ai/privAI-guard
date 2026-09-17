from typing import List

from .detection_models import Detection
from .regex_detector import detect_regex
from .presidio_detector import detect_presidio
from .dictionary_detector import detect_dictionary
from .merge_detections import merge_detections


def detect_all(
    text: str,
    company_terms: dict | None = None,
) -> List[Detection]:
    """
    Run all Stage 2 detection layers and merge their results.

    Detection layers:
        1. Regex
        2. Presidio / spaCy NER
        3. Company dictionary

    The final result contains one canonical detection for each
    overlapping sensitive span.
    """

    if not text:
        return []

    regex_detections = detect_regex(text)

    presidio_detections = detect_presidio(text)

    dictionary_detections = detect_dictionary(
        text,
        company_terms=company_terms,
    )

    all_detections = (
        regex_detections
        + presidio_detections
        + dictionary_detections
    )

    return merge_detections(all_detections)