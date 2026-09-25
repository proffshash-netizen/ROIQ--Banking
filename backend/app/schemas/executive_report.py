from typing import Any, Optional
from pydantic import BaseModel, Field


class ExecutiveSummarySection(BaseModel):
    companyName: str
    industry: str
    requestedLoanAmount: str
    rawLoanAmount: float
    loanPurpose: str
    loanTenure: str
    overallRecommendation: str
    reportGenerationDate: str
    borrowerRating: str


class FinancialHighlightsSection(BaseModel):
    liquidityPosition: str
    treasuryHealth: str
    revenueTrend: str
    profitability: str
    cashFlow: str
    debtPosition: str
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)


class MacroIndustryOutlookSection(BaseModel):
    gdpOutlook: str
    inflation: str
    interestRateEnvironment: str
    industryGrowth: str
    countryRisk: str
    aiInterpretation: str


class MarketFXRiskSummarySection(BaseModel):
    var95: str
    expectedShortfall: str
    fxExposure: str
    hedgedVsUnhedged: str
    tailRisk: str
    overallMarketRiskConclusion: str


class CreditRiskSummarySection(BaseModel):
    creditRating: str
    existingDebt: str
    debtRatios: list[dict[str, str]] = Field(default_factory=list)
    repaymentBehaviour: str
    defaultHistory: str
    primaryStrengths: list[str] = Field(default_factory=list)
    primaryConcerns: list[str] = Field(default_factory=list)


class RiskAggregationRecommendationSection(BaseModel):
    overallRiskScore: float
    overallRiskLevel: str
    confidenceScore: float
    recommendedDecision: str
    triggeredRule: str


class ConditionsSection(BaseModel):
    isConditional: bool
    isRejected: bool
    requiredCollateral: list[str] = Field(default_factory=list)
    additionalDocumentation: list[str] = Field(default_factory=list)
    financialCovenants: list[str] = Field(default_factory=list)
    reportingFrequency: Optional[str] = "Quarterly"
    monitoringRequirements: list[str] = Field(default_factory=list)
    rejectionReasons: list[str] = Field(default_factory=list)


class ExecutiveReportVM(BaseModel):
    reportId: str
    executiveSummary: ExecutiveSummarySection
    keyFinancialHighlights: FinancialHighlightsSection
    macroIndustryOutlook: MacroIndustryOutlookSection
    marketFXRiskSummary: MarketFXRiskSummarySection
    creditRiskSummary: CreditRiskSummarySection
    riskAggregation: RiskAggregationRecommendationSection
    keyInsights: list[str] = Field(default_factory=list)
    conditions: ConditionsSection
    aiExplainabilityNarrative: str
    disclaimer: str
