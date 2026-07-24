from abc import ABC, abstractmethod
from typing import Any


class AIAnalysisService(ABC):
    """Interface for AI-driven analysis workflows.

    TODO: Implemented by Backend Developer 2.
    """

    @abstractmethod
    async def analyze_company(self, company_id: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def calculate_risk(self, company_id: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def due_diligence(self, company_id: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def explainability(self, company_id: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        raise NotImplementedError

