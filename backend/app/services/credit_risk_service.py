from datetime import datetime, timezone
from typing import Any, Optional

from .company_service import CompanyService
from ..ai.graph import loan_ai_graph
from ..ai.groq_service import groq_service
from ..schemas.credit_risk import (
    CreditRiskAnalyzeRequest,
    CreditRiskAnalyzeResponse,
    CreditRiskInput,
    CreditRiskServiceResponse,
    HumanReviewRequest,
    LoanRecommendationResult,
    MarketFxData,
    MarketRiskInput,
)


class CreditRiskService:
    """Orchestrates credit-risk data retrieval, LangGraph analysis, and HITL approvals."""

    def __init__(self, company_service: Optional[CompanyService] = None) -> None:
        self.company_service = company_service or CompanyService()

    def get_credit_risk_data(self, company_id: str) -> CreditRiskServiceResponse:
        company = self.company_service.get_company_by_id(company_id)
        if not company:
            company = self.company_service.get_company_by_id("1")  # safe fallback

        score = company.creditScore
        exp_str = company.loanExposure
        exp_mil = 420.0
        if "B" in exp_str:
            exp_mil = float("".join(c for c in exp_str if c.isdigit() or c == ".")) * 1000.0
        elif "M" in exp_str:
            exp_mil = float("".join(c for c in exp_str if c.isdigit() or c == "."))

        curr_exp = round(exp_mil * 1_000_000 * 2.1)
        hedged_pct = 0.78 if score >= 80 else 0.62 if score >= 65 else 0.48 if score >= 50 else 0.32
        hedged_exp = round(curr_exp * hedged_pct)
        unhedged_exp = curr_exp - hedged_exp
        pnl_vol = round(4.2 + (100 - score) * 0.082, 2)
        fx_vol = round(8.5 + (100 - score) * 0.12, 1)
        var_95 = round(curr_exp * 0.0145 * (1 + (100 - score) / 200))
        es = round(var_95 * 1.52)

        market_risk = MarketRiskInput(
            company_id=company.name,
            market_fx_data=MarketFxData(
                var_95=var_95,
                expected_shortfall=es,
                pnl_volatility=pnl_vol,
                tail_risk_ratio=round(es / max(var_95, 1), 2),
                currency_exposure=curr_exp,
                hedged_exposure=hedged_exp,
                unhedged_exposure=unhedged_exp,
                fx_volatility=fx_vol,
                cross_currency_basis=round(-0.12 - (100 - score) * 0.004, 2),
                security_identifiers=[f"IN{company.id * 1000 + i:010d}" for i in range(6)],
            ),
        )

        f_context = self.company_service.get_financial_context(company_id)
        total_debt = round(exp_mil * 1_000_000 * 3.8)
        rating = "AA-" if score >= 88 else "A+" if score >= 80 else "A-" if score >= 72 else "BBB" if score >= 58 else "BB-" if score >= 45 else "CCC"
        debt_to_eq = float(f_context.get("debt_to_equity") or (0.38 if score >= 85 else 0.85 if score >= 72 else 1.42 if score >= 58 else 2.10 if score >= 45 else 3.20))
        interest_cov = float(f_context.get("interest_coverage") or (12.5 if score >= 85 else 7.8 if score >= 72 else 4.2 if score >= 58 else 2.1 if score >= 45 else 0.9))
        dscr = float(f_context.get("dscr") or (2.85 if score >= 85 else 1.95 if score >= 72 else 1.30 if score >= 58 else 0.98 if score >= 45 else 0.65))
        debt_to_eb = float(f_context.get("debt_to_ebitda") or (1.8 if score >= 85 else 2.9 if score >= 72 else 4.2 if score >= 58 else 6.0 if score >= 45 else 8.5))
        curr_ratio = float(f_context.get("current_ratio") or (2.4 if score >= 85 else 1.75 if score >= 72 else 1.25 if score >= 58 else 0.95 if score >= 45 else 0.72))
        prob_def = round((0.015 if score >= 85 else 0.022 if score >= 75 else 0.045 if score >= 58 else 0.095 if score >= 45 else 0.185) * 100, 2)

        credit_risk = CreditRiskInput(
            credit_history={
                "credit_score": score,
                "years_of_credit": 22 if score >= 80 else 15 if score >= 65 else 10 if score >= 50 else 6,
                "payment_history_pct": round(88.0 + score * 0.12, 1),
                "credit_utilization_pct": round(max(10.0, 70.0 - score * 0.45), 1),
                "total_credit_lines": 8,
                "open_credit_lines": 5,
            },
            existing_debt={
                "total_outstanding": total_debt,
                "short_term_debt": round(total_debt * 0.22),
                "long_term_debt": round(total_debt * 0.62),
                "revolving_credit": round(total_debt * 0.10),
                "secured_debt": round(total_debt * 0.72),
                "unsecured_debt": round(total_debt * 0.28),
            },
            default_history={
                "total_defaults": 2 if score < 45 else 1 if score < 58 else 0,
                "bankruptcies": 0,
                "delinquencies_last_2_years": 2 if score < 50 else 0,
                "most_recent_default_year": "2021" if score < 58 else "None",
            },
            credit_rating=rating,
            debt_ratios={
                "debt_to_equity": debt_to_eq,
                "interest_coverage": interest_cov,
                "dscr": dscr,
                "debt_service_coverage": dscr,
                "debt_to_ebitda": debt_to_eb,
                "current_ratio": curr_ratio,
                "probability_of_default": prob_def,
            },
        )

        return CreditRiskServiceResponse(
            marketRisk=market_risk,
            creditRisk=credit_risk,
        )

    async def analyze_credit_risk(
        self,
        company_id: str,
        request: Optional[CreditRiskAnalyzeRequest] = None,
    ) -> CreditRiskAnalyzeResponse:
        f_context = self.company_service.get_financial_context(company_id)
        cid = f_context.get("company_id") or company_id
        company_name = f_context.get("name") or f"Company {cid}"
        sector = f_context.get("sector") or "Diversified Corporates"

        req_loan = request.requested_loan if request and request.requested_loan else f_context.get("requested_loan") or 100_000_000.0

        thread_id = f"thread_comp_{cid}"
        config = {"configurable": {"thread_id": thread_id}}

        payload = {
            "company_id": str(cid),
            "company_name": company_name,
            "sector": sector,
            "customer_data": {
                **f_context,
                "requested_loan": req_loan,
            },
            "human_approval": None,
        }

        # Execute LangGraph workflow
        state = loan_ai_graph.invoke(payload, config=config)

        # Check if Groq narrative should enrich insights
        score = float(state.get("decision_score", 65.0))
        risk_cat = state.get("risk_category", "Medium")
        p_def = float(state.get("credit_risk", {}).get("probability_of_default", 0.04))
        metrics = state.get("financial_metrics", {})

        ai_narrative = await groq_service.generate_risk_narrative(
            company_name=company_name,
            sector=sector,
            credit_score=score,
            risk_category=risk_cat,
            probability_of_default=p_def,
            metrics=metrics,
            requested_loan=req_loan,
        )

        insights = list(state.get("ai_insights", []))
        if ai_narrative.get("executive_summary"):
            insights.insert(0, ai_narrative["executive_summary"])

        rec = None
        if state.get("loan_recommendation"):
            r = state["loan_recommendation"]
            rec = LoanRecommendationResult(
                decision=r.get("decision", "APPROVE_WITH_CONDITIONS"),
                requested_amount=r.get("requested_amount", req_loan),
                approved_amount=r.get("approved_amount", 0.0),
                pricing_spread=r.get("pricing_spread", "SOFR + 250 bps"),
                covenants=r.get("covenants", ai_narrative.get("covenant_recommendations", [])),
                tenure_months=r.get("tenure_months", 36),
                decision_date=r.get("decision_date", datetime.now(timezone.utc).isoformat()),
            )

        human_req = state.get("human_review_required", risk_cat in ("Medium", "High", "Critical"))
        status = "PAUSED_FOR_APPROVAL" if human_req and not state.get("human_approval") else "COMPLETED"

        now_iso = datetime.now(timezone.utc).isoformat()
        try:
            from ..db.session import SessionLocal
            from ..db.repositories.credit_repository import CreditRepository
            from ..db.repositories.audit_repository import AuditRepository
            with SessionLocal() as db:
                credit_repo = CreditRepository(db)
                audit_repo = AuditRepository(db)
                eval_record = credit_repo.save_evaluation(
                    company_id=int(cid) if str(cid).isdigit() else 1,
                    thread_id=thread_id,
                    credit_score=score,
                    risk_category=risk_cat,
                    credit_rating=state.get("credit_risk", {}).get("credit_rating", "BBB"),
                    probability_of_default=p_def,
                    metrics=metrics,
                    risk_factors=state.get("risk_factors") or ai_narrative.get("key_concerns", []),
                    positive_factors=state.get("positive_factors") or ai_narrative.get("positive_aspects", []),
                    ai_insights=insights,
                    workflow_status=status,
                    current_node=state.get("current_node", "evaluate"),
                    chart_data=state.get("chart_data", {}),
                    is_llm_generated=ai_narrative.get("is_llm_generated", False),
                    data_provenance="INTERNAL",
                )
                if rec:
                    credit_repo.save_recommendation(
                        evaluation_id=eval_record.id,
                        company_id=int(cid) if str(cid).isdigit() else 1,
                        decision=rec.decision,
                        requested_amount=rec.requested_amount,
                        approved_amount=rec.approved_amount,
                        pricing_spread=rec.pricing_spread,
                        covenants=rec.covenants,
                        tenure_months=rec.tenure_months,
                    )
                audit_repo.log_event(
                    action="CREDIT_ANALYSIS_EXECUTED",
                    officer="LangGraph System",
                    company_id=int(cid) if str(cid).isdigit() else 1,
                    thread_id=thread_id,
                    new_state={"score": score, "risk_category": risk_cat, "status": status},
                    notes=f"Automated risk evaluation completed with status: {status}",
                )
        except Exception:
            pass

        return CreditRiskAnalyzeResponse(
            company_id=str(cid),
            company_name=company_name,
            credit_score=score,
            risk_category=risk_cat,
            credit_rating=state.get("credit_risk", {}).get("credit_rating", "BBB"),
            probability_of_default=p_def,
            metrics=metrics,
            risk_factors=state.get("risk_factors") or ai_narrative.get("key_concerns", []),
            positive_factors=state.get("positive_factors") or ai_narrative.get("positive_aspects", []),
            ai_insights=insights,
            recommendation=rec,
            human_review_required=human_req,
            human_approval=state.get("human_approval"),
            workflow_status=status,
            current_node=state.get("current_node", "evaluate"),
            thread_id=thread_id,
            chart_data=state.get("chart_data", {}),
            is_llm_generated=ai_narrative.get("is_llm_generated", False),
            source="INTERNAL",
            source_timestamp=now_iso,
        )

    async def submit_human_review(
        self,
        company_id: str,
        review: HumanReviewRequest,
    ) -> CreditRiskAnalyzeResponse:
        f_context = self.company_service.get_financial_context(company_id)
        cid = f_context.get("company_id") or company_id
        company_name = f_context.get("name") or f"Company {cid}"
        sector = f_context.get("sector") or "Diversified Corporates"

        thread_id = f"thread_comp_{cid}"
        config = {"configurable": {"thread_id": thread_id}}

        approval_payload = {
            "approved": review.approved,
            "notes": review.notes,
            "adjusted_category": review.adjusted_category,
            "officer": review.officer,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        # Update LangGraph checkpoint state
        loan_ai_graph.update_state(config, {"human_approval": approval_payload})

        # Resume LangGraph workflow from checkpoint
        resumed_state = loan_ai_graph.invoke(None, config=config)

        rec = None
        if resumed_state.get("loan_recommendation"):
            r = resumed_state["loan_recommendation"]
            rec = LoanRecommendationResult(
                decision=r.get("decision", "APPROVE_WITH_CONDITIONS" if review.approved else "REJECT"),
                requested_amount=r.get("requested_amount", 100_000_000.0),
                approved_amount=r.get("approved_amount", 0.0),
                pricing_spread=r.get("pricing_spread", "SOFR + 250 bps"),
                covenants=r.get("covenants", []),
                tenure_months=r.get("tenure_months", 36),
                decision_date=r.get("decision_date", datetime.now(timezone.utc).isoformat()),
            )

        now_iso = datetime.now(timezone.utc).isoformat()
        try:
            from ..db.session import SessionLocal
            from ..db.repositories.credit_repository import CreditRepository
            from ..db.repositories.audit_repository import AuditRepository
            with SessionLocal() as db:
                credit_repo = CreditRepository(db)
                audit_repo = AuditRepository(db)
                existing_eval = credit_repo.get_by_thread_id(thread_id)
                eval_id = existing_eval.id if existing_eval else 1
                
                credit_repo.save_human_review(
                    evaluation_id=eval_id,
                    company_id=int(cid) if str(cid).isdigit() else 1,
                    thread_id=thread_id,
                    officer=review.officer or "Corporate Credit Officer",
                    approved=review.approved,
                    notes=review.notes,
                    original_category=resumed_state.get("chart_data", {}).get("human_review", {}).get("original_category", "Medium"),
                    adjusted_category=review.adjusted_category,
                )
                
                if existing_eval:
                    existing_eval.workflow_status = "COMPLETED"
                    existing_eval.current_node = "recommend"
                    if review.adjusted_category:
                        existing_eval.risk_category = review.adjusted_category
                    db.commit()
                    
                if rec:
                    credit_repo.save_recommendation(
                        evaluation_id=eval_id,
                        company_id=int(cid) if str(cid).isdigit() else 1,
                        decision=rec.decision,
                        requested_amount=rec.requested_amount,
                        approved_amount=rec.approved_amount,
                        pricing_spread=rec.pricing_spread,
                        covenants=rec.covenants,
                        tenure_months=rec.tenure_months,
                    )
                    
                audit_repo.log_event(
                    action="HUMAN_REVIEW_DECISION",
                    officer=review.officer or "Corporate Credit Officer",
                    company_id=int(cid) if str(cid).isdigit() else 1,
                    thread_id=thread_id,
                    previous_state={"risk_category": resumed_state.get("chart_data", {}).get("human_review", {}).get("original_category", "Medium")},
                    new_state={"decision": "APPROVED" if review.approved else "REJECTED", "adjusted_category": review.adjusted_category},
                    notes=review.notes,
                )
        except Exception:
            pass

        return CreditRiskAnalyzeResponse(
            company_id=str(cid),
            company_name=company_name,
            credit_score=float(resumed_state.get("decision_score", 65.0)),
            risk_category=resumed_state.get("risk_category", "Medium"),
            credit_rating=resumed_state.get("credit_risk", {}).get("credit_rating", "BBB"),
            probability_of_default=float(resumed_state.get("credit_risk", {}).get("probability_of_default", 0.04)),
            metrics=resumed_state.get("financial_metrics", {}),
            risk_factors=resumed_state.get("risk_factors", []),
            positive_factors=resumed_state.get("positive_factors", []),
            ai_insights=resumed_state.get("ai_insights", []),
            recommendation=rec,
            human_review_required=False,
            human_approval=approval_payload,
            workflow_status="COMPLETED",
            current_node="recommend",
            thread_id=thread_id,
            chart_data=resumed_state.get("chart_data", {}),
            is_llm_generated=False,
            source="INTERNAL",
            source_timestamp=now_iso,
        )
