import os

from dotenv import load_dotenv
from openai import OpenAI

from backend.services.llm.provider_base import LLMProvider


# Load environment variables from the project's .env file.
load_dotenv()


class OpenAIProvider(LLMProvider):
    """
    OpenAI implementation of the common LLM provider interface.

    IMPORTANT:
    This provider expects to receive an already-sanitized prompt.
    It must never be called with the user's original prompt.
    """

    def __init__(
        self,
        model: str | None = None,
    ):
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise RuntimeError(
                "OPENAI_API_KEY is not configured."
            )

        self.client = OpenAI(
            api_key=api_key,
        )

        self.model = model or os.getenv(
            "OPENAI_MODEL",
            "gpt-5.6-luna",
        )

    def generate(self, prompt: str) -> str:
        if not prompt:
            raise ValueError("Prompt must not be empty.")

        protected_prompt = (
            "You are receiving a prompt through a privacy gateway.\n"
            "The gateway replaces sensitive information with placeholders such as "
            "[PROJECT_001], [CLIENT_001], [EMAIL_001], and [API_KEY_001].\n\n"
            "IMPORTANT PLACEHOLDER RULES:\n"
            "1. Treat every placeholder as opaque protected data.\n"
            "2. Never guess, infer, expand, or replace a placeholder with its original value.\n"
            "3. If you refer to protected information, preserve the exact placeholder text.\n"
            "4. Do not modify placeholder spelling, numbering, brackets, or capitalization.\n\n"
            "User prompt:\n"
            f"{prompt}"
        )

        response = self.client.responses.create(
            model=self.model,
            input=protected_prompt,
        )

        return response.output_text