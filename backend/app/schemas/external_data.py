from datetime import date
from typing import Any

from pydantic import BaseModel, Field


class ExternalDataRequest(BaseModel):
    company_id: str = Field(..., description="Ticker symbol or corporate identifier")
    symbol: str | None = Field(
        default=None,
        description="Optional security symbol when the company identifier is non-standard",
    )
    include_macro: bool = Field(
        default=True,
        description="Whether macroeconomic indicator data should be included in the normalized payload",
    )
    include_legal_esg: bool = Field(
        default=True,
        description="Whether legal and ESG related data should be included in the normalized payload",
    )


class CompanyIdentity(BaseModel):
    company_id: str
    symbol: str
    name: str
    exchange: str | None = None
    sector: str | None = None
    industry: str | None = None
    country: str | None = None
    description: str | None = None


class FinancialStatement(BaseModel):
    statement_type: str
    period_ending: date | str
    revenue: float | None = None
    net_income: float | None = None
    ebitda: float | None = None
    operating_cash_flow: float | None = None
    total_assets: float | None = None
    total_liabilities: float | None = None
    shareholders_equity: float | None = None


class FinancialRatios(BaseModel):
    current_ratio: float | None = None
    leverage_ratio: float | None = None
    profit_margin: float | None = None
    return_on_assets: float | None = None
    debt_to_equity: float | None = None


class FinancialData(BaseModel):
    income_statement: list[FinancialStatement]
    balance_sheet: list[FinancialStatement]
    cash_flow: list[FinancialStatement]
    financial_ratios: FinancialRatios


class MarketFxData(BaseModel):
    var_95: float | None = None
    expected_shortfall: float | None = None
    pnl_volatility: float | None = None
    tail_risk_ratio: float | None = None
    currency_exposure: float | None = None
    hedged_exposure: float | None = None
    unhedged_exposure: float | None = None
    fx_volatility: float | None = None
    cross_currency_basis: float | None = None
    security_identifiers: list[str] = Field(default_factory=list)


class CountryRisk(BaseModel):
    political_risk: float | None = None
    economic_risk: float | None = None
    stability_score: float | None = None


class MacroIndustryData(BaseModel):
    gdp_growth: float | None = None
    inflation_rate: float | None = None
    interest_rate: float | None = None
    treasury_rate: float | None = None
    currency_stability: float | None = None
    industry_growth_rate: float | None = None
    market_sentiment: str | None = None
    competition_level: str | None = None
    country_risk: CountryRisk = Field(default_factory=CountryRisk)


class LegalEsgData(BaseModel):
    pending_litigation: bool = False
    litigation_severity: str | None = None
    regulatory_issues: list[str] = Field(default_factory=list)
    tax_compliance_status: str | None = None
    environmental_risk: str | None = None
    governance_score: float | None = None
    esg_score: float | None = None


class NormalizedPipelinePayload(BaseModel):
    company_identity: CompanyIdentity
    financial_data: FinancialData
    market_fx_data: MarketFxData
    macro_industry_data: MacroIndustryData
    legal_esg_data: LegalEsgData


class NormalizedDataResponse(BaseModel):
    pipeline_payload: NormalizedPipelinePayload
