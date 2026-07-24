// Forecast Mock Service — company-context-aware
import type { ForecastResponse } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

// Sector-based macro profiles
const sectorMacro: Record<string, {
  gdpGrowth: number; inflation: number; interestRate: number;
  treasuryRate: number; currency: number; industryGrowth: number;
  sentiment: string; competition: string;
}> = {
  "Metals & Mining":              { gdpGrowth: 6.2, inflation: 5.1, interestRate: 6.50, treasuryRate: 7.05, currency: 81.2, industryGrowth: 7.4,  sentiment: "Neutral",  competition: "High"     },
  "Oil & Gas":                    { gdpGrowth: 6.8, inflation: 5.4, interestRate: 6.50, treasuryRate: 7.05, currency: 82.0, industryGrowth: 6.8,  sentiment: "Bullish",  competition: "Moderate" },
  "NBFC / Financial Services":    { gdpGrowth: 7.2, inflation: 4.9, interestRate: 6.25, treasuryRate: 6.80, currency: 84.5, industryGrowth: 12.4, sentiment: "Bullish",  competition: "High"     },
  "Conglomerate / Infrastructure":{ gdpGrowth: 7.0, inflation: 5.0, interestRate: 6.50, treasuryRate: 7.10, currency: 80.0, industryGrowth: 9.2,  sentiment: "Bullish",  competition: "Moderate" },
  "Diversified Metals":           { gdpGrowth: 5.8, inflation: 5.5, interestRate: 6.75, treasuryRate: 7.20, currency: 76.0, industryGrowth: 5.9,  sentiment: "Bearish",  competition: "High"     },
  "Energy / Telecom / Retail":    { gdpGrowth: 7.5, inflation: 4.6, interestRate: 6.25, treasuryRate: 6.75, currency: 86.0, industryGrowth: 14.0, sentiment: "Bullish",  competition: "High"     },
  "Banking":                      { gdpGrowth: 7.3, inflation: 4.8, interestRate: 6.50, treasuryRate: 7.00, currency: 85.0, industryGrowth: 11.5, sentiment: "Bullish",  competition: "High"     },
  "Automotive / Agri":            { gdpGrowth: 6.5, inflation: 5.2, interestRate: 6.50, treasuryRate: 7.05, currency: 82.5, industryGrowth: 8.1,  sentiment: "Neutral",  competition: "Moderate" },
  "Media & Entertainment":        { gdpGrowth: 5.0, inflation: 5.6, interestRate: 6.75, treasuryRate: 7.30, currency: 70.0, industryGrowth: 3.2,  sentiment: "Bearish",  competition: "High"     },
};

const defaultMacro = { gdpGrowth: 6.8, inflation: 4.8, interestRate: 6.50, treasuryRate: 7.05, currency: 85.2, industryGrowth: 8.5, sentiment: "Bullish", competition: "High" };

export const fetchForecastData = async (): Promise<ForecastResponse> => {
  await new Promise((res) => setTimeout(res, 300));

  const store = useCompaniesStore.getState();
  const active = store.companies.find(c => c.id === store.selectedCompanyId) || store.companies[0];

  const score = active.creditScore;
  const macro = sectorMacro[active.sector] ?? defaultMacro;

  // Parse revenue from string like "₹2,43,353 Cr" to number (millions)
  const revenueRaw = active.revenue.replace(/[₹,\s]/g, "").replace("Cr", "").trim();
  const revenueMillion = parseFloat(revenueRaw) * 10_000_000; // Cr = 10M

  // Generate 5-year revenue trend based on company data
  const growthRate = macro.industryGrowth / 100;
  const baseRevenue = isNaN(revenueMillion) ? 1_950_000_000 : revenueMillion;
  const marginPct = (score >= 80 ? 0.17 : score >= 65 ? 0.13 : score >= 50 ? 0.09 : 0.05);

  const years = ["2022", "2023", "2024", "2025", "2026 (F)"];
  const revenueBase = baseRevenue * 0.6; // 2022 was 60% of today
  const revenueTrend = years.map((period, i) => ({
    period,
    value: Math.round(revenueBase * Math.pow(1 + growthRate * 0.8, i)),
  }));
  const profitabilityTrend = revenueTrend.map(({ period, value }) => ({
    period,
    net_income: Math.round(value * marginPct),
    operating_income: Math.round(value * (marginPct * 1.35)),
  }));

  const currentRevenue = revenueTrend[3].value;
  const currentNetIncome = profitabilityTrend[3].net_income;

  const debtToEquity = score >= 80 ? 0.45 : score >= 65 ? 0.85 : score >= 50 ? 1.42 : 2.20;
  const currentRatio = score >= 80 ? 2.40 : score >= 65 ? 1.75 : score >= 50 ? 1.20 : 0.95;
  const roe = score >= 80 ? 19.5 : score >= 65 ? 14.2 : score >= 50 ? 9.8 : 5.2;
  const roa = score >= 80 ? 12.1 : score >= 65 ? 8.5 : score >= 50 ? 5.4 : 2.8;

  return {
    corporate: {
      income_statement: {
        revenue_trend: revenueTrend,
        profitability_trend: profitabilityTrend,
        current_revenue: currentRevenue,
        current_net_income: currentNetIncome,
        gross_profit_margin: parseFloat((marginPct * 2.4 * 100).toFixed(1)),
        net_profit_margin: parseFloat((marginPct * 100).toFixed(1)),
      },
      balance_sheet: {
        total_assets: Math.round(currentRevenue * 1.65),
        total_liabilities: Math.round(currentRevenue * 0.65),
        total_equity: Math.round(currentRevenue),
        current_ratio: currentRatio,
        debt_to_equity: debtToEquity,
      },
      cash_flow_statement: {
        operating_cash_flow: Math.round(currentRevenue * 0.21),
        investing_cash_flow: Math.round(currentRevenue * -0.09),
        financing_cash_flow: Math.round(currentRevenue * -0.05),
        free_cash_flow: Math.round(currentRevenue * 0.12),
      },
      financial_ratios: {
        roe,
        roa,
        quick_ratio: parseFloat((currentRatio * 0.77).toFixed(2)),
        interest_coverage: parseFloat((score >= 80 ? 10.2 : score >= 65 ? 6.8 : score >= 50 ? 3.5 : 1.8).toFixed(1)),
      },
    },
    macro: {
      macro_industry_data: {
        gdp_growth: macro.gdpGrowth,
        inflation_rate: macro.inflation,
        interest_rate: macro.interestRate,
        treasury_rate: macro.treasuryRate,
        currency_stability: macro.currency,
        industry_growth_rate: macro.industryGrowth,
        market_sentiment: macro.sentiment,
        competition_level: macro.competition,
        country_risk: {
          rating: score >= 80 ? "BBB+" : score >= 65 ? "BBB-" : "BB",
          score: parseFloat((55 + score * 0.2).toFixed(1)),
          outlook: score >= 70 ? "Stable" : "Negative",
          description: `Macroeconomic outlook for ${active.sector} sector with ${macro.sentiment.toLowerCase()} market sentiment. ${macro.industryGrowth}% projected industry growth rate; ${macro.competition.toLowerCase()} competitive intensity.`,
        },
        historical_trends: [
          { year: "2022", gdp: macro.gdpGrowth - 0.8, inflation: macro.inflation + 0.9, interest: macro.interestRate - 0.75, treasury: macro.treasuryRate - 0.70 },
          { year: "2023", gdp: macro.gdpGrowth - 0.4, inflation: macro.inflation + 0.4, interest: macro.interestRate - 0.50, treasury: macro.treasuryRate - 0.40 },
          { year: "2024", gdp: macro.gdpGrowth - 0.1, inflation: macro.inflation + 0.1, interest: macro.interestRate - 0.25, treasury: macro.treasuryRate - 0.20 },
          { year: "2025", gdp: macro.gdpGrowth,       inflation: macro.inflation,       interest: macro.interestRate,        treasury: macro.treasuryRate        },
          { year: "2026", gdp: macro.gdpGrowth + 0.2, inflation: macro.inflation - 0.3, interest: macro.interestRate + 0.25, treasury: macro.treasuryRate + 0.15 },
        ],
        industry_segments: [
          { segment: "Core Operations",  growth_rate: macro.industryGrowth },
          { segment: "Digital / Tech",   growth_rate: macro.industryGrowth * 1.5 },
          { segment: "Exports",          growth_rate: macro.industryGrowth * 0.7 },
          { segment: "Domestic",         growth_rate: macro.industryGrowth * 0.9 },
          { segment: "Green / ESG",      growth_rate: macro.industryGrowth * 1.2 },
        ],
      },
    },
  };
};
