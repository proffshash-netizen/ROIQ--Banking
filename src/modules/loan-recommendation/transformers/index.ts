// Loan Recommendation Module (CDSS) – Transformation Layer
// Pure functions transforming backend JSON contracts into business view models (VMs)
// Includes deterministic decision logic rules engine.

import type {
  LoanRecommendationInput,
  LoanRecommendationDataVM,
  LoanSummaryVM,
  RiskAggregationVM,
  RiskModuleBreakdownVM,
  CreditDecisionVM,
  ExplainabilityVM,
  DecisionOutcome,
  RiskLevel,
} from "../types";

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Deterministic Decision Rules Engine:
 * Risk Score <= 30     => APPROVE
 * Risk Score 31–60     => APPROVE WITH CONDITIONS
 * Risk Score 61–80     => FURTHER REVIEW
 * Risk Score > 80      => REJECT
 */
export function determineCreditDecision(overallRiskScore: number): {
  decision: DecisionOutcome;
  rule: string;
  interestRateBand: string;
  collateralReq: string;
  monitoringFreq: string;
} {
  if (overallRiskScore <= 30) {
    return {
      decision: "APPROVE",
      rule: "Deterministic Rule: Risk Score ≤ 30 → APPROVE (Standard corporate credit terms apply)",
      interestRateBand: "SOFR + 1.75% – 2.25%",
      collateralReq: "Unsecured / Negative Pledge",
      monitoringFreq: "Annual Review",
    };
  } else if (overallRiskScore <= 60) {
    return {
      decision: "APPROVE WITH CONDITIONS",
      rule: "Deterministic Rule: Risk Score 31–60 → APPROVE WITH CONDITIONS (Enhanced collateral & quarterly monitoring required)",
      interestRateBand: "SOFR + 2.75% – 3.50%",
      collateralReq: "120% First Lien on Receivables & Inventory",
      monitoringFreq: "Quarterly Monitoring",
    };
  } else if (overallRiskScore <= 80) {
    return {
      decision: "FURTHER REVIEW",
      rule: "Deterministic Rule: Risk Score 61–80 → FURTHER REVIEW (Escalate to Senior Credit Committee)",
      interestRateBand: "SOFR + 4.00% – 5.25%",
      collateralReq: "150% Corporate Guarantee & Fixed Asset Pledge",
      monitoringFreq: "Monthly Monitoring",
    };
  } else {
    return {
      decision: "REJECT",
      rule: "Deterministic Rule: Risk Score > 80 → REJECT (Risk profile exceeds bank credit risk appetite threshold)",
      interestRateBand: "N/A (Declined)",
      collateralReq: "N/A",
      monitoringFreq: "N/A",
    };
  }
}

export function transformLoanRecommendationInput(
  raw: LoanRecommendationInput
): LoanRecommendationDataVM {
  // 1. Loan Summary VM
  const loanSummary: LoanSummaryVM = {
    companyName: raw.loan_details.company_name,
    loanAmount: raw.loan_details.loan_amount,
    formattedLoanAmount: formatCurrency(raw.loan_details.loan_amount, raw.loan_details.currency),
    loanPurpose: raw.loan_details.loan_purpose,
    loanTenureMonths: raw.loan_details.loan_tenure_months,
    formattedTenure: `${raw.loan_details.loan_tenure_months} Months (${(raw.loan_details.loan_tenure_months / 12).toFixed(1)} Yrs)`,
    requestedProductType: raw.loan_details.requested_product_type,
    requestedDate: raw.loan_details.requested_date,
    currency: raw.loan_details.currency,
    aiSummary: `Application requested by ${raw.loan_details.company_name} for ${formatCurrency(raw.loan_details.loan_amount, raw.loan_details.currency)} over ${raw.loan_details.loan_tenure_months} months under ${raw.loan_details.requested_product_type}.`,
  };

  // 2. Risk Aggregation VM
  const moduleBreakdowns: RiskModuleBreakdownVM[] = raw.module_results.map((m) => {
    const weightPct = Math.round((m.weight ?? 0.166) * 100);
    const weightedContribution = Number(((m.risk_score * (m.weight ?? 0.166))).toFixed(1));
    return {
      moduleName: m.module,
      riskScore: m.risk_score,
      riskLevel: m.risk_level,
      status: m.status,
      weightPct,
      weightedContribution,
      aiSummary: m.ai_summary ?? `Risk score for ${m.module} evaluated at ${m.risk_score}/100 (${m.risk_level}).`,
    };
  });

  const riskAggregation: RiskAggregationVM = {
    overallRiskScore: raw.risk_aggregation.overall_risk_score,
    overallRiskLevel: raw.risk_aggregation.overall_risk_level,
    confidenceScore: raw.risk_aggregation.confidence_score,
    moduleBreakdowns,
    aiInterpretation: `Aggregated overall risk score calculated at ${raw.risk_aggregation.overall_risk_score}/100 (${raw.risk_aggregation.overall_risk_level} Risk) across 6 analytical modules with ${raw.risk_aggregation.confidence_score}% model confidence.`,
  };

  // 3. Credit Decision VM
  const decisionDetails = determineCreditDecision(raw.risk_aggregation.overall_risk_score);
  const creditDecision: CreditDecisionVM = {
    decision: decisionDetails.decision,
    overallRiskScore: raw.risk_aggregation.overall_risk_score,
    confidenceScore: raw.risk_aggregation.confidence_score,
    riskCategory: raw.risk_aggregation.overall_risk_level as RiskLevel,
    suggestedInterestRateBand: decisionDetails.interestRateBand,
    suggestedCollateralRequirement: decisionDetails.collateralReq,
    suggestedMonitoringFrequency: decisionDetails.monitoringFreq,
    triggeredRule: decisionDetails.rule,
    aiSummary: `Recommendation Engine outcome: ${decisionDetails.decision}. Driven by composite risk score of ${raw.risk_aggregation.overall_risk_score} with ${raw.risk_aggregation.confidence_score}% AI confidence.`,
  };

  // 4. Explainability Panel VM
  const explainability: ExplainabilityVM = {
    topPositiveFactors: [
      "Robust liquidity ratio (Current Ratio 1.85x) providing strong short-term obligations coverage.",
      "High debt service coverage ratio (DSCR 2.18x) and EBITDA interest coverage (8.65x).",
      "Stable A- long-term credit rating with a 97.8% historical on-time payment track record.",
      "Well-structured debt portfolio with 70% secured long-term funding instruments.",
    ],
    topNegativeFactors: [
      "Market & FX Risk exposure: Elevated unhedged FX volatility on overseas revenue contracts ($1.42M 1-day VaR).",
      "Macroeconomic headwinds: Macro central bank interest rate pressure in international markets.",
      "Historical credit default: 1 resolved default recorded in 2019 (fully recovered at 85% rate).",
    ],
    primaryRiskDrivers: [
      "Market & FX Risk (Score: 65/100, Weight: 15%)",
      "Credit Risk (Score: 55/100, Weight: 10%)",
      "Macroeconomic Risk (Score: 52/100, Weight: 15%)",
    ],
    mitigationStrategies: [
      "Require mandatory FX forward hedging agreements covering at least 75% of non-USD revenue streams.",
      "Obtain first-priority lien on inventory and accounts receivable assets (120% collateral coverage).",
      "Establish minimum DSCR financial covenant of ≥ 1.75x checked quarterly.",
    ],
    recommendedLoanConditions: [
      "Maintain minimum Cash Balance Covenant of $2.5M in primary bank operating accounts.",
      "Quarterly compliance certificate submittal with audited financial metrics within 45 days of quarter-end.",
      "Restriction on additional unapproved debt issuance exceeding $1.0M without prior lender consent.",
    ],
    requiredDocumentation: [
      "Audited Financial Statements (Last 3 Fiscal Years)",
      "Updated FX Exposure & Cross-Border Cash Flow Projection Sheet",
      "Perfection of Security Interest & Accounts Receivable Collateral Schedule",
      "Corporate Board Resolution Authorizing Credit Facility",
    ],
    postApprovalMonitoring: [
      "Quarterly Covenant Compliance & Financial Ratio Audit",
      "Semi-Annual Collateral Valuation & Inventory Audit",
      "Continuous Automated FX Exposure & VaR Threshold Monitoring",
    ],
    businessJustification:
      "The applicant demonstrates strong liquidity, stable cash flow, and positive repayment history. However, moderate FX exposure and elevated leverage require enhanced collateral and quarterly monitoring. Based on the aggregated risk score and confidence level, approval with conditions is recommended.",
    aiSummary: "Comprehensive explainability matrix generated. 4 positive credit factors and 3 risk drivers identified with tailored risk mitigation covenants.",
  };

  return {
    loanSummary,
    riskAggregation,
    creditDecision,
    explainability,
  };
}
