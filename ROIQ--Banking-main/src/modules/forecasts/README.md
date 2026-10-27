# Forecasts Module Documentation

This module implements the predictive engine combining corporate financial analysis with macroeconomic and industry indicators.

## Mock JSON Schema Contracts

### Corporate Financial Analysis
```json
{
  "income_statement": {
    "revenue_trend": [ { "period": "string", "value": 0.0 } ],
    "profitability_trend": [ { "period": "string", "net_income": 0.0, "operating_income": 0.0 } ],
    "current_revenue": 0.0,
    "current_net_income": 0.0,
    "gross_profit_margin": 0.0,
    "net_profit_margin": 0.0
  },
  "balance_sheet": {
    "total_assets": 0.0,
    "total_liabilities": 0.0,
    "total_equity": 0.0,
    "current_ratio": 0.0,
    "debt_to_equity": 0.0
  },
  "cash_flow_statement": {
    "operating_cash_flow": 0.0,
    "investing_cash_flow": 0.0,
    "financing_cash_flow": 0.0,
    "free_cash_flow": 0.0
  },
  "financial_ratios": {
    "roe": 0.0,
    "roa": 0.0,
    "quick_ratio": 0.0,
    "interest_coverage": 0.0
  }
}
```

### Macroeconomic & Industry Analysis
```json
{
  "macro_industry_data": {
    "gdp_growth": 0.0,
    "inflation_rate": 0.0,
    "interest_rate": 0.0,
    "treasury_rate": 0.0,
    "currency_stability": 0.0,
    "industry_growth_rate": 0.0,
    "market_sentiment": "string",
    "competition_level": "string",
    "country_risk": {
      "rating": "string",
      "score": 0.0,
      "outlook": "string",
      "description": "string"
    },
    "historical_trends": [
      {
        "year": "string",
        "gdp": 0.0,
        "inflation": 0.0,
        "interest": 0.0,
        "treasury": 0.0
      }
    ],
    "industry_segments": [
      {
        "segment": "string",
        "growth_rate": 0.0
      }
    ]
  }
}
```

## Transformation Pipeline

The UI is insulated from the raw backend payloads via a typed transformation layer situated in `src/modules/forecasts/transformers/index.ts`.
- `transformCorporate`: Re-aligns disjoint annual revenue arrays and profitability trends into unified `FinancialTrendPoint` view models.
- `transformMacro`: Translates inflation, GDP, interest, and yield histories into `MacroTrendPoint` objects and segments.
- `transformForecastSummary`: Combines balance sheet indicators and macroeconomic stability values into weighted scores representing the radar indices.

## Chart Descriptions
1. **Corporate Financials**:
   - *Revenue vs Profit Trend*: ECharts smooth line/area chart showing top-line scaling vs bottom-line operating margins.
   - *Core Ratios*: Vertical bar chart visualizing ROE, ROA, Current, Quick, and Debt metrics.
2. **Macro & Industry**:
   - *Macro Trends*: Multi-line chart showing GDP growth vs interest rates vs treasury yields.
   - *Sector Growth*: Horizontal bar chart highlighting competitive segment trajectories.
3. **Forecast Composite Rating**:
   - *Radar Chart*: Displays weighted dimensions of Financial Strength, Profitability, Macro Health, Sector Growth, Country Stability, and Model Confidence.

## Future Backend Integration Strategy
When migrating from mocks to the FastAPI backend, the following endpoints should be bound in `src/modules/forecasts/services/`:
- `GET /api/forecasts/corporate`: Serves corporate balance sheet forecasts.
- `GET /api/forecasts/macro`: Serves macroeconomic indicators.

Because the components consume view models (`CorporateFinancialVM` and `MacroIndustryVM`), only the `fetchForecastData` service and the corresponding `transformers/` files will need adjustment to parse the new backend schemas. The presentation layer remains completely decoupled.
