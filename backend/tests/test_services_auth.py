import pytest

from app.services.auth_service import (
    register_user,
    authenticate_user,
    get_user_by_id,
    get_user_by_email,
    update_user_profile,
    change_user_password,
    store_refresh_token,
    validate_refresh_token,
    revoke_refresh_token,
    revoke_all_user_tokens,
    get_all_users,
)


@pytest.mark.unit
class TestRegisterUser:
    def test_register_new_user(self):
        user = register_user("New User", "new@example.com", "password123")
        assert user is not None
        assert user["name"] == "New User"
        assert "password" not in user

    def test_register_duplicate_email(self):
        register_user("First", "dup@example.com", "password123")
        user = register_user("Second", "dup@example.com", "password123")
        assert user is None

    def test_register_default_role(self):
        user = register_user("Role Test", "role@example.com", "pass123")
        assert user["role"] == "admin"


@pytest.mark.unit
class TestAuthenticateUser:
    def test_authenticate_valid_credentials(self):
        register_user("Auth User", "auth@example.com", "correctpass")
        user = authenticate_user("auth@example.com", "correctpass")
        assert user is not None

    def test_authenticate_wrong_password(self):
        register_user("Wrong Pass", "wrong@example.com", "correctpass")
        user = authenticate_user("wrong@example.com", "wrongpass")
        assert user is None

    def test_authenticate_nonexistent_email(self):
        assert authenticate_user("noone@example.com", "pass") is None


@pytest.mark.unit
class TestGetUser:
    def test_get_user_by_id_exists(self):
        user = register_user("Get ID", "getid@example.com", "pass123")
        assert get_user_by_id(user["id"]) is not None

    def test_get_user_by_id_not_found(self):
        assert get_user_by_id("USR-NONEXISTENT") is None

    def test_get_user_by_email_exists(self):
        register_user("Get Email", "getemail@example.com", "pass123")
        assert get_user_by_email("getemail@example.com") is not None


@pytest.mark.unit
class TestUpdateProfile:
    def test_update_name(self):
        user = register_user("Old Name", "upd@example.com", "pass123")
        updated = update_user_profile(user["id"], {"name": "New Name"})
        assert updated["name"] == "New Name"

    def test_update_nonexistent_user(self):
        assert update_user_profile("USR-FAKE", {"name": "Fake"}) is None


@pytest.mark.unit
class TestChangePassword:
    def test_change_password_success(self):
        user = register_user("Pass Chg", "passchg@example.com", "oldpass")
        assert change_user_password(user["id"], "oldpass", "newpass") is True

    def test_change_password_wrong_current(self):
        user = register_user("Wrong Curr", "wrongcur@example.com", "oldpass")
        assert change_user_password(user["id"], "wrongpass", "newpass") is False

    def test_change_password_nonexistent_user(self):
        assert change_user_password("USR-FAKE", "old", "new") is False


@pytest.mark.unit
class TestRefreshTokens:
    def test_store_and_validate(self):
        store_refresh_token("jti-123", "user-1")
        assert validate_refresh_token("jti-123", "user-1") is True

    def test_validate_wrong_user(self):
        store_refresh_token("jti-456", "user-1")
        assert validate_refresh_token("jti-456", "user-2") is False

    def test_revoke_token(self):
        store_refresh_token("jti-789", "user-1")
        revoke_refresh_token("jti-789")
        assert validate_refresh_token("jti-789", "user-1") is False

    def test_revoke_all_user_tokens(self):
        store_refresh_token("jti-1", "user-a")
        store_refresh_token("jti-2", "user-a")
        store_refresh_token("jti-3", "user-b")
        revoke_all_user_tokens("user-a")
        assert validate_refresh_token("jti-1", "user-a") is False
        assert validate_refresh_token("jti-3", "user-b") is True


@pytest.mark.unit
class TestGetAllUsers:
    def test_get_all_users_is_list(self):
        assert isinstance(get_all_users(), list)

    def test_get_all_users_no_passwords(self):
        for user in get_all_users():
            assert "password" not in user
