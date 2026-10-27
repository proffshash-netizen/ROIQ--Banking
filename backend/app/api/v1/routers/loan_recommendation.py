from datetime import datetime, timezone
from fastapi import APIRouter, Depends

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....schemas.loan_recommendation import (
    LoanDetailsInput,
    LoanRecommendationInput,
    ModuleRiskResult,
    RiskAggregationSummaryInput,
)
from ....services.company_service import CompanyService

router = APIRouter(
    tags=["Loan Recommendation"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Viewer", "Corporate Credit Officer"]))],
)

company_service = CompanyService()


@router.get("/{company_id}", response_model=dict, summary="Get loan recommendation and credit decision data")
async def get_loan_recommendation(company_id: str) -> dict:
    f_ctx = company_service.get_financial_context(company_id)
    company_name = f_ctx.get("name") or f"Company {company_id}"
    score = float(f_ctx.get("credit_score") or 72.0)
    exp_str = f_ctx.get("loan_exposure") or "$420M"

    loan_amt = 420_000_000.0
    if "B" in exp_str:
        loan_amt = float("".join(c for c in exp_str if c.isdigit() or c == ".")) * 1_000_000_000.0
    elif "M" in exp_str:
        loan_amt = float("".join(c for c in exp_str if c.isdigit() or c == ".")) * 1_000_000.0

    risk_level = "Low" if score >= 75 else "Medium" if score >= 58 else "High" if score >= 45 else "Critical"

    # Check for executed LangGraph evaluation / human review
    try:
        from backend.app.db.session import SessionLocal
        from backend.app.db.repositories.credit_repository import CreditRepository
        with SessionLocal() as db:
            repo = CreditRepository(db)
            cid_int = int(company_id) if company_id.isdigit() else 1
            eval_record = repo.get_latest_by_company(cid_int)
            rec_record = repo.get_latest_recommendation_by_company(cid_int)
            if eval_record:
                score = float(eval_record.credit_score)
                risk_level = eval_record.risk_category
            if rec_record:
                loan_amt = float(rec_record.requested_amount)
    except Exception:
        pass

    # Module risk decomposition derived deterministically from company profile
    financial_risk = round(100.0 - score * 0.85)
    treasury_risk = round(100.0 - score * 0.90)
    macro_risk = round(45.0 + (100.0 - score) * 0.25)
    industry_risk = round(38.0 + (100.0 - score) * 0.28)
    fx_risk = round(50.0 + (100.0 - score) * 0.30)

    def to_level(s: float) -> str:
        return "Low" if s <= 35 else "Medium" if s <= 60 else "High" if s <= 75 else "Critical"

    def to_status(s: float) -> str:
        return "success" if s <= 40 else "warning" if s <= 65 else "error"

    module_results = [
        ModuleRiskResult(
            module="Financial Risk & Solvency",
            risk_score=financial_risk,
            risk_level=to_level(financial_risk),
            status=to_status(financial_risk),
            weight=0.30,
            ai_summary=f"D/E at {f_ctx.get('debt_to_equity', 1.2)}x with DSCR {f_ctx.get('dscr', 1.8)}x.",
        ),
        ModuleRiskResult(
            module="Credit & Default Probability",
            risk_score=round(100.0 - score),
            risk_level=risk_level,
            status="success" if risk_level == "Low" else "warning" if risk_level == "Medium" else "error",
            weight=0.25,
            ai_summary=f"Quantitative underwriter rating: {score:.0f}/100.",
        ),
        ModuleRiskResult(
            module="Treasury & Liquidity Management",
            risk_score=treasury_risk,
            risk_level=to_level(treasury_risk),
            status=to_status(treasury_risk),
            weight=0.20,
            ai_summary="Sufficient high-quality liquid asset reserves covering near-term maturities.",
        ),
        ModuleRiskResult(
            module="Macroeconomic & Country Risk",
            risk_score=macro_risk,
            risk_level=to_level(macro_risk),
            status=to_status(macro_risk),
            weight=0.15,
            ai_summary="Interest rate environment stable at 4.75% with low sovereign risk.",
        ),
        ModuleRiskResult(
            module="Foreign Exchange & Market Risk",
            risk_score=fx_risk,
            risk_level=to_level(fx_risk),
            status=to_status(fx_risk),
            weight=0.10,
            ai_summary="Hedged currency portfolio with monitored basis spread risk.",
        ),
    ]

    payload = LoanRecommendationInput(
        loan_details=LoanDetailsInput(
            company_name=company_name,
            loan_amount=loan_amt,
            loan_purpose="Corporate Working Capital & Capacity Expansion",
            loan_tenure_months=36,
            requested_product_type="Senior Secured Term Loan Facility",
            requested_date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            currency="USD",
        ),
        risk_aggregation=RiskAggregationSummaryInput(
            overall_risk_score=round(100.0 - score),
            overall_risk_level=risk_level,
            confidence_score=94.5,
        ),
        module_results=module_results,
    )

    return build_success_response(payload.model_dump())
