import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.mark.websocket
class TestWebSocket:
    def test_websocket_connect_and_receive(self):
        client = TestClient(app)
        with client.websocket_connect("/ws") as ws:
            data = ws.receive_json()
            assert data is not None
            assert "current_load" in data
            assert "peak_load" in data
            assert "active_zones" in data
            assert "grid_health" in data
            assert "status" in data
            assert "timestamp" in data

    def test_websocket_receives_live_data(self):
        client = TestClient(app)
        with client.websocket_connect("/ws") as ws:
            data = ws.receive_json()
            assert isinstance(data["current_load"], float)
            assert isinstance(data["peak_load"], float)
            assert isinstance(data["active_zones"], int)
            assert isinstance(data["grid_health"], int)
            assert data["status"] in ["Normal", "Warning", "Critical"]

    def test_websocket_receives_analytics_data(self):
        client = TestClient(app)
        with client.websocket_connect("/ws") as ws:
            data = ws.receive_json()
            assert "analytics" in data
            analytics = data["analytics"]
            assert "today_energy" in analytics
            assert "weekly_usage" in analytics
            assert "monthly_usage" in analytics
            assert "prediction_accuracy" in analytics
            assert "carbon_saved" in analytics
            assert "ai_efficiency" in analytics

    def test_websocket_receives_chart_data(self):
        client = TestClient(app)
        with client.websocket_connect("/ws") as ws:
            data = ws.receive_json()
            assert "chart_data" in data
            chart = data["chart_data"]
            assert "load_trend" in chart
            assert "forecast" in chart
            assert "consumption" in chart
            assert "zones" in chart

    def test_websocket_multiple_messages(self):
        client = TestClient(app)
        with client.websocket_connect("/ws") as ws:
            data1 = ws.receive_json()
            data2 = ws.receive_json()
            assert data1 != data2  # Different timestamps
            assert data1["timestamp"] != data2["timestamp"]
