from typing import Dict, List

from backend.services.detection.detection_models import Detection
from backend.services.detection.detection_pipeline import detect_all
from backend.services.risk.risk_scorer import calculate_risk, get_risk_level
from backend.services.policy.policy_engine import evaluate_policy
from backend.services.redaction.redaction_engine import redact_text


def process_prompt(
    text: str,
    company_terms: dict | None = None,
    entity_actions: dict | None = None,
) -> Dict:
    """
    Run the complete Stage 3 privacy pipeline.

    Flow:
        Detection
        -> Risk scoring
        -> Policy evaluation
        -> Redaction when required

    The original sensitive values are kept only in the
    returned in-memory mapping.
    """

    detections: List[Detection] = detect_all(
        text,
        company_terms=company_terms,
    )

    risk_score = calculate_risk(detections)
    risk_level = get_risk_level(risk_score)

    action = evaluate_policy(
        detections,
        risk_score,
        entity_actions=entity_actions,
    )

    sanitized_text = text
    mapping = {}

    if action == "REDACT":
        sanitized_text, mapping = redact_text(
            text,
            detections,
        )

    elif action == "ALLOW":
        sanitized_text = text

    elif action == "WARN":
        sanitized_text = text

    elif action == "BLOCK":
        sanitized_text = ""

    return {
        "action": action,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "detections": detections,
        "sanitized_text": sanitized_text,
        "mapping": mapping,
    }