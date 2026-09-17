import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List


DB_PATH = Path(__file__).resolve().parent / "audit.db"


def _get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def _initialize_database() -> None:
    connection = _get_connection()

    try:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS audit_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                action TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                risk_level TEXT NOT NULL,
                detection_count INTEGER NOT NULL,
                entity_types TEXT NOT NULL,
                redaction_count INTEGER NOT NULL
            )
            """
        )
        connection.commit()
    finally:
        connection.close()


def record_audit_event(
    action: str,
    risk_score: int,
    risk_level: str,
    detections: list,
    redaction_count: int,
) -> None:
    """
    Store privacy-safe security metadata for one request.

    IMPORTANT:
    This function deliberately does NOT store:
        - original prompt
        - detected sensitive values
        - API keys
        - passwords
        - raw LLM requests
        - raw LLM responses
    """

    entity_types = sorted(
        {detection.entity_type for detection in detections}
    )

    connection = _get_connection()

    try:
        connection.execute(
            """
            INSERT INTO audit_records (
                timestamp,
                action,
                risk_score,
                risk_level,
                detection_count,
                entity_types,
                redaction_count
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                datetime.now(timezone.utc).isoformat(),
                action,
                risk_score,
                risk_level,
                len(detections),
                json.dumps(entity_types),
                redaction_count,
            ),
        )

        connection.commit()
    finally:
        connection.close()


def get_audit_records() -> List[Dict]:
    connection = _get_connection()

    try:
        rows = connection.execute(
            """
            SELECT
                timestamp,
                action,
                risk_score,
                risk_level,
                detection_count,
                entity_types,
                redaction_count
            FROM audit_records
            ORDER BY id ASC
            """
        ).fetchall()

        records = []

        for row in rows:
            records.append(
                {
                    "timestamp": row["timestamp"],
                    "action": row["action"],
                    "risk_score": row["risk_score"],
                    "risk_level": row["risk_level"],
                    "detection_count": row["detection_count"],
                    "entity_types": json.loads(row["entity_types"]),
                    "redaction_count": row["redaction_count"],
                }
            )

        return records

    finally:
        connection.close()


def get_audit_summary() -> Dict:
    records = get_audit_records()

    action_counts = {
        "ALLOW": 0,
        "WARN": 0,
        "REDACT": 0,
        "BLOCK": 0,
    }

    risk_counts = {
        "NONE": 0,
        "LOW": 0,
        "MEDIUM": 0,
        "HIGH": 0,
    }

    entity_counts: Dict[str, int] = {}

    total_detections = 0
    total_redactions = 0

    for record in records:
        action = record["action"]

        if action in action_counts:
            action_counts[action] += 1

        risk_level = record["risk_level"]

        if risk_level in risk_counts:
            risk_counts[risk_level] += 1

        total_detections += record["detection_count"]
        total_redactions += record["redaction_count"]

        for entity_type in record["entity_types"]:
            entity_counts[entity_type] = (
                entity_counts.get(entity_type, 0) + 1
            )

    return {
        "total_prompts_scanned": len(records),
        "total_detections": total_detections,
        "total_redactions": total_redactions,
        "blocked_requests": action_counts["BLOCK"],
        "action_counts": action_counts,
        "risk_counts": risk_counts,
        "entity_counts": entity_counts,
    }


def clear_audit_records() -> None:
    connection = _get_connection()

    try:
        connection.execute("DELETE FROM audit_records")
        connection.commit()
    finally:
        connection.close()


_initialize_database()