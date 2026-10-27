import pytest
from backend.app.ai.graph import create_loan_ai_graph, loan_ai_graph


def test_langgraph_low_risk_flow():
    """LOW: INGEST -> EVALUATE -> RECOMMEND -> END (No human pause required)."""
    low_risk_data = {
        "company_id": "LOW_TEST",
        "company_name": "Prime Corporate AAA",
        "sector": "Technology",
        "customer_data": {
            "revenue": 500_000_000.0,
            "ebitda": 200_000_000.0,
            "existing_debt": 50_000_000.0,
            "equity": 300_000_000.0,
            "operating_cash_flow": 180_000_000.0,
            "interest_expense": 3_000_000.0,
            "requested_loan": 40_000_000.0,
        },
    }

    config = {"configurable": {"thread_id": "thread_low_test"}}
    result = loan_ai_graph.invoke(low_risk_data, config=config)

    assert result["risk_category"] == "Low"
    assert result["decision_score"] >= 75.0
    assert result["human_review_required"] is False
    assert result["status"] == "COMPLETED"
    assert result["loan_recommendation"]["decision"] == "APPROVE"
    assert result["loan_recommendation"]["approved_amount"] == 40_000_000.0


def test_langgraph_medium_risk_approval_flow():
    """MEDIUM: INGEST -> EVALUATE -> HUMAN REVIEW -> APPROVE -> RECOMMEND -> END."""
    med_risk_data = {
        "company_id": "MED_TEST",
        "company_name": "Midcorp Manufacturing Ltd",
        "sector": "Manufacturing",
        "customer_data": {
            "revenue": 200_000_000.0,
            "ebitda": 25_000_000.0,
            "existing_debt": 180_000_000.0,
            "equity": 100_000_000.0,
            "operating_cash_flow": 20_000_000.0,
            "interest_expense": 12_000_000.0,
            "requested_loan": 40_000_000.0,
        },
    }

    thread_id = "thread_medium_approve_test"
    config = {"configurable": {"thread_id": thread_id}}

    # Step 1: Pauses before human_review
    paused_state = loan_ai_graph.invoke(med_risk_data, config=config)
    assert paused_state["risk_category"] in ("Medium", "High")
    assert paused_state["human_review_required"] is True

    # Step 2: Officer Approves
    approval_payload = {
        "approved": True,
        "notes": "Approved with negative pledge and covenant review.",
        "adjusted_category": "Medium",
        "officer": "Senior Risk Officer",
    }
    loan_ai_graph.update_state(config, {"human_approval": approval_payload})

    # Step 3: Resumes to recommend
    resumed_state = loan_ai_graph.invoke(None, config=config)
    assert resumed_state["status"] == "COMPLETED"
    assert resumed_state["human_approval"]["approved"] is True
    assert resumed_state["loan_recommendation"]["decision"] == "APPROVE_WITH_CONDITIONS"
    assert resumed_state["loan_recommendation"]["approved_amount"] > 0


def test_langgraph_high_risk_rejection_flow():
    """HIGH: INGEST -> EVALUATE -> HUMAN REVIEW -> REJECT -> END."""
    high_risk_data = {
        "company_id": "HIGH_TEST",
        "company_name": "Leveraged Metals Corp",
        "sector": "Mining",
        "customer_data": {
            "revenue": 180_000_000.0,
            "ebitda": 22_000_000.0,
            "existing_debt": 160_000_000.0,
            "equity": 35_000_000.0,
            "operating_cash_flow": 15_000_000.0,
            "interest_expense": 17_000_000.0,
            "requested_loan": 50_000_000.0,
        },
    }

    thread_id = "thread_high_reject_test"
    config = {"configurable": {"thread_id": thread_id}}

    paused_state = loan_ai_graph.invoke(high_risk_data, config=config)
    assert paused_state["human_review_required"] is True

    rejection_payload = {
        "approved": False,
        "notes": "Declined due to excessive leverage and insufficient DSCR headroom.",
        "officer": "Credit Committee Chair",
    }
    loan_ai_graph.update_state(config, {"human_approval": rejection_payload})

    resumed_state = loan_ai_graph.invoke(None, config=config)
    assert resumed_state["status"] == "COMPLETED"
    assert resumed_state["loan_recommendation"]["decision"] == "REJECT"
    assert resumed_state["loan_recommendation"]["approved_amount"] == 0.0


def test_langgraph_critical_risk_rejection_flow():
    """CRITICAL: INGEST -> EVALUATE -> HUMAN REVIEW -> REJECT -> END."""
    critical_data = {
        "company_id": "CRITICAL_TEST",
        "company_name": "Distressed Media PLC",
        "sector": "Media",
        "customer_data": {
            "revenue": 50_000_000.0,
            "ebitda": 2_000_000.0,
            "existing_debt": 110_000_000.0,
            "equity": 5_000_000.0,
            "operating_cash_flow": 1_000_000.0,
            "interest_expense": 10_000_000.0,
            "requested_loan": 30_000_000.0,
        },
    }

    thread_id = "thread_crit_reject_test"
    config = {"configurable": {"thread_id": thread_id}}

    paused_state = loan_ai_graph.invoke(critical_data, config=config)
    assert paused_state["human_review_required"] is True

    rejection_payload = {
        "approved": False,
        "notes": "Critical risk profile - severe insolvency concerns.",
        "officer": "Risk Committee Chair",
    }
    loan_ai_graph.update_state(config, {"human_approval": rejection_payload})

    resumed_state = loan_ai_graph.invoke(None, config=config)
    assert resumed_state["status"] == "COMPLETED"
    assert resumed_state["loan_recommendation"]["decision"] == "REJECT"
    assert resumed_state["loan_recommendation"]["approved_amount"] == 0.0


def test_langgraph_pause_backend_restart_resume_same_thread():
    """
    PAUSE -> BACKEND RESTART -> SAME THREAD_ID -> RESUME:
    Verifies that state persists across separate graph compilations (simulating backend reboot).
    """
    thread_id = "thread_reboot_persistence_test_99"
    config = {"configurable": {"thread_id": thread_id}}

    # 1. Run on first graph instance before restart
    data = {
        "company_id": "REBOOT_TEST",
        "company_name": "Reboot Resilience Inc",
        "sector": "Infrastructure",
        "customer_data": {
            "revenue": 300_000_000.0,
            "ebitda": 35_000_000.0,
            "existing_debt": 240_000_000.0,
            "equity": 120_000_000.0,
            "operating_cash_flow": 28_000_000.0,
            "interest_expense": 18_000_000.0,
            "requested_loan": 50_000_000.0,
        },
    }
    initial_paused = loan_ai_graph.invoke(data, config=config)
    assert initial_paused["human_review_required"] is True

    # 2. Simulate Backend Restart by creating a brand-new compiled graph instance
    rebooted_graph = create_loan_ai_graph()

    # 3. Retrieve state from the restarted graph using the exact same thread_id
    rebooted_state = rebooted_graph.get_state(config)
    assert rebooted_state is not None
    assert rebooted_state.values.get("company_name") == "Reboot Resilience Inc"

    # 4. Resume the workflow on the restarted graph instance
    rebooted_graph.update_state(config, {
        "human_approval": {
            "approved": True,
            "notes": "Approved after server reboot verification.",
            "officer": "Lead Underwriter",
        }
    })
    resumed = rebooted_graph.invoke(None, config=config)

    assert resumed["status"] == "COMPLETED"
    assert resumed["human_approval"]["approved"] is True
    assert resumed["loan_recommendation"]["decision"] == "APPROVE_WITH_CONDITIONS"
    assert resumed["loan_recommendation"]["approved_amount"] > 0
