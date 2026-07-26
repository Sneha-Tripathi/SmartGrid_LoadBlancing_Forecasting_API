import pytest


@pytest.mark.api
class TestDashboardEndpoints:
    def test_dashboard_cards(self, client):
        response = client.get("/dashboard/cards")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)
        assert "current_load" in data
        assert "peak_load" in data
        assert "active_zones" in data
        assert "grid_health" in data

    def test_activity(self, client):
        response = client.get("/activity")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "time" in data[0]
        assert "event" in data[0]
