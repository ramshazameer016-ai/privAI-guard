from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.audit.audit_logger import record_audit_event
from backend.core.orchestrator import process_prompt
from backend.services.llm.openai_provider import OpenAIProvider
from backend.services.rehydration.rehydration_engine import (
    RehydrationError,
    rehydrate_response,
)

router = APIRouter(
    prefix="/api",
    tags=["chat"],
)


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


@router.post(
    "/chat",
    response_model=ChatResponse,
)
def chat(request: ChatRequest):
    result = process_prompt(request.text)

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

    sanitized_prompt = result["sanitized_text"]
    mapping = result["mapping"]

    provider = OpenAIProvider()
    llm_response = provider.generate(sanitized_prompt)

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

    redaction_count = len(mapping)

    record_audit_event(
        action=result["action"],
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        detections=result["detections"],
        redaction_count=redaction_count,
    )

    return ChatResponse(
        action=result["action"],
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        detections=result["detections"],
        sanitized_text=sanitized_prompt,
        response=final_response,
        raw_ai_response=llm_response,
        mappings=mapping,
    )