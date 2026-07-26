"""
Unit Tests for Smart Grid Load Balancing API

Uses FastAPI TestClient with an isolated SQLite database per test function.
Tests all CRUD operations for meter data and alerts.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app, get_db
from database import Base

TEST_DATABASE_URL = "sqlite:///./test_smart_grid.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def sample_meter_data():
    return {"voltage": 230.5, "current": 5.8, "power": 1336.9, "frequency": 50.0}


@pytest.fixture
def sample_alert_data():
    return {"zone": "Zone A", "load": 1336.9, "status": "CRITICAL"}


class TestMeterData:

    def test_create_meter_data(self, sample_meter_data):
        response = client.post("/meter-data", json=sample_meter_data)
        assert response.status_code == 201
        data = response.json()
        assert data["voltage"] == sample_meter_data["voltage"]
        assert data["current"] == sample_meter_data["current"]
        assert data["power"] == sample_meter_data["power"]
        assert data["frequency"] == sample_meter_data["frequency"]
        assert "id" in data
        assert "timestamp" in data

    def test_get_all_meter_data(self, sample_meter_data):
        client.post("/meter-data", json=sample_meter_data)
        response = client.get("/meter-data")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1

    def test_get_meter_data_by_id(self, sample_meter_data):
        create_resp = client.post("/meter-data", json=sample_meter_data)
        meter_id = create_resp.json()["id"]
        response = client.get(f"/meter-data/{meter_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == meter_id
        assert data["voltage"] == sample_meter_data["voltage"]

    def test_get_meter_data_not_found(self):
        response = client.get("/meter-data/99999")
        assert response.status_code == 404
        assert response.json()["error"] == "Record not found"

    def test_update_meter_data(self, sample_meter_data):
        create_resp = client.post("/meter-data", json=sample_meter_data)
        meter_id = create_resp.json()["id"]
        update_payload = {"voltage": 240.0, "current": 6.2, "power": 1488.0, "frequency": 50.1}
        response = client.put(f"/meter-data/{meter_id}", json=update_payload)
        assert response.status_code == 200
        data = response.json()
        assert data["voltage"] == update_payload["voltage"]
        assert data["current"] == update_payload["current"]
        assert data["power"] == update_payload["power"]
        assert data["frequency"] == update_payload["frequency"]

    def test_update_meter_data_not_found(self):
        update_payload = {"voltage": 240.0, "current": 6.2, "power": 1488.0, "frequency": 50.1}
        response = client.put("/meter-data/99999", json=update_payload)
        assert response.status_code == 404
        assert response.json()["error"] == "Record not found"

    def test_delete_meter_data(self, sample_meter_data):
        create_resp = client.post("/meter-data", json=sample_meter_data)
        meter_id = create_resp.json()["id"]
        response = client.delete(f"/meter-data/{meter_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Record deleted successfully"
        get_resp = client.get(f"/meter-data/{meter_id}")
        assert get_resp.status_code == 404

    def test_delete_meter_data_not_found(self):
        response = client.delete("/meter-data/99999")
        assert response.status_code == 404

    def test_create_meter_data_validation_error(self):
        invalid_payload = {"voltage": 600, "current": 5.8, "power": 1336.9, "frequency": 50.0}
        response = client.post("/meter-data", json=invalid_payload)
        assert response.status_code == 422


class TestAlerts:

    def test_create_alert(self, sample_alert_data):
        response = client.post("/alerts", json=sample_alert_data)
        assert response.status_code == 201
        data = response.json()
        assert data["zone"] == sample_alert_data["zone"]
        assert data["load"] == sample_alert_data["load"]
        assert data["status"] == sample_alert_data["status"]
        assert "id" in data

    def test_get_all_alerts(self, sample_alert_data):
        client.post("/alerts", json=sample_alert_data)
        response = client.get("/alerts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1

    def test_get_alert_by_id(self, sample_alert_data):
        create_resp = client.post("/alerts", json=sample_alert_data)
        alert_id = create_resp.json()["id"]
        response = client.get(f"/alerts/{alert_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == alert_id
        assert data["status"] == sample_alert_data["status"]

    def test_get_alert_not_found(self):
        response = client.get("/alerts/99999")
        assert response.status_code == 404
        assert response.json()["error"] == "Alert not found"

    def test_filter_alerts_by_status(self, sample_alert_data):
        warning_data = sample_alert_data.copy()
        warning_data["status"] = "WARNING"
        client.post("/alerts", json=warning_data)
        critical_data = sample_alert_data.copy()
        critical_data["status"] = "CRITICAL"
        client.post("/alerts", json=critical_data)
        response = client.get("/alerts/status/WARNING")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["status"] == "WARNING"
        response = client.get("/alerts/status/CRITICAL")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["status"] == "CRITICAL"

    def test_delete_alert(self, sample_alert_data):
        create_resp = client.post("/alerts", json=sample_alert_data)
        alert_id = create_resp.json()["id"]
        response = client.delete(f"/alerts/{alert_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Alert Deleted Successfully"
        get_resp = client.get(f"/alerts/{alert_id}")
        assert get_resp.status_code == 404

    def test_delete_alert_not_found(self):
        response = client.delete("/alerts/99999")
        assert response.status_code == 404
