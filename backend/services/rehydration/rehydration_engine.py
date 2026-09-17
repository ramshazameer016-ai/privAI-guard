import re
from typing import Dict


PLACEHOLDER_PATTERN = re.compile(
    r"\[([A-Z][A-Z0-9_]*)_(\d{3})\]"
)


class RehydrationError(Exception):
    pass


def validate_placeholders(
    response: str,
    mapping: Dict[str, str],
) -> None:
    if not response:
        return

    placeholders = PLACEHOLDER_PATTERN.findall(response)

    for entity_type, number in placeholders:
        placeholder = f"[{entity_type}_{number}]"

        if placeholder not in mapping:
            raise RehydrationError(
                f"Unknown placeholder detected: {placeholder}"
            )


def validate_sensitive_values(
    response: str,
    mapping: Dict[str, str],
) -> None:
    """
    Ensure the external model did not reproduce any
    original sensitive value in its response.

    The external model should only see placeholders.
    If an original sensitive value appears in the response,
    fail closed instead of returning it to the employee.
    """
    if not response:
        return

    for placeholder, original_value in mapping.items():
        if original_value and original_value in response:
            raise RehydrationError(
                "External model response contained an original "
                f"sensitive value for {placeholder}."
            )


def rehydrate_response(
    response: str,
    mapping: Dict[str, str],
) -> str:
    if not response:
        return ""

    validate_sensitive_values(
        response,
        mapping,
    )

    validate_placeholders(
        response,
        mapping,
    )

    rehydrated_response = response

    for placeholder, original_value in mapping.items():
        rehydrated_response = rehydrated_response.replace(
            placeholder,
            original_value,
        )

    return rehydrated_response