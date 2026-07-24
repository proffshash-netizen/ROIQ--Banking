// Mock data matching backend contracts for Forecasts module
import type { CorporateFinancialInput, MacroIndustryInput } from "../types";

export const corporateMockData: CorporateFinancialInput = {
  income_statement: {
    revenue_trend: [
      { period: "2022", value: 1250000000 },
      { period: "2023", value: 1420000000 },
      { period: "2024", value: 1680000000 },
      { period: "2025", value: 1950000000 },
      { period: "2026 (F)", value: 2240000000 },
    ],
    profitability_trend: [
      { period: "2022", net_income: 187000000, operating_income: 250000000 },
      { period: "2023", net_income: 213000000, operating_income: 284000000 },
      { period: "2024", net_income: 268000000, operating_income: 352000000 },
      { period: "2025", net_income: 331000000, operating_income: 429000000 },
      { period: "2026 (F)", net_income: 392000000, operating_income: 515000000 },
    ],
    current_revenue: 1950000000,
    current_net_income: 331000000,
    gross_profit_margin: 42.5,
    net_profit_margin: 16.9,
  },
  balance_sheet: {
    total_assets: 3100000000,
    total_liabilities: 1250000000,
    total_equity: 1850000000,
    current_ratio: 2.15,
    debt_to_equity: 0.68,
  },
  cash_flow_statement: {
    operating_cash_flow: 412000000,
    investing_cash_flow: -185000000,
    financing_cash_flow: -95000000,
    free_cash_flow: 227000000,
  },
  financial_ratios: {
    roe: 17.89,
    roa: 10.68,
    quick_ratio: 1.65,
    interest_coverage: 8.45,
  },
};

export const macroMockData: MacroIndustryInput = {
  macro_industry_data: {
    gdp_growth: 6.8,
    inflation_rate: 4.8,
    interest_rate: 6.50,
    treasury_rate: 7.05,
    currency_stability: 85.2,
    industry_growth_rate: 8.5,
    market_sentiment: "Bullish",
    competition_level: "High",
    country_risk: {
      rating: "BBB-",
      score: 62.4,
      outlook: "Stable",
      description: "Moderate sovereign debt risk with resilient macroeconomic growth engine and strong structural demographics.",
    },
    historical_trends: [
      { year: "2022", gdp: 5.6, inflation: 6.2, interest: 5.5, treasury: 6.1 },
      { year: "2023", gdp: 6.1, inflation: 5.5, interest: 6.0, treasury: 6.4 },
      { year: "2024", gdp: 6.3, inflation: 5.1, interest: 6.5, treasury: 6.8 },
      { year: "2025", gdp: 6.5, inflation: 4.9, interest: 6.5, treasury: 6.9 },
      { year: "2026 (F)", gdp: 6.8, inflation: 4.8, interest: 6.5, treasury: 7.05 },
    ],
    industry_segments: [
      { segment: "SaaS & Core Tech", growth_rate: 14.5 },
      { segment: "Fintech & Banking", growth_rate: 11.2 },
      { segment: "Ecommerce & Retail", growth_rate: 9.8 },
      { segment: "Traditional Supply Chain", growth_rate: 5.4 },
      { segment: "Industrial Real Estate", growth_rate: 4.2 },
    ],
  },
};
