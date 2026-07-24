// Executive Report Module – Enterprise Mock Data Aggregation
import type { ExecutiveReportVM } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

export const getExecutiveReportMockData = (): ExecutiveReportVM => {
  const state = useCompaniesStore.getState();
  const company = state.companies.find((c) => c.id === state.selectedCompanyId) || state.companies[0];

  const reportId = `RPT-2026-${String(company.id).padStart(4, '0')}-${company.name.slice(0, 3).toUpperCase()}`;
  const loanAmount = parseFloat(company.loanExposure.replace(/[^0-9.]/g, "")) * (company.loanExposure.includes("B") ? 1_000_000_000 : 1_000_000);
  
  const ratingMap: Record<string, string> = {
    low: "A- (Investment Grade)",
    medium: "BBB (Investment Grade)",
    high: "BB (Non-Investment Grade)",
    critical: "CCC (High Risk)",
  };

  const decisionMap: Record<string, string> = {
    low: "APPROVE",
    medium: "APPROVE WITH CONDITIONS",
    high: "REJECT (HIGH RISK)",
    critical: "REJECT (CRITICAL RISK)",
  };

  return {
    reportId,
    executiveSummary: {
      companyName: company.name,
      industry: company.sector,
      requestedLoanAmount: company.loanExposure,
      rawLoanAmount: loanAmount,
      loanPurpose: "Working Capital & Expansion",
      loanTenure: "36 Months",
      overallRecommendation: decisionMap[company.riskLevel],
      reportGenerationDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      borrowerRating: ratingMap[company.riskLevel],
    },
    keyFinancialHighlights: {
      liquidityPosition: `Current Ratio ${company.creditScore > 70 ? "1.85x" : "1.1x"}`,
      treasuryHealth: `NSFR ${company.creditScore > 70 ? "118%" : "95%"}`,
      revenueTrend: "+14.2% CAGR YoY",
      profitability: "EBITDA 24.5%",
      cashFlow: `FCF $${(loanAmount * 0.1).toFixed(2)}`,
      debtPosition: `Total Debt $${(loanAmount * 1.5).toFixed(2)} | D/E ${company.creditScore > 70 ? "1.42x" : "3.5x"}`,
      strengths: [
        "Established market presence",
        "Consistent revenue generation",
      ],
      weaknesses: [
        company.riskLevel === 'high' || company.riskLevel === 'critical' ? "High leverage levels" : "Moderate leverage",
        "Macroeconomic sensitivity",
      ],
    },
    macroIndustryOutlook: {
      gdpOutlook: "Regional GDP +2.4% annually",
      inflation: "CPI stabilizing at 2.8%",
      interestRateEnvironment: "Terminal rate steady at 4.75%",
      industryGrowth: "Sector growth +8.5%",
      countryRisk: "Low — AAA/AA+ sovereign rating",
      aiInterpretation: "Stable macro backdrop. Elevated rates offset by sector tailwinds.",
    },
    marketFXRiskSummary: {
      var95: "$1.42M (95% 1-Day VaR)",
      expectedShortfall: "$1.89M Expected Shortfall",
      fxExposure: "$12.5M exposure",
      hedgedVsUnhedged: "45% Hedged / 55% Unhedged",
      tailRisk: "Moderate",
      overallMarketRiskConclusion: "Moderately elevated FX risk. Hedging recommended.",
    },
    creditRiskSummary: {
      creditRating: ratingMap[company.riskLevel],
      existingDebt: `$${(loanAmount * 1.5).toFixed(2)} Total`,
      debtRatios: [
        { name: "Debt / Equity", value: company.creditScore > 70 ? "1.42x" : "3.5x" },
        { name: "Interest Coverage", value: company.creditScore > 70 ? "8.65x" : "1.5x" },
        { name: "DSCR", value: company.creditScore > 70 ? "2.18x" : "1.05x" },
        { name: "Debt / EBITDA", value: company.creditScore > 70 ? "3.20x" : "6.5x" },
      ],
      repaymentBehaviour: `${company.creditScore > 70 ? "97.8%" : "85%"} On-Time`,
      defaultHistory: company.riskLevel === 'critical' ? "2 Defaults (Unresolved)" : "None",
      primaryStrengths: ["Market share", "Operational history"],
      primaryConcerns: company.riskLevel === 'critical' ? ["Liquidity constraints", "High debt burden"] : ["Maturity tranche approaching"],
    },
    riskAggregation: {
      overallRiskScore: 100 - company.creditScore,
      overallRiskLevel: company.riskLevel.charAt(0).toUpperCase() + company.riskLevel.slice(1),
      confidenceScore: 89.4,
      recommendedDecision: decisionMap[company.riskLevel],
      triggeredRule: `Risk Score dictates ${decisionMap[company.riskLevel]}`,
    },
    keyInsights: [
      "FCF supports debt servicing.",
      "NSFR exceeds benchmarks.",
      "FX hedging recommended.",
      "D/E within parameters.",
      "Repayment record consistent.",
    ],
    conditions: {
      isConditional: company.riskLevel === 'medium',
      isRejected: company.riskLevel === 'high' || company.riskLevel === 'critical',
      requiredCollateral: company.riskLevel === 'high' || company.riskLevel === 'critical' ? [] : ["120% First Lien on Receivables & Inventory"],
      additionalDocumentation: ["Audited Financials"],
      financialCovenants: ["Min DSCR >= 1.75x (quarterly)"],
      reportingFrequency: "Quarterly statements",
      monitoringRequirements: ["Quarterly Covenant Audits"],
      rejectionReasons: company.riskLevel === 'high' || company.riskLevel === 'critical' ? ["Unacceptable leverage", "Poor DSCR"] : undefined,
    },
    aiExplainabilityNarrative: `${company.name} shows ${company.riskLevel} risk profile. Current score is ${company.creditScore}/100. Recommendation: ${decisionMap[company.riskLevel]}.`,
    disclaimer: "AI-assisted decision support only. Final credit approval remains subject to formal credit committee review, institutional lending policies, legal documentation, and regulatory compliance.",
  };
};
