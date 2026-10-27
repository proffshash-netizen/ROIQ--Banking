// Transformation Utilities
// Converts raw API / mock JSON into typed View Models consumed by widgets.

import type {
  TreasuryInput,
  LiquidityInput,
  TreasuryVM,
  LiquidityVM,
  InterestRateVM,
  InterestRatePoint,
  YieldCurveVM,
  YieldTenor,
  DurationVM,
  LCRVM,
  NSFRVM,
  PortfolioVM,
  AIWorkflowStatus,
  ComplianceStatus,
} from "../types";

// ---------- helpers ----------

const safeNum = (v: unknown, fallback = 0): number =>
  typeof v === "number" ? v : fallback;

const safeStr = (v: unknown, fallback = "—"): string =>
  typeof v === "string" ? v : fallback;


const rec = (v: unknown): Record<string, unknown> =>
  (typeof v === "object" && v !== null ? v : {}) as Record<string, unknown>;

// ---------- Currency formatting ----------

export const formatCurrency = (value: number): string => {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

export const formatPct = (value: number): string => `${value.toFixed(1)}%`;

export const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

// ---------- Treasury ----------

export function transformTreasury(raw: TreasuryInput): TreasuryVM {
  const bp = rec(raw.bond_portfolio);
  const alloc = rec(bp.allocation);
  return {
    totalPortfolioValue: safeNum(bp.total_value),
    governmentBonds: safeNum(bp.government_bonds),
    corporateBonds: safeNum(bp.corporate_bonds),
    treasuryBills: safeNum(bp.treasury_bills),
    treasuryNotes: safeNum(bp.treasury_notes),
    treasuryBonds: safeNum(bp.treasury_bonds),
    allocation: {
      governmentPct: safeNum(alloc.government_pct),
      corporatePct: safeNum(alloc.corporate_pct),
      billsPct: safeNum(alloc.bills_pct),
      notesPct: safeNum(alloc.notes_pct),
      bondsPct: safeNum(alloc.bonds_pct),
    },
    riskRating: safeStr(bp.risk_rating, "Unknown"),
    aiAssessment: safeStr(raw.ai_treasury_assessment as unknown as string, "Treasury assessment pending."),
    lastUpdated: safeStr(raw.last_updated as unknown as string),
  };
}

// ---------- Liquidity ----------

export function transformLiquidity(raw: LiquidityInput): LiquidityVM {
  const cp = rec(raw.cash_positions);
  const la = rec(raw.liquid_assets);
  const fi = rec(raw.funding_information);
  const debt = rec(raw.debt_obligations);
  const ratios = rec(raw.liquidity_ratios);
  return {
    totalCash: safeNum(cp.total_cash),
    operatingCash: safeNum(cp.operating_cash),
    reserveCash: safeNum(cp.reserve_cash),
    investmentCash: safeNum(cp.investment_cash),
    totalLiquidAssets: safeNum(la.total_liquid_assets),
    totalFunding: safeNum(fi.total_funding),
    stableFunding: safeNum(fi.stable_funding),
    shortTermDebt: safeNum(debt.short_term_debt),
    longTermDebt: safeNum(debt.long_term_debt),
    totalDebt: safeNum(debt.total_debt),
    currentRatio: safeNum(ratios.current_ratio),
    quickRatio: safeNum(ratios.quick_ratio),
    liquidityHealth: safeStr(ratios.liquidity_health, "Unknown"),
    aiAssessment: safeStr(
      ratios.ai_liquidity_assessment as unknown as string,
      "Liquidity assessment pending."
    ),
    lastUpdated: safeStr(raw.last_updated as unknown as string),
  };
}

// ---------- Interest Rates ----------

export function transformInterestRate(raw: TreasuryInput): InterestRateVM {
  const ir = rec(raw.interest_rate_information);
  const trend = (Array.isArray(ir.historical_trend) ? ir.historical_trend : []) as Array<Record<string, unknown>>;
  return {
    policyRate: safeNum(ir.policy_rate),
    marketRate: safeNum(ir.market_rate),
    overnightRate: safeNum(ir.overnight_rate),
    averageRate: safeNum(ir.average_rate),
    highestRate: safeNum(ir.highest_rate),
    lowestRate: safeNum(ir.lowest_rate),
    historicalTrend: trend.map(
      (t): InterestRatePoint => ({
        date: safeStr(t.date),
        policy: safeNum(t.policy),
        market: safeNum(t.market),
        overnight: safeNum(t.overnight),
      })
    ),
    aiInterpretation: safeStr(ir.ai_interpretation, "Interest rate analysis pending."),
  };
}

// ---------- Yield Curve ----------

export function transformYieldCurve(raw: TreasuryInput): YieldCurveVM {
  const yc = rec(raw.yield_curve_data);
  const tenors = (Array.isArray(yc.tenors) ? yc.tenors : []) as Array<Record<string, unknown>>;
  return {
    tenors: tenors.map(
      (t): YieldTenor => ({
        label: safeStr(t.label),
        years: safeNum(t.years),
        yield: safeNum(t.yield),
      })
    ),
    shape: safeStr(yc.shape, "Unknown"),
    steepness: safeStr(yc.steepness, "Unknown"),
    aiSummary: safeStr(yc.ai_summary, "Yield curve analysis pending."),
  };
}

// ---------- Duration ----------

export function transformDuration(raw: TreasuryInput): DurationVM {
  const d = rec(raw.duration_information);
  return {
    modifiedDuration: safeNum(d.modified_duration),
    macaulayDuration: safeNum(d.macaulay_duration),
    portfolioDuration: safeNum(d.portfolio_duration),
    interestRateSensitivity: safeStr(d.interest_rate_sensitivity, "Unknown"),
    convexity: safeNum(d.convexity),
    riskLevel: safeStr(d.risk_level, "Unknown"),
    aiAssessment: safeStr(d.ai_assessment as unknown as string, "Duration analysis pending."),
  };
}

// ---------- LCR ----------

export function transformLCR(raw: LiquidityInput): LCRVM {
  const ratios = rec(raw.liquidity_ratios);
  const lcr = rec(ratios.lcr);
  return {
    ratio: safeNum(lcr.ratio),
    requiredThreshold: safeNum(lcr.required_threshold, 100),
    complianceStatus: safeStr(lcr.compliance_status, "Unknown") as ComplianceStatus,
    buffer: safeNum(lcr.buffer),
    regulatoryHealth: safeStr(lcr.regulatory_health, "Unknown"),
    aiAssessment: safeStr(lcr.ai_assessment as unknown as string, "LCR assessment pending."),
  };
}

// ---------- NSFR ----------

export function transformNSFR(raw: LiquidityInput): NSFRVM {
  const ratios = rec(raw.liquidity_ratios);
  const nsfr = rec(ratios.nsfr);
  return {
    ratio: safeNum(nsfr.ratio),
    availableStableFunding: safeNum(nsfr.available_stable_funding),
    requiredStableFunding: safeNum(nsfr.required_stable_funding),
    complianceStatus: safeStr(nsfr.compliance_status, "Unknown") as ComplianceStatus,
    fundingStabilityScore: safeStr(nsfr.funding_stability_score, "—"),
    aiAssessment: safeStr(nsfr.ai_assessment as unknown as string, "NSFR assessment pending."),
  };
}

// ---------- Portfolio ----------

export function transformPortfolio(treasury: TreasuryInput, liquidity: LiquidityInput): PortfolioVM {
  const bp = rec(treasury.bond_portfolio);
  const la = rec(liquidity.liquid_assets);
  const totalPortfolio = safeNum(bp.total_value) + safeNum(la.total_liquid_assets);
  const treasurySecurities = safeNum(bp.total_value);
  const liquidAssets = safeNum(la.total_liquid_assets);
  return {
    totalPortfolio,
    treasurySecurities,
    liquidAssets,
    allocation: [
      { name: "Government Bonds", value: safeNum(bp.government_bonds) },
      { name: "Corporate Bonds", value: safeNum(bp.corporate_bonds) },
      { name: "T-Bills", value: safeNum(bp.treasury_bills) },
      { name: "T-Notes", value: safeNum(bp.treasury_notes) },
      { name: "T-Bonds", value: safeNum(bp.treasury_bonds) },
      { name: "Liquid Assets", value: liquidAssets },
    ],
    diversificationScore: "A",
    portfolioRating: "Investment Grade",
  };
}

// ---------- AI Workflow Status ----------

export function transformAIStatus(): AIWorkflowStatus {
  return {
    engine: "ROIQ AI Engine v2.1",
    workflows: [
      { name: "Treasury Analysis", status: "Complete" },
      { name: "Liquidity Analysis", status: "Complete" },
      { name: "Portfolio Validation", status: "Complete" },
      { name: "Interest Rate Evaluation", status: "Complete" },
      { name: "Yield Curve Interpretation", status: "Complete" },
    ],
    langGraphStatus: "Ready (Awaiting Backend)",
    backendStatus: "Mock Service Active",
    overallInsight:
      "Portfolio maintains healthy liquidity coverage and moderate duration exposure. Current interest rate environment indicates manageable treasury risk. All analytical workflows completed successfully.",
  };
}
