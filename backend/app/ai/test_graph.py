from app.ai.graph import loan_ai_graph


mock_data = {
    "customer_data": {
        "income": 500000,
        "existing_debt": 100000
    }
}

result = loan_ai_graph.invoke(mock_data)

print("\n--- LANGGRAPH TEST RESULT ---")
print("Credit Risk:")
print(result["credit_risk"])

print("\nDecision Score:")
print(result["decision_score"])