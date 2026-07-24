from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health_endpoints() -> None:
    for endpoint in ["/health", "/ready", "/live", "/api/v1/health/health"]:
        response = client.get(endpoint)
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "service" in data


def test_authentication_flow() -> None:
    # 1. Test invalid login
    login_fail = client.post(
        "/api/v1/auth/login",
        json={"username": "invalid_user", "password": "wrong_password"},
    )
    assert login_fail.status_code == 200  # returns standard error structure
    assert login_fail.json()["success"] is False
    assert login_fail.json()["error"]["code"] == "authentication_error"

    # 2. Test successful login
    login_success = client.post(
        "/api/v1/auth/login", json={"username": "admin", "password": "password"}
    )
    assert login_success.status_code == 200
    res_data = login_success.json()
    assert res_data["success"] is True
    assert "access_token" in res_data["data"]
    assert res_data["data"]["role"] == "Admin"

    token = res_data["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Test /me endpoint
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["data"]["username"] == "admin"
    assert me_resp.json()["data"]["role"] == "Admin"


def test_role_authorization() -> None:
    # Get analyst token
    analyst_login = client.post(
        "/api/v1/auth/login", json={"username": "analyst", "password": "password"}
    )
    analyst_token = analyst_login.json()["data"]["access_token"]

    # Get viewer token
    viewer_login = client.post(
        "/api/v1/auth/login", json={"username": "viewer", "password": "password"}
    )
    viewer_token = viewer_login.json()["data"]["access_token"]

    # Analyst calls /analysis/company -> Allowed
    analyst_headers = {"Authorization": f"Bearer {analyst_token}"}
    response_analyst = client.post(
        "/api/v1/analysis/company",
        json={
            "company_id": "AAPL",
            "include_risk": True,
            "include_explainability": False,
        },
        headers=analyst_headers,
    )
    assert response_analyst.status_code == 200
    assert response_analyst.json()["success"] is True

    # Viewer calls /analysis/company -> Forbidden
    viewer_headers = {"Authorization": f"Bearer {viewer_token}"}
    response_viewer = client.post(
        "/api/v1/analysis/company",
        json={
            "company_id": "AAPL",
            "include_risk": True,
            "include_explainability": False,
        },
        headers=viewer_headers,
    )
    assert response_viewer.status_code == 403


def test_dashboard_echarts_contract() -> None:
    login_resp = client.post(
        "/api/v1/auth/login", json={"username": "viewer", "password": "password"}
    )
    token = login_resp.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/dashboard/overview", headers=headers)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True

    # Verify ECharts contracts structure
    widgets = res_data["data"]["widgets"]
    assert len(widgets) > 0
    config = widgets[0]["config"]
    assert "xAxis" in config
    assert "yAxis" in config
    assert "series" in config


def test_sse_streaming() -> None:
    response = client.get("/api/v1/stream")
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
