from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def get_auth_headers(role: str = "Corporate Credit Officer") -> dict[str, str]:
    resp = client.post(
        "/api/v1/auth/login",
        json={"username": "cco@roiq.ai", "password": "password123"},
    )
    assert resp.status_code == 200
    token = resp.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_companies_endpoints():
    headers = get_auth_headers()
    # List companies
    res = client.get("/api/v1/companies", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["data"]) >= 9
    assert data["data"][0]["name"] == "Tata Steel Ltd."

    # Single company
    res_single = client.get("/api/v1/companies/1", headers=headers)
    assert res_single.status_code == 200
    s_data = res_single.json()["data"]
    assert s_data["name"] == "Tata Steel Ltd."
    assert "financial_metrics" in s_data


def test_credit_risk_flow_and_hitl():
    headers = get_auth_headers()

    # 1. GET credit risk data
    res_get = client.get("/api/v1/credit-risk/1", headers=headers)
    assert res_get.status_code == 200
    get_data = res_get.json()["data"]
    assert "marketRisk" in get_data
    assert "creditRisk" in get_data

    # 2. POST analyze for Low Risk company (Tata Steel) -> completes directly
    res_analyze_1 = client.post(
        "/api/v1/credit-risk/1/analyze",
        json={"requested_loan": 420000000.0, "tenure_months": 36},
        headers=headers,
    )
    assert res_analyze_1.status_code == 200
    analyze_data_1 = res_analyze_1.json()["data"]
    assert analyze_data_1["risk_category"] == "Low"
    assert analyze_data_1["human_review_required"] is False
    assert analyze_data_1["workflow_status"] == "COMPLETED"

    # 3. POST analyze for High Risk company (Adani Enterprises, ID 4) -> Pauses for Human Review
    res_analyze_4 = client.post(
        "/api/v1/credit-risk/4/analyze",
        json={"requested_loan": 870000000.0, "tenure_months": 36},
        headers=headers,
    )
    assert res_analyze_4.status_code == 200
    analyze_data_4 = res_analyze_4.json()["data"]
    assert analyze_data_4["risk_category"] in ("High", "Critical", "Medium")
    assert analyze_data_4["human_review_required"] is True
    assert analyze_data_4["workflow_status"] == "PAUSED_FOR_APPROVAL"

    # 4. POST review (HITL approval for company 4) -> Resumes and Completes
    res_review = client.post(
        "/api/v1/credit-risk/4/review",
        json={
            "approved": True,
            "notes": "Approved by Senior Credit Committee with 1st lien requirement.",
            "adjusted_category": "High",
            "officer": "Thomas Shelby (CCO)",
        },
        headers=headers,
    )
    assert res_review.status_code == 200
    rev_data = res_review.json()["data"]
    assert rev_data["workflow_status"] == "COMPLETED"
    assert rev_data["recommendation"]["decision"] in ("APPROVE", "APPROVE_WITH_CONDITIONS")


def test_financial_analytics_endpoint():
    headers = get_auth_headers()
    res = client.get("/api/v1/financial-analytics/1", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "treasury" in data
    assert "liquidity" in data
    assert "bond_portfolio" in data["treasury"]
    assert "cash_positions" in data["liquidity"]


def test_forecasts_endpoint():
    headers = get_auth_headers()
    res = client.get("/api/v1/forecasts/1", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "corporate" in data
    assert "macro" in data
    assert len(data["corporate"]["income_statement"]["revenue_trend"]) > 0


def test_loan_recommendation_endpoint():
    headers = get_auth_headers()
    res = client.get("/api/v1/loan-recommendation/1", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "loan_details" in data
    assert "risk_aggregation" in data
    assert len(data["module_results"]) > 0


def test_executive_report_endpoint():
    headers = get_auth_headers()
    res = client.get("/api/v1/executive-report/1", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "reportId" in data
    assert "executiveSummary" in data
    assert "keyFinancialHighlights" in data
    assert "conditions" in data


def test_ai_insights_endpoint():
    headers = get_auth_headers()
    res = client.get("/api/v1/ai-insights/1", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "facts" in data
    assert "calculated_metrics" in data
    assert "ai_interpretations" in data
    assert "recommendations" in data
    assert len(data["facts"]) > 0
    assert len(data["calculated_metrics"]) > 0
