import pytest

from backend.services.rehydration.rehydration_engine import (
    RehydrationError,
    rehydrate_response,
    validate_placeholders,
)


def test_exact_rehydration():
    response = (
        "Debug [PROJECT_001] for [CLIENT_001]."
    )

    mapping = {
        "[PROJECT_001]": "Project Phoenix",
        "[CLIENT_001]": "Client Orion",
    }

    result = rehydrate_response(
        response,
        mapping,
    )

    assert result == (
        "Debug Project Phoenix for Client Orion."
    )


def test_repeated_placeholder_rehydrates_every_occurrence():
    response = (
        "[PROJECT_001] is the same as [PROJECT_001]."
    )

    mapping = {
        "[PROJECT_001]": "Project Phoenix",
    }

    result = rehydrate_response(
        response,
        mapping,
    )

    assert result == (
        "Project Phoenix is the same as Project Phoenix."
    )


def test_multiple_entity_types_rehydrate():
    response = (
        "Contact [PERSON_001] at [EMAIL_001]."
    )

    mapping = {
        "[PERSON_001]": "John Smith",
        "[EMAIL_001]": "test@example.com",
    }

    result = rehydrate_response(
        response,
        mapping,
    )

    assert result == (
        "Contact John Smith at test@example.com."
    )


def test_unknown_placeholder_fails_closed():
    response = (
        "Use [PROJECT_999] for this task."
    )

    mapping = {
        "[PROJECT_001]": "Project Phoenix",
    }

    with pytest.raises(
        RehydrationError,
        match="Unknown placeholder detected: \\[PROJECT_999\\]",
    ):
        rehydrate_response(
            response,
            mapping,
        )


def test_known_placeholder_validation_passes():
    response = (
        "Debug [PROJECT_001] for [CLIENT_001]."
    )

    mapping = {
        "[PROJECT_001]": "Project Phoenix",
        "[CLIENT_001]": "Client Orion",
    }

    validate_placeholders(
        response,
        mapping,
    )


def test_response_without_placeholders_is_unchanged():
    response = (
        "This response contains no sensitive placeholders."
    )

    mapping = {
        "[PROJECT_001]": "Project Phoenix",
    }

    result = rehydrate_response(
        response,
        mapping,
    )

    assert result == response


def test_empty_response_is_safe():
    mapping = {
        "[PROJECT_001]": "Project Phoenix",
    }

    result = rehydrate_response(
        "",
        mapping,
    )

    assert result == ""


def test_empty_mapping_rejects_placeholder():
    response = (
        "Debug [PROJECT_001]."
    )

    with pytest.raises(
        RehydrationError,
        match="Unknown placeholder detected: \\[PROJECT_001\\]",
    ):
        rehydrate_response(
            response,
            {},
        )


def test_mapping_values_are_not_modified():
    mapping = {
        "[PROJECT_001]": "Project Phoenix",
        "[CLIENT_001]": "Client Orion",
    }

    original_mapping = mapping.copy()

    response = (
        "[PROJECT_001] belongs to [CLIENT_001]."
    )

    rehydrate_response(
        response,
        mapping,
    )

    assert mapping == original_mapping