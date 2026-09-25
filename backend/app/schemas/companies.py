from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, Field


class CompanyFinancialMetrics(BaseModel):
    revenue: float = Field(default=0.0, description="Annual revenue in base currency")
    ebitda: float = Field(default=0.0, description="Earnings before interest, taxes, depreciation, amortization")
    net_income: float = Field(default=0.0, description="Net income")
    total_debt: float = Field(default=0.0, description="Total outstanding debt")
    equity: float = Field(default=0.0, description="Shareholders equity")
    cash_flow: float = Field(default=0.0, description="Operating cash flow")
    interest_expense: float = Field(default=0.0, description="Annual interest expense")
    requested_loan: float = Field(default=0.0, description="Requested facility amount")
    debt_to_equity: float = Field(default=0.0, description="Debt to equity ratio")
    interest_coverage: float = Field(default=0.0, description="Interest coverage ratio")
    debt_to_ebitda: float = Field(default=0.0, description="Debt to EBITDA ratio")
    dscr: float = Field(default=0.0, description="Debt service coverage ratio")
    operating_margin_pct: float = Field(default=0.0, description="Operating margin percentage")
    current_ratio: float = Field(default=0.0, description="Current liquidity ratio")


class CompanyItem(BaseModel):
    id: int
    name: str
    sector: str
    country: str
    founded: int
    revenue: str
    employees: str
    creditScore: int
    riskLevel: str  # "low" | "medium" | "high" | "critical"
    loanExposure: str
    status: str  # "processing" | "completed" | "flagged" | "pending"
    module: str
    progress: int
    eta: str
    lastAnalysis: str
    ceo: str
    hq: str

    model_config = ConfigDict(populate_by_name=True)

    @property
    def risk_level(self) -> str:
        return self.riskLevel

    @property
    def loan_exposure(self) -> str:
        return self.loanExposure


class CompanyDetail(CompanyItem):
    description: Optional[str] = None
    financial_metrics: Optional[CompanyFinancialMetrics] = None
    exchange: Optional[str] = "NSE / BSE"
    symbol: Optional[str] = None
