from typing import List

from backend.services.detection.detection_models import Detection


# Default policy actions for sensitive entity types.
#
# These are MVP demo policies. They can later be loaded from
# the Company Policies database/UI.
DEFAULT_ENTITY_ACTIONS = {
    "API_KEY": "BLOCK",
    "SSN": "BLOCK",
    "CREDIT_CARD": "BLOCK",
    "PASSWORD": "BLOCK",

    "CLIENT": "REDACT",
    "INTERNAL_TERM": "REDACT",
    "PROJECT": "REDACT",

    "EMAIL": "WARN",
    "PHONE": "WARN",
    "PERSON": "WARN",
    "ORGANIZATION": "WARN",
    "LOCATION": "WARN",
    "IP_ADDRESS": "WARN",
    "DATE_TIME": "WARN",
}


VALID_ACTIONS = {
    "ALLOW",
    "WARN",
    "REDACT",
    "BLOCK",
}


ACTION_PRIORITY = {
    "ALLOW": 0,
    "WARN": 1,
    "REDACT": 2,
    "BLOCK": 3,
}


def evaluate_policy(
    detections: List[Detection],
    risk_score: int,
    entity_actions: dict | None = None,
) -> str:
    """
    Determine the required security action.

    The strongest action required by any detected entity is returned.

    Action priority:
        ALLOW < WARN < REDACT < BLOCK

    Risk score is used as an additional safety rule:
        - 80+ risk automatically requires at least REDACT
        - 95+ risk automatically requires BLOCK

    Args:
        detections: Canonical detections from the detection pipeline.
        risk_score: Numeric risk score from 0 to 100.
        entity_actions: Optional custom policy mapping.

    Returns:
        One of ALLOW, WARN, REDACT, or BLOCK.
    """

    if not detections:
        return "ALLOW"

    actions = entity_actions or DEFAULT_ENTITY_ACTIONS

    strongest_action = "ALLOW"

    for detection in detections:
        action = actions.get(
            detection.entity_type,
            "WARN",
        )

        # Protect against invalid custom policy values.
        if action not in VALID_ACTIONS:
            action = "WARN"

        if ACTION_PRIORITY[action] > ACTION_PRIORITY[strongest_action]:
            strongest_action = action

    # Apply risk-based safety thresholds.
    if risk_score >= 95:
        strongest_action = "BLOCK"

    elif risk_score >= 80:
        if ACTION_PRIORITY["REDACT"] > ACTION_PRIORITY[strongest_action]:
            strongest_action = "REDACT"

    return strongest_action