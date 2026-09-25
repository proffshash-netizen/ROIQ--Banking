"""
ROIQ-DT Banking System - LangGraph Credit Risk & Loan Workflow
Implements node-by-node execution with MemorySaver checkpointer and
Human-in-the-Loop (HITL) risk approval pauses.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional

try:
    from langgraph.graph import StateGraph, START, END
    from langgraph.checkpoint.memory import MemorySaver
    HAS_LANGGRAPH = True
except ImportError:
    HAS_LANGGRAPH = False

from app.ai.state import LoanAIState, HumanApproval


# ---------------------------------------------------------------------------
# Node 1: Ingest
# ---------------------------------------------------------------------------
def ingest_node(state: LoanAIState) -> LoanAIState:
    """
    Ingests raw customer data, extracts key balance sheet and income statement
    figures, and calculates initial baseline financial metrics and benchmark charts.
    """
    customer_data = state.get("customer_data", {})
    company_id = state.get("company_id") or customer_data.get("company_id") or "UNKNOWN"
    company_name = state.get("company_name") or customer_data.get("name") or f"Company {company_id}"
    sector = state.get("sector") or customer_data.get("sector") or "Diversified Corporates"

    # Financial extractions
    revenue = float(customer_data.get("revenue") or customer_data.get("income") or 450_000_000.0)
    ebitda = float(customer_data.get("ebitda") or (revenue * 0.22))
    total_debt = float(customer_data.get("existing_debt") or customer_data.get("total_debt") or 380_000_000.0)
    equity = float(customer_data.get("equity") or (total_debt * 0.65))
    cash_flow = float(customer_data.get("operating_cash_flow") or (ebitda * 0.85))
    interest_expense = float(customer_data.get("interest_expense") or (total_debt * 0.065))
    requested_loan = float(customer_data.get("requested_loan") or 120_000_000.0)

    # Calculate baseline ratios
    debt_to_equity = round(total_debt / max(equity, 1.0), 2)
    interest_coverage = round(ebitda / max(interest_expense, 1.0), 2)
    debt_to_ebitda = round(total_debt / max(ebitda, 1.0), 2)
    dscr = round(cash_flow / max(interest_expense + (requested_loan * 0.15), 1.0), 2)
    operating_margin = round((ebitda / max(revenue, 1.0)) * 100, 1)

    metrics = {
        "revenue": revenue,
        "ebitda": ebitda,
        "total_debt": total_debt,
        "equity": equity,
        "debt_to_equity": debt_to_equity,
        "interest_coverage": interest_coverage,
        "debt_to_ebitda": debt_to_ebitda,
        "dscr": dscr,
        "operating_margin_pct": operating_margin,
        "requested_loan": requested_loan,
    }

    # Initial ECharts radar representation for financial dimensions
    chart_data = {
        "step": "ingest",
        "radar": {
            "indicators": [
                {"name": "Liquidity", "max": 100},
                {"name": "Solvency", "max": 100},
                {"name": "Profitability", "max": 100},
                {"name": "Debt Service", "max": 100},
                {"name": "Cash Generation", "max": 100},
            ],
            "series": [
                {
                    "name": "Target Benchmark",
                    "value": [70, 75, 70, 80, 75],
                },
                {
                    "name": company_name,
                    "value": [
                        min(100, max(20, int(dscr * 45))),
                        min(100, max(20, int(100 - (debt_to_equity * 20)))),
                        min(100, max(20, int(operating_margin * 3.5))),
                        min(100, max(20, int(interest_coverage * 18))),
                        min(100, max(20, int((cash_flow / max(revenue, 1.0)) * 400))),
                    ],
                },
            ],
        },
        "metrics_bars": {
            "categories": ["D/E Ratio", "Interest Coverage", "Debt/EBITDA", "DSCR"],
            "actual": [debt_to_equity, interest_coverage, debt_to_ebitda, dscr],
            "benchmark": [2.0, 3.5, 3.2, 1.8],
        },
    }

    return {
        **state,
        "company_id": company_id,
        "company_name": company_name,
        "sector": sector,
        "financial_metrics": metrics,
        "chart_data": chart_data,
        "current_node": "ingest",
        "status": "RUNNING",
        "ai_insights": [
            f"Financial data normalized for {company_name}.",
            f"Reported D/E is {debt_to_equity}x (benchmark <= 2.0x) with DSCR {dscr}x.",
        ],
    }


# ---------------------------------------------------------------------------
# Node 2: Evaluate
# ---------------------------------------------------------------------------
def evaluate_node(state: LoanAIState) -> LoanAIState:
    """
    Computes corporate credit score, default probability, and distress risk index.
    Classifies company into risk categories (Low, Medium, High, Critical).
    """
    metrics = state.get("financial_metrics", {})
    debt_to_equity = float(metrics.get("debt_to_equity", 2.2))
    interest_coverage = float(metrics.get("interest_coverage", 2.5))
    dscr = float(metrics.get("dscr", 1.4))

    # Base scoring formula (0 - 100)
    score = 100.0
    score -= min(40.0, max(0.0, (debt_to_equity - 1.0) * 18.0))
    if interest_coverage < 3.0:
        score -= min(30.0, (3.0 - interest_coverage) * 12.0)
    if dscr < 1.6:
        score -= min(25.0, (1.6 - dscr) * 20.0)

    score = round(max(15.0, min(95.0, score)), 1)

    # Risk categorization
    if score >= 75.0:
        risk_category = "Low"
        rating = "A-"
        p_default = 0.018
    elif score >= 58.0:
        risk_category = "Medium"
        rating = "BBB"
        p_default = 0.042
    elif score >= 38.0:
        risk_category = "High"
        rating = "BB-"
        p_default = 0.095
    else:
        risk_category = "Critical"
        rating = "CCC"
        p_default = 0.185

    credit_risk = {
        "risk_level": risk_category,
        "credit_rating": rating,
        "probability_of_default": p_default,
        "z_score": round(1.2 + (score * 0.025), 2),
        "score": score,
    }

    # Enhanced ECharts option for risk factor decomposition
    chart_data = state.get("chart_data", {})
    chart_data["step"] = "evaluate"
    chart_data["gauge"] = {
        "score": score,
        "category": risk_category,
        "rating": rating,
    }
    chart_data["risk_breakdown"] = {
        "categories": ["Leverage Risk", "Coverage Risk", "Liquidity Risk", "Market Sensitivity"],
        "values": [
            min(100, int(debt_to_equity * 30)),
            min(100, int(max(10.0, 100 - (interest_coverage * 20)))),
            min(100, int(max(10.0, 100 - (dscr * 35)))),
            int(45 if risk_category == "Low" else 75 if risk_category == "Medium" else 88),
        ],
    }

    insights = list(state.get("ai_insights", []))
    insights.append(
        f"Underwriting model determined {risk_category} risk profile with decision score {score}/100."
    )
    if risk_category in ("High", "Medium", "Critical"):
        insights.append(
            f"Policy Rule Trigger: {risk_category} risk requires mandatory Senior Credit Officer review."
        )

    return {
        **state,
        "credit_risk": credit_risk,
        "risk_category": risk_category,
        "decision_score": score,
        "chart_data": chart_data,
        "current_node": "evaluate",
        "status": "RUNNING",
        "ai_insights": insights,
    }


# ---------------------------------------------------------------------------
# Routing Condition
# ---------------------------------------------------------------------------
def check_requires_human_review(state: LoanAIState) -> str:
    """
    Determines if human review is required.
    High and Medium risk profiles pause for human review.
    """
    category = state.get("risk_category", "High")
    if category in ("High", "Medium", "Critical"):
        return "human_review"
    return "recommend"


# ---------------------------------------------------------------------------
# Node 3: Human Review (HITL)
# ---------------------------------------------------------------------------
def human_review_node(state: LoanAIState) -> LoanAIState:
    """
    Processes the Risk Officer's approval, overrides, and audit notes.
    Runs when resumed after the interrupt_before trigger.
    """
    approval: HumanApproval = state.get("human_approval", {}) # type: ignore
    current_cat = state.get("risk_category", "High")
    adjusted = approval.get("adjusted_category")
    final_cat = adjusted if adjusted else current_cat
    is_approved = approval.get("approved", True)
    officer = approval.get("officer", "Senior Risk Officer")
    notes = approval.get("notes", "Decision authorized by credit committee.")

    insights = list(state.get("ai_insights", []))
    if adjusted and adjusted != current_cat:
        insights.append(f"Risk category adjusted from {current_cat} to {final_cat} by {officer}.")
    insights.append(f"Officer Notes: {notes} (Approved: {is_approved})")

    # Update chart data to reflect human review intervention
    chart_data = state.get("chart_data", {})
    chart_data["step"] = "human_review"
    chart_data["human_review"] = {
        "original_category": current_cat,
        "final_category": final_cat,
        "approved": is_approved,
        "officer": officer,
        "notes": notes,
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
    }

    return {
        **state,
        "risk_category": final_cat,
        "human_approval": approval,
        "chart_data": chart_data,
        "current_node": "human_review",
        "status": "RUNNING",
        "ai_insights": insights,
    }


# ---------------------------------------------------------------------------
# Node 4: Recommend
# ---------------------------------------------------------------------------
def recommend_node(state: LoanAIState) -> LoanAIState:
    """
    Synthesizes the finalized credit decision, interest rate pricing spread,
    covenants, and loan facility parameters.
    """
    risk_cat = state.get("risk_category", "Medium")
    approval = state.get("human_approval", {})
    is_officer_approved = approval.get("approved", True)
    metrics = state.get("financial_metrics", {})
    req_loan = float(metrics.get("requested_loan", 100_000_000.0))

    if not is_officer_approved or risk_cat == "Critical":
        decision = "REJECT"
        approved_amount = 0.0
        pricing = "N/A"
        covenants = [
            "Facility application denied due to high probability of default.",
            "Borrower may reapply following 2 consecutive quarters of audited deleveraging.",
        ]
        recommendations = [
            "Decline requested credit facility.",
            "Issue standard adverse notice letter specifying debt capacity breach.",
        ]
    elif risk_cat == "High":
        decision = "APPROVE_WITH_CONDITIONS"
        approved_amount = round(req_loan * 0.65, 2)
        pricing = "SOFR + 425 bps"
        covenants = [
            "Mandatory first lien on prime corporate property & inventory assets.",
            "Quarterly minimum DSCR covenant of >= 1.45x maintained throughout tenure.",
            "Restricted equity dividend payments until leverage ratio drops below 2.2x.",
        ]
        recommendations = [
            f"Conditionally approve reduced tranche of ${approved_amount / 1_000_000:.1f}M (65% of ask).",
            "Mandate monthly cash-flow reporting and escrow account for debt servicing.",
        ]
    elif risk_cat == "Medium":
        decision = "APPROVE_WITH_CONDITIONS"
        approved_amount = round(req_loan * 0.85, 2)
        pricing = "SOFR + 285 bps"
        covenants = [
            "Negative pledge on all unencumbered fixed assets.",
            "Semi-annual audited covenant compliance certificate required.",
            "Cap on additional unhedged foreign exchange borrowings above $25M.",
        ]
        recommendations = [
            f"Approve syndication tranche of ${approved_amount / 1_000_000:.1f}M with 50% asset backing.",
            "Execute standard interest rate collar to hedge variable rate exposure.",
        ]
    else:  # Low
        decision = "APPROVE"
        approved_amount = req_loan
        pricing = "SOFR + 165 bps"
        covenants = [
            "Annual audited financial statement delivery within 90 days of fiscal year end.",
            "Maintain investment-grade compliance standing.",
        ]
        recommendations = [
            f"Fully approve requested revolving credit facility of ${approved_amount / 1_000_000:.1f}M.",
            "Offer priority rate discount for treasury liquidity placement with bank.",
        ]

    loan_rec = {
        "decision": decision,
        "requested_amount": req_loan,
        "approved_amount": approved_amount,
        "pricing_spread": pricing,
        "covenants": covenants,
        "tenure_months": 36,
        "decision_date": datetime.now(timezone.utc).isoformat(),
    }

    # Final ECharts facility summary
    chart_data = state.get("chart_data", {})
    chart_data["step"] = "recommend"
    chart_data["recommendation"] = {
        "decision": decision,
        "approved_amount": approved_amount,
        "pricing": pricing,
    }
    chart_data["facility_donut"] = {
        "labels": ["Approved Tranche", "Risk Haircut", "Syndicated Reserve"],
        "values": [
            approved_amount,
            max(0.0, req_loan - approved_amount),
            round(approved_amount * 0.25, 2),
        ],
    }

    insights = list(state.get("ai_insights", []))
    insights.append(f"Final Decision: {decision} (${approved_amount / 1_000_000:.1f}M at {pricing}).")

    return {
        **state,
        "loan_recommendation": loan_rec,
        "recommendations": recommendations,
        "chart_data": chart_data,
        "current_node": "recommend",
        "status": "COMPLETED",
        "ai_insights": insights,
    }


# ---------------------------------------------------------------------------
# Workflow Builder
# ---------------------------------------------------------------------------
shared_memory_saver = MemorySaver() if HAS_LANGGRAPH else None


def create_loan_ai_graph(checkpointer: Optional[Any] = None):
    """
    Creates and compiles the LangGraph workflow with MemorySaver checkpointer
    and interrupt_before=['human_review'] for High/Medium risk profiles.
    """
    if not HAS_LANGGRAPH:
        class FallbackGraph:
            def __init__(self):
                self._states: Dict[str, LoanAIState] = {}

            def invoke(self, input_val: Optional[dict], config: dict) -> LoanAIState:
                tid = config.get("configurable", {}).get("thread_id", "default")
                st = self._states.get(tid, {}) if input_val is None else {**input_val}
                st = ingest_node(st)
                st = evaluate_node(st)
                if check_requires_human_review(st) == "human_review" and not st.get("human_approval"):
                    st["current_node"] = "human_review"
                    st["status"] = "PAUSED_FOR_APPROVAL"
                    self._states[tid] = st
                    return st
                st = human_review_node(st)
                st = recommend_node(st)
                self._states[tid] = st
                return st

            def get_state(self, config: dict):
                tid = config.get("configurable", {}).get("thread_id", "default")
                st = self._states.get(tid, {})
                class Snap:
                    def __init__(self, values, next_nodes):
                        self.values = values
                        self.next = next_nodes
                next_nodes = ("human_review",) if st.get("status") == "PAUSED_FOR_APPROVAL" else ()
                return Snap(st, next_nodes)

            def update_state(self, config: dict, values: dict, as_node: Optional[str] = None):
                tid = config.get("configurable", {}).get("thread_id", "default")
                curr = self._states.get(tid, {})
                curr.update(values)
                self._states[tid] = curr

        return FallbackGraph()

    g = StateGraph(LoanAIState)

    g.add_node("ingest", ingest_node)
    g.add_node("evaluate", evaluate_node)
    g.add_node("human_review", human_review_node)
    g.add_node("recommend", recommend_node)

    g.add_edge(START, "ingest")
    g.add_edge("ingest", "evaluate")
    g.add_conditional_edges(
        "evaluate",
        check_requires_human_review,
        {
            "human_review": "human_review",
            "recommend": "recommend",
        },
    )
    g.add_edge("human_review", "recommend")
    g.add_edge("recommend", END)

    cp = checkpointer or shared_memory_saver or MemorySaver()
    return g.compile(
        checkpointer=cp,
        interrupt_before=["human_review"],
    )


loan_ai_checkpointer = shared_memory_saver
loan_ai_graph = create_loan_ai_graph(loan_ai_checkpointer)