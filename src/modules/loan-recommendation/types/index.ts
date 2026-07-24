// Loan Recommendation Module (CDSS) – Type Definitions
// Raw input types match backend JSON contracts exactly.
// View Model (VM) types are consumed by UI widgets after transformation.

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type DecisionOutcome = "APPROVE" | "APPROVE WITH CONDITIONS" | "FURTHER REVIEW" | "REJECT";
export type ModuleStatus = "success" | "warning" | "error" | "pending";

// ========== Raw Backend JSON Contracts ==========

export interface ModuleRiskResult {
  module: string;
  risk_score: number;
  risk_level: RiskLevel;
  status: ModuleStatus;
  weight?: number;
  ai_summary?: string;
}

export interface RiskAggregationInput {
  module_results: ModuleRiskResult[];
}

export interface LoanDetailsInput {
  company_name: string;
  loan_amount: number;
  loan_purpose: string;
  loan_tenure_months: number;
  requested_product_type: string;
  requested_date: string;
  currency: string;
}

export interface RiskAggregationSummaryInput {
  overall_risk_score: number;
  overall_risk_level: RiskLevel;
  confidence_score: number;
}

export interface LoanRecommendationInput {
  loan_details: LoanDetailsInput;
  risk_aggregation: RiskAggregationSummaryInput;
  module_results: ModuleRiskResult[];
}

// ========== Transformed Business View Models (VMs) ==========

export interface LoanSummaryVM {
  companyName: string;
  loanAmount: number;
  formattedLoanAmount: string;
  loanPurpose: string;
  loanTenureMonths: number;
  formattedTenure: string;
  requestedProductType: string;
  requestedDate: string;
  currency: string;
  aiSummary: string;
}

export interface RiskModuleBreakdownVM {
  moduleName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: ModuleStatus;
  weightPct: number;
  weightedContribution: number;
  aiSummary: string;
}

export interface RiskAggregationVM {
  overallRiskScore: number;
  overallRiskLevel: RiskLevel;
  confidenceScore: number;
  moduleBreakdowns: RiskModuleBreakdownVM[];
  aiInterpretation: string;
}

export interface CreditDecisionVM {
  decision: DecisionOutcome;
  overallRiskScore: number;
  confidenceScore: number;
  riskCategory: RiskLevel;
  suggestedInterestRateBand: string;
  suggestedCollateralRequirement: string;
  suggestedMonitoringFrequency: string;
  triggeredRule: string;
  aiSummary: string;
}

export interface ExplainabilityVM {
  topPositiveFactors: string[];
  topNegativeFactors: string[];
  primaryRiskDrivers: string[];
  mitigationStrategies: string[];
  recommendedLoanConditions: string[];
  requiredDocumentation: string[];
  postApprovalMonitoring: string[];
  businessJustification: string;
  aiSummary: string;
}

export interface LoanRecommendationDataVM {
  loanSummary: LoanSummaryVM;
  riskAggregation: RiskAggregationVM;
  creditDecision: CreditDecisionVM;
  explainability: ExplainabilityVM;
}

export interface LoanRecommendationModuleState {
  data: LoanRecommendationDataVM | null;
  loading: boolean;
  error: string | null;
}
