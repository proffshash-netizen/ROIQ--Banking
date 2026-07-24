// Forecast Module Type Definitions

export interface CorporateFinancialInput {
  income_statement: {
    revenue_trend?: Array<{ period: string; value: number }>;
    profitability_trend?: Array<{ period: string; net_income: number; operating_income: number }>;
    current_revenue?: number;
    current_net_income?: number;
    gross_profit_margin?: number;
    net_profit_margin?: number;
  };
  balance_sheet: {
    total_assets?: number;
    total_liabilities?: number;
    total_equity?: number;
    current_ratio?: number;
    debt_to_equity?: number;
  };
  cash_flow_statement: {
    operating_cash_flow?: number;
    investing_cash_flow?: number;
    financing_cash_flow?: number;
    free_cash_flow?: number;
  };
  financial_ratios: {
    roe?: number;
    roa?: number;
    quick_ratio?: number;
    interest_coverage?: number;
  };
}

export interface MacroIndustryInput {
  macro_industry_data: {
    gdp_growth: number;
    inflation_rate: number;
    interest_rate: number;
    treasury_rate: number;
    currency_stability: number;
    industry_growth_rate: number;
    market_sentiment: string;
    competition_level: string;
    country_risk: {
      rating?: string;
      score?: number;
      outlook?: string;
      description?: string;
    };
    historical_trends?: Array<{
      year: string;
      gdp: number;
      inflation: number;
      interest: number;
      treasury: number;
    }>;
    industry_segments?: Array<{
      segment: string;
      growth_rate: number;
    }>;
  };
}

export interface ForecastResponse {
  corporate: CorporateFinancialInput;
  macro: MacroIndustryInput;
}

// --- View Models ---

export interface FinancialTrendPoint {
  period: string;
  revenue: number;
  netIncome: number;
  operatingIncome: number;
}

export interface CorporateFinancialVM {
  currentRevenue: number;
  currentNetIncome: number;
  grossMargin: number;
  netMargin: number;
  roe: number;
  roa: number;
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  interestCoverage: number;
  freeCashFlow: number;
  operatingCashFlow: number;
  trends: FinancialTrendPoint[];
  aiAssessment: string;
}

export interface MacroTrendPoint {
  year: string;
  gdp: number;
  inflation: number;
  interest: number;
  treasury: number;
}

export interface IndustrySegmentVM {
  segment: string;
  growthRate: number;
}

export interface MacroIndustryVM {
  gdpGrowth: number;
  inflationRate: number;
  interestRate: number;
  treasuryRate: number;
  currencyStability: number;
  industryGrowth: number;
  marketSentiment: string;
  competitionLevel: string;
  countryRiskRating: string;
  countryRiskScore: number;
  countryRiskOutlook: string;
  countryRiskDescription: string;
  macroTrends: MacroTrendPoint[];
  industrySegments: IndustrySegmentVM[];
  aiAssessment: string;
}

export interface ForecastSummaryVM {
  financialStrength: number; // 0-100
  profitability: number;     // 0-100
  macroeconomicHealth: number;// 0-100
  industryGrowth: number;    // 0-100
  countryStability: number;  // 0-100
  forecastConfidence: number; // 0-100
  overallScore: number;
  grade: string;
  summaryText: string;
}
