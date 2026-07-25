"""
Health API Tests

Tests for the health check and root endpoints.
"""

from fastapi import status


class TestHealthAPI:
    """Test suite for health check endpoints."""

    def test_root_endpoint(self, client):
        """Test that the root endpoint returns success."""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "success"
        assert "Smart Grid" in data["message"]
        assert "version" in data

    def test_health_check(self, client):
        """Test that the health check returns healthy status."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] is not None
        assert data["version"] is not None
        assert data["timestamp"] is not None

    def test_metrics_endpoint(self, client):
        """Test that the metrics endpoint returns stats."""
        response = client.get("/metrics")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "application" in data
        assert "statistics" in data
        assert "total_meters" in data["statistics"]
        assert "total_users" in data["statistics"]
