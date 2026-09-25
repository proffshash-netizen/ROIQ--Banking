from typing import Any, Optional
from pydantic import BaseModel, Field


class RevenueTrendPoint(BaseModel):
    period: str
    value: float


class ProfitabilityTrendPoint(BaseModel):
    period: str
    net_income: float
    operating_income: float


class IncomeStatementData(BaseModel):
    revenue_trend: list[RevenueTrendPoint] = Field(default_factory=list)
    profitability_trend: list[ProfitabilityTrendPoint] = Field(default_factory=list)
    current_revenue: float = 0.0
    current_net_income: float = 0.0
    gross_profit_margin: float = 0.0
    net_profit_margin: float = 0.0


class BalanceSheetData(BaseModel):
    total_assets: float = 0.0
    total_liabilities: float = 0.0
    total_equity: float = 0.0
    current_ratio: float = 0.0
    debt_to_equity: float = 0.0


class CashFlowStatementData(BaseModel):
    operating_cash_flow: float = 0.0
    investing_cash_flow: float = 0.0
    financing_cash_flow: float = 0.0
    free_cash_flow: float = 0.0


class FinancialRatiosData(BaseModel):
    roe: float = 0.0
    roa: float = 0.0
    quick_ratio: float = 0.0
    interest_coverage: float = 0.0


class CorporateFinancialInput(BaseModel):
    income_statement: IncomeStatementData
    balance_sheet: BalanceSheetData
    cash_flow_statement: CashFlowStatementData
    financial_ratios: FinancialRatiosData


class MacroIndustryDetail(BaseModel):
    gdp_growth: float = 2.4
    inflation_rate: float = 2.8
    interest_rate: float = 4.75
    treasury_rate: float = 4.25
    currency_stability: float = 85.0
    industry_growth_rate: float = 8.5
    market_sentiment: str = "Cautiously Optimistic"
    competition_level: str = "Moderate"
    country_risk: dict[str, Any] = Field(default_factory=dict)
    historical_trends: list[dict[str, Any]] = Field(default_factory=list)
    industry_segments: list[dict[str, Any]] = Field(default_factory=list)


class MacroIndustryInput(BaseModel):
    macro_industry_data: MacroIndustryDetail


class ForecastResponse(BaseModel):
    corporate: CorporateFinancialInput
    macro: MacroIndustryInput
