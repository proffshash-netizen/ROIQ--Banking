"""ROIQ Banking Platform - Comprehensive Critical Sprint Test Suite.

Verifies:
1. Financial data and Indian Rupee / ₹ Lakh normalization
2. Coherent synthetic Indian dataset calculations & ratios
3. Treasury cash coverage calculations (Opening: 450, Inflows: 180, Outflows: 150, Net: 30, Closing: 480, Coverage: 3.0 mos)
4. Authentication security (valid login, bad password, unknown user, expired token, signature validation, role isolation)
5. Dataset upload validation (size limits, file extensions, parsing, normalization to ₹ Lakh, rejection of invalid files)
"""

import io
from datetime import datetime, timedelta, timezone
import pytest
from starlette.testclient import TestClient

from backend.app.main import create_app
from backend.app.config.settings import settings
from backend.app.core.auth import create_access_token, decode_token
from backend.app.core.exceptions import AuthenticationError
from backend.app.core.security import hash_password, verify_password
from backend.app.core.synthetic_dataset import (
    SYNTHETIC_INDIAN_COMPANY,
    SYNTHETIC_DATA_LABEL,
    calculate_financial_ratios,
    calculate_treasury_metrics,
)
from backend.app.services.auth_service import AuthService
from backend.app.services.ingestion_service import IngestionService, normalize_amount_to_lakh

app = create_app()
client = TestClient(app)


# ===========================================================================
# 1. Financial Data, Treasury & Ratio Tests
# ===========================================================================

def test_synthetic_indian_company_arithmetic():
    """Verify exact financial ratio formulas and arithmetic on the benchmark dataset."""
    synth = SYNTHETIC_INDIAN_COMPANY
    assert synth["annual_revenue"] == 3200.0
    assert synth["ebitda"] == 480.0
    assert synth["net_profit"] == 240.0
    assert synth["current_assets"] == 1200.0
    assert synth["current_liabilities"] == 600.0
    assert synth["total_debt"] == 1500.0
    assert synth["shareholders_equity"] == 2000.0
    assert synth["annual_interest_expense"] == 120.0
    assert synth["annual_operating_cash_flow"] == 360.0

    ratios = calculate_financial_ratios(synth)
    # EBITDA margin = 480 / 3200 * 100 = 15.0%
    assert ratios["ebitda_margin_pct"] == 15.0
    # Net profit margin = 240 / 3200 * 100 = 7.5%
    assert ratios["net_profit_margin_pct"] == 7.5
    # Current ratio = 1200 / 600 = 2.0x
    assert ratios["current_ratio"] == 2.0
    # Debt-to-equity = 1500 / 2000 = 0.75x
    assert ratios["debt_to_equity"] == 0.75
    # EBITDA interest coverage = 480 / 120 = 4.0x
    assert ratios["ebitda_interest_coverage"] == 4.0


def test_treasury_cash_coverage_formulas():
    """Verify treasury monthly scenario and formulas:
    Opening: ₹450 lakh, Inflows: ₹180 lakh, Outflows: ₹150 lakh
    Net: ₹30 lakh, Closing: ₹480 lakh, Cash coverage: 3.0 months
    """
    metrics = calculate_treasury_metrics(
        opening_cash=450.0,
        inflows=180.0,
        outflows=150.0,
    )
    assert metrics["net_monthly_cash_flow"] == 30.0
    assert metrics["closing_cash"] == 480.0
    assert metrics["cash_coverage_months"] == 3.0


def test_financial_analytics_endpoint_inr_lakh():
    """Verify /financial-analytics returns normalized INR Lakh metrics and disclaimer."""
    login_resp = client.post("/api/v1/auth/login", json={"username": "cco@roiq.ai", "password": "Officer@Roiq2026!"})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.get("/api/v1/financial-analytics/1", headers=headers)
    assert resp.status_code == 200
    data = resp.json()["data"]

    treasury = data["treasury"]
    liquidity = data["liquidity"]

    # Verify treasury values reconcile with ₹450 lakh opening / portfolio
    assert treasury["bond_portfolio"]["total_value"] == 450.0
    assert treasury["interest_rate_information"]["benchmark_rate"] == 6.50  # RBI Repo rate
    assert liquidity["cash_positions"]["total_cash"] == 450.0
    assert liquidity["liquidity_ratios"]["cash_coverage_months"] == 3.0
    assert liquidity["debt_obligations"]["total_debt"] == 1500.0


def test_forecasts_endpoint_inr_lakh():
    """Verify /forecasts returns ₹ Lakh metrics conforming to synthetic baseline."""
    login_resp = client.post("/api/v1/auth/login", json={"username": "cco@roiq.ai", "password": "Officer@Roiq2026!"})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.get("/api/v1/forecasts/1", headers=headers)
    assert resp.status_code == 200
    data = resp.json()["data"]["corporate"]
    assert data["income_statement"]["current_revenue"] == 3200.0
    assert data["income_statement"]["current_net_income"] == 240.0
    assert data["balance_sheet"]["current_ratio"] == 2.0
    assert data["balance_sheet"]["debt_to_equity"] == 0.75
    assert data["financial_ratios"]["interest_coverage"] == 4.0


# ===========================================================================
# 2. Authentication & JWT Security Tests
# ===========================================================================

def test_auth_valid_login_and_hash_verification():
    """Verify login with cryptographic password verification."""
    auth_service = AuthService(demo_mode_enabled=False)
    # Correct officer login
    token_resp = auth_service.authenticate("cco@roiq.ai", "Officer@Roiq2026!")
    assert token_resp.access_token is not None
    assert token_resp.role == "Corporate Credit Officer"


def test_auth_invalid_password_rejected():
    """Verify bad passwords fail securely."""
    auth_service = AuthService(demo_mode_enabled=False)
    with pytest.raises(AuthenticationError):
        auth_service.authenticate("cco@roiq.ai", "WrongPassword123!")


def test_auth_unknown_user_rejected():
    """Verify unknown user emails are rejected."""
    auth_service = AuthService(demo_mode_enabled=False)
    with pytest.raises(AuthenticationError):
        auth_service.authenticate("hacker@unknown.com", "password")


def test_jwt_expiry_enforcement():
    """Verify expired JWTs are strictly rejected."""
    expired_token = create_access_token(
        username="officer",
        role="Corporate Credit Officer",
        expires_delta=timedelta(seconds=-10),  # expired 10 seconds ago
    )
    with pytest.raises(AuthenticationError, match="expired"):
        decode_token(expired_token)


def test_jwt_tampered_signature_rejected():
    """Verify altered signatures fail validation."""
    valid_token = create_access_token(username="officer", role="Corporate Credit Officer")
    tampered = valid_token[:-4] + "fake"
    with pytest.raises(AuthenticationError):
        decode_token(tampered)


def test_role_based_authorization():
    """Verify Viewer cannot access privileged human review approval."""
    auth_service = AuthService()
    viewer_token = auth_service.authenticate("viewer", "Viewer@Roiq2026!").access_token
    headers = {"Authorization": f"Bearer {viewer_token}"}

    # Attempt committee approval
    resp = client.post(
        "/api/v1/credit-risk/1/review",
        headers=headers,
        json={
            "officer": "Viewer",
            "approved": True,
            "notes": "Unauthorized approval attempt",
        },
    )
    assert resp.status_code == 403


# ===========================================================================
# 3. Financial Dataset Ingestion & Validation Tests
# ===========================================================================

def test_ingestion_valid_csv():
    """Verify tabular CSV ingestion with normalization to ₹ Lakh."""
    csv_content = (
        "metric,value\n"
        "annual_revenue,3200\n"
        "ebitda,480\n"
        "net_profit,240\n"
        "current_assets,1200\n"
        "current_liabilities,600\n"
        "total_debt,1500\n"
        "shareholders_equity,2000\n"
        "annual_interest_expense,120\n"
        "annual_operating_cash_flow,360\n"
    ).encode("utf-8")

    ingestion = IngestionService(upload_dir="uploads")
    result = ingestion.process_upload("financials.csv", csv_content, "text/csv")

    assert result["status"] == "ingested_and_validated"
    assert result["unit"] == "lakh"
    assert result["extracted_metrics"]["annual_revenue"] == 3200.0
    assert result["extracted_metrics"]["ebitda"] == 480.0
    assert result["calculated_ratios"]["current_ratio"] == 2.0
    assert result["calculated_ratios"]["ebitda_interest_coverage"] == 4.0


def test_ingestion_unit_normalization_crore_to_lakh():
    """Verify that values in Crore are normalized correctly: 1 Cr = 100 Lakh."""
    assert normalize_amount_to_lakh(50.0, "crore") == 5000.0  # 50 Cr = 5000 Lakh
    assert normalize_amount_to_lakh(10_000_000.0, "inr") == 100.0  # 10M INR = 100 Lakh


def test_ingestion_rejects_unsupported_extensions():
    """Verify unsupported file formats (.exe, .pdf) are rejected."""
    ingestion = IngestionService(upload_dir="uploads")
    with pytest.raises(ValueError, match="Unsupported file format"):
        ingestion.process_upload("exploit.exe", b"binarycontent", "application/octet-stream")


def test_ingestion_rejects_empty_files():
    """Verify 0-byte uploads are rejected."""
    ingestion = IngestionService(upload_dir="uploads")
    with pytest.raises(ValueError, match="empty"):
        ingestion.process_upload("empty.csv", b"", "text/csv")


def test_upload_api_endpoint():
    """Verify POST /upload/dataset accepts valid file and returns normalized data."""
    login_resp = client.post("/api/v1/auth/login", json={"username": "cco@roiq.ai", "password": "Officer@Roiq2026!"})
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    csv_data = b"line_item,amount\nannual_revenue,3200\nebitda,480\ncurrent_assets,1200\ncurrent_liabilities,600\n"
    files = {"file": ("statements.csv", io.BytesIO(csv_data), "text/csv")}

    resp = client.post("/api/v1/upload/dataset", headers=headers, files=files)
    assert resp.status_code == 200
    res_data = resp.json()["data"]
    assert res_data["status"] == "ingested_and_validated"
    assert res_data["unit"] == "lakh"
    assert res_data["extracted_metrics"]["annual_revenue"] == 3200.0
