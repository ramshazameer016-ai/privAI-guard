from pydantic import BaseModel, Field


class Detection(BaseModel):
    """
    Standard representation of a detected sensitive entity.

    All detection methods in Stage 2 (Regex, Presidio/spaCy,
    and Company Dictionary) will produce this same structure.
    """

    entity_type: str = Field(
        ...,
        description="Type of detected entity, such as EMAIL or PERSON."
    )

    start: int = Field(
        ...,
        ge=0,
        description="Start character position in the original prompt."
    )

    end: int = Field(
        ...,
        gt=0,
        description="End character position in the original prompt."
    )

    text: str = Field(
        ...,
        min_length=1,
        description="The detected text from the original prompt."
    )

    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Detection confidence between 0 and 1."
    )

    source: str = Field(
        ...,
        description="Detection source: regex, presidio, or dictionary."
    )

    @property
    def length(self) -> int:
        """Return the number of characters covered by the detection."""
        return self.end - self.start