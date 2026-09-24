from langgraph.graph import StateGraph, START, END

from app.ai.state import LoanAIState


def analyze_credit_risk(state: LoanAIState) -> LoanAIState:
    """
    Placeholder node for credit-risk analysis.

    We are using mock data for now.
    Later, this node can be connected to the
    project's actual credit-risk logic.
    """

    customer_data = state.get("customer_data", {})

    # Temporary mock calculation
    income = float(customer_data.get("income", 0))
    existing_debt = float(customer_data.get("existing_debt", 0))

    if income <= 0:
        risk = "unknown"
    elif existing_debt / income < 0.4:
        risk = "low"
    else:
        risk = "high"

    return {
        **state,
        "credit_risk": {
            "risk_level": risk,
            "income": income,
            "existing_debt": existing_debt,
        },
    }


def calculate_decision_score(state: LoanAIState) -> LoanAIState:
    """
    Temporary decision-score node.

    This is only for testing the LangGraph connection.
    We will later connect this to the project's
    actual decision-score/business logic.
    """

    risk_level = state.get("credit_risk", {}).get("risk_level")

    if risk_level == "low":
        score = 80.0
    elif risk_level == "high":
        score = 40.0
    else:
        score = 0.0

    return {
        **state,
        "decision_score": score,
    }


def create_loan_ai_graph():
    """
    Creates and compiles the LangGraph workflow.
    """

    graph = StateGraph(LoanAIState)

    graph.add_node("credit_risk", analyze_credit_risk)
    graph.add_node("decision_score", calculate_decision_score)

    graph.add_edge(START, "credit_risk")
    graph.add_edge("credit_risk", "decision_score")
    graph.add_edge("decision_score", END)

    return graph.compile()


loan_ai_graph = create_loan_ai_graph()