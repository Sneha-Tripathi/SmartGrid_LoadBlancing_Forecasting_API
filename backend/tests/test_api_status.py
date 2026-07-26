import pytest


@pytest.mark.api
class TestStatusEndpoint:
    def test_status_returns_200(self, client):
        response = client.get("/status")
        assert response.status_code == 200

    def test_status_returns_correct_fields(self, client):
        response = client.get("/status")
        data = response.json()
        assert "backend" in data
        assert "database" in data
        assert "ai" in data
        assert data["backend"] == "Online"

    def test_root_returns_200(self, client):
        response = client.get("/")
        assert response.status_code == 200

    def test_root_returns_correct_message(self, client):
        response = client.get("/")
        data = response.json()
        assert "message" in data
        assert data["status"] == "success"
        assert "version" in data
