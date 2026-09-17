from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.audit.audit_logger import record_audit_event
from backend.core.orchestrator import process_prompt
from backend.services.llm.openai_provider import OpenAIProvider
from backend.services.rehydration.rehydration_engine import (
    RehydrationError,
    rehydrate_response,
)

router = APIRouter(prefix="/api", tags=["chat"])


class ChatRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="User prompt to process through the privacy gateway.",
    )


class ChatResponse(BaseModel):
    action: str
    risk_score: int
    risk_level: str
    detections: list
    sanitized_text: str
    response: str | None
    raw_ai_response: str | None
    mappings: dict[str, str]


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    result = process_prompt(request.text)

    # ---------------------------------------------------------
    # BLOCKED REQUEST
    # ---------------------------------------------------------
    # The external LLM must never be called for a blocked request.
    if result["action"] == "BLOCK":
        record_audit_event(
            action=result["action"],
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            detections=result["detections"],
            redaction_count=0,
        )

        return ChatResponse(
            action=result["action"],
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            detections=result["detections"],
            sanitized_text="",
            response=None,
            raw_ai_response=None,
            mappings={},
        )

    # ---------------------------------------------------------
    # SANITIZED REQUEST
    # ---------------------------------------------------------
    sanitized_prompt = result["sanitized_text"]
    mapping = result["mapping"]

    # The provider receives ONLY the sanitized prompt.
    provider = OpenAIProvider()
    llm_response = provider.generate(sanitized_prompt)

    # ---------------------------------------------------------
    # RESPONSE VALIDATION + REHYDRATION
    # ---------------------------------------------------------
    try:
        final_response = rehydrate_response(
            llm_response,
            mapping,
        )
    except RehydrationError:
        raise HTTPException(
            status_code=502,
            detail="LLM response contained an invalid placeholder.",
        )

    # Number of reversible mappings created for this request.
    redaction_count = len(mapping)

    # ---------------------------------------------------------
    # PRIVACY-SAFE AUDIT LOG
    # ---------------------------------------------------------
    record_audit_event(
        action=result["action"],
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        detections=result["detections"],
        redaction_count=redaction_count,
    )

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------
    return ChatResponse(
        action=result["action"],
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        detections=result["detections"],
        sanitized_text=sanitized_prompt,

        # Final response after local rehydration.
        response=final_response,

        # Exact response received from the external LLM.
        # This should contain placeholders rather than
        # the original sensitive values.
        raw_ai_response=llm_response,

        # Private request-scoped placeholder mapping.
        mappings=mapping,
    )