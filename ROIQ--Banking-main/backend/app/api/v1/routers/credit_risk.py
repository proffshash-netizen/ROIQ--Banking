from typing import Annotated, Optional
from fastapi import APIRouter, Depends, status

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....schemas.credit_risk import (
    CreditRiskAnalyzeRequest,
    HumanReviewRequest,
)
from ....services.credit_risk_service import CreditRiskService

router = APIRouter(
    tags=["Credit Risk"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Viewer", "Corporate Credit Officer"]))],
)

credit_risk_service = CreditRiskService()


def get_credit_risk_service() -> CreditRiskService:
    return credit_risk_service


@router.get("/{company_id}", response_model=dict, summary="Get company market and credit risk assessment data")
async def get_credit_risk(company_id: str) -> dict:
    data = credit_risk_service.get_credit_risk_data(company_id)
    return build_success_response(data.model_dump())


@router.post(
    "/{company_id}/analyze",
    response_model=dict,
    summary="Trigger LangGraph AI loan & credit risk evaluation workflow",
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Corporate Credit Officer"]))],
)
async def analyze_company_credit_risk(
    company_id: str,
    payload: Optional[CreditRiskAnalyzeRequest] = None,
) -> dict:
    result = await credit_risk_service.analyze_credit_risk(company_id, payload)
    return build_success_response(result.model_dump())


@router.post(
    "/{company_id}/review",
    response_model=dict,
    summary="Submit Human-in-the-Loop credit committee approval and resume LangGraph workflow",
    dependencies=[Depends(RequireRole(["Admin", "Corporate Credit Officer"]))],
)
async def submit_human_review(
    company_id: str,
    payload: HumanReviewRequest,
) -> dict:
    result = await credit_risk_service.submit_human_review(company_id, payload)
    return build_success_response(result.model_dump())


@router.get(
    "/{company_id}/audit-trail",
    response_model=dict,
    summary="Get immutable audit logs for company credit reviews and decisions",
    dependencies=[Depends(RequireRole(["Admin", "Corporate Credit Officer", "Analyst", "Viewer"]))],
)
async def get_audit_trail(company_id: str) -> dict:
    try:
        from ...db.session import SessionLocal
        from ...db.repositories.audit_repository import AuditRepository
        with SessionLocal() as db:
            repo = AuditRepository(db)
            cid_int = int(company_id) if company_id.isdigit() else 1
            logs = repo.list_logs_for_company(cid_int)
            return build_success_response([
                {
                    "id": log.id,
                    "company_id": log.company_id,
                    "thread_id": log.thread_id,
                    "action": log.action,
                    "officer": log.officer,
                    "previous_state": log.previous_state,
                    "new_state": log.new_state,
                    "notes": log.notes,
                    "created_at": log.created_at.isoformat() if log.created_at else None,
                }
                for log in logs
            ])
    except Exception:
        return build_success_response([])

