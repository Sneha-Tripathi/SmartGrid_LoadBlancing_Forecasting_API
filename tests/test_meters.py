"""
Smart Meter API Tests

Tests for CRUD operations, pagination, filtering, sorting, and search.
"""

from fastapi import status


class TestCreateMeter:
    """Test suite for creating smart meters."""

    def test_create_meter_success(self, client, auth_header):
        """Test successful meter creation."""
        response = client.post(
            "/meters/",
            headers=auth_header,
            json={
                "meter_number": "MTR-2024-002",
                "zone": "South Zone",
                "consumer_name": "Jane Smith",
                "current_load": 250.75,
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["meter_number"] == "MTR-2024-002"
        assert data["zone"] == "South Zone"
        assert data["consumer_name"] == "Jane Smith"
        assert data["current_load"] == 250.75
        assert "id" in data

    def test_create_meter_unauthorized(self, client):
        """Test meter creation without authentication."""
        response = client.post(
            "/meters/",
            json={
                "meter_number": "MTR-2024-099",
                "zone": "Test Zone",
                "consumer_name": "Test User",
                "current_load": 100.0,
            },
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_meter_invalid_format(self, client, auth_header):
        """Test meter creation with invalid meter number format."""
        response = client.post(
            "/meters/",
            headers=auth_header,
            json={
                "meter_number": "INVALID-123",
                "zone": "Test Zone",
                "consumer_name": "Test User",
                "current_load": 100.0,
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_meter_negative_load(self, client, auth_header):
        """Test meter creation with negative load."""
        response = client.post(
            "/meters/",
            headers=auth_header,
            json={
                "meter_number": "MTR-2024-003",
                "zone": "Test Zone",
                "consumer_name": "Test User",
                "current_load": -50.0,
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestGetMeters:
    """Test suite for retrieving smart meters."""

    def test_get_all_meters_paginated(self, client, auth_header, sample_meter):
        """Test paginated retrieval of meters."""
        response = client.get("/meters/?page=1&page_size=10", headers=auth_header)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "page_size" in data
        assert "total_pages" in data
        assert data["total"] >= 1

    def test_get_meter_by_id(self, client, auth_header, sample_meter):
        """Test retrieving a specific meter."""
        response = client.get(f"/meters/{sample_meter.id}", headers=auth_header)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_meter.id
        assert data["meter_number"] == sample_meter.meter_number

    def test_get_meter_not_found(self, client, auth_header):
        """Test retrieving a non-existent meter."""
        response = client.get("/meters/99999", headers=auth_header)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_filter_by_zone(self, client, auth_header, sample_meter):
        """Test filtering meters by zone."""
        response = client.get(
            "/meters/?zone=North", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total"] >= 1
        assert all("North" in item["zone"] for item in data["items"])

    def test_search_meters(self, client, auth_header, sample_meter):
        """Test searching meters."""
        response = client.get(
            "/meters/?search=John", headers=auth_header
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total"] >= 1

    def test_sort_by_load_desc(self, client, auth_header, sample_meter):
        """Test sorting meters by load descending."""
        response = client.get(
            "/meters/?sort_by=current_load&sort_order=desc",
            headers=auth_header,
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["items"]) > 0


class TestUpdateMeter:
    """Test suite for updating smart meters."""

    def test_update_meter_success(self, client, auth_header, sample_meter):
        """Test successful meter update."""
        response = client.put(
            f"/meters/{sample_meter.id}",
            headers=auth_header,
            json={
                "meter_number": "MTR-2024-001",
                "zone": "Updated Zone",
                "consumer_name": "John Updated",
                "current_load": 200.0,
            },
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["zone"] == "Updated Zone"
        assert data["current_load"] == 200.0

    def test_update_meter_not_found(self, client, auth_header):
        """Test updating a non-existent meter."""
        response = client.put(
            "/meters/99999",
            headers=auth_header,
            json={
                "meter_number": "MTR-2024-099",
                "zone": "Test Zone",
                "consumer_name": "Test User",
                "current_load": 100.0,
            },
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestDeleteMeter:
    """Test suite for deleting smart meters."""

    def test_delete_meter_success(self, client, admin_token, sample_meter):
        """Test successful meter deletion by admin."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.delete(f"/meters/{sample_meter.id}", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["success"] is True

    def test_delete_meter_not_found(self, client, admin_token):
        """Test deleting a non-existent meter."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.delete("/meters/99999", headers=headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_meter_unauthorized(self, client, viewer_token, sample_meter):
        """Test that viewer cannot delete meters."""
        headers = {"Authorization": f"Bearer {viewer_token}"}
        response = client.delete(f"/meters/{sample_meter.id}", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN
