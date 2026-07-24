# API Endpoints Report

Base URL: http://localhost:8000

## 1. Authentication Endpoints

### 1.1 POST /api/v1/auth/login
Purpose: Authenticate a user and return a token.

Request JSON:
```json
{
  "username": "string",
  "password": "string"
}
```

Example:
```json
{
  "username": "admin",
  "password": "password"
}
```

Success response JSON:
```json
{
  "success": true,
  "data": {
    "access_token": "string",
    "token_type": "bearer",
    "role": "string"
  },
  "meta": {
    "timestamp": "2026-07-23T00:00:00+00:00",
    "processing_time_ms": 0
  }
}
```

Error response JSON:
```json
{
  "success": false,
  "error": {
    "code": "authentication_error",
    "message": "string",
    "request_id": null
  }
}
```

### 1.2 GET /api/v1/auth/me
Purpose: Placeholder identity endpoint.

Request:
```text
/api/v1/auth/me?token=your-token-here
```

Success response JSON:
```json
{
  "success": true,
  "data": {
    "message": "Auth hook ready"
  },
  "meta": {
    "timestamp": "2026-07-23T00:00:00+00:00",
    "processing_time_ms": 0
  }
}
```

## 2. Analysis Endpoints

### 2.1 POST /api/v1/analysis/company
Purpose: Submit a company analysis request.

Request JSON:
```json
{
  "company_id": "string",
  "include_risk": true,
  "include_explainability": false
}
```

Example:
```json
{
  "company_id": "AAPL",
  "include_risk": true,
  "include_explainability": false
}
```

Success response JSON:
```json
{
  "success": true,
  "data": {
    "company_id": "AAPL",
    "summary": "string",
    "risk_score": 0.42,
    "status": "ready"
  },
  "meta": {
    "timestamp": "2026-07-23T00:00:00+00:00",
    "processing_time_ms": 0
  }
}
```

## 3. External Data Endpoints

### 3.1 POST /api/v1/external-data/normalize
Purpose: Fetch external financial data and normalize it into the AI contract.

Request JSON:
```json
{
  "company_id": "AAPL",
  "symbol": "AAPL",
  "include_macro": true,
  "include_legal_esg": true
}
```

Success response JSON:
```json
{
  "success": true,
  "data": {
    "pipeline_payload": {
      "company_identity": {
        "company_id": "AAPL",
        "symbol": "AAPL",
        "name": "Company AAPL",
        "exchange": "NYSE",
        "sector": "Financial Services",
        "industry": "Corporate Banking",
        "country": "US",
        "description": "Placeholder company profile fetched from external providers."
      },
      "financial_data": {
        "income_statement": [
          {
            "statement_type": "income_statement",
            "period_ending": "2025-12-31",
            "revenue": 480000000.0,
            "net_income": 83000000.0,
            "ebitda": 132000000.0,
            "operating_cash_flow": null,
            "total_assets": null,
            "total_liabilities": null,
            "shareholders_equity": null
          }
        ],
        "balance_sheet": [
          {
            "statement_type": "balance_sheet",
            "period_ending": "2025-12-31",
            "revenue": null,
            "net_income": null,
            "ebitda": null,
            "operating_cash_flow": null,
            "total_assets": 1800000000.0,
            "total_liabilities": 960000000.0,
            "shareholders_equity": 840000000.0
          }
        ],
        "cash_flow": [
          {
            "statement_type": "cash_flow",
            "period_ending": "2025-12-31",
            "revenue": null,
            "net_income": null,
            "ebitda": null,
            "operating_cash_flow": 135000000.0,
            "total_assets": null,
            "total_liabilities": null,
            "shareholders_equity": null
          }
        ],
        "financial_ratios": {
          "current_ratio": 1.38,
          "leverage_ratio": 0.53,
          "profit_margin": 0.172,
          "return_on_assets": 0.046,
          "debt_to_equity": 1.14
        }
      },
      "market_fx_data": {
        "var_95": 0.041,
        "expected_shortfall": 0.061,
        "pnl_volatility": 0.038,
        "tail_risk_ratio": 0.62,
        "currency_exposure": 18000000.0,
        "hedged_exposure": 7200000.0,
        "unhedged_exposure": 10800000.0,
        "fx_volatility": 0.12,
        "cross_currency_basis": 0.0075,
        "security_identifiers": [
          "AAPL"
        ]
      },
      "macro_industry_data": {
        "gdp_growth": 2.1,
        "inflation_rate": 3.6,
        "interest_rate": 5.25,
        "treasury_rate": 4.2,
        "currency_stability": 0.86,
        "industry_growth_rate": 1.9,
        "market_sentiment": "neutral",
        "competition_level": "moderate",
        "country_risk": {
          "political_risk": 0.24,
          "economic_risk": 0.18,
          "stability_score": 0.77
        }
      },
      "legal_esg_data": {
        "pending_litigation": false,
        "litigation_severity": null,
        "regulatory_issues": [],
        "tax_compliance_status": "compliant",
        "environmental_risk": "low",
        "governance_score": 72.0,
        "esg_score": 68.5
      }
    }
  },
  "meta": {
    "timestamp": "2026-07-23T00:00:00+00:00",
    "processing_time_ms": 0
  }
}
```

## 4. Dashboard Endpoints

### 3.1 GET /api/v1/dashboard/overview
Purpose: Return a dashboard overview contract.

Success response JSON:
```json
{
  "success": true,
  "data": {
    "overview": [
      {
        "name": "Active Deals",
        "value": 24,
        "trend": "+8%"
      }
    ],
    "widgets": [
      {
        "title": "Pipeline",
        "type": "chart",
        "config": {
          "series": []
        }
      }
    ]
  },
  "meta": {
    "timestamp": "2026-07-23T00:00:00+00:00",
    "processing_time_ms": 0
  }
}
```

## 4. Health Endpoints

### 4.1 GET /health
Success response JSON:
```json
{
  "status": "ok",
  "service": "backend-platform",
  "timestamp": "2026-07-23T00:00:00+00:00"
}
```

### 4.2 GET /ready
Success response JSON:
```json
{
  "status": "ready",
  "service": "backend-platform",
  "timestamp": "2026-07-23T00:00:00+00:00"
}
```

### 4.3 GET /live
Success response JSON:
```json
{
  "status": "live",
  "service": "backend-platform",
  "timestamp": "2026-07-23T00:00:00+00:00"
}
```

## 5. Streaming Endpoints

### 5.1 GET /api/v1/stream
Purpose: SSE placeholder endpoint.

Response event example:
```json
{
  "event": "message",
  "data": "stream-ready"
}
```

### 5.2 WS /api/v1/ws
Purpose: WebSocket placeholder endpoint.

WebSocket URL:
```text
ws://localhost:8000/api/v1/ws
```

## 6. Common Response Structure

Successful response format:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-07-23T00:00:00+00:00",
    "processing_time_ms": 0
  }
}
```

Error response format:
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "request_id": null
  }
}
```
