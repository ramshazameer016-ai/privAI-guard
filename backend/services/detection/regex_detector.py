import re
from typing import List

from .detection_models import Detection


# Regex patterns for structured sensitive information.
PATTERNS = {
    "EMAIL": re.compile(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    ),

    "API_KEY": re.compile(
        r"\bsk-[A-Za-z0-9_-]{8,}\b"
    ),

    "CREDIT_CARD": re.compile(
        r"\b(?:\d[ -]*?){13,19}\b"
    ),

    "IP_ADDRESS": re.compile(
        r"\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}"
        r"(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b"
    ),

    "PHONE": re.compile(
    r"(?<![\d.])(?:\+?\d[\d\s().-]{7,}\d)(?![\d.])"
),

    "SSN": re.compile(
        r"\b\d{3}-\d{2}-\d{4}\b"
    ),
}

def detect_regex(text: str) -> List[Detection]:
    """
    Detect structured sensitive information using deterministic regex patterns.

    IP addresses are excluded from phone-number detection to avoid
    classifying an IP address as both IP_ADDRESS and PHONE.
    """

    detections: List[Detection] = []

    if not text:
        return detections

    # Detect all IP addresses first.
    ip_matches = list(PATTERNS["IP_ADDRESS"].finditer(text))

    # Store their character ranges so the phone detector can skip them.
    ip_ranges = [
        (match.start(), match.end())
        for match in ip_matches
    ]

    for entity_type, pattern in PATTERNS.items():

        for match in pattern.finditer(text):

            # Prevent an IP address from also being detected as a phone number.
            if entity_type == "PHONE":
                overlaps_ip = any(
                    match.start() < ip_end
                    and match.end() > ip_start
                    for ip_start, ip_end in ip_ranges
                )

                if overlaps_ip:
                    continue

            detections.append(
                Detection(
                    entity_type=entity_type,
                    start=match.start(),
                    end=match.end(),
                    text=match.group(),
                    confidence=1.0,
                    source="regex",
                )
            )

    # Return detections in their original text order.
    detections.sort(
        key=lambda detection: (detection.start, detection.end)
    )

    return detections