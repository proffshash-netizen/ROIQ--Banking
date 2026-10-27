// Loan Recommendation Module (CDSS) – Company-Aware Mock Data Generator

import type { LoanRecommendationInput, RiskLevel } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

export const getLoanRecommendationMockData = (): LoanRecommendationInput => {
  const store = useCompaniesStore.getState();
  const active = store.companies.find(c => c.id === store.selectedCompanyId) ?? store.companies[0] ?? {
    id: 1,
    name: "Apple Inc.",
    creditScore: 88,
    loanExposure: "$420M",
    sector: "Technology",
    riskLevel: "low",
  };
  const score = active.creditScore;

  // Map credit score → risk level
  const toRiskLevel = (s: number): RiskLevel =>
    s >= 80 ? "Low" : s >= 65 ? "Medium" : s >= 45 ? "High" : "Critical";

  // Module scores derived from company credit score
  const financialRiskScore = Math.round(100 - score * 0.85);
  const treasuryRiskScore  = Math.round(100 - score * 0.90);
  const macroRiskScore     = Math.round(45 + (100 - score) * 0.25);
  const industryRiskScore  = Math.round(38 + (100 - score) * 0.28);
  const fxRiskScore        = Math.round(50 + (100 - score) * 0.30);
  const creditRiskScore    = Math.round(100 - score * 0.80);

  // Overall = weighted average
  const overallRiskScore = Math.round(
    financialRiskScore * 0.25 +
    treasuryRiskScore  * 0.20 +
    macroRiskScore     * 0.15 +
    industryRiskScore  * 0.15 +
    fxRiskScore        * 0.15 +
    creditRiskScore    * 0.10
  );

  const overallRiskLevel: RiskLevel = toRiskLevel(100 - overallRiskScore);
  const confidenceScore = parseFloat((75 + score * 0.15).toFixed(1));

  // Loan amount ~= loanExposure
  let loanAmount = 15_000_000;
  const loanStr = active.loanExposure;
  if (loanStr.includes("B")) {
    loanAmount = parseFloat(loanStr.replace(/[^0-9.]/g, "")) * 1_000_000_000;
  } else if (loanStr.includes("M")) {
    loanAmount = parseFloat(loanStr.replace(/[^0-9.]/g, "")) * 1_000_000;
  }

  const loanPurposeMap: Record<string, string> = {
    "Metals & Mining":              "Capital Expenditure for Capacity Expansion & Modernisation",
    "Oil & Gas":                    "Exploration Drilling Programme & Refinery Upgrade",
    "NBFC / Financial Services":    "Retail Lending Portfolio Expansion & Working Capital",
    "Conglomerate / Infrastructure": "Green Infrastructure Development & Debt Refinancing",
    "Diversified Metals":           "Debt Restructuring & Operational Working Capital",
    "Energy / Telecom / Retail":    "5G Network Rollout & Retail Expansion Financing",
    "Banking":                      "Regulatory Capital Augmentation & Digital Transformation",
    "Automotive / Agri":            "EV Platform Launch & Supply Chain Financing",
    "Media & Entertainment":        "Content Acquisition & Platform Debt Servicing",
  };

  const productTypeMap: Record<string, string> = {
    "Metals & Mining":              "Term Loan (Secured)",
    "Oil & Gas":                    "Project Finance Facility",
    "NBFC / Financial Services":    "Revolving Credit Facility",
    "Conglomerate / Infrastructure": "Syndicated Term Loan",
    "Diversified Metals":           "Structured Refinancing Facility",
    "Energy / Telecom / Retail":    "Syndicated Revolving Credit Facility",
    "Banking":                      "Subordinated Tier-2 Capital Facility",
    "Automotive / Agri":            "Capex Term Loan (Green)",
    "Media & Entertainment":        "Bridge Loan Facility",
  };

  const financialRatioText = score >= 80
    ? `Strong liquidity ratio (${(1.4 + score * 0.012).toFixed(2)}x) and healthy EBITDA interest coverage (${(5 + score * 0.07).toFixed(1)}x). Low leverage.`
    : score >= 65
    ? `Adequate liquidity ratio (${(1.0 + score * 0.008).toFixed(2)}x). Moderate leverage and interest coverage within acceptable threshold.`
    : `Elevated leverage with tight liquidity metrics. EBITDA interest coverage below optimal threshold at ${(1.5 + score * 0.025).toFixed(1)}x.`;

  const fxRatioText = `Value at Risk (95% 1-day) stands at $${(loanAmount * 0.0032 / 1_000_000).toFixed(2)}M. ${score >= 70 ? "Adequate" : "Limited"} FX hedging coverage of ${Math.round(40 + score * 0.4)}%.`;

  const creditRatioText = score >= 80
    ? `Excellent credit rating with consistent repayment behaviour. ${score}% credit history score, zero recent defaults.`
    : score >= 65
    ? `Satisfactory credit profile. Minor historical credit events resolved. Overall rating: ${score >= 72 ? "A-" : "BBB+"}.`
    : `Below-investment-grade signals. Recent credit stress noted. Requires enhanced monitoring.`;

  return {
    loan_details: {
      company_name: active.name,
      loan_amount: loanAmount,
      loan_purpose: loanPurposeMap[active.sector] ?? "General Corporate Purpose",
      loan_tenure_months: score >= 75 ? 60 : score >= 55 ? 36 : 18,
      requested_product_type: productTypeMap[active.sector] ?? "Term Loan",
      requested_date: new Date().toISOString().split("T")[0],
      currency: "USD",
    },
    risk_aggregation: {
      overall_risk_score: overallRiskScore,
      overall_risk_level: overallRiskLevel,
      confidence_score: confidenceScore,
    },
    module_results: [
      {
        module: "Corporate Financial Risk",
        risk_score: financialRiskScore,
        risk_level: toRiskLevel(100 - financialRiskScore),
        status: "success",
        weight: 0.25,
        ai_summary: financialRatioText,
      },
      {
        module: "Treasury & Liquidity Risk",
        risk_score: treasuryRiskScore,
        risk_level: toRiskLevel(100 - treasuryRiskScore),
        status: "success",
        weight: 0.20,
        ai_summary: `Net Stable Funding Ratio at ${Math.round(95 + score * 0.35)}%. Liquidity coverage buffer covers ${Math.round(2 + score * 0.04)} months of debt service.`,
      },
      {
        module: "Macroeconomic Risk",
        risk_score: macroRiskScore,
        risk_level: toRiskLevel(100 - macroRiskScore),
        status: "success",
        weight: 0.15,
        ai_summary: `Macro environment for ${active.sector} sector shows ${score >= 65 ? "moderate" : "elevated"} sensitivity to rate cycles and FX pressure.`,
      },
      {
        module: "Industry Risk",
        risk_score: industryRiskScore,
        risk_level: toRiskLevel(100 - industryRiskScore),
        status: "success",
        weight: 0.15,
        ai_summary: `${active.sector} industry demand remains ${score >= 65 ? "resilient with stable growth trajectory" : "under pressure with near-term headwinds"}.`,
      },
      {
        module: "Market & FX Risk",
        risk_score: fxRiskScore,
        risk_level: toRiskLevel(100 - fxRiskScore),
        status: "success",
        weight: 0.15,
        ai_summary: fxRatioText,
      },
      {
        module: "Credit Risk",
        risk_score: creditRiskScore,
        risk_level: toRiskLevel(100 - creditRiskScore),
        status: "success",
        weight: 0.10,
        ai_summary: creditRatioText,
      },
    ],
  };
};

// Legacy export
export const loanRecommendationMockData = getLoanRecommendationMockData();
