"""Company repository interacting with SQLAlchemy models."""

from typing import Any, Optional
from sqlalchemy.orm import Session
from ..models import CompanyModel, FinancialDataModel
from ...services.company_service import STATIC_PORTFOLIO


class CompanyRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def seed_initial_portfolio_if_empty(self) -> None:
        count = self.db.query(CompanyModel).count()
        if count > 0:
            return

        for item in STATIC_PORTFOLIO:
            comp = CompanyModel(
                id=item["id"],
                name=item["name"],
                sector=item["sector"],
                country=item["country"],
                founded=item["founded"],
                revenue=item["revenue"],
                employees=item["employees"],
                credit_score=item["creditScore"],
                risk_level=item["riskLevel"],
                loan_exposure=item["loanExposure"],
                status=item["status"],
                module=item["module"],
                progress=item["progress"],
                eta=item["eta"],
                last_analysis=item["lastAnalysis"],
                ceo=item["ceo"],
                hq=item["hq"],
                symbol=item.get("symbol"),
                exchange=item.get("exchange"),
                raw_financials=item.get("raw_financials"),
            )
            self.db.add(comp)
            
            # Add initial financial data record
            fin = FinancialDataModel(
                company_id=item["id"],
                balance_sheet={"total_debt": item.get("raw_financials", {}).get("total_debt", 0.0), "equity": item.get("raw_financials", {}).get("equity", 0.0)},
                income_statement={"revenue": item.get("raw_financials", {}).get("revenue", 0.0), "ebitda": item.get("raw_financials", {}).get("ebitda", 0.0)},
                cash_flow={"operating_cash_flow": item.get("raw_financials", {}).get("cash_flow", 0.0)},
                ratios=item.get("raw_financials"),
                data_source="INTERNAL",
            )
            self.db.add(fin)

        self.db.commit()

    def get_all(self) -> list[CompanyModel]:
        self.seed_initial_portfolio_if_empty()
        return self.db.query(CompanyModel).order_by(CompanyModel.id).all()

    def get_by_id(self, company_id: str | int) -> Optional[CompanyModel]:
        self.seed_initial_portfolio_if_empty()
        cid_str = str(company_id).strip()
        
        # Try integer ID lookup
        if cid_str.isdigit():
            c = self.db.query(CompanyModel).filter(CompanyModel.id == int(cid_str)).first()
            if c:
                return c
                
        # Try name or symbol match
        c = self.db.query(CompanyModel).filter(
            (CompanyModel.name.ilike(f"%{cid_str}%")) |
            (CompanyModel.symbol.ilike(cid_str))
        ).first()
        return c
