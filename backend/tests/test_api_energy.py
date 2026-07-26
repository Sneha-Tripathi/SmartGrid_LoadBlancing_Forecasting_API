import pytest


@pytest.mark.api
class TestEnergyEndpoints:
    def test_load_trend(self, client):
        response = client.get("/energy/load-trend")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "time" in data[0]
        assert "load" in data[0]

    def test_forecast(self, client):
        response = client.get("/energy/forecast")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "day" in data[0]
        assert "value" in data[0]

    def test_zones(self, client):
        response = client.get("/energy/zones")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "name" in data[0]
        assert "value" in data[0]

    def test_consumption(self, client):
        response = client.get("/energy/consumption")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "zone" in data[0]
        assert "power" in data[0]
