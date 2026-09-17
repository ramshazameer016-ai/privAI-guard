import sqlite3

from backend.audit.audit_logger import (
    DB_PATH,
    clear_audit_records,
    get_audit_records,
    get_audit_summary,
    record_audit_event,
)


def setup_function():
    clear_audit_records()


def teardown_function():
    clear_audit_records()


def test_audit_record_contains_only_safe_metadata():
    class Detection:
        def __init__(self, entity_type):
            self.entity_type = entity_type

    record_audit_event(
        action="REDACT",
        risk_score=70,
        risk_level="MEDIUM",
        detections=[
            Detection("PROJECT"),
            Detection("EMAIL"),
        ],
        redaction_count=2,
    )

    records = get_audit_records()

    assert len(records) == 1

    record = records[0]

    assert set(record.keys()) == {
        "timestamp",
        "action",
        "risk_score",
        "risk_level",
        "detection_count",
        "entity_types",
        "redaction_count",
    }


def test_sensitive_values_are_not_stored_in_audit_database():
    class Detection:
        def __init__(self, entity_type, text):
            self.entity_type = entity_type
            self.text = text

    sensitive_values = [
        "Project Phoenix",
        "test@example.com",
        "sk-test-123456",
    ]

    record_audit_event(
        action="BLOCK",
        risk_score=95,
        risk_level="HIGH",
        detections=[
            Detection("PROJECT", "Project Phoenix"),
            Detection("EMAIL", "test@example.com"),
            Detection("API_KEY", "sk-test-123456"),
        ],
        redaction_count=0,
    )

    connection = sqlite3.connect(DB_PATH)

    try:
        rows = connection.execute(
            "SELECT * FROM audit_records"
        ).fetchall()
    finally:
        connection.close()

    database_text = str(rows)

    for sensitive_value in sensitive_values:
        assert sensitive_value not in database_text


def test_audit_summary_counts_records_correctly():
    class Detection:
        def __init__(self, entity_type):
            self.entity_type = entity_type

    record_audit_event(
        action="ALLOW",
        risk_score=0,
        risk_level="NONE",
        detections=[],
        redaction_count=0,
    )

    record_audit_event(
        action="REDACT",
        risk_score=70,
        risk_level="MEDIUM",
        detections=[
            Detection("PROJECT"),
            Detection("EMAIL"),
        ],
        redaction_count=2,
    )

    record_audit_event(
        action="BLOCK",
        risk_score=95,
        risk_level="HIGH",
        detections=[
            Detection("API_KEY"),
        ],
        redaction_count=0,
    )

    summary = get_audit_summary()

    assert summary["total_prompts_scanned"] == 3
    assert summary["total_detections"] == 3
    assert summary["total_redactions"] == 2
    assert summary["blocked_requests"] == 1

    assert summary["action_counts"]["ALLOW"] == 1
    assert summary["action_counts"]["REDACT"] == 1
    assert summary["action_counts"]["BLOCK"] == 1

    assert summary["risk_counts"]["NONE"] == 1
    assert summary["risk_counts"]["MEDIUM"] == 1
    assert summary["risk_counts"]["HIGH"] == 1


def test_audit_records_persist_in_sqlite():
    class Detection:
        def __init__(self, entity_type):
            self.entity_type = entity_type

    record_audit_event(
        action="ALLOW",
        risk_score=0,
        risk_level="NONE",
        detections=[],
        redaction_count=0,
    )

    connection = sqlite3.connect(DB_PATH)

    try:
        count = connection.execute(
            "SELECT COUNT(*) FROM audit_records"
        ).fetchone()[0]
    finally:
        connection.close()

    assert count == 1