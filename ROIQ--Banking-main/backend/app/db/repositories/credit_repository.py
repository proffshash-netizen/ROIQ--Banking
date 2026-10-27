"""Credit risk and loan recommendation repository interacting with SQLAlchemy models."""

from typing import Any, Optional
from sqlalchemy.orm import Session
from ..models import (
    CreditEvaluationModel,
    HumanReviewDecisionModel,
    LoanRecommendationModel,
)


class CreditRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def save_evaluation(
        self,
        company_id: int,
        thread_id: str,
        credit_score: float,
        risk_category: str,
        credit_rating: str,
        probability_of_default: float,
        metrics: Optional[dict[str, Any]] = None,
        risk_factors: Optional[list[str]] = None,
        positive_factors: Optional[list[str]] = None,
        ai_insights: Optional[list[str]] = None,
        workflow_status: str = "COMPLETED",
        current_node: str = "recommend",
        chart_data: Optional[dict[str, Any]] = None,
        is_llm_generated: bool = False,
        data_provenance: str = "INTERNAL",
    ) -> CreditEvaluationModel:
        # Check if an evaluation already exists for this thread
        eval_record = (
            self.db.query(CreditEvaluationModel)
            .filter(CreditEvaluationModel.thread_id == thread_id)
            .first()
        )

        if not eval_record:
            eval_record = CreditEvaluationModel(
                company_id=company_id,
                thread_id=thread_id,
                credit_score=credit_score,
                risk_category=risk_category,
                credit_rating=credit_rating,
                probability_of_default=probability_of_default,
                metrics=metrics,
                risk_factors=risk_factors,
                positive_factors=positive_factors,
                ai_insights=ai_insights,
                workflow_status=workflow_status,
                current_node=current_node,
                chart_data=chart_data,
                is_llm_generated=is_llm_generated,
                data_provenance=data_provenance,
            )
            self.db.add(eval_record)
        else:
            eval_record.credit_score = credit_score
            eval_record.risk_category = risk_category
            eval_record.credit_rating = credit_rating
            eval_record.probability_of_default = probability_of_default
            eval_record.metrics = metrics
            eval_record.risk_factors = risk_factors
            eval_record.positive_factors = positive_factors
            eval_record.ai_insights = ai_insights
            eval_record.workflow_status = workflow_status
            eval_record.current_node = current_node
            eval_record.chart_data = chart_data
            eval_record.is_llm_generated = is_llm_generated
            eval_record.data_provenance = data_provenance

        self.db.commit()
        self.db.refresh(eval_record)
        return eval_record

    def save_recommendation(
        self,
        evaluation_id: int,
        company_id: int,
        decision: str,
        requested_amount: float,
        approved_amount: float,
        pricing_spread: str,
        covenants: Optional[list[str]] = None,
        tenure_months: int = 36,
    ) -> LoanRecommendationModel:
        rec = (
            self.db.query(LoanRecommendationModel)
            .filter(LoanRecommendationModel.evaluation_id == evaluation_id)
            .first()
        )
        if not rec:
            rec = LoanRecommendationModel(
                evaluation_id=evaluation_id,
                company_id=company_id,
                decision=decision,
                requested_amount=requested_amount,
                approved_amount=approved_amount,
                pricing_spread=pricing_spread,
                covenants=covenants,
                tenure_months=tenure_months,
            )
            self.db.add(rec)
        else:
            rec.decision = decision
            rec.requested_amount = requested_amount
            rec.approved_amount = approved_amount
            rec.pricing_spread = pricing_spread
            rec.covenants = covenants
            rec.tenure_months = tenure_months

        self.db.commit()
        self.db.refresh(rec)
        return rec

    def save_human_review(
        self,
        evaluation_id: int,
        company_id: int,
        thread_id: str,
        officer: str,
        approved: bool,
        notes: str,
        original_category: str,
        adjusted_category: Optional[str] = None,
    ) -> HumanReviewDecisionModel:
        review = HumanReviewDecisionModel(
            evaluation_id=evaluation_id,
            company_id=company_id,
            thread_id=thread_id,
            officer=officer,
            approved=approved,
            notes=notes,
            original_category=original_category,
            adjusted_category=adjusted_category,
        )
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review

    def get_latest_by_company(self, company_id: int) -> Optional[CreditEvaluationModel]:
        return (
            self.db.query(CreditEvaluationModel)
            .filter(CreditEvaluationModel.company_id == company_id)
            .order_by(CreditEvaluationModel.id.desc())
            .first()
        )

    def get_by_thread_id(self, thread_id: str) -> Optional[CreditEvaluationModel]:
        return (
            self.db.query(CreditEvaluationModel)
            .filter(CreditEvaluationModel.thread_id == thread_id)
            .first()
        )

    def get_latest_recommendation_by_company(self, company_id: int) -> Optional[LoanRecommendationModel]:
        return (
            self.db.query(LoanRecommendationModel)
            .filter(LoanRecommendationModel.company_id == company_id)
            .order_by(LoanRecommendationModel.id.desc())
            .first()
        )

    def get_latest_human_review_by_company(self, company_id: int) -> Optional[HumanReviewDecisionModel]:
        return (
            self.db.query(HumanReviewDecisionModel)
            .filter(HumanReviewDecisionModel.company_id == company_id)
            .order_by(HumanReviewDecisionModel.id.desc())
            .first()
        )
