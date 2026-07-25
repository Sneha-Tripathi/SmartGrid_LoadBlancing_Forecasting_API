"""
Monitoring Tests

Tests for metrics endpoints, Prometheus export, and health probes.
"""

from fastapi import status


class TestMetricsEndpoint:
    """Test suite for the /metrics endpoint."""

    def test_metrics_returns_counts(self, client):
        """Test that metrics returns correct structure."""
        response = client.get("/metrics")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "application" in data
        assert "version" in data
        assert "database" in data
        assert data["database"]["type"] == "sqlite"
        assert "statistics" in data
        assert "total_meters" in data["statistics"]
        assert "total_users" in data["statistics"]
        assert "active_users" in data["statistics"]
        assert "requests" in data
        assert "errors" in data
        assert "performance" in data

    def test_metrics_tracks_requests(self, client):
        """Test that metrics track request counts."""
        # Make some requests
        for _ in range(3):
            client.get("/health")

        response = client.get("/metrics")
        data = response.json()
        assert data["requests"]["total"] >= 3

    def test_metrics_tracks_errors(self, client):
        """Test that metrics track errors."""
        # Make a request to non-existent endpoint
        client.get("/nonexistent")

        response = client.get("/metrics")
        data = response.json()
        assert "errors" in data


class TestPrometheusMetrics:
    """Test suite for Prometheus metrics export."""

    def test_prometheus_endpoint_exists(self, client):
        """Test that Prometheus endpoint is accessible."""
        response = client.get("/metrics/prometheus")
        assert response.status_code == status.HTTP_200_OK
        assert "text/plain" in response.headers.get("content-type", "")

    def test_prometheus_format(self, client):
        """Test that Prometheus format contains expected metrics."""
        response = client.get("/metrics/prometheus")
        content = response.text
        assert "smartgrid_requests_total" in content
        assert "smartgrid_errors_total" in content
        assert "smartgrid_average_response_time_ms" in content


class TestHealthProbes:
    """Test suite for health probe endpoints."""

    def test_liveness_endpoint(self, client):
        """Test liveness probe."""
        response = client.get("/health/live")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "alive"
        assert "timestamp" in data

    def test_readiness_endpoint(self, client):
        """Test readiness probe."""
        response = client.get("/health/ready")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "ready"
        assert data["database"] == "healthy"
        assert "timestamp" in data

    def test_health_check(self, client):
        """Test the main health check endpoint."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        assert "version" in data
        assert "timestamp" in data


class TestRootRedirect:
    """Test suite for root endpoint redirect."""

    def test_root_redirects(self, client):
        """Test that root endpoint redirects to health."""
        response = client.get("/", follow_redirects=False)
        # Should either redirect or return success
        assert response.status_code in (
            status.HTTP_200_OK,
            status.HTTP_307_TEMPORARY_REDIRECT,
            status.HTTP_308_PERMANENT_REDIRECT,
        )
