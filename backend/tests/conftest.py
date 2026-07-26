import pytest
import uuid
from fastapi.testclient import TestClient

from app.main import app
from app.websocket import manager


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def auth_headers(client):
    unique_id = uuid.uuid4().hex[:8]
    register_payload = {
        "name": "Test User",
        "email": f"testuser-{unique_id}@example.com",
        "password": "testpass123",
    }
    resp = client.post("/auth/register", json=register_payload)
    assert resp.status_code == 201, f"Registration failed: {resp.json()}"
    data = resp.json()
    access_token = data["access_token"]
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def admin_headers(client):
    login_payload = {"email": "admin@smartgrid.com", "password": "admin123"}
    resp = client.post("/auth/login", json=login_payload)
    assert resp.status_code == 200
    data = resp.json()
    access_token = data["access_token"]
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def sample_meter_payload():
    return {
        "meter_id": "MTR-TEST-9999",
        "zone": "North Zone",
        "location": "Test Building, Floor 1",
        "load": "1.50 MW",
        "voltage": "230 V",
        "frequency": "50.0 Hz",
        "current": "6.5 A",
        "power_factor": "0.95",
        "status": "Normal",
        "type": "Smart Meter",
        "install_date": "2025-01-01",
        "last_maintenance": "2025-06-15",
        "consumer": "Test Consumer",
    }


@pytest.fixture
def clear_ws_connections():
    manager.active_connections.clear()
    yield
    manager.active_connections.clear()
