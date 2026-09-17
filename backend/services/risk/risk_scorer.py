from typing import List

from backend.services.detection.detection_models import Detection


# Base risk contribution for each entity type.
#
# These values are intentionally simple and explainable for the MVP.
# They can be adjusted later as company policies become configurable.
ENTITY_RISK_WEIGHTS = {
    "API_KEY": 90,
    "SSN": 85,
    "CREDIT_CARD": 85,
    "PASSWORD": 90,
    "PHONE": 45,
    "EMAIL": 40,
    "IP_ADDRESS": 35,
    "PERSON": 30,
    "ORGANIZATION": 30,
    "LOCATION": 20,
    "DATE_TIME": 15,
    "PROJECT": 50,
    "CLIENT": 60,
    "INTERNAL_TERM": 60,
}


def calculate_risk(
    detections: List[Detection],
) -> int:
    """
    Calculate an explainable risk score from 0 to 100.

    The highest-risk detected entity provides the main risk level.
    Additional distinct detections can increase the score slightly.

    The result is always capped at 100.
    """

    if not detections:
        return 0

    # Start with the strongest individual detection.
    highest_risk = max(
        ENTITY_RISK_WEIGHTS.get(
            detection.entity_type,
            20,
        )
        for detection in detections
    )

    # Add a small amount of risk for additional detections.
    #
    # This prevents a prompt containing many sensitive entities
    # from receiving the same score as a prompt containing only one.
    additional_risk = max(
        0,
        len(detections) - 1,
    ) * 5

    risk_score = highest_risk + additional_risk

    # Keep the score within the required 0-100 range.
    return min(
        risk_score,
        100,
    )


def get_risk_level(
    risk_score: int,
) -> str:
    """
    Convert a numeric risk score into an explainable risk level.
    """

    if risk_score >= 80:
        return "HIGH"

    if risk_score >= 50:
        return "MEDIUM"

    if risk_score > 0:
        return "LOW"

    return "NONE"