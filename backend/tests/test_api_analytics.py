import pytest


@pytest.mark.api
class TestAnalyticsEndpoints:
    def test_today_energy(self, client):
        response = client.get("/analytics/today-energy")
        assert response.status_code == 200
        data = response.json()
        assert "value" in data
        assert "unit" in data
        assert data["unit"] == "MWh"

    def test_weekly_usage(self, client):
        response = client.get("/analytics/weekly-usage")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 7
        assert "day" in data[0]
        assert "usage" in data[0]

    def test_monthly_usage(self, client):
        response = client.get("/analytics/monthly-usage")
        assert response.status_code == 200
        data = response.json()
        assert "value" in data
        assert data["unit"] == "MWh"

    def test_prediction_accuracy(self, client):
        response = client.get("/analytics/prediction-accuracy")
        assert response.status_code == 200
        data = response.json()
        assert "value" in data
        assert data["unit"] == "%"

    def test_carbon_saved(self, client):
        response = client.get("/analytics/carbon-saved")
        assert response.status_code == 200
        data = response.json()
        assert "value" in data
        assert "unit" in data
        assert data["trend"] == "up"

    def test_ai_efficiency(self, client):
        response = client.get("/analytics/ai-efficiency")
        assert response.status_code == 200
        data = response.json()
        assert "value" in data
        assert data["unit"] == "%"

    def test_forecast_hourly(self, client):
        response = client.get("/analytics/forecast/hourly")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 24
        assert "time" in data[0]
        assert "predicted" in data[0]
        assert "confidence" in data[0]

    def test_forecast_daily(self, client):
        response = client.get("/analytics/forecast/daily")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 7
        assert "day" in data[0]
        assert "predicted" in data[0]

    def test_forecast_peak_load(self, client):
        response = client.get("/analytics/forecast/peak-load")
        assert response.status_code == 200
        data = response.json()
        assert "predicted_peak" in data
        assert "unit" in data
        assert "confidence" in data

    def test_forecast_confidence(self, client):
        response = client.get("/analytics/forecast/confidence")
        assert response.status_code == 200
        data = response.json()
        assert "overall" in data
        assert "model_version" in data

    def test_recommendations(self, client):
        response = client.get("/analytics/recommendations")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "id" in data[0]
        assert "title" in data[0]
        assert "impact" in data[0]
