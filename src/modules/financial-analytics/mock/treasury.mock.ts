// Mock data for Treasury Analysis
export const treasuryMockData = {
  bond_portfolio: {
    total_value: 2_450_000_000,
    government_bonds: 980_000_000,
    corporate_bonds: 735_000_000,
    treasury_bills: 367_500_000,
    treasury_notes: 245_000_000,
    treasury_bonds: 122_500_000,
    allocation: {
      government_pct: 40.0,
      corporate_pct: 30.0,
      bills_pct: 15.0,
      notes_pct: 10.0,
      bonds_pct: 5.0,
    },
    risk_rating: "Moderate",
    last_rebalanced: "2026-07-20T09:30:00Z",
  },
  treasury_securities: {
    total_holdings: 735_000_000,
    maturity_profile: {
      short_term: 294_000_000,
      medium_term: 257_250_000,
      long_term: 183_750_000,
    },
    average_yield: 4.35,
    weighted_average_maturity_years: 5.2,
  },
  interest_rate_information: {
    policy_rate: 6.50,
    market_rate: 6.85,
    overnight_rate: 6.40,
    average_rate: 6.58,
    highest_rate: 7.10,
    lowest_rate: 6.15,
    historical_trend: [
      { date: "2026-01", policy: 6.00, market: 6.35, overnight: 5.90 },
      { date: "2026-02", policy: 6.00, market: 6.42, overnight: 5.95 },
      { date: "2026-03", policy: 6.25, market: 6.55, overnight: 6.10 },
      { date: "2026-04", policy: 6.25, market: 6.65, overnight: 6.20 },
      { date: "2026-05", policy: 6.50, market: 6.78, overnight: 6.35 },
      { date: "2026-06", policy: 6.50, market: 6.82, overnight: 6.38 },
      { date: "2026-07", policy: 6.50, market: 6.85, overnight: 6.40 },
    ],
    ai_interpretation:
      "Interest rates remain moderately elevated, indicating tighter monetary policy with stable market conditions. The RBI's cautious approach suggests rates may hold steady through Q3 2026.",
  },
  yield_curve_data: {
    tenors: [
      { label: "3M", years: 0.25, yield: 5.85 },
      { label: "6M", years: 0.5, yield: 6.02 },
      { label: "1Y", years: 1, yield: 6.25 },
      { label: "2Y", years: 2, yield: 6.48 },
      { label: "5Y", years: 5, yield: 6.82 },
      { label: "10Y", years: 10, yield: 7.05 },
      { label: "30Y", years: 30, yield: 7.35 },
    ],
    shape: "Normal (Upward Sloping)",
    steepness: "Moderate",
    ai_summary:
      "The upward-sloping yield curve suggests positive long-term economic expectations and healthy market confidence. The moderate steepness indicates balanced inflation expectations.",
  },
  duration_information: {
    modified_duration: 4.82,
    macaulay_duration: 5.15,
    portfolio_duration: 4.95,
    interest_rate_sensitivity: "Medium",
    convexity: 28.4,
    risk_level: "Moderate",
    ai_assessment:
      "Portfolio duration of 4.95 years indicates moderate interest rate sensitivity. A 1% rate increase would result in approximately 4.82% portfolio value decline.",
  },
  ai_treasury_assessment:
    "Treasury portfolio demonstrates balanced allocation with moderate risk. Government bonds provide stability while corporate bonds enhance yield. Current positioning is well-suited for the prevailing interest rate environment.",
  last_updated: "2026-07-24T05:30:00Z",
} as const;
