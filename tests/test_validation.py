"""
Validation and Edge Case Tests

Tests for input validation, pagination limits, sorting,
search edge cases, and boundary conditions.
"""

from fastapi import status


class TestValidationEdgeCases:
    """Test suite for validation edge cases."""

    def test_create_meter_excessive_load(self, client, auth_header):
        """Test meter creation with load exceeding maximum."""
        response = client.post(
            "/meters/",
            headers=auth_header,
            json={
                "meter_number": "MTR-2024-099",
                "zone": "Test Zone",
                "consumer_name": "Test User",
                "current_load": 99999.0,
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_meter_empty_zone(self, client, auth_header):
        """Test meter creation with empty zone name."""
        response = client.post(
            "/meters/",
            headers=auth_header,
            json={
                "meter_number": "MTR-2024-099",
                "zone": "",
                "consumer_name": "Test User",
                "current_load": 100.0,
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_meter_empty_consumer_name(self, client, auth_header):
        """Test meter creation with empty consumer name."""
        response = client.post(
            "/meters/",
            headers=auth_header,
            json={
                "meter_number": "MTR-2024-099",
                "zone": "Test Zone",
                "consumer_name": "",
                "current_load": 100.0,
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_meter_special_chars_in_zone(self, client, auth_header):
        """Test meter creation with special characters in zone."""
        response = client.post(
            "/meters/",
            headers=auth_header,
            json={
                "meter_number": "MTR-2024-099",
                "zone": "<script>alert('xss')</script>",
                "consumer_name": "Test User",
                "current_load": 100.0,
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestPaginationEdgeCases:
    """Test suite for pagination edge cases."""

    def test_pagination_page_zero(self, client, auth_header):
        """Test pagination with page number 0."""
        response = client.get("/meters/?page=0&page_size=10", headers=auth_header)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_pagination_excessive_page_size(self, client, auth_header):
        """Test pagination with page size exceeding maximum."""
        response = client.get("/meters/?page=1&page_size=200", headers=auth_header)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_pagination_empty_result(self, client, auth_header):
        """Test pagination when no results match."""
        response = client.get("/meters/?page=999&page_size=10", headers=auth_header)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total"] == 0
        assert data["items"] == []


class TestSortingEdgeCases:
    """Test suite for sorting edge cases."""

    def test_sort_invalid_field(self, client, auth_header):
        """Test sorting with invalid field name."""
        response = client.get("/meters/?sort_by=invalid_field", headers=auth_header)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_sort_invalid_order(self, client, auth_header, sample_meter):
        """Test sorting with invalid sort order."""
        response = client.get("/meters/?sort_order=invalid", headers=auth_header)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestSearchEdgeCases:
    """Test suite for search edge cases."""

    def test_search_no_results(self, client, auth_header):
        """Test search that returns no results."""
        response = client.get("/meters/?search=NonExistentValueXYZ", headers=auth_header)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total"] == 0

    def test_search_special_characters(self, client, auth_header, sample_meter):
        """Test search with special characters (should be safe)."""
        response = client.get("/meters/?search=%25%24%23%40%21", headers=auth_header)
        assert response.status_code == status.HTTP_200_OK


class TestAuthEdgeCases:
    """Test suite for authentication edge cases."""

    def test_access_with_expired_token_format(self, client):
        """Test access with malformed token."""
        headers = {"Authorization": "Bearer invalid_token_format"}
        response = client.get("/auth/me", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_access_without_bearer_prefix(self, client):
        """Test access with token missing Bearer prefix."""
        headers = {"Authorization": "some_token"}
        response = client.get("/meters/", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_access_with_empty_token(self, client):
        """Test access with empty token."""
        headers = {"Authorization": "Bearer "}
        response = client.get("/meters/", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_register_email_invalid_format(self, client):
        """Test registration with invalid email format."""
        response = client.post(
            "/auth/register",
            json={
                "username": "testuser",
                "email": "not-an-email",
                "password": "password123",
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_very_long_username(self, client):
        """Test registration with very long username."""
        long_username = "a" * 200
        response = client.post(
            "/auth/register",
            json={
                "username": long_username,
                "email": "long@test.com",
                "password": "password123",
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestMetricsEndpoint:
    """Test suite for the metrics endpoint."""

    def test_metrics_endpoint_returns_counts(self, client):
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
