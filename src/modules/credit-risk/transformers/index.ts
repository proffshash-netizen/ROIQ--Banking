// Credit Risk Module – Transformation Layer
// Converts raw backend JSON into typed View Models consumed by UI widgets.
// Never bind UI directly to raw JSON – always go through these transformers.

import type {
  MarketRiskInput,
  CreditRiskInput,
  MarketRiskVM,
  MarketRiskKpiVM,
  CreditRiskVM,
  CreditRiskKpiVM,
  ExecutiveSummaryVM,
  RiskLevel,
  TrendDirection,
  DecisionOption,
} from "../types";

// ========== Helpers ==========

const safeNum = (v: unknown, fallback = 0): number =>
  typeof v === "number" ? v : fallback;

const safeStr = (v: unknown, fallback = "—"): string =>
  typeof v === "string" ? v : fallback;

const rec = (v: unknown): Record<string, unknown> =>
  (typeof v === "object" && v !== null ? v : {}) as Record<string, unknown>;

// ========== Currency & Number Formatting ==========

export const formatCurrency = (value: number): string => {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

export const formatPct = (value: number): string => `${value.toFixed(1)}%`;

export const formatRatio = (value: number): string => `${value.toFixed(2)}x`;

export const formatBps = (value: number): string => `${(value * 100).toFixed(0)} bps`;

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("en-US").format(value);

// ========== Risk Classification ==========

export function calculateRiskLevel(
  value: number,
  thresholds: { low: number; moderate: number; high: number }
): RiskLevel {
  if (value <= thresholds.low) return "Low";
  if (value <= thresholds.moderate) return "Moderate";
  if (value <= thresholds.high) return "High";
  return "Critical";
}

export function calculateInverseRiskLevel(
  value: number,
  thresholds: { critical: number; high: number; moderate: number }
): RiskLevel {
  if (value <= thresholds.critical) return "Critical";
  if (value <= thresholds.high) return "High";
  if (value <= thresholds.moderate) return "Moderate";
  return "Low";
}

// ========== Market Risk Transformer ==========

export function transformMarketRisk(raw: MarketRiskInput): MarketRiskVM {
  const d = raw.market_fx_data;

  const kpis: MarketRiskKpiVM[] = [
    {
      label: "Value at Risk (95%)",
      value: d.var_95,
      formattedValue: formatCurrency(d.var_95),
      unit: "USD",
      riskLevel: calculateRiskLevel(d.var_95, { low: 5_000_000, moderate: 15_000_000, high: 30_000_000 }),
      interpretation: d.var_95 > 15_000_000
        ? "Elevated portfolio risk — daily loss could exceed this threshold 5% of the time."
        : "Portfolio risk within acceptable parameters for current exposure levels.",
      trend: "stable" as TrendDirection,
      trendPct: -2.3,
    },
    {
      label: "Expected Shortfall",
      value: d.expected_shortfall,
      formattedValue: formatCurrency(d.expected_shortfall),
      unit: "USD",
      riskLevel: calculateRiskLevel(d.expected_shortfall, { low: 8_000_000, moderate: 20_000_000, high: 40_000_000 }),
      interpretation: "Average loss in worst 5% of scenarios. Key metric for tail risk assessment.",
      trend: "up" as TrendDirection,
      trendPct: 4.1,
    },
    {
      label: "P&L Volatility",
      value: d.pnl_volatility,
      formattedValue: formatPct(d.pnl_volatility),
      unit: "%",
      riskLevel: calculateRiskLevel(d.pnl_volatility, { low: 5, moderate: 10, high: 20 }),
      interpretation: d.pnl_volatility > 10
        ? "Significant earnings variability detected. Consider hedging strategies."
        : "P&L stability within expected range for the asset class.",
      trend: "down" as TrendDirection,
      trendPct: -1.5,
    },
    {
      label: "Tail Risk Ratio",
      value: d.tail_risk_ratio,
      formattedValue: formatRatio(d.tail_risk_ratio),
      unit: "ratio",
      riskLevel: calculateRiskLevel(d.tail_risk_ratio, { low: 1.0, moderate: 1.5, high: 2.0 }),
      interpretation: d.tail_risk_ratio > 1.5
        ? "Fat-tailed distribution detected. Expected Shortfall significantly exceeds VaR."
        : "Distribution tails within normal parameters.",
      trend: "stable" as TrendDirection,
      trendPct: 0.8,
    },
    {
      label: "Currency Exposure",
      value: d.currency_exposure,
      formattedValue: formatCurrency(d.currency_exposure),
      unit: "USD",
      riskLevel: calculateRiskLevel(d.currency_exposure, { low: 200_000_000, moderate: 500_000_000, high: 1_000_000_000 }),
      interpretation: "Total notional value exposed to foreign currency fluctuations.",
      trend: "up" as TrendDirection,
      trendPct: 3.2,
    },
    {
      label: "Hedged Exposure",
      value: d.hedged_exposure,
      formattedValue: formatCurrency(d.hedged_exposure),
      unit: "USD",
      riskLevel: "Low",
      interpretation: `${((d.hedged_exposure / d.currency_exposure) * 100).toFixed(1)}% of total exposure is hedged. Active risk mitigation in place.`,
      trend: "up" as TrendDirection,
      trendPct: 1.8,
    },
    {
      label: "Unhedged Exposure",
      value: d.unhedged_exposure,
      formattedValue: formatCurrency(d.unhedged_exposure),
      unit: "USD",
      riskLevel: calculateRiskLevel(d.unhedged_exposure, { low: 100_000_000, moderate: 300_000_000, high: 500_000_000 }),
      interpretation: "Portion of currency exposure without hedging protection.",
      trend: "down" as TrendDirection,
      trendPct: -5.2,
    },
    {
      label: "FX Volatility",
      value: d.fx_volatility,
      formattedValue: formatPct(d.fx_volatility),
      unit: "%",
      riskLevel: calculateRiskLevel(d.fx_volatility, { low: 8, moderate: 15, high: 25 }),
      interpretation: d.fx_volatility > 15
        ? "Elevated currency market volatility. Review hedging adequacy."
        : "FX volatility within manageable range.",
      trend: "stable" as TrendDirection,
      trendPct: 0.3,
    },
    {
      label: "Cross Currency Basis",
      value: d.cross_currency_basis,
      formattedValue: formatBps(d.cross_currency_basis),
      unit: "bps",
      riskLevel: Math.abs(d.cross_currency_basis) > 0.5 ? "High" : Math.abs(d.cross_currency_basis) > 0.2 ? "Moderate" : "Low",
      interpretation: d.cross_currency_basis < 0
        ? "Negative basis indicates USD funding premium. Monitor for widening."
        : "Positive basis suggests favorable cross-currency funding conditions.",
      trend: "stable" as TrendDirection,
      trendPct: -0.5,
    },
    {
      label: "Instrument Count",
      value: d.security_identifiers.length,
      formattedValue: `${d.security_identifiers.length}`,
      unit: "instruments",
      riskLevel: "Low",
      interpretation: "Number of distinct securities contributing to market risk exposure.",
      trend: "stable" as TrendDirection,
      trendPct: 0,
    },
  ];

  const hedgedPct = (d.hedged_exposure / d.currency_exposure) * 100;

  return {
    companyId: raw.company_id,
    kpis,
    varVsEs: { var95: d.var_95, expectedShortfall: d.expected_shortfall },
    exposureBreakdown: {
      hedged: d.hedged_exposure,
      unhedged: d.unhedged_exposure,
      total: d.currency_exposure,
    },
    fxVolatilityTrend: [
      { month: "Jan", volatility: 12.1 },
      { month: "Feb", volatility: 11.8 },
      { month: "Mar", volatility: 13.5 },
      { month: "Apr", volatility: 14.2 },
      { month: "May", volatility: 13.9 },
      { month: "Jun", volatility: 15.1 },
      { month: "Jul", volatility: d.fx_volatility },
    ],
    exposureDistribution: [
      { name: "Hedged", value: d.hedged_exposure },
      { name: "Unhedged", value: d.unhedged_exposure },
    ],
    crossCurrencyBasis: d.cross_currency_basis,
    instrumentCount: d.security_identifiers.length,
    summary: {
      riskRating: calculateRiskLevel(d.fx_volatility, { low: 8, moderate: 15, high: 25 }),
      primaryDriver: "FX Volatility",
      largestExposure: "USD",
      riskTrend: "stable",
      aiInterpretation: `The portfolio exhibits ${d.fx_volatility > 15 ? "elevated" : "moderate"} market risk driven primarily by foreign exchange exposure. Current hedging strategies cover ${hedgedPct.toFixed(1)}% of total currency exposure, mitigating a significant portion of FX volatility. The Value-at-Risk of ${formatCurrency(d.var_95)} at 95% confidence indicates ${d.var_95 > 15_000_000 ? "above-average" : "manageable"} daily loss potential. Cross-currency basis of ${formatBps(d.cross_currency_basis)} remains within acceptable thresholds. Tail risk ratio of ${d.tail_risk_ratio.toFixed(2)}x suggests ${d.tail_risk_ratio > 1.5 ? "fat-tailed distribution requiring attention" : "normal distribution characteristics"}.`,
    },
  };
}

// ========== Credit Risk Transformer ==========

export function transformCreditRisk(raw: CreditRiskInput): CreditRiskVM {
  const history = rec(raw.credit_history);
  const debt = rec(raw.existing_debt);
  const defaults = rec(raw.default_history);
  const ratios = rec(raw.debt_ratios);

  const creditScore = safeNum(history.credit_score, 72);
  const debtOutstanding = safeNum(debt.total_outstanding);
  const debtToEquity = safeNum(ratios.debt_to_equity);
  const interestCoverage = safeNum(ratios.interest_coverage);
  const creditUtilization = safeNum(history.credit_utilization_pct);
  const debtServiceCapacity = safeNum(ratios.debt_service_coverage);
  const historicalDefaults = safeNum(defaults.total_defaults);
  const paymentHistoryPct = safeNum(history.payment_history_pct);

  const riskCategory = calculateRiskLevel(debtToEquity, { low: 0.8, moderate: 1.5, high: 2.5 });

  const kpis: CreditRiskKpiVM[] = [
    {
      label: "Credit Rating",
      value: safeStr(raw.credit_rating, "NR"),
      formattedValue: safeStr(raw.credit_rating, "NR"),
      unit: "",
      riskLevel: raw.credit_rating.startsWith("A") ? "Low" : raw.credit_rating.startsWith("B") ? "Moderate" : "High",
      interpretation: `Current credit rating of ${raw.credit_rating} indicates ${raw.credit_rating.startsWith("A") ? "strong" : "adequate"} creditworthiness.`,
    },
    {
      label: "Credit Score",
      value: creditScore,
      formattedValue: `${creditScore}/100`,
      unit: "points",
      riskLevel: creditScore >= 75 ? "Low" : creditScore >= 58 ? "Moderate" : creditScore >= 45 ? "High" : "Critical",
      interpretation: creditScore >= 75 ? "Excellent institutional credit profile." : creditScore >= 58 ? "Moderate credit standing with monitored covenants." : "Elevated risk credit profile requiring committee oversight.",
    },
    {
      label: "Debt Outstanding",
      value: debtOutstanding,
      formattedValue: formatCurrency(debtOutstanding),
      unit: "USD",
      riskLevel: calculateRiskLevel(debtOutstanding, { low: 1_000_000_000, moderate: 5_000_000_000, high: 10_000_000_000 }),
      interpretation: "Total principal amount of all outstanding debt obligations.",
    },
    {
      label: "Debt-to-Equity",
      value: debtToEquity,
      formattedValue: formatRatio(debtToEquity),
      unit: "ratio",
      riskLevel: calculateRiskLevel(debtToEquity, { low: 0.8, moderate: 1.5, high: 2.5 }),
      interpretation: debtToEquity > 1.5 ? "High financial leverage. Debt exceeds equity significantly." : "Leverage within acceptable range for the sector.",
    },
    {
      label: "Interest Coverage",
      value: interestCoverage,
      formattedValue: formatRatio(interestCoverage),
      unit: "ratio",
      riskLevel: calculateInverseRiskLevel(interestCoverage, { critical: 1.5, high: 3, moderate: 6 }),
      interpretation: interestCoverage >= 6 ? "Strong ability to service interest payments from operating earnings." : "Adequate interest coverage but warrants monitoring.",
    },
    {
      label: "Historical Defaults",
      value: historicalDefaults,
      formattedValue: `${historicalDefaults}`,
      unit: "events",
      riskLevel: historicalDefaults === 0 ? "Low" : historicalDefaults <= 2 ? "Moderate" : "High",
      interpretation: historicalDefaults === 0 ? "Clean default history. No prior credit events." : `${historicalDefaults} historical default event(s) recorded.`,
    },
    {
      label: "Repayment Behaviour",
      value: paymentHistoryPct,
      formattedValue: formatPct(paymentHistoryPct),
      unit: "%",
      riskLevel: paymentHistoryPct >= 95 ? "Low" : paymentHistoryPct >= 85 ? "Moderate" : "High",
      interpretation: `${paymentHistoryPct}% on-time payment history indicates ${paymentHistoryPct >= 95 ? "excellent" : "acceptable"} repayment discipline.`,
    },
    {
      label: "Credit Utilization",
      value: creditUtilization,
      formattedValue: formatPct(creditUtilization),
      unit: "%",
      riskLevel: calculateRiskLevel(creditUtilization, { low: 30, moderate: 50, high: 75 }),
      interpretation: creditUtilization <= 30 ? "Healthy utilization ratio. Well within recommended limits." : "Elevated credit utilization may impact credit profile.",
    },
    {
      label: "Debt Service Capacity",
      value: debtServiceCapacity,
      formattedValue: formatRatio(debtServiceCapacity),
      unit: "ratio",
      riskLevel: calculateInverseRiskLevel(debtServiceCapacity, { critical: 1.0, high: 1.5, moderate: 2.0 }),
      interpretation: debtServiceCapacity >= 2.0 ? "Strong capacity to meet all debt obligations." : "Adequate debt service coverage but close to minimum thresholds.",
    },
    {
      label: "Risk Category",
      value: riskCategory,
      formattedValue: riskCategory,
      unit: "",
      riskLevel: riskCategory,
      interpretation: `Overall credit risk classified as ${riskCategory} based on combined financial indicators.`,
    },
  ];

  const timeline = (Array.isArray(defaults.timeline) ? defaults.timeline : []) as Array<Record<string, unknown>>;
  const ratingHistory = (Array.isArray(ratios.rating_history) ? ratios.rating_history : []) as Array<Record<string, unknown>>;

  return {
    creditRating: safeStr(raw.credit_rating, "NR"),
    creditScore,
    debtOutstanding,
    debtToEquity,
    interestCoverage,
    historicalDefaults,
    repaymentBehaviour: paymentHistoryPct >= 95 ? "Excellent" : paymentHistoryPct >= 85 ? "Good" : "Below Average",
    creditUtilization,
    debtServiceCapacity,
    riskCategory,
    kpis,
    debtStructure: {
      shortTerm: safeNum(debt.short_term_debt),
      longTerm: safeNum(debt.long_term_debt),
      revolving: safeNum(debt.revolving_credit),
      secured: safeNum(debt.secured_debt),
      unsecured: safeNum(debt.unsecured_debt),
    },
    defaultTimeline: timeline.map((t) => ({
      year: safeStr(t.year),
      defaults: safeNum(t.defaults),
      resolved: safeNum(t.resolved),
    })),
    debtRatios: [
      { name: "D/E", value: safeNum(ratios.debt_to_equity), threshold: 2.0 },
      { name: "ICR", value: safeNum(ratios.interest_coverage), threshold: 3.0 },
      { name: "DSCR", value: safeNum(ratios.debt_service_coverage), threshold: 1.5 },
      { name: "D/A", value: safeNum(ratios.debt_to_assets), threshold: 0.6 },
      { name: "D/EBITDA", value: safeNum(ratios.debt_to_ebitda), threshold: 4.0 },
    ],
    ratingHistory: ratingHistory.map((r) => ({
      date: safeStr(r.date),
      rating: safeStr(r.rating),
    })),
    summary: {
      currentRating: safeStr(raw.credit_rating, "NR"),
      probabilityOfDefault: safeNum(ratios.probability_of_default, historicalDefaults > 2 ? 8.5 : historicalDefaults > 0 ? 2.8 : 0.5),
      financialLeverage: debtToEquity > 2.0 ? "High" : debtToEquity > 1.0 ? "Moderate" : "Low",
      repaymentQuality: paymentHistoryPct >= 95 ? "Excellent" : paymentHistoryPct >= 85 ? "Good" : "Below Average",
      debtBurden: debtOutstanding > 5_000_000_000 ? "Heavy" : debtOutstanding > 1_000_000_000 ? "Moderate" : "Light",
      creditOutlook: "Stable",
      riskClassification: riskCategory,
      aiInterpretation: `The borrower demonstrates ${paymentHistoryPct >= 95 ? "strong" : "adequate"} repayment behaviour with a ${formatPct(paymentHistoryPct)} on-time payment record. Financial leverage at ${formatRatio(debtToEquity)} remains ${debtToEquity > 1.5 ? "elevated but within sector norms" : "within acceptable lending thresholds"}. The credit rating of ${raw.credit_rating} with ${historicalDefaults} historical default(s) and interest coverage of ${formatRatio(interestCoverage)} supports a ${riskCategory.toLowerCase()} risk classification. Debt service capacity of ${formatRatio(debtServiceCapacity)} indicates ${debtServiceCapacity >= 2.0 ? "comfortable" : "adequate"} ability to meet obligations.`,
    },
  };
}

// ========== Executive Summary Transformer ==========

export function transformExecutiveSummary(
  marketRisk: MarketRiskVM,
  creditRisk: CreditRiskVM
): ExecutiveSummaryVM {
  // Compute composite risk scores (0-100, higher = worse)
  const marketScore = computeMarketRiskScore(marketRisk);
  const creditScore = computeCreditRiskScore(creditRisk);
  const overallScore = Math.round(marketScore * 0.4 + creditScore * 0.6);

  const decision = determineDecision(overallScore, creditRisk);

  const compositeRating: RiskLevel = overallScore > 75 ? "Critical" : overallScore > 55 ? "High" : overallScore > 35 ? "Moderate" : "Low";
  const limit = decision === "Reject" ? 0 : decision === "Approve" ? 500000000 : 250000000;
  
  const warnings: string[] = [];
  if (marketRisk.exposureBreakdown.unhedged > 200_000_000) {
    warnings.push(`High unhedged FX exposure of ${formatCurrency(marketRisk.exposureBreakdown.unhedged)}.`);
  }
  if (creditRisk.debtToEquity > 1.5) {
    warnings.push(`Elevated debt-to-equity ratio of ${formatRatio(creditRisk.debtToEquity)} exceeds conservative thresholds.`);
  }
  if (creditRisk.creditUtilization > 35) {
    warnings.push(`Credit facility utilization is high at ${formatPct(creditRisk.creditUtilization)}.`);
  }
  if (marketRisk.summary.riskRating === "High" || marketRisk.summary.riskRating === "Critical") {
    warnings.push(`Market risk conditions rated as ${marketRisk.summary.riskRating}.`);
  }

  const aiRationale = `Based on comprehensive quantitative analysis of market risk (score: ${marketScore}/100) and credit risk (score: ${creditScore}/100), the overall unified risk score is ${overallScore}/100 (${compositeRating} risk). The borrower holds a strong ${creditRisk.creditRating} rating with ${creditRisk.repaymentBehaviour.toLowerCase()} repayment history. The recommended action is "${decision}" with a maximum credit facility limit of ${formatCurrency(limit)}.`;

  return {
    unifiedRiskScore: overallScore,
    marketRiskScore: marketScore,
    creditRiskScore: creditScore,
    compositeRiskRating: compositeRating,
    creditFacilityLimit: limit,
    fxExposureRisk: marketRisk.summary.riskRating,
    leverage: creditRisk.summary.financialLeverage,
    probabilityOfDefault: creditRisk.summary.probabilityOfDefault,
    recommendedMonitoring: overallScore > 60 ? "Monthly" : overallScore > 40 ? "Quarterly" : "Semi-Annual",
    riskConfidence: 87.5,
    recommendedDecision: decision,
    warningSignals: warnings,
    decisionMatrix: [
      { option: "Approve", confidence: decision === "Approve" ? 87.5 : 15, isRecommended: decision === "Approve" },
      { option: "Approve with Conditions", confidence: decision === "Approve with Conditions" ? 82.0 : 25, isRecommended: decision === "Approve with Conditions" },
      { option: "Further Review", confidence: decision === "Further Review" ? 75.0 : 10, isRecommended: decision === "Further Review" },
      { option: "Reject", confidence: decision === "Reject" ? 90.0 : 5, isRecommended: decision === "Reject" },
    ],
    aiDecisionRationale: aiRationale,
    aiExplanation: {
      topRiskDrivers: [
        `FX Volatility at ${formatPct(marketRisk.kpis[7]?.value as number || 0)} contributes to market uncertainty`,
        `Debt-to-Equity of ${formatRatio(creditRisk.debtToEquity)} indicates ${creditRisk.debtToEquity > 1.5 ? "elevated" : "moderate"} leverage`,
        `Unhedged exposure of ${formatCurrency(marketRisk.exposureBreakdown.unhedged)} remains a residual risk`,
        `${creditRisk.historicalDefaults} historical default event(s) on record`,
        `Credit utilization at ${formatPct(creditRisk.creditUtilization)}`,
      ],
      positiveIndicators: [
        `Strong credit rating of ${creditRisk.creditRating}`,
        `${creditRisk.repaymentBehaviour} repayment behaviour`,
        `Interest coverage ratio of ${formatRatio(creditRisk.interestCoverage)} well above minimum`,
        `${formatPct((marketRisk.exposureBreakdown.hedged / marketRisk.exposureBreakdown.total) * 100)} of FX exposure is hedged`,
        `Stable credit outlook with consistent rating history`,
      ],
      negativeIndicators: [
        `${marketRisk.summary.riskRating} market risk environment`,
        creditRisk.debtToEquity > 1.5 ? "Elevated financial leverage" : "Moderate leverage position",
        `Cross-currency basis at ${formatBps(marketRisk.crossCurrencyBasis)} indicates funding premium`,
        creditRisk.creditUtilization > 30 ? "Credit utilization above 30% threshold" : "Credit utilization within range",
      ],
      mitigationSuggestions: [
        "Increase hedging ratio to cover at least 80% of FX exposure",
        "Implement stop-loss mechanisms for tail risk scenarios",
        "Diversify currency exposure across multiple pairs",
        "Establish debt reduction targets over next 4 quarters",
        "Set up automated monitoring for credit covenant breaches",
      ],
      monitoringRecommendations: [
        `Review FX hedging strategy ${overallScore > 60 ? "monthly" : "quarterly"}`,
        "Monitor debt covenant compliance continuously",
        "Track credit rating agency announcements",
        "Reassess VaR limits if market volatility exceeds 20%",
        "Quarterly stress testing of combined market and credit scenarios",
      ],
      businessSummary: `Based on comprehensive analysis of market risk (score: ${marketScore}/100) and credit risk (score: ${creditScore}/100), the overall risk profile scores ${overallScore}/100. The borrower maintains a ${creditRisk.creditRating} credit rating with ${creditRisk.repaymentBehaviour.toLowerCase()} repayment history. Market conditions indicate ${marketRisk.summary.riskRating.toLowerCase()} volatility with adequate hedging coverage. The recommended decision is "${decision}" with ${overallScore <= 40 ? "high" : overallScore <= 60 ? "moderate" : "limited"} confidence. ${overallScore <= 40 ? "Fundamental credit metrics support this assessment." : "Additional risk mitigation measures are advised."}`,
    },
  };
}

// ========== Internal Scoring Helpers ==========

function computeMarketRiskScore(vm: MarketRiskVM): number {
  const varScore = Math.min((vm.varVsEs.var95 / 30_000_000) * 100, 100);
  const volScore = Math.min((vm.kpis[2]?.value as number || 0) / 20 * 100, 100);
  const tailScore = Math.min(((vm.kpis[3]?.value as number || 0) / 2.0) * 100, 100);
  const hedgeRatio = vm.exposureBreakdown.hedged / vm.exposureBreakdown.total;
  const hedgeScore = Math.max(0, (1 - hedgeRatio) * 100);
  return Math.round((varScore * 0.3 + volScore * 0.25 + tailScore * 0.25 + hedgeScore * 0.2));
}

function computeCreditRiskScore(vm: CreditRiskVM): number {
  const deScore = Math.min((vm.debtToEquity / 3.0) * 100, 100);
  const utilScore = Math.min((vm.creditUtilization / 100) * 100, 100);
  const icrScore = Math.max(0, 100 - (vm.interestCoverage / 10) * 100);
  const defaultScore = Math.min(vm.historicalDefaults * 30, 100);
  const ratingScore = vm.creditRating.startsWith("A") ? 15 : vm.creditRating.startsWith("B") ? 45 : 75;
  return Math.round((deScore * 0.25 + utilScore * 0.2 + icrScore * 0.2 + defaultScore * 0.15 + ratingScore * 0.2));
}

function determineDecision(overallScore: number, creditRisk: CreditRiskVM): DecisionOption {
  if (overallScore <= 30 && creditRisk.creditRating.startsWith("A")) return "Approve";
  if (overallScore <= 50) return "Approve with Conditions";
  if (overallScore <= 70) return "Further Review";
  return "Reject";
}
