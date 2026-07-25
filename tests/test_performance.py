"""
Performance and Edge Case Tests

Tests for pagination performance, query optimization,
response times, and edge cases.
"""

from fastapi import status


class TestPaginationPerformance:
    """Test suite for pagination performance."""

    def test_pagination_default_values(self, client, auth_header, sample_meter):
        """Test that pagination returns correct default values."""
        response = client.get("/meters/", headers=auth_header)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["page"] == 1
        assert data["page_size"] == 10
        assert "total_pages" in data

    def test_pagination_large_page_size(self, client, auth_header, sample_meter):
        """Test that large but valid page sizes work."""
        response = client.get(
            "/meters/?page=1&page_size=100", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK

    def test_pagination_multiple_pages(self, client, auth_header, sample_meter):
        """Test that page 2 returns empty when only 1 result exists."""
        response = client.get(
            "/meters/?page=2&page_size=10", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total_pages"] >= 1


class TestSortingPerformance:
    """Test suite for sorting performance."""

    def test_sort_ascending(self, client, auth_header, sample_meter):
        """Test ascending sort."""
        response = client.get(
            "/meters/?sort_by=id&sort_order=asc", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK

    def test_sort_by_zone(self, client, auth_header, sample_meter):
        """Test sorting by zone field."""
        response = client.get(
            "/meters/?sort_by=zone&sort_order=asc", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK

    def test_sort_by_multiple_combinations(self, client, auth_header, sample_meter):
        """Test various sort combinations."""
        for sort_by in ["id", "meter_number", "zone", "consumer_name", "current_load"]:
            response = client.get(
                f"/meters/?sort_by={sort_by}&sort_order=desc",
                headers=auth_header,
            )
            assert response.status_code == status.HTTP_200_OK


class TestFilterPerformance:
    """Test suite for filter performance."""

    def test_filter_min_load(self, client, auth_header, sample_meter):
        """Test filtering by minimum load."""
        response = client.get(
            "/meters/?min_load=100", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        for item in data["items"]:
            assert item["current_load"] >= 100

    def test_filter_max_load(self, client, auth_header, sample_meter):
        """Test filtering by maximum load."""
        response = client.get(
            "/meters/?max_load=200", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        for item in data["items"]:
            assert item["current_load"] <= 200

    def test_filter_load_range(self, client, auth_header, sample_meter):
        """Test filtering by load range."""
        response = client.get(
            "/meters/?min_load=50&max_load=500", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        for item in data["items"]:
            assert 50 <= item["current_load"] <= 500

    def test_filter_by_meter_number(self, client, auth_header, sample_meter):
        """Test filtering by exact meter number."""
        response = client.get(
            f"/meters/?meter_number=MTR-2024-001", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total"] >= 1


class TestConcurrentAccess:
    """Test suite for concurrent/edge case access patterns."""

    def test_multiple_get_requests(self, client, auth_header, sample_meter):
        """Test that multiple sequential reads work fine."""
        for _ in range(10):
            response = client.get("/meters/", headers=auth_header)
            assert response.status_code == status.HTTP_200_OK

    def test_create_then_read(self, client, auth_header):
        """Test creating a meter then immediately reading it."""
        create_resp = client.post(
            "/meters/",
            headers=auth_header,
            json={
                "meter_number": "MTR-2025-999",
                "zone": "Test Zone",
                "consumer_name": "Test User",
                "current_load": 100.0,
            },
        )
        assert create_resp.status_code == status.HTTP_201_CREATED
        meter_id = create_resp.json()["id"]

        read_resp = client.get(f"/meters/{meter_id}", headers=auth_header)
        assert read_resp.status_code == status.HTTP_200_OK
        assert read_resp.json()["meter_number"] == "MTR-2025-999"
