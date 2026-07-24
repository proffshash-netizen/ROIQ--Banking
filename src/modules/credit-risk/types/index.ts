// Credit Risk Module – Type Definitions
// Raw input types match backend JSON contracts exactly.
// View Model (VM) types are consumed by UI widgets after transformation.

// ========== Risk severity types ==========

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type TrendDirection = "up" | "down" | "stable";
export type DecisionOption = "Approve" | "Approve with Conditions" | "Further Review" | "Reject";

// ========== Raw Input Types (Backend Contracts) ==========

export interface MarketRiskInput {
  company_id: string;
  market_fx_data: {
    var_95: number;
    expected_shortfall: number;
    pnl_volatility: number;
    tail_risk_ratio: number;
    currency_exposure: number;
    hedged_exposure: number;
    unhedged_exposure: number;
    fx_volatility: number;
    cross_currency_basis: number;
    security_identifiers: string[];
  };
}

export interface CreditRiskInput {
  credit_history: Record<string, unknown>;
  existing_debt: Record<string, unknown>;
  default_history: Record<string, unknown>;
  credit_rating: string;
  debt_ratios: Record<string, unknown>;
}

// ========== Market Risk View Models ==========

export interface MarketRiskKpiVM {
  label: string;
  value: number;
  formattedValue: string;
  unit: string;
  riskLevel: RiskLevel;
  interpretation: string;
  trend: TrendDirection;
  trendPct: number;
}

export interface MarketRiskVM {
  companyId: string;
  kpis: MarketRiskKpiVM[];
  varVsEs: { var95: number; expectedShortfall: number };
  exposureBreakdown: { hedged: number; unhedged: number; total: number };
  fxVolatilityTrend: Array<{ month: string; volatility: number }>;
  exposureDistribution: Array<{ name: string; value: number }>;
  crossCurrencyBasis: number;
  instrumentCount: number;
  summary: {
    riskRating: RiskLevel;
    primaryDriver: string;
    largestExposure: string;
    riskTrend: TrendDirection;
    aiInterpretation: string;
  };
}

// ========== Credit Risk View Models ==========

export interface CreditRiskKpiVM {
  label: string;
  value: number | string;
  formattedValue: string;
  unit: string;
  riskLevel: RiskLevel;
  interpretation: string;
}

export interface CreditRiskVM {
  creditRating: string;
  creditScore: number;
  debtOutstanding: number;
  debtToEquity: number;
  interestCoverage: number;
  historicalDefaults: number;
  repaymentBehaviour: string;
  creditUtilization: number;
  debtServiceCapacity: number;
  riskCategory: RiskLevel;
  kpis: CreditRiskKpiVM[];
  debtStructure: {
    shortTerm: number;
    longTerm: number;
    revolving: number;
    secured: number;
    unsecured: number;
  };
  defaultTimeline: Array<{ year: string; defaults: number; resolved: number }>;
  debtRatios: Array<{ name: string; value: number; threshold: number }>;
  ratingHistory: Array<{ date: string; rating: string }>;
  summary: {
    currentRating: string;
    probabilityOfDefault: number;
    financialLeverage: string;
    repaymentQuality: string;
    debtBurden: string;
    creditOutlook: string;
    riskClassification: RiskLevel;
    aiInterpretation: string;
  };
}

// ========== Executive Decision Support View Models ==========

export interface ExecutiveSummaryVM {
  unifiedRiskScore: number;
  marketRiskScore: number;
  creditRiskScore: number;
  compositeRiskRating: RiskLevel;
  creditFacilityLimit: number;
  fxExposureRisk: RiskLevel;
  leverage: string;
  probabilityOfDefault: number;
  recommendedMonitoring: string;
  riskConfidence: number;
  recommendedDecision: DecisionOption;
  warningSignals: string[];
  decisionMatrix: Array<{
    option: DecisionOption;
    confidence: number;
    isRecommended: boolean;
  }>;
  aiDecisionRationale: string;
  aiExplanation: {
    topRiskDrivers: string[];
    positiveIndicators: string[];
    negativeIndicators: string[];
    mitigationSuggestions: string[];
    monitoringRecommendations: string[];
    businessSummary: string;
  };
}

// ========== Combined Module State ==========

export interface CreditRiskModuleState {
  marketRisk: MarketRiskVM | null;
  creditRisk: CreditRiskVM | null;
  executiveSummary: ExecutiveSummaryVM | null;
  loading: boolean;
  error: string | null;
}
