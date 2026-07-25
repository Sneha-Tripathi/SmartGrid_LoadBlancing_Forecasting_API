"""
Authentication and User Profile Tests

Tests for registration, login, profile management, and role-based access.
"""

from fastapi import status


class TestAuthRegister:
    """Test suite for user registration."""

    def test_register_user_success(self, client):
        """Test successful user registration."""
        response = client.post(
            "/auth/register",
            json={
                "username": "newuser",
                "email": "newuser@test.com",
                "password": "password123",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["username"] == "newuser"
        assert data["email"] == "newuser@test.com"
        assert data["is_active"] is True
        assert data["role"] == "viewer"
        assert "id" in data

    def test_register_duplicate_username(self, client, test_admin):
        """Test registration with existing username."""
        response = client.post(
            "/auth/register",
            json={
                "username": "admin",
                "email": "another@test.com",
                "password": "password123",
            },
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Username already exists" in response.text

    def test_register_duplicate_email(self, client, test_admin):
        """Test registration with existing email."""
        response = client.post(
            "/auth/register",
            json={
                "username": "newuser2",
                "email": "admin@test.com",
                "password": "password123",
            },
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Email already exists" in response.text

    def test_register_weak_password(self, client):
        """Test registration with weak password."""
        response = client.post(
            "/auth/register",
            json={
                "username": "weakuser",
                "email": "weak@test.com",
                "password": "12345",
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestAuthLogin:
    """Test suite for user login."""

    def test_login_success(self, client, test_admin):
        """Test successful login."""
        response = client.post(
            "/auth/login",
            data={
                "username": "admin",
                "password": "admin123",
            },
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, test_admin):
        """Test login with wrong password."""
        response = client.post(
            "/auth/login",
            data={
                "username": "admin",
                "password": "wrong_password",
            },
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user."""
        response = client.post(
            "/auth/login",
            data={
                "username": "nobody",
                "password": "password123",
            },
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestUserProfile:
    """Test suite for user profile endpoints."""

    def test_get_profile(self, client, auth_header):
        """Test retrieving authenticated user's profile."""
        response = client.get("/auth/me", headers=auth_header)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["username"] == "admin"
        assert data["role"] == "admin"
        assert "created_at" in data
        assert "updated_at" in data

    def test_get_profile_unauthorized(self, client):
        """Test profile retrieval without authentication."""
        response = client.get("/auth/me")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_profile(self, client, auth_header):
        """Test updating user profile."""
        response = client.put(
            "/auth/me",
            headers=auth_header,
            json={
                "full_name": "Admin User",
                "phone": "1234567890",
            },
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["full_name"] == "Admin User"
        assert data["phone"] is not None

    def test_change_password(self, client, auth_header):
        """Test changing password."""
        response = client.put(
            "/auth/change-password",
            headers=auth_header,
            json={
                "current_password": "admin123",
                "new_password": "newadmin456",
            },
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["success"] is True

    def test_change_password_wrong_current(self, client, auth_header):
        """Test changing password with wrong current password."""
        response = client.put(
            "/auth/change-password",
            headers=auth_header,
            json={
                "current_password": "wrong_password",
                "new_password": "newadmin456",
            },
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_deactivate_account(self, client, auth_header):
        """Test account deactivation."""
        response = client.post(
            "/auth/deactivate",
            headers=auth_header,
            json={"password": "admin123"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["success"] is True

    def test_deactivate_account_wrong_password(self, client, auth_header):
        """Test account deactivation with wrong password."""
        response = client.post(
            "/auth/deactivate",
            headers=auth_header,
            json={"password": "wrong_password"},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestRoleBasedAccess:
    """Test suite for role-based access control."""

    def test_viewer_cannot_create_meter(self, client, viewer_token):
        """Test viewer cannot create meters."""
        headers = {"Authorization": f"Bearer {viewer_token}"}
        response = client.post(
            "/meters/",
            headers=headers,
            json={
                "meter_number": "MTR-2024-099",
                "zone": "Test Zone",
                "consumer_name": "Test User",
                "current_load": 100.0,
            },
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_admin_can_delete_meter(self, client, admin_token, sample_meter):
        """Test admin can delete meters."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.delete(f"/meters/{sample_meter.id}", headers=headers)
        assert response.status_code == status.HTTP_200_OK

    def test_operator_cannot_delete_meter(self, client, operator_token, sample_meter):
        """Test operator cannot delete meters."""
        headers = {"Authorization": f"Bearer {operator_token}"}
        response = client.delete(f"/meters/{sample_meter.id}", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN
