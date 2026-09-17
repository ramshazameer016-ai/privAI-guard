from backend.core.orchestrator import process_prompt


def test_raw_sensitive_prompt_is_not_sent_to_llm():
    prompt = (
        "Please help me with Project Phoenix. "
        "The client is Client Orion and their email is test@example.com."
    )

    result = process_prompt(prompt)

    assert result["action"] == "REDACT"

    sanitized_prompt = result["sanitized_text"]

    # The sanitized prompt must contain placeholders.
    assert "[PROJECT_001]" in sanitized_prompt
    assert "[CLIENT_001]" in sanitized_prompt
    assert "[EMAIL_001]" in sanitized_prompt

    # The original sensitive values must not remain.
    assert "Project Phoenix" not in sanitized_prompt
    assert "Client Orion" not in sanitized_prompt
    assert "test@example.com" not in sanitized_prompt

    # The complete original prompt must never be the sanitized prompt.
    assert sanitized_prompt != prompt
from unittest.mock import patch

from backend.api.chat import chat, ChatRequest


def test_blocked_request_makes_zero_llm_calls():
    request = ChatRequest(
        text="My API key is sk-test-123456. Please use it to connect."
    )

    with patch(
        "backend.api.chat.OpenAIProvider"
    ) as mock_provider:
        response = chat(request)

        # The request must be blocked.
        assert response.action == "BLOCK"

        # No LLM provider should be created.
        mock_provider.assert_not_called()

        # No LLM response should exist.
        assert response.response is None

        # No sanitized prompt should be sent onward.
        assert response.sanitized_text == ""
from backend.services.rehydration.rehydration_engine import (
    RehydrationError,
    rehydrate_response,
)


def test_unknown_placeholder_fails_closed():
    response = "The customer's email is [EMAIL_999]."
    mapping = {
        "[EMAIL_001]": "test@example.com"
    }

    try:
        rehydrate_response(response, mapping)
        assert False, "Unknown placeholder should have been rejected."
    except RehydrationError:
        pass
def test_sensitive_values_are_not_logged(capsys):
    from backend.audit.audit_logger import record_audit_event

    class Detection:
        def __init__(self, entity_type, text):
            self.entity_type = entity_type
            self.text = text

    sensitive_prompt = (
        "My API key is sk-test-123456 and my email is secret@example.com."
    )

    record_audit_event(
        action="BLOCK",
        risk_score=95,
        risk_level="HIGH",
        detections=[
            Detection("API_KEY", "sk-test-123456"),
            Detection("EMAIL", "secret@example.com"),
        ],
        redaction_count=0,
    )

    captured = capsys.readouterr()

    assert "sk-test-123456" not in captured.out
    assert "secret@example.com" not in captured.out
    assert sensitive_prompt not in captured.out
from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_chat_rejects_empty_prompt():
    response = client.post(
        "/api/chat",
        json={"text": ""}
    )

    assert response.status_code == 422


def test_chat_rejects_oversized_prompt():
    oversized_prompt = "A" * 10001

    response = client.post(
        "/api/chat",
        json={"text": oversized_prompt}
    )

    assert response.status_code == 422
def test_sanitized_prompt_exactly_reaches_llm_provider():
    from backend.core.orchestrator import process_prompt

    prompt = (
        "Please help me debug Project Phoenix. "
        "The client is Client Orion and their email is test@example.com."
    )

    result = process_prompt(prompt)

    assert result["action"] == "REDACT"

    sanitized_prompt = result["sanitized_text"]

    with patch(
        "backend.api.chat.OpenAIProvider"
    ) as mock_provider:
        mock_provider.return_value.generate.return_value = (
            "I can help with [PROJECT_001] for [CLIENT_001]. "
            "The contact is [EMAIL_001]."
        )

        response = chat(ChatRequest(text=prompt))

        mock_provider.return_value.generate.assert_called_once_with(
            sanitized_prompt
        )

        assert "Project Phoenix" not in sanitized_prompt
        assert "Client Orion" not in sanitized_prompt
        assert "test@example.com" not in sanitized_prompt
        assert response.response is not None
def test_full_privacy_gateway_flow():
    prompt = (
        "Please help me debug Project Phoenix. "
        "The client is Client Orion and their email is test@example.com."
    )

    with patch(
        "backend.api.chat.OpenAIProvider"
    ) as mock_provider:
        mock_provider.return_value.generate.return_value = (
            "Debugging [PROJECT_001] for [CLIENT_001]. "
            "The contact email is [EMAIL_001]."
        )

        response = chat(ChatRequest(text=prompt))

        # Policy decision
        assert response.action == "REDACT"
        assert response.risk_level == "MEDIUM"

        # Sensitive values must not reach the LLM
        sanitized_prompt = mock_provider.return_value.generate.call_args.args[0]

        assert "Project Phoenix" not in sanitized_prompt
        assert "Client Orion" not in sanitized_prompt
        assert "test@example.com" not in sanitized_prompt

        assert "[PROJECT_001]" in sanitized_prompt
        assert "[CLIENT_001]" in sanitized_prompt
        assert "[EMAIL_001]" in sanitized_prompt

        # LLM response must be rehydrated correctly
        assert response.response == (
            "Debugging Project Phoenix for Client Orion. "
            "The contact email is test@example.com."
        )
def test_llm_response_containing_original_sensitive_value_fails_closed():
    from backend.services.rehydration.rehydration_engine import (
        RehydrationError,
        rehydrate_response,
    )

    response = "I can help debug Project Phoenix."

    mapping = {
        "[PROJECT_001]": "Project Phoenix"
    }

    try:
        rehydrate_response(response, mapping)
        assert False, (
            "Response containing an original sensitive value "
            "should have been rejected."
        )
    except RehydrationError:
        pass