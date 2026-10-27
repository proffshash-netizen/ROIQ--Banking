from abc import ABC, abstractmethod
from typing import Any


class ExternalProviderService(ABC):
    """Abstract interface for the external API ingestion layer."""

    @abstractmethod
    async def fetch_company_profile(self, company_id: str, symbol: str | None = None) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def fetch_financial_statements(self, company_id: str, symbol: str | None = None) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def fetch_market_fx(self, symbol: str) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def fetch_macro_indicators(self) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def fetch_legal_esg(self, company_id: str, symbol: str | None = None) -> dict[str, Any]:
        raise NotImplementedError
