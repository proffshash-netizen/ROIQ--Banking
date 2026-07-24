// src/modules/financial-analytics/services/FinancialAnalyticsMockService.ts
import { treasuryMockData } from "../mock/treasury.mock";
import { liquidityMockData } from "../mock/liquidity.mock";
import type { TreasuryInput, LiquidityInput } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

export interface FinancialAnalyticsResponse {
  treasury: TreasuryInput;
  liquidity: LiquidityInput;
}

export const fetchFinancialAnalyticsData = async (): Promise<FinancialAnalyticsResponse> => {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 300));

  const store = useCompaniesStore.getState();
  const activeCompany = store.companies.find(c => c.id === store.selectedCompanyId) || store.companies[0];

  // Parse loan exposure (e.g., "$420M" -> 420, "$1.2B" -> 1200)
  let exposureVal = 420; // default Tata Steel exposure in millions
  const exposureStr = activeCompany.loanExposure;
  if (exposureStr.endsWith("B")) {
    exposureVal = parseFloat(exposureStr.replace(/[^0-9.]/g, "")) * 1000;
  } else if (exposureStr.endsWith("M")) {
    exposureVal = parseFloat(exposureStr.replace(/[^0-9.]/g, ""));
  }

  // Calculate multiplier (based on $420M base)
  const scale = exposureVal / 420;

  // Adapt credit rating and risk
  const score = activeCompany.creditScore;
  const rating = score >= 85 ? "A+" : score >= 75 ? "A" : score >= 65 ? "BBB+" : score >= 50 ? "BB" : "B-";
  const riskRating = activeCompany.riskLevel.charAt(0).toUpperCase() + activeCompany.riskLevel.slice(1);

  // Scale bond portfolio government/corporate allocation according to risk
  // Low risk -> more gov bonds, high risk -> more cash / liquid reserves
  const govBonds = Math.round(980_000_000 * scale * (score / 70));
  const corpBonds = Math.round(735_000_000 * scale * (1.2 - score / 150));
  const tBills = Math.round(367_500_000 * scale);
  const tNotes = Math.round(245_000_000 * scale);
  const tBonds = Math.round(122_500_000 * scale);
  const totalValue = govBonds + corpBonds + tBills + tNotes + tBonds;

  const governmentPct = parseFloat(((govBonds / totalValue) * 100).toFixed(1));
  const corporatePct = parseFloat(((corpBonds / totalValue) * 100).toFixed(1));
  const billsPct = parseFloat(((tBills / totalValue) * 100).toFixed(1));
  const notesPct = parseFloat(((tNotes / totalValue) * 100).toFixed(1));
  const bondsPct = parseFloat(((tBonds / totalValue) * 100).toFixed(1));

  const treasury: TreasuryInput = {
    ...treasuryMockData,
    bond_portfolio: {
      total_value: totalValue,
      government_bonds: govBonds,
      corporate_bonds: corpBonds,
      treasury_bills: tBills,
      treasury_notes: tNotes,
      treasury_bonds: tBonds,
      allocation: {
        government_pct: governmentPct,
        corporate_pct: corporatePct,
        bills_pct: billsPct,
        notes_pct: notesPct,
        bonds_pct: bondsPct,
      },
      risk_rating: riskRating,
      last_rebalanced: new Date().toISOString(),
    },
    treasury_securities: {
      total_holdings: Math.round(735_000_000 * scale),
      maturity_profile: {
        short_term: Math.round(294_000_000 * scale),
        medium_term: Math.round(257_250_000 * scale),
        long_term: Math.round(183_750_000 * scale),
      },
      average_yield: parseFloat((4.35 * (1 + (80 - score) / 500)).toFixed(2)),
      weighted_average_maturity_years: parseFloat((5.2 * (score / 75)).toFixed(1)),
    },
    ai_treasury_assessment: `Comprehensive treasury analysis for ${activeCompany.name} (${activeCompany.sector}). The entity currently exhibits a Credit Score of ${activeCompany.creditScore}/100 and a ${activeCompany.riskLevel} risk outlook. Government securities comprise ${governmentPct}% of the bond portfolio allocation. Overall portfolio yield is projected at ${(4.35 * (1 + (80 - score) / 500)).toFixed(2)}% under prevailing market rates.`,
    last_updated: new Date().toLocaleDateString(),
  };

  const cashVal = Math.round(850_000_000 * scale);
  const liquidAssetsVal = Math.round(1_650_000_000 * scale);
  const stableFundingVal = Math.round(2_560_000_000 * scale);
  const requiredFundingVal = Math.round(1_800_000_000 * scale);

  const liquidity: LiquidityInput = {
    ...liquidityMockData,
    cash_positions: {
      total_cash: cashVal,
      operating_cash: Math.round(cashVal * 0.4),
      reserve_cash: Math.round(cashVal * 0.3),
      investment_cash: Math.round(cashVal * 0.2),
      restricted_cash: Math.round(cashVal * 0.1),
      currency_breakdown: {
        INR: Math.round(cashVal * 0.8),
        USD: Math.round(cashVal * 0.12),
        EUR: Math.round(cashVal * 0.05),
        GBP: Math.round(cashVal * 0.03),
      },
    },
    liquid_assets: {
      total_liquid_assets: liquidAssetsVal,
      hqla_level_1: Math.round(liquidAssetsVal * 0.6),
      hqla_level_2a: Math.round(liquidAssetsVal * 0.25),
      hqla_level_2b: Math.round(liquidAssetsVal * 0.15),
      encumbered_assets: Math.round(liquidAssetsVal * 0.1),
      unencumbered_assets: Math.round(liquidAssetsVal * 0.9),
    },
    funding_information: {
      total_funding: Math.round(3_200_000_000 * scale),
      stable_funding: stableFundingVal,
      wholesale_funding: Math.round(3_200_000_000 * scale * 0.2),
      retail_deposits: Math.round(3_200_000_000 * scale * 0.6),
      interbank_borrowing: Math.round(3_200_000_000 * scale * 0.1),
      funding_concentration_risk: activeCompany.riskLevel === "low" ? "Low" : activeCompany.riskLevel === "medium" ? "Moderate" : "High",
    },
    debt_obligations: {
      total_debt: requiredFundingVal,
      short_term_debt: Math.round(requiredFundingVal * 0.3),
      long_term_debt: Math.round(requiredFundingVal * 0.7),
      weighted_average_cost: parseFloat((5.85 * (1.5 - score / 150)).toFixed(2)),
      next_maturity_date: "2026-09-15",
      next_maturity_amount: Math.round(requiredFundingVal * 0.1),
    },
    liquidity_ratios: {
      liquidity_coverage_ratio: parseFloat((142.5 * (score / 70)).toFixed(1)),
      net_stable_funding_ratio: parseFloat((120.4 * (score / 72)).toFixed(1)),
      current_ratio: parseFloat((1.85 * (score / 68)).toFixed(2)),
      quick_ratio: parseFloat((1.32 * (score / 68)).toFixed(2)),
      last_updated: new Date().toISOString(),
    },
    last_updated: new Date().toLocaleDateString(),
  };

  return { treasury, liquidity };
};
