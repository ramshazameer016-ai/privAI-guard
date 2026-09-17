from typing import List

import spacy
from presidio_analyzer import (
    AnalyzerEngine,
    RecognizerRegistry,
)
from presidio_analyzer.nlp_engine import (
    SpacyNlpEngine,
    NlpEngineProvider,
)

from .detection_models import Detection


# Explicitly use the small English spaCy model that we installed.
# This prevents Presidio from trying to download en_core_web_lg.
NLP_ENGINE_CONF = {
    "nlp_engine_name": "spacy",
    "models": [
        {
            "lang_code": "en",
            "model_name": "en_core_web_sm",
        }
    ],
}


# Create the spaCy NLP engine from the configuration above.
provider = NlpEngineProvider(nlp_configuration=NLP_ENGINE_CONF)
nlp_engine = provider.create_engine()


# Create Presidio's analyzer using our explicitly configured spaCy engine.
registry = RecognizerRegistry()
registry.load_predefined_recognizers()

analyzer = AnalyzerEngine(
    nlp_engine=nlp_engine,
    registry=registry,
    supported_languages=["en"],
)


# Map Presidio entity names to PrivAI Guard's standard entity names.
ENTITY_TYPE_MAP = {
    "PERSON": "PERSON",
    "ORGANIZATION": "ORGANIZATION",
    "LOCATION": "LOCATION",
    "DATE_TIME": "DATE_TIME",
    "PHONE_NUMBER": "PHONE",
    "EMAIL_ADDRESS": "EMAIL",
    "IP_ADDRESS": "IP_ADDRESS",
}


def detect_presidio(text: str) -> List[Detection]:
    """
    Detect entities using Microsoft Presidio with spaCy NER.
    """

    detections: List[Detection] = []

    if not text:
        return detections

    results = analyzer.analyze(
        text=text,
        language="en",
    )

    for result in results:
        entity_type = ENTITY_TYPE_MAP.get(result.entity_type)

        # Ignore Presidio entities that are not part of our
        # current PrivAI Guard Stage 2 schema.
        if entity_type is None:
            continue

        detected_text = text[result.start:result.end]

        detections.append(
            Detection(
                entity_type=entity_type,
                start=result.start,
                end=result.end,
                text=detected_text,
                confidence=round(float(result.score), 4),
                source="presidio",
            )
        )

    # Keep detections in their original text order.
    detections.sort(
        key=lambda detection: (detection.start, detection.end)
    )

    return detections