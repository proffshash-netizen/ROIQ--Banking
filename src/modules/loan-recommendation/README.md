# ROIQ AI – Loan Recommendation Module (Credit Decision Support System - CDSS)

## Module Overview

The **Loan Recommendation Module** provides an enterprise-grade AI-assisted Credit Decision Support System (CDSS) that aggregates analytical outputs from all previous risk and financial modules (Corporate Financial Risk, Treasury & Liquidity Risk, Macroeconomic Risk, Industry Risk, Market & FX Risk, and Credit Risk) to generate a transparent, explainable credit recommendation for credit officers and committees.

This module acts strictly as a decision support system, providing credit officers with quantitative metrics, visual risk contributions, deterministic business rule triggers, and structured explainability rationales.

---

## Folder Structure

```
src/modules/loan-recommendation/
├── mock/
│   └── loanRecommendation.mock.ts    # Realistic enterprise mock data matching raw backend contracts
├── services/
│   └── loanRecommendation.service.ts # Service layer simulating backend API responses
├── transformers/
│   └── index.ts                       # Pure transformation functions & deterministic rules engine
├── types/
│   └── index.ts                       # Raw input contracts & transformed Business View Models (VMs)
├── hooks/
│   └── useLoanRecommendation.ts       # React hook managing module state, loading, & errors
├── widgets/
│   ├── shared.tsx                     # Reusable design system badges, metrics, & AI cards
│   ├── LoanRequestSummaryWidget.tsx   # Section 1: Structured information cards
│   ├── RiskAggregationWidget.tsx     # Section 2: ECharts horizontal bar, gauge, & distribution table
│   ├── CreditDecisionWidget.tsx       # Section 3: Recommendation outcome banner & suggested terms
│   └── ExplainabilityPanelWidget.tsx  # Section 4: Transparent AI reasoning & business justification
├── README.md                          # Module documentation & backend specs
└── index.ts                           # Module barrel export hub
```

---

## Backend JSON Contracts

### Risk Aggregation Input Contract
```json
{
  "module_results": [
    {
      "module": "Market & FX Risk",
      "risk_score": 65,
      "risk_level": "Medium",
      "status": "success",
      "weight": 0.15,
      "ai_summary": "Value at Risk (95% 1-day) stands at $1.42M due to unhedged EUR/USD revenues."
    }
  ]
}
```

### Loan Recommendation Input Contract
```json
{
  "loan_details": {
    "company_name": "Apex Global Technologies Inc.",
    "loan_amount": 15000000,
    "loan_purpose": "Working Capital Expansion & Cross-Border Supply Chain Financing",
    "loan_tenure_months": 36,
    "requested_product_type": "Syndicated Revolving Credit Facility",
    "requested_date": "2026-07-20",
    "currency": "USD"
  },
  "risk_aggregation": {
    "overall_risk_score": 48,
    "overall_risk_level": "Medium",
    "confidence_score": 89.4
  },
  "module_results": [ ... ]
}
```

---

## Transformation Layer

The transformation layer (`src/modules/loan-recommendation/transformers/index.ts`) enforces strict decoupling between backend JSON schemas and UI view components:
- Converts raw monetary numbers into locale-formatted currency (`$15,000,000`).
- Calculates weighted risk score contributions per module (`Risk Score * Weight %`).
- Evaluates the deterministic rules engine to select the credit outcome.
- Assembles pure, type-safe Business View Models (`LoanSummaryVM`, `RiskAggregationVM`, `CreditDecisionVM`, `ExplainabilityVM`).

---

## Decision Rules Engine

Credit decision outcomes are generated deterministically based on the aggregated overall risk score:

| Overall Risk Score | Decision Outcome | Suggested Terms & Conditions |
|---|---|---|
| **≤ 30** | `APPROVE` | Standard pricing (SOFR + 1.75–2.25%), Unsecured, Annual Review |
| **31 – 60** | `APPROVE WITH CONDITIONS` | Enhanced pricing (SOFR + 2.75–3.50%), 120% Collateral Lien, Quarterly Monitoring |
| **61 – 80** | `FURTHER REVIEW` | Senior Committee Escalation, 150% Corporate Guarantee, Monthly Monitoring |
| **> 80** | `REJECT` | Declined (Exceeds Bank Risk Appetite) |

---

## Risk Aggregation Logic

The overall risk score is calculated as a weighted average across six core risk dimensions:
$$\text{Overall Risk Score} = \sum_{i=1}^{n} (\text{Risk Score}_i \times \text{Weight}_i)$$

Visualized using:
1. **Risk Contribution Horizontal Bar Chart** (ECharts) highlighting raw risk scores and individual module weights.
2. **Overall Risk Gauge** showing real-time composite score on a color-coded gauge.
3. **Risk Distribution Table** breaking down module risk scores, levels, weights, and AI insights.

---

## Explainability Strategy

Explainability is structured into distinct, actionable categories:
- **Top Positive Factors**: Credit strengths supporting loan approval.
- **Top Negative Factors**: Key credit weaknesses and exposure areas.
- **Primary Risk Drivers**: Highest weighted risk modules.
- **Mitigation Strategies**: Required risk-mitigating actions (e.g., mandatory FX hedging).
- **Recommended Loan Conditions**: Financial covenants and reporting requirements.
- **Required Documentation**: Pre-disbursement checklist.
- **Post-Approval Monitoring**: Audit and covenant frequency.
- **Executive Business Justification**: Clear natural-language synthesis for credit committees.

---

## Future FastAPI Compatibility

The architecture is built for seamless API integration:
- UI widgets consume *only* Business View Models via `useLoanRecommendation()`.
- Integrating a FastAPI backend requires updating *only* `src/modules/loan-recommendation/services/loanRecommendation.service.ts` to replace the mock response with an `axios.post('/api/v1/loan-recommendation', payload)` HTTP call.
- No changes to UI components or view models will be required.

---

## Validation Checklist

- [x] Existing routing unchanged (`/recommendation` route intact in `App.tsx`)
- [x] Existing layout preserved (`AppLayout` intact)
- [x] No raw JSON displayed in UI
- [x] ECharts horizontal bar & gauge charts render successfully
- [x] Currency formatting applied (`formatCurrency`)
- [x] No TypeScript errors
- [x] No Oxlint warnings
- [x] `npm run lint` passes cleanly
- [x] `npm run build` passes cleanly
- [x] Smoke test created & passed (`tests/loanRecommendation.smoke.test.tsx`)
