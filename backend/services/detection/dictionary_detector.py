from typing import List

from .detection_models import Detection


# Demo company-specific sensitive terms.
#
# These are intentionally demo values for the hackathon.
# In a real deployment, these would come from the company's
# configured policy/database.
DEFAULT_COMPANY_TERMS = {
    "PROJECT": [
        "Project Phoenix",
    ],
    "CLIENT": [
        "Client Orion",
    ],
    "INTERNAL_TERM": [
        "Acme Internal",
    ],
}


def detect_dictionary(
    text: str,
    company_terms: dict | None = None,
) -> List[Detection]:
    """
    Detect company-specific sensitive terms using an explicit dictionary.

    Args:
        text: Original user prompt.
        company_terms: Optional custom dictionary. If omitted,
                       the demo company dictionary is used.

    Returns:
        A list of Detection objects.
    """

    detections: List[Detection] = []

    if not text:
        return detections

    terms = company_terms or DEFAULT_COMPANY_TERMS

    for entity_type, values in terms.items():

        for value in values:

            if not value:
                continue

            # Case-insensitive search while preserving the
            # exact text and character positions from the prompt.
            start_position = 0

            while True:
                index = text.lower().find(
                    value.lower(),
                    start_position,
                )

                if index == -1:
                    break

                end_index = index + len(value)

                detections.append(
                    Detection(
                        entity_type=entity_type,
                        start=index,
                        end=end_index,
                        text=text[index:end_index],
                        confidence=1.0,
                        source="dictionary",
                    )
                )

                start_position = end_index

    # Keep results in original text order.
    detections.sort(
        key=lambda detection: (detection.start, detection.end)
    )

    return detections