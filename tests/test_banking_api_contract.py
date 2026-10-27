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

    # 2. POST analyze for Low Risk company (Reliance Industries, ID 2) -> completes directly
    res_analyze_2 = client.post(
        "/api/v1/credit-risk/2/analyze",
        json={"requested_loan": 500000000.0, "tenure_months": 36},
        headers=headers,
    )
    assert res_analyze_2.status_code == 200
    analyze_data_2 = res_analyze_2.json()["data"]
    assert analyze_data_2["risk_category"] == "Low"
    assert analyze_data_2["human_review_required"] is False
    assert analyze_data_2["workflow_status"] == "COMPLETED"

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


def test_full_mvp_mentor_flow():
    """
    Validates the end-to-end MVP flow for mentor demonstration:
    1. Login with CCO credentials & receive valid JWT.
    2. Retrieve companies catalogue & select High-Risk entity (Adani Enterprises, ID 4).
    3. Verify financial data (Revenue, EBITDA, Total Debt, Cash Flow, DSCR).
    4. Run Credit Risk analysis via LangGraph.
    5. Verify paused state (PAUSED_FOR_APPROVAL) due to High Risk profile.
    6. Human-in-the-Loop review: Override category, add committee note, and approve facility.
    7. Verify LangGraph resumes to COMPLETED with finalized recommendation.
    8. Check Loan Recommendation reflects the audited decision and spreads.
    9. Check Executive Report reflects human officer decision & notes.
    10. Verify AI Insights structure (FACT, CALCULATED METRIC, AI INTERPRETATION, RECOMMENDATION).
    """
    # 1. Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"username": "cco@roiq.ai", "password": "password123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Select Company (Adani Enterprises, ID 4)
    comp_res = client.get("/api/v1/companies/4", headers=headers)
    assert comp_res.status_code == 200
    comp_data = comp_res.json()["data"]
    assert comp_data["name"] == "Adani Enterprises Ltd."
    assert "ebitda" in comp_data
    assert "debt" in comp_data
    assert "dscr" in comp_data

    # 3. Financial Analytics
    analytics_res = client.get("/api/v1/financial-analytics/4", headers=headers)
    assert analytics_res.status_code == 200
    assert "treasury" in analytics_res.json()["data"]

    # 4. Trigger LangGraph Credit Risk Analysis
    analyze_res = client.post(
        "/api/v1/credit-risk/4/analyze",
        json={"requested_loan": 850000000.0, "tenure_months": 36},
        headers=headers,
    )
    assert analyze_res.status_code == 200
    analysis = analyze_res.json()["data"]
    assert analysis["workflow_status"] == "PAUSED_FOR_APPROVAL"
    assert analysis["human_review_required"] is True
    assert analysis["credit_score"] <= 70
    assert analysis["probability_of_default"] > 0

    # 5. Human-in-the-Loop Review (Approve with override)
    review_res = client.post(
        "/api/v1/credit-risk/4/review",
        json={
            "approved": True,
            "notes": "Approved by Corporate Credit Committee subject to senior lien covenants.",
            "adjusted_category": "Medium",
            "officer": "Senior Credit Officer",
        },
        headers=headers,
    )
    assert review_res.status_code == 200
    review_data = review_res.json()["data"]
    assert review_data["workflow_status"] == "COMPLETED"
    assert review_data["risk_category"] == "Medium"
    assert review_data["human_approval"]["approved"] is True
    assert review_data["human_approval"]["officer"] == "Senior Credit Officer"

    # 6. Verify Loan Recommendation
    loan_res = client.get("/api/v1/loan-recommendation/4", headers=headers)
    assert loan_res.status_code == 200
    loan_data = loan_res.json()["data"]
    assert loan_data["loan_details"]["requested_product_type"] is not None
    assert loan_data["loan_details"]["loan_amount"] > 0
    assert loan_data["risk_aggregation"]["overall_risk_level"] in ("Medium", "High", "Low")
    assert loan_data["risk_aggregation"]["overall_risk_score"] is not None

    # 7. Verify Executive Report integration
    exec_res = client.get("/api/v1/executive-report/4", headers=headers)
    assert exec_res.status_code == 200
    exec_data = exec_res.json()["data"]
    assert exec_data["executiveSummary"]["companyName"] == "Adani Enterprises Ltd."
    assert exec_data["riskAggregation"]["recommendedDecision"] in ("APPROVE", "APPROVE WITH CONDITIONS")
    # Verify human credit officer note appears in keyInsights
    insights_str = " ".join(exec_data["keyInsights"])
    assert "senior lien covenants" in insights_str

    # 8. Verify AI Insights
    ai_res = client.get("/api/v1/ai-insights/4", headers=headers)
    assert ai_res.status_code == 200
    ai_data = ai_res.json()["data"]
    assert len(ai_data["facts"]) > 0
    assert len(ai_data["calculated_metrics"]) > 0
    assert len(ai_data["ai_interpretations"]) > 0
    assert len(ai_data["recommendations"]) > 0

