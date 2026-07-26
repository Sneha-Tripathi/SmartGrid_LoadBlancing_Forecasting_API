import pytest


@pytest.mark.api
@pytest.mark.auth
class TestAuthRegister:
    def test_register_success(self, client):
        response = client.post("/auth/register", json={
            "name": "New User",
            "email": "newuser@test.com",
            "password": "password123",
        })
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["email"] == "newuser@test.com"

    def test_register_duplicate_email(self, client):
        payload = {"name": "User", "email": "dup@test.com", "password": "pass123"}
        client.post("/auth/register", json=payload)
        response = client.post("/auth/register", json=payload)
        assert response.status_code == 409

    def test_register_invalid_data(self, client):
        response = client.post("/auth/register", json={"name": "", "email": "bad", "password": "12"})
        assert response.status_code == 422


@pytest.mark.api
@pytest.mark.auth
class TestAuthLogin:
    def test_login_success(self, client):
        client.post("/auth/register", json={"name": "Login User", "email": "login@test.com", "password": "pass123"})
        response = client.post("/auth/login", json={"email": "login@test.com", "password": "pass123"})
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        client.post("/auth/register", json={"name": "Wrong", "email": "wrong@test.com", "password": "correct"})
        response = client.post("/auth/login", json={"email": "wrong@test.com", "password": "incorrect"})
        assert response.status_code == 401

    def test_login_nonexistent_email(self, client):
        response = client.post("/auth/login", json={"email": "noone@test.com", "password": "pass"})
        assert response.status_code == 401

    def test_login_with_default_admin(self, client):
        response = client.post("/auth/login", json={"email": "admin@smartgrid.com", "password": "admin123"})
        assert response.status_code == 200

    def test_login_with_default_operator(self, client):
        response = client.post("/auth/login", json={"email": "operator@smartgrid.com", "password": "operator123"})
        assert response.status_code == 200


@pytest.mark.api
@pytest.mark.auth
class TestAuthRefresh:
    def test_refresh_token_success(self, client):
        reg = client.post("/auth/register", json={"name": "Refresh Test", "email": "refresh@test.com", "password": "pass123"}).json()
        response = client.post("/auth/refresh", json={"refresh_token": reg["refresh_token"]})
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

    def test_refresh_invalid_token(self, client):
        response = client.post("/auth/refresh", json={"refresh_token": "invalid.token.here"})
        assert response.status_code == 401


@pytest.mark.api
@pytest.mark.auth
class TestAuthLogout:
    def test_logout_success(self, client):
        reg = client.post("/auth/register", json={"name": "Logout Test", "email": "logout@test.com", "password": "pass123"}).json()
        response = client.post("/auth/logout", json={"refresh_token": reg["refresh_token"]})
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Logged out successfully"

    def test_logout_all(self, client, auth_headers):
        response = client.post("/auth/logout-all", headers=auth_headers)
        assert response.status_code == 200


@pytest.mark.api
@pytest.mark.auth
class TestAuthMe:
    def test_get_me_authenticated(self, client, auth_headers):
        response = client.get("/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "name" in data

    def test_get_me_unauthenticated(self, client):
        response = client.get("/auth/me")
        assert response.status_code == 401


@pytest.mark.api
@pytest.mark.auth
class TestAuthUpdateProfile:
    def test_update_profile(self, client, auth_headers):
        response = client.put("/auth/profile", json={"name": "Updated Name"}, headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["name"] == "Updated Name"

    def test_update_profile_unauthenticated(self, client):
        response = client.put("/auth/profile", json={"name": "Hacker"})
        assert response.status_code == 401


@pytest.mark.api
@pytest.mark.auth
class TestChangePassword:
    def test_change_password_success(self, client, auth_headers):
        # First register then login to get the password right
        client.post("/auth/register", json={
            "name": "Change Pass",
            "email": "changepass@test.com",
            "password": "oldpass123",
        })
        login_resp = client.post("/auth/login", json={"email": "changepass@test.com", "password": "oldpass123"})
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        response = client.put("/auth/change-password", json={
            "current_password": "oldpass123",
            "new_password": "newpass456",
        }, headers=headers)
        assert response.status_code == 200
