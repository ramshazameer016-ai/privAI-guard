from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.services.detection.detection_pipeline import detect_all


router = APIRouter(
    prefix="/api",
    tags=["scan"],
)


class ScanRequest(BaseModel):
    """
    Request body for the /api/scan endpoint.
    """

    text: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="User prompt to scan for sensitive information.",
    )


class ScanResponse(BaseModel):
    """
    Response returned by the /api/scan endpoint.
    """

    detections: list


@router.post(
    "/scan",
    response_model=ScanResponse,
)
def scan_prompt(request: ScanRequest):
    """
    Scan a user prompt using all Stage 2 detection layers.

    This endpoint currently performs detection only.
    Risk scoring, policy decisions, redaction, and LLM calls
    will be added in later stages.
    """

    try:
        detections = detect_all(request.text)

        return ScanResponse(
            detections=detections,
        )

    except Exception as exc:
        # Do not expose internal exception details to the client.
        raise HTTPException(
            status_code=500,
            detail="Detection service failed.",
        ) from exc