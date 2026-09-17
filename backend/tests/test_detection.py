from backend.services.detection.detection_pipeline import detect_all
from backend.services.detection.merge_detections import merge_detections
from backend.services.detection.detection_models import Detection


def get_types(results):
    """Return the detected entity types."""
    return [d.entity_type for d in results]


def test_email_detection():
    text = "Contact me at john.smith@example.com"
    results = detect_all(text)

    assert any(
        d.entity_type == "EMAIL"
        and d.text == "john.smith@example.com"
        for d in results
    )


def test_api_key_detection():
    text = "My API key is sk-test-123456"
    results = detect_all(text)

    assert any(
        d.entity_type == "API_KEY"
        and d.text == "sk-test-123456"
        for d in results
    )


def test_person_detection():
    text = "My name is John Smith."
    results = detect_all(text)

    assert any(
        d.entity_type == "PERSON"
        and d.text == "John Smith"
        for d in results
    )


def test_organization_detection():
    text = "I work at Acme Corp."
    results = detect_all(text)

    assert any(
        d.entity_type == "ORGANIZATION"
        and "Acme Corp" in d.text
        for d in results
    )


def test_project_name_detection():
    text = "Please review Project Phoenix."
    results = detect_all(text)

    assert any(
        d.entity_type == "PROJECT"
        and d.text == "Project Phoenix"
        for d in results
    )


def test_multiple_entities():
    text = (
        "John Smith from Acme Corp is working on "
        "Project Phoenix. Contact john@example.com."
    )

    results = detect_all(text)
    types = get_types(results)

    assert "PERSON" in types
    assert "ORGANIZATION" in types
    assert "PROJECT" in types
    assert "EMAIL" in types


def test_no_sensitive_data():
    text = "Please explain how a database index works."
    results = detect_all(text)

    assert results == []


def test_overlapping_detections_keep_one():
    detections = [
        Detection(
            entity_type="EMAIL",
            start=10,
            end=26,
            text="john@example.com",
            confidence=1.0,
            source="regex",
        ),
        Detection(
            entity_type="EMAIL_ADDRESS",
            start=10,
            end=26,
            text="john@example.com",
            confidence=0.85,
            source="presidio",
        ),
    ]

    results = merge_detections(detections)

    assert len(results) == 1
    assert results[0].source == "regex"


def test_repeated_project_name():
    text = (
        "Project Phoenix is important. "
        "Please update Project Phoenix."
    )

    results = detect_all(text)

    project_results = [
        d for d in results
        if d.entity_type == "PROJECT"
    ]

    assert len(project_results) == 2
    assert all(
        d.text == "Project Phoenix"
        for d in project_results
    )