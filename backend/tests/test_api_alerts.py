import pytest


@pytest.mark.api
class TestAlertsEndpoints:
    def test_get_alerts(self, client):
        response = client.get("/alerts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_alert_fields(self, client):
        response = client.get("/alerts")
        data = response.json()
        for alert in data:
            assert "title" in alert
            assert "zone" in alert
            assert "time" in alert
