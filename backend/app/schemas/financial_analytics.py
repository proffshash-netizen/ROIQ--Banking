from typing import Any, Optional
from pydantic import BaseModel, Field


class TreasuryInput(BaseModel):
    bond_portfolio: dict[str, Any] = Field(default_factory=dict)
    treasury_securities: dict[str, Any] = Field(default_factory=dict)
    interest_rate_information: dict[str, Any] = Field(default_factory=dict)
    yield_curve_data: dict[str, Any] = Field(default_factory=dict)
    duration_information: dict[str, Any] = Field(default_factory=dict)
    ai_treasury_assessment: Optional[str] = None
    last_updated: Optional[str] = None


class LiquidityInput(BaseModel):
    cash_positions: dict[str, Any] = Field(default_factory=dict)
    liquid_assets: dict[str, Any] = Field(default_factory=dict)
    funding_information: dict[str, Any] = Field(default_factory=dict)
    debt_obligations: dict[str, Any] = Field(default_factory=dict)
    liquidity_ratios: dict[str, Any] = Field(default_factory=dict)
    last_updated: Optional[str] = None


class FinancialAnalyticsOutput(BaseModel):
    treasury: TreasuryInput
    liquidity: LiquidityInput
