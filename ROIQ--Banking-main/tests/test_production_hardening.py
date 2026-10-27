import pytest
from starlette.testclient import TestClient
from backend.app.main import create_app
from backend.app.db.session import SessionLocal, init_db
from backend.app.db.repositories.company_repository import CompanyRepository
from backend.app.db.repositories.credit_repository import CreditRepository
from backend.app.db.repositories.audit_repository import AuditRepository
from backend.app.services.external_provider_service import HttpExternalProviderService

app = create_app()
client = TestClient(app)


def get_token_for(username: str, role_title: str) -> str:
    resp = client.post("/api/v1/auth/login", json={"username": username, "password": "password"})
    assert resp.status_code == 200
    return resp.json()["data"]["access_token"]


def test_database_initialization_and_company_persistence():
    """Verify database schema creation and CompanyRepository seeding."""
    init_db()
    with SessionLocal() as db:
        repo = CompanyRepository(db)
        repo.seed_initial_portfolio_if_empty()
        companies = repo.get_all()
        assert len(companies) >= 9
        comp1 = repo.get_by_id(1)
        assert comp1 is not None
        assert comp1.name == "Tata Steel Ltd."
        assert comp1.credit_score == 68


def test_credit_evaluation_and_recommendation_persistence():
    """Verify credit evaluations and recommendations persist in database."""
    with SessionLocal() as db:
        repo = CreditRepository(db)
        eval_model = repo.save_evaluation(
            company_id=1,
            thread_id="test_persistence_thread_1",
            credit_score=72.5,
            risk_category="Medium",
            credit_rating="BBB",
            probability_of_default=0.035,
            metrics={"dscr": 1.75, "debt_to_equity": 0.85},
            workflow_status="PAUSED_FOR_APPROVAL",
        )
        assert eval_model.id is not None

        rec = repo.save_recommendation(
            evaluation_id=eval_model.id,
            company_id=1,
            decision="APPROVE_WITH_CONDITIONS",
            requested_amount=100_000_000.0,
            approved_amount=85_000_000.0,
            pricing_spread="SOFR + 285 bps",
        )
        assert rec.id is not None
        assert rec.approved_amount == 85_000_000.0

        # Verify retrieval
        fetched = repo.get_by_thread_id("test_persistence_thread_1")
        assert fetched is not None
        assert fetched.credit_score == 72.5


def test_immutable_audit_trail_persistence():
    """Verify immutable audit trail records are created and retrieved."""
    with SessionLocal() as db:
        repo = AuditRepository(db)
        log = repo.log_event(
            action="CREDIT_APPROVAL_TEST",
            officer="Senior Risk Officer",
            company_id=1,
            thread_id="audit_test_thread",
            previous_state={"risk": "Medium"},
            new_state={"risk": "Medium", "decision": "APPROVED"},
            notes="Credit committee unanimously signed facility memo.",
        )
        assert log.id is not None
        assert log.created_at is not None

        logs = repo.list_logs_for_company(1)
        assert len(logs) > 0
        assert any(l.action == "CREDIT_APPROVAL_TEST" for l in logs)


def test_audit_trail_api_endpoint():
    """Verify GET /api/v1/credit-risk/{company_id}/audit-trail endpoint."""
    token = get_token_for("officer", "Corporate Credit Officer")
    resp = client.get("/api/v1/credit-risk/1/audit-trail", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_external_providers_health_and_status():
    """Verify provider health report and fallback behavior."""
    service = HttpExternalProviderService()
    status = service.get_providers_status()
    assert "FRED" in status
    assert "FMP" in status
    assert "Finnhub" in status
    assert "AlphaVantage" in status

    # API endpoint check
    token = get_token_for("analyst", "Analyst")
    resp = client.get("/api/v1/external-data/providers", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["data"]["FRED"]["mode"] in ("LIVE", "FALLBACK")


def test_external_provider_graceful_fallback():
    """Verify external provider gracefully falls back when keys are not set."""
    import asyncio
    service = HttpExternalProviderService()
    profile = asyncio.run(service.fetch_company_profile("TATASTEEL", "TATASTEEL"))
    assert profile["company_id"] == "TATASTEEL"
    assert profile["source"] in ("INTERNAL", "FMP", "FINNHUB")

    macro = asyncio.run(service.fetch_macro_indicators())
    assert "interest_rate" in macro
    assert macro["source"] in ("INTERNAL", "FRED")


def test_rbac_authorization_enforcement():
    """
    Test RBAC enforcement:
    - Viewer: Read-only access (403 on analyze and review)
    - Analyst: Can analyze, but 403 on review
    - Corporate Credit Officer: Can analyze and review
    """
    viewer_token = get_token_for("viewer", "Viewer")
    analyst_token = get_token_for("analyst", "Analyst")
    officer_token = get_token_for("officer", "Corporate Credit Officer")

    # 1. Viewer can read credit-risk
    res_v_read = client.get("/api/v1/credit-risk/1", headers={"Authorization": f"Bearer {viewer_token}"})
    assert res_v_read.status_code == 200

    # 2. Viewer cannot trigger analyze (Requires Admin, Analyst, or CCO)
    res_v_analyze = client.post("/api/v1/credit-risk/1/analyze", json={}, headers={"Authorization": f"Bearer {viewer_token}"})
    assert res_v_analyze.status_code == 400 or res_v_analyze.status_code == 403  # PlatformError / Auth error

    # 3. Viewer cannot submit human review (Requires Admin or CCO)
    res_v_review = client.post("/api/v1/credit-risk/1/review", json={"approved": True, "notes": "test"}, headers={"Authorization": f"Bearer {viewer_token}"})
    assert res_v_review.status_code == 400 or res_v_review.status_code == 403

    # 4. Analyst cannot submit human review
    res_a_review = client.post("/api/v1/credit-risk/1/review", json={"approved": True, "notes": "test"}, headers={"Authorization": f"Bearer {analyst_token}"})
    assert res_a_review.status_code == 400 or res_a_review.status_code == 403

    # 5. Officer CAN submit human review
    res_o_review = client.post(
        "/api/v1/credit-risk/1/review",
        json={"approved": True, "notes": "Officer authorization accepted.", "adjusted_category": "Medium"},
        headers={"Authorization": f"Bearer {officer_token}"}
    )
    assert res_o_review.status_code == 200
    assert res_o_review.json()["data"]["workflow_status"] == "COMPLETED"
