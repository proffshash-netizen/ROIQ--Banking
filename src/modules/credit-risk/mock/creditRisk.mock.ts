// Credit Risk Module – Mock Data (Credit Risk) — Company-Aware
import type { CreditRiskInput } from "../types";
import { useCompaniesStore } from "@/stores/companiesStore";

export const getCreditRiskMockData = (): CreditRiskInput => {
  const store = useCompaniesStore.getState();
  const active = store.companies.find(c => c.id === store.selectedCompanyId) ?? store.companies[0];
  const score = active.creditScore;

  // Scale total outstanding debt by loan exposure
  const loanStr = active.loanExposure;
  let exposureMillion = 420;
  if (loanStr.includes("B")) {
    exposureMillion = parseFloat(loanStr.replace(/[^0-9.]/g, "")) * 1000;
  } else if (loanStr.includes("M")) {
    exposureMillion = parseFloat(loanStr.replace(/[^0-9.]/g, ""));
  }
  const totalOutstanding = Math.round(exposureMillion * 1_000_000 * 3.8); // Outstanding ~3.8x loan
  const shortTerm = Math.round(totalOutstanding * 0.22);
  const longTerm = Math.round(totalOutstanding * 0.62);
  const revolving = Math.round(totalOutstanding * 0.10);
  const secured = Math.round(totalOutstanding * 0.72);
  const unsecured = Math.round(totalOutstanding * 0.28);

  // Credit rating based on score
  const rating = score >= 88 ? "AA-" : score >= 80 ? "A+" : score >= 72 ? "A-" : score >= 60 ? "BBB+" : score >= 48 ? "BB" : "B-";
  const creditHistoryYears = score >= 80 ? 22 : score >= 65 ? 15 : score >= 50 ? 10 : 6;
  const paymentHistoryPct = parseFloat((88 + score * 0.12).toFixed(1));
  const creditUtilizationPct = parseFloat((70 - score * 0.45).toFixed(1));
  const debtToEquity = score >= 85 ? 0.38 : score >= 72 ? 0.85 : score >= 58 ? 1.42 : score >= 45 ? 2.10 : 3.20;
  const interestCoverage = score >= 85 ? 12.5 : score >= 72 ? 7.8 : score >= 58 ? 4.2 : score >= 45 ? 2.1 : 0.9;
  const dscr = score >= 85 ? 2.85 : score >= 72 ? 1.95 : score >= 58 ? 1.30 : score >= 45 ? 0.98 : 0.65;
  const debtToEbitda = score >= 85 ? 1.8 : score >= 72 ? 2.9 : score >= 58 ? 4.2 : score >= 45 ? 6.0 : 8.5;
  const currentRatio = score >= 85 ? 2.40 : score >= 72 ? 1.75 : score >= 58 ? 1.25 : score >= 45 ? 0.95 : 0.72;

  // Historical defaults – the lower the score, the more likely to have a default
  const hasDefault = score < 60;
  const defaultYear = hasDefault ? "2021" : "None";
  const totalDefaults = hasDefault ? 1 : 0;

  // Generate realistic rating history
  const ratingHistoryMap: Record<string, string> = {
    "AA-": "A+", "A+": "A-", "A-": "BBB+", "BBB+": "BBB", "BB": "BB-", "B-": "CCC+"
  };
  const previousRating = ratingHistoryMap[rating] ?? rating;
  const ratingHistory = [
    { date: "2022-Q1", rating: previousRating },
    { date: "2022-Q3", rating: previousRating },
    { date: "2023-Q1", rating: score >= 65 ? rating : previousRating },
    { date: "2023-Q3", rating: score >= 65 ? rating : previousRating },
    { date: "2024-Q1", rating },
    { date: "2024-Q3", rating },
    { date: "2025-Q1", rating },
    { date: "2025-Q3", rating },
    { date: "2026-Q1", rating },
  ];

  return {
    credit_history: {
      years_of_credit: creditHistoryYears,
      total_accounts: score >= 75 ? 14 : 8,
      active_accounts: score >= 75 ? 9 : 5,
      closed_accounts: score >= 75 ? 5 : 3,
      credit_score: score,
      payment_history_pct: paymentHistoryPct,
      average_account_age_years: parseFloat((creditHistoryYears * 0.47).toFixed(1)),
      oldest_account_years: creditHistoryYears,
      recent_inquiries: score >= 75 ? 1 : 4,
      credit_utilization_pct: Math.max(5, creditUtilizationPct),
    },
    existing_debt: {
      total_outstanding: totalOutstanding,
      short_term_debt: shortTerm,
      long_term_debt: longTerm,
      revolving_credit: revolving,
      secured_debt: secured,
      unsecured_debt: unsecured,
      annual_debt_service: Math.round(totalOutstanding * 0.092),
      weighted_avg_interest_rate: parseFloat((3.5 + (100 - score) * 0.065).toFixed(2)),
      next_maturity_date: "2027-03-15",
      debt_currency: "USD",
    },
    default_history: {
      total_defaults: totalDefaults,
      last_default_year: defaultYear,
      defaults_resolved: totalDefaults,
      defaults_outstanding: 0,
      recovery_rate_pct: hasDefault ? 72.0 : 0,
      timeline: [
        { year: "2019", defaults: 0, resolved: 0 },
        { year: "2020", defaults: 0, resolved: 0 },
        { year: "2021", defaults: hasDefault ? 1 : 0, resolved: 0 },
        { year: "2022", defaults: 0, resolved: hasDefault ? 1 : 0 },
        { year: "2023", defaults: 0, resolved: 0 },
        { year: "2024", defaults: 0, resolved: 0 },
        { year: "2025", defaults: 0, resolved: 0 },
        { year: "2026", defaults: 0, resolved: 0 },
      ],
    },
    credit_rating: rating,
    debt_ratios: {
      debt_to_equity: debtToEquity,
      interest_coverage: interestCoverage,
      debt_service_coverage: dscr,
      debt_to_assets: parseFloat((debtToEquity / (1 + debtToEquity)).toFixed(2)),
      debt_to_ebitda: debtToEbitda,
      current_ratio: currentRatio,
      quick_ratio: parseFloat((currentRatio * 0.72).toFixed(2)),
      rating_history: ratingHistory,
    },
  };
};

// Legacy export for backwards compat
export const creditRiskMockData = getCreditRiskMockData();
