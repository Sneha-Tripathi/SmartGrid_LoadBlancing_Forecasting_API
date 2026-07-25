"""
Middleware Tests

Tests for Request ID, Security Headers, CORS, and Timing middleware.
"""

from fastapi import status


class TestRequestIDMiddleware:
    """Test suite for Request ID middleware."""

    def test_request_id_generated(self, client):
        """Test that a request ID is generated and returned."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        assert "X-Request-ID" in response.headers
        assert len(response.headers["X-Request-ID"]) > 0

    def test_request_id_custom_value(self, client):
        """Test that a custom request ID from client is respected."""
        custom_id = "my-custom-request-id-123"
        response = client.get(
            "/health", headers={"X-Request-ID": custom_id}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.headers["X-Request-ID"] == custom_id


class TestSecurityHeadersMiddleware:
    """Test suite for Security Headers middleware."""

    def test_security_headers_present(self, client):
        """Test that all security headers are present on API responses."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK

        # Security headers
        assert response.headers.get("X-Content-Type-Options") == "nosniff"
        assert response.headers.get("X-Frame-Options") == "DENY"
        assert response.headers.get("X-XSS-Protection") == "1; mode=block"
        assert "Referrer-Policy" in response.headers
        assert "Strict-Transport-Security" in response.headers
        assert "Content-Security-Policy" in response.headers

    def test_csp_relaxed_for_docs(self, client):
        """Test that Swagger docs have relaxed CSP."""
        response = client.get("/docs")
        assert response.status_code in (200, 307)
        if response.status_code == 200:
            csp = response.headers.get("Content-Security-Policy", "")
            assert "cdn.jsdelivr.net" in csp or "unsafe-inline" in csp


class TestTimingMiddleware:
    """Test suite for Request Timing middleware."""

    def test_timing_header_present(self, client):
        """Test that timing header is present on responses."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        assert "X-Execution-Time-MS" in response.headers
        time_ms = float(response.headers["X-Execution-Time-MS"])
        assert time_ms >= 0


class TestCORSMiddleware:
    """Test suite for CORS middleware."""

    def test_cors_preflight(self, client):
        """Test that CORS preflight (OPTIONS) requests work."""
        response = client.options(
            "/health",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert response.status_code == status.HTTP_200_OK
        assert "Access-Control-Allow-Origin" in response.headers

    def test_cors_headers_on_response(self, client):
        """Test that CORS headers are present on responses."""
        response = client.get(
            "/health",
            headers={"Origin": "http://localhost:3000"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert "Access-Control-Allow-Origin" in response.headers
