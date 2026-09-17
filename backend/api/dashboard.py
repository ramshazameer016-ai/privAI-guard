from fastapi import APIRouter

from backend.audit.audit_logger import (
    get_audit_records,
    get_audit_summary,
)


router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"],
)


@router.get("/summary")
def dashboard_summary():
    """
    Return aggregate privacy and security statistics.
    """
    return get_audit_summary()


@router.get("/history")
def dashboard_history():
    """
    Return privacy-safe audit history.

    No original prompts, sensitive values,
    API keys, passwords, or raw LLM content
    are returned.
    """
    return {
        "records": get_audit_records()
    }