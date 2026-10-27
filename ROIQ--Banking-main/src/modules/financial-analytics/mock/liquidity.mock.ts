// Mock data for Liquidity Management
export const liquidityMockData = {
  cash_positions: {
    total_cash: 850_000_000,
    operating_cash: 340_000_000,
    reserve_cash: 255_000_000,
    investment_cash: 170_000_000,
    restricted_cash: 85_000_000,
    currency_breakdown: {
      INR: 680_000_000,
      USD: 102_000_000,
      EUR: 42_500_000,
      GBP: 25_500_000,
    },
  },
  liquid_assets: {
    total_liquid_assets: 1_650_000_000,
    hqla_level_1: 990_000_000,
    hqla_level_2a: 412_500_000,
    hqla_level_2b: 247_500_000,
    encumbered_assets: 165_000_000,
    unencumbered_assets: 1_485_000_000,
  },
  funding_information: {
    total_funding: 3_200_000_000,
    stable_funding: 2_560_000_000,
    wholesale_funding: 640_000_000,
    retail_deposits: 1_920_000_000,
    interbank_borrowing: 320_000_000,
    funding_concentration_risk: "Low",
  },
  debt_obligations: {
    total_debt: 1_800_000_000,
    short_term_debt: 540_000_000,
    long_term_debt: 1_260_000_000,
    weighted_average_cost: 5.85,
    next_maturity_date: "2026-09-15",
    next_maturity_amount: 180_000_000,
  },
  liquidity_ratios: {
    current_ratio: 1.85,
    quick_ratio: 1.42,
    lcr: {
      ratio: 142.5,
      required_threshold: 100,
      hqla: 1_485_000_000,
      net_cash_outflows: 1_042_105_263,
      compliance_status: "Compliant",
      buffer: 42.5,
      regulatory_health: "Strong",
      ai_assessment:
        "LCR of 142.5% significantly exceeds the regulatory minimum of 100%, providing a robust 42.5% buffer. The institution maintains strong short-term liquidity resilience.",
    },
    nsfr: {
      ratio: 118.2,
      available_stable_funding: 2_560_000_000,
      required_stable_funding: 2_165_820_000,
      compliance_status: "Compliant",
      funding_stability_score: "A+",
      ai_assessment:
        "NSFR of 118.2% indicates a healthy funding structure with sufficient stable funding sources to cover long-term assets. Funding stability score of A+ reflects low structural liquidity risk.",
    },
    liquidity_health: "Healthy",
    ai_liquidity_assessment:
      "Overall liquidity position is strong with healthy cash reserves and well-diversified funding sources. Current and quick ratios exceed industry benchmarks, indicating robust short-term solvency.",
  },
  last_updated: "2026-07-24T05:30:00Z",
} as const;
