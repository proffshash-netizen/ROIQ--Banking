from abc import ABC, abstractmethod
from typing import Any


class FinancialDataService(ABC):
    """Interface for external financial data providers.

    TODO: Implemented by Backend Developer 1.
    """

    @abstractmethod
    async def get_company(self, company_id: str) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def get_financial_statements(self, company_id: str) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    async def get_market_data(self, symbol: str) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def get_macro_data(self) -> dict[str, Any]:
        raise NotImplementedError

