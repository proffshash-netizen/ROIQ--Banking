"""ROIQ Banking Platform - Production Database Models (SQLAlchemy 2.0).

Defines persistent entities for:
- Companies
- Financial data
- Credit evaluations
- Risk assessments
- Loan recommendations
- Human review decisions
- Immutable audit logs
"""

from datetime import datetime, timezone
from typing import Any, Optional
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class CompanyModel(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    sector = Column(String(100), nullable=False, index=True)
    country = Column(String(100), default="India")
    founded = Column(Integer, default=2000)
    revenue = Column(String(100), default="₹0 Cr")
    employees = Column(String(100), default="~10,000")
    credit_score = Column(Integer, default=70)
    risk_level = Column(String(50), default="medium", index=True)  # low, medium, high, critical
    loan_exposure = Column(String(100), default="$100M")
    status = Column(String(50), default="processing")
    module = Column(String(100), default="Credit Risk")
    progress = Column(Integer, default=100)
    eta = Column(String(50), default="Done")
    last_analysis = Column(String(100), default="Just now")
    ceo = Column(String(255), default="Executive Officer")
    hq = Column(String(255), default="Corporate HQ")
    symbol = Column(String(50), nullable=True, index=True)
    exchange = Column(String(50), nullable=True)
    raw_financials = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    evaluations = relationship("CreditEvaluationModel", back_populates="company", cascade="all, delete-orphan")
    financial_data = relationship("FinancialDataModel", back_populates="company", uselist=False, cascade="all, delete-orphan")
    audit_logs = relationship("AuditLogModel", back_populates="company", cascade="all, delete-orphan")


class FinancialDataModel(Base):
    __tablename__ = "financial_data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    balance_sheet = Column(JSON, nullable=True)
    income_statement = Column(JSON, nullable=True)
    cash_flow = Column(JSON, nullable=True)
    ratios = Column(JSON, nullable=True)
    market_fx_data = Column(JSON, nullable=True)
    data_source = Column(String(50), default="INTERNAL")  # INTERNAL, FRED, FMP, FINNHUB, FALLBACK
    source_timestamp = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    company = relationship("CompanyModel", back_populates="financial_data")


class CreditEvaluationModel(Base):
    __tablename__ = "credit_evaluations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    thread_id = Column(String(255), nullable=False, index=True)
    credit_score = Column(Float, nullable=False)
    risk_category = Column(String(50), nullable=False, index=True)  # Low, Medium, High, Critical
    credit_rating = Column(String(20), nullable=False)  # AAA, AA, A, BBB, BB, CCC
    probability_of_default = Column(Float, nullable=False)
    metrics = Column(JSON, nullable=True)
    risk_factors = Column(JSON, nullable=True)
    positive_factors = Column(JSON, nullable=True)
    ai_insights = Column(JSON, nullable=True)
    workflow_status = Column(String(50), default="COMPLETED")  # RUNNING, PAUSED_FOR_APPROVAL, COMPLETED
    current_node = Column(String(50), default="recommend")
    chart_data = Column(JSON, nullable=True)
    is_llm_generated = Column(Boolean, default=False)
    data_provenance = Column(String(50), default="INTERNAL")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    company = relationship("CompanyModel", back_populates="evaluations")
    recommendation = relationship("LoanRecommendationModel", back_populates="evaluation", uselist=False, cascade="all, delete-orphan")
    human_reviews = relationship("HumanReviewDecisionModel", back_populates="evaluation", cascade="all, delete-orphan")


class LoanRecommendationModel(Base):
    __tablename__ = "loan_recommendations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    evaluation_id = Column(Integer, ForeignKey("credit_evaluations.id", ondelete="CASCADE"), nullable=False, unique=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    decision = Column(String(50), nullable=False)  # APPROVE, APPROVE_WITH_CONDITIONS, REJECT
    requested_amount = Column(Float, default=0.0)
    approved_amount = Column(Float, default=0.0)
    pricing_spread = Column(String(100), default="SOFR + 250 bps")
    covenants = Column(JSON, nullable=True)
    tenure_months = Column(Integer, default=36)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    evaluation = relationship("CreditEvaluationModel", back_populates="recommendation")


class HumanReviewDecisionModel(Base):
    __tablename__ = "human_review_decisions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    evaluation_id = Column(Integer, ForeignKey("credit_evaluations.id", ondelete="CASCADE"), nullable=False, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    thread_id = Column(String(255), nullable=False, index=True)
    officer = Column(String(255), nullable=False)
    approved = Column(Boolean, nullable=False)
    notes = Column(Text, nullable=False)
    original_category = Column(String(50), nullable=False)
    adjusted_category = Column(String(50), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), default=utc_now)

    evaluation = relationship("CreditEvaluationModel", back_populates="human_reviews")


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True, index=True)
    thread_id = Column(String(255), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)  # e.g. ANALYZE_TRIGGERED, HUMAN_REVIEW_SUBMITTED
    officer = Column(String(255), nullable=False)
    previous_state = Column(JSON, nullable=True)
    new_state = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, index=True)

    company = relationship("CompanyModel", back_populates="audit_logs")
