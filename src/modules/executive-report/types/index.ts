// Executive Report Module – Type Definitions

export type DecisionOutcome = "APPROVE" | "APPROVE WITH CONDITIONS" | "FURTHER REVIEW" | "REJECT";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface ExecutiveSummarySection {
  companyName: string;
  industry: string;
  requestedLoanAmount: string;
  rawLoanAmount: number;
  loanPurpose: string;
  loanTenure: string;
  overallRecommendation: DecisionOutcome;
  reportGenerationDate: string;
  borrowerRating: string;
}

export interface FinancialHighlightsSection {
  liquidityPosition: string;
  treasuryHealth: string;
  revenueTrend: string;
  profitability: string;
  cashFlow: string;
  debtPosition: string;
  strengths: string[];
  weaknesses: string[];
}

export interface MacroIndustryOutlookSection {
  gdpOutlook: string;
  inflation: string;
  interestRateEnvironment: string;
  industryGrowth: string;
  countryRisk: string;
  aiInterpretation: string;
}

export interface MarketFXRiskSummarySection {
  var95: string;
  expectedShortfall: string;
  fxExposure: string;
  hedgedVsUnhedged: string;
  tailRisk: string;
  overallMarketRiskConclusion: string;
}

export interface CreditRiskSummarySection {
  creditRating: string;
  existingDebt: string;
  debtRatios: Array<{ name: string; value: string }>;
  repaymentBehaviour: string;
  defaultHistory: string;
  primaryStrengths: string[];
  primaryConcerns: string[];
}

export interface RiskAggregationRecommendationSection {
  overallRiskScore: number;
  overallRiskLevel: RiskLevel;
  confidenceScore: number;
  recommendedDecision: DecisionOutcome;
  triggeredRule: string;
}

export interface ConditionsSection {
  isConditional: boolean;
  isRejected: boolean;
  requiredCollateral?: string[];
  additionalDocumentation?: string[];
  financialCovenants?: string[];
  reportingFrequency?: string;
  monitoringRequirements?: string[];
  rejectionReasons?: string[];
}

export interface ExecutiveReportVM {
  reportId: string;
  executiveSummary: ExecutiveSummarySection;
  keyFinancialHighlights: FinancialHighlightsSection;
  macroIndustryOutlook: MacroIndustryOutlookSection;
  marketFXRiskSummary: MarketFXRiskSummarySection;
  creditRiskSummary: CreditRiskSummarySection;
  riskAggregation: RiskAggregationRecommendationSection;
  keyInsights: string[];
  conditions: ConditionsSection;
  aiExplainabilityNarrative: string;
  disclaimer: string;
}

export interface ExecutiveReportModuleState {
  data: ExecutiveReportVM | null;
  loading: boolean;
  error: string | null;
  generatingPDF: boolean;
}
