from abc import ABC, abstractmethod


class LLMProvider(ABC):
    """
    Common interface for external LLM providers.

    The privacy gateway communicates with this interface
    instead of directly depending on a specific provider.
    """

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """
        Send a sanitized prompt to the external LLM
        and return its response.
        """
        raise NotImplementedError