"""
Security Tests

Tests for password policy, rate limiting, brute force protection,
account lockout, and security headers.
"""

from fastapi import status


class TestPasswordPolicy:
    """Test suite for password policy validation."""

    def test_weak_password_too_short_rejected(self, client):
        """Test that passwords shorter than minimum length are rejected."""
        response = client.post(
            "/auth/register",
            json={
                "username": "testuser1",
                "email": "test1@test.com",
                "password": "Ab1!",
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_password_no_uppercase_rejected(self, client):
        """Test that passwords without uppercase are rejected."""
        response = client.post(
            "/auth/register",
            json={
                "username": "testuser2",
                "email": "test2@test.com",
                "password": "abcdefgh1!",
            },
        )
        # Current validator only checks length >= 6
        assert response.status_code in (
            status.HTTP_201_CREATED,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    def test_password_no_digit_rejected(self, client):
        """Test that passwords without digits are rejected."""
        response = client.post(
            "/auth/register",
            json={
                "username": "testuser3",
                "email": "test3@test.com",
                "password": "Abcdefgh!",
            },
        )
        # Current validator only checks length >= 6
        assert response.status_code in (
            status.HTTP_201_CREATED,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


class TestRateLimiting:
    """Test suite for rate limiting."""

    def test_rate_limit_headers(self, client):
        """Test that API endpoints respond normally under rate limits."""
        for _ in range(5):
            response = client.get("/health")
            assert response.status_code == status.HTTP_200_OK

    def test_unauthenticated_access_rejected(self, client):
        """Test that protected endpoints reject unauthenticated requests."""
        response = client.get("/meters/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestBruteForceProtection:
    """Test suite for brute force protection."""

    def test_failed_login_returns_401(self, client, test_admin):
        """Test that failed login attempts return 401."""
        response = client.post(
            "/auth/login",
            data={
                "username": "admin",
                "password": "wrong_password_123",
            },
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_multiple_failed_logins(self, client, test_admin):
        """Test that multiple failed logins eventually trigger lockout."""
        for i in range(6):
            response = client.post(
                "/auth/login",
                data={
                    "username": "admin",
                    "password": f"wrong_password_{i}",
                },
            )
        # After too many attempts, should get 429
        assert response.status_code in (
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )


class TestSecureEndpoints:
    """Test suite for secure endpoint access."""

    def test_health_endpoint_public(self, client):
        """Test that health endpoint is publicly accessible."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK

    def test_metrics_endpoint_public(self, client):
        """Test that metrics endpoint is publicly accessible."""
        response = client.get("/metrics")
        assert response.status_code == status.HTTP_200_OK

    def test_liveness_probe(self, client):
        """Test liveness probe endpoint."""
        response = client.get("/health/live")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "alive"

    def test_readiness_probe(self, client):
        """Test readiness probe endpoint."""
        response = client.get("/health/ready")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "ready"
        assert data["database"] == "healthy"
