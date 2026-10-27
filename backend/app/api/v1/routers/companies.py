from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import RequireRole
from ....core.responses import build_success_response
from ....schemas.companies import CompanyDetail, CompanyItem
from ....services.company_service import CompanyService

router = APIRouter(
    tags=["Companies"],
    dependencies=[Depends(RequireRole(["Admin", "Analyst", "Viewer", "Corporate Credit Officer"]))],
)

company_service = CompanyService()


def get_company_service() -> CompanyService:
    return company_service


@router.get("", response_model=dict, summary="List corporate portfolio entities")
async def list_companies() -> dict:
    companies = company_service.get_all_companies()
    return build_success_response([c.model_dump(by_alias=True) for c in companies])


@router.get("/{company_id}", response_model=dict, summary="Get company profile and financial statements")
async def get_company(company_id: str) -> dict:
    company = company_service.get_company_by_id(company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with identifier '{company_id}' not found.",
        )
    return build_success_response(company.model_dump(by_alias=True))
