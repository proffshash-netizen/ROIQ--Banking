// Financial Analytics Types

// --- Raw Input Types (matching mock / API shape) ---

export interface TreasuryInput {
  bond_portfolio: Record<string, unknown>;
  treasury_securities: Record<string, unknown>;
  interest_rate_information: Record<string, unknown>;
  yield_curve_data: Record<string, unknown>;
  duration_information: Record<string, unknown>;
  ai_treasury_assessment?: string;
  last_updated?: string;
}

export interface LiquidityInput {
  cash_positions: Record<string, unknown>;
  liquid_assets: Record<string, unknown>;
  funding_information: Record<string, unknown>;
  debt_obligations: Record<string, unknown>;
  liquidity_ratios: Record<string, unknown>;
  last_updated?: string;
}

export interface FinancialAnalyticsOutput {
  treasury: TreasuryInput;
  liquidity: LiquidityInput;
}

// --- View Model Types (consumed by widgets) ---

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type ComplianceStatus = "Compliant" | "Non-Compliant" | "Warning";
export type HealthStatus = "Strong" | "Healthy" | "Adequate" | "Weak" | "Critical";

export interface TreasuryVM {
  totalPortfolioValue: number;
  governmentBonds: number;
  corporateBonds: number;
  treasuryBills: number;
  treasuryNotes: number;
  treasuryBonds: number;
  allocation: {
    governmentPct: number;
    corporatePct: number;
    billsPct: number;
    notesPct: number;
    bondsPct: number;
  };
  riskRating: string;
  aiAssessment: string;
  lastUpdated: string;
}

export interface LiquidityVM {
  totalCash: number;
  operatingCash: number;
  reserveCash: number;
  investmentCash: number;
  totalLiquidAssets: number;
  totalFunding: number;
  stableFunding: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalDebt: number;
  currentRatio: number;
  quickRatio: number;
  liquidityHealth: string;
  aiAssessment: string;
  lastUpdated: string;
}

export interface InterestRatePoint {
  date: string;
  policy: number;
  market: number;
  overnight: number;
}

export interface InterestRateVM {
  policyRate: number;
  marketRate: number;
  overnightRate: number;
  averageRate: number;
  highestRate: number;
  lowestRate: number;
  historicalTrend: InterestRatePoint[];
  aiInterpretation: string;
}

export interface YieldTenor {
  label: string;
  years: number;
  yield: number;
}

export interface YieldCurveVM {
  tenors: YieldTenor[];
  shape: string;
  steepness: string;
  aiSummary: string;
}

export interface DurationVM {
  modifiedDuration: number;
  macaulayDuration: number;
  portfolioDuration: number;
  interestRateSensitivity: string;
  convexity: number;
  riskLevel: string;
  aiAssessment: string;
}

export interface LCRVM {
  ratio: number;
  requiredThreshold: number;
  complianceStatus: ComplianceStatus;
  buffer: number;
  regulatoryHealth: string;
  aiAssessment: string;
}

export interface NSFRVM {
  ratio: number;
  availableStableFunding: number;
  requiredStableFunding: number;
  complianceStatus: ComplianceStatus;
  fundingStabilityScore: string;
  aiAssessment: string;
}

export interface PortfolioVM {
  totalPortfolio: number;
  treasurySecurities: number;
  liquidAssets: number;
  allocation: Array<{ name: string; value: number }>;
  diversificationScore: string;
  portfolioRating: string;
}

export interface AIWorkflowStatus {
  engine: string;
  workflows: Array<{ name: string; status: string }>;
  langGraphStatus: string;
  backendStatus: string;
  overallInsight: string;
}
