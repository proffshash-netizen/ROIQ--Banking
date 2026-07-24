# Credit Risk Module Architecture & Integration

## Overview
The **Credit Risk Module** (`src/modules/credit-risk/`) is an enterprise-grade corporate banking decision support module designed for credit analysts, risk officers, and enterprise treasury managers.

It follows a strict decoupled, 4-tier feature architecture compatible with future FastAPI/REST microservices integration.

---

## Folder & Component Architecture

```
src/modules/credit-risk/
├── types/
│   └── index.ts                 # Full domain & view model TypeScript contracts
├── mock/
│   ├── marketRisk.mock.ts       # Raw Market Risk mock dataset (AAPL benchmark)
│   └── creditRisk.mock.ts       # Raw Credit Risk mock dataset (corporate credit)
├── services/
│   └── creditRisk.service.ts    # Async Service Abstraction layer (simulates API calls)
├── transformers/
│   └── index.ts                 # Data Transformation layer & Quantitative Risk Scoring
├── hooks/
│   └── useCreditRisk.ts         # React Custom Hook orchestrating state and transforms
├── widgets/
│   ├── shared.tsx               # Reusable UI primitives (RiskBadge, Trend, AIInsight, Skeleton)
│   ├── MarketRiskKpiWidget.tsx  # 10 Market Risk KPI Cards + Executive Summary Card
│   ├── MarketRiskChartsWidget.tsx# ECharts: VaR vs ES, FX Volatility, Exposure Donut
│   ├── CreditRiskKpiWidget.tsx  # 10 Credit Risk KPI Cards + Credit Summary Card
│   ├── CreditRiskChartsWidget.tsx# ECharts: Debt Structure, Ratios, Utilization Gauge, Timeline
│   └── ExecutiveSummaryWidget.tsx# Unified Risk Score, Decision Banner, Warning Signals
└── index.ts                     # Single point barrel export for module
```

---

## Core Sections Implemented

### 1. Executive Credit Decision Support
- **Recommended Decision**: Actionable decision banner (*Approved* / *Conditional* / *Rejected*) with max facility limit recommendation.
- **Unified Risk Score**: Weighted Composite Index (0–100) combining Market Risk (40%) and Credit Risk (60%).
- **Warning Signals**: Automated algorithmic warning detection (e.g. leverage thresholds, FX unhedged exposure, liquidity coverage).
- **Decision Rationale**: Automated natural language summary generator.

### 2. Market Risk Analysis
- **10 Core Metrics**: VaR 95%, Expected Shortfall (CVaR), Volatility (30d), FX Exposure, Beta, Liquidity Risk, Interest Rate Sensitivity, Stress Test Impact, Max Drawdown, Country Exposure.
- **Interactive Visualizations**:
  - Horizontal Bar Chart: Value at Risk vs Expected Shortfall comparison.
  - Stacked Bar Chart & Donut Chart: Currency Exposure Breakdown (Hedged vs Unhedged).
  - Area Line Chart: 6-month FX Volatility trend with risk thresholds.

### 3. Credit Risk Assessment
- **10 Core Metrics**: Credit Rating, Probability of Default (PD), Loss Given Default (LGD), Exposure at Default (EAD), Debt-to-Equity, Interest Coverage, Current Ratio, Cash Flow Stability, Customer Concentration, Default History.
- **Interactive Visualizations**:
  - Stacked Bar Chart: Debt Maturity & Security Structure.
  - Bar Comparison: Financial Debt Ratios vs Industry Thresholds.
  - Gauge Chart: Credit Facility Utilization.
  - Timeline Chart: Historical Default & Resolution Timeline.

---

## Data Flow Pipeline

```
[Raw Mock Datasets / Backend API]
              │
              ▼
    [creditRisk.service.ts] (Async fetch abstraction)
              │
              ▼
     [transformers/index.ts] (Formatting, Risk Classification, Scoring Algorithms)
              │
              ▼
      [useCreditRisk Hook] (State & Life-cycle management)
              │
              ▼
     [src/pages/Risk.tsx] (Integrated Risk Dashboard Page)
```

---

## FastAPI Backend Integration Guide

To connect a live FastAPI backend:

1. Update `src/modules/credit-risk/services/creditRisk.service.ts`:
   ```typescript
   import axios from "axios";

   export const fetchCreditRiskData = async (): Promise<RawCreditRiskPayload> => {
     const response = await axios.get("/api/v1/credit-risk/analysis");
     return response.data;
   };
   ```
2. The transformation and UI layers require zero modifications as long as the response matches `RawCreditRiskPayload` defined in `types/index.ts`.
