# ROIQ AI – Executive Report Module

## Module Overview

The **Executive Report Module** aggregates transformed data across all prior analytical modules (Financial Analytics, Treasury & Liquidity, Corporate Financial Analysis, Macroeconomic & Industry Analysis, Market & FX Risk, Credit Risk, and Loan Recommendation) to produce a professional, 10-section **Credit Assessment Executive Report**.

The generated report serves as an executive Credit Committee document summarizing key findings, highlighting financial strengths/vulnerabilities, presenting the decision recommendation outcome, and supporting high-resolution PDF export & browser printing.

---

## Folder Structure

```
src/modules/executive-report/
├── mock/
│   └── executiveReport.mock.ts        # Enterprise mock data aggregated across analytics modules
├── services/
│   ├── executiveReport.service.ts     # Service layer fetching report data & calling PDF generator
│   └── pdfGenerator.ts                # PDF print & export engine
├── transformers/
│   └── index.ts                       # Data transformation & view model mapping
├── types/
│   └── index.ts                       # ExecutiveReportVM and sub-section interface definitions
├── hooks/
│   └── useExecutiveReport.ts          # Custom React hook for state management & PDF export
├── widgets/
│   ├── shared.tsx                     # Loading skeletons & shared components
│   ├── ExecutiveReportHeaderWidget.tsx# Header toolbar with PDF download, print, & refresh controls
│   └── ExecutiveReportPreviewWidget.tsx# Structured 10-section report document
├── README.md                          # Module documentation
└── index.ts                           # Module barrel export hub
```

---

## Report Structure (10 Sections)

1. **Executive Summary**: Company Name, Industry, Loan Amount, Purpose, Tenure, Report Date.
2. **Key Financial Highlights**: Liquidity, Treasury, Revenue Trend, Profitability, Cash Flow, Debt Position, Financial Strengths & Weaknesses.
3. **Macroeconomic & Industry Outlook**: GDP, Inflation, Interest Rates, Industry Growth, Country Risk, AI Macro Analysis.
4. **Market & FX Risk Summary**: 95% 1-Day VaR, Expected Shortfall, Contract Exposure, Hedging Ratios, Tail Risk.
5. **Credit Risk Summary**: Credit Rating, Debt Ratios, Repayment Behavior, Default History.
6. **Risk Aggregation & Loan Recommendation**: Overall Risk Score, Level, Confidence Score, Decision Outcome (`APPROVE`, `APPROVE WITH CONDITIONS`, `FURTHER REVIEW`, `REJECT`).
7. **Key Influential Insights**: Concise list of primary financial drivers.
8. **Recommended Conditions & Covenants**: Collateral, Covenants, Monitoring requirements (or clear rejection reasons if rejected).
9. **AI Explainability Narrative**: Transparent, executive natural-language synthesis.
10. **Regulatory & Institutional Disclaimer**: Credit policy & human review disclaimer.

---

## PDF Generation Strategy

- Utilizes high-resolution print stylesheet rules (`@media print`) and browser PDF renderer (`window.print()`).
- Ensures clean typography, cover header, section borders, custom colors, and multi-page layout.
- Prevents text truncation or overflow while hiding UI controls in print mode.

---

## Future Backend Compatibility

- The UI consumes *only* `ExecutiveReportVM` from `useExecutiveReport()`.
- Future FastAPI backend integration requires modifying *only* `executiveReportService.getExecutiveReport()` to call `/api/v1/executive-report`.

---

## Validation Checklist

- [x] Existing routing unchanged (`/report` route intact in `App.tsx`)
- [x] Existing layout preserved (`AppLayout` intact)
- [x] Report preview renders cleanly
- [x] No raw JSON displayed
- [x] Download PDF / Print triggers clean PDF print dialog
- [x] All 10 sections present and structured
- [x] No TypeScript errors
- [x] `npm run lint` passes cleanly
- [x] `npm run build` passes cleanly
- [x] Smoke test created & passed (`tests/executiveReport.smoke.test.tsx`)
