import pytest

from app.schemas.auth import (
    UserCreate,
    UserLogin,
    TokenResponse,
    RefreshRequest,
    ChangePasswordRequest,
    UpdateProfileRequest,
    UserResponse,
    UserWithToken,
)


@pytest.mark.unit
class TestUserCreate:
    def test_valid_user_create(self):
        user = UserCreate(name="Test User", email="test@example.com", password="password123", phone="+1-555-0100")
        assert user.name == "Test User"
        assert user.email == "test@example.com"
        assert user.phone == "+1-555-0100"

    def test_user_create_minimal(self):
        user = UserCreate(name="Test", email="test@x.com", password="pass123")
        assert user.name == "Test"
        assert user.phone is None

    def test_user_create_name_empty(self):
        with pytest.raises(Exception):
            UserCreate(name="", email="test@x.com", password="pass123")


@pytest.mark.unit
class TestUserLogin:
    def test_valid_login(self):
        login = UserLogin(email="test@example.com", password="pass123")
        assert login.email == "test@example.com"


@pytest.mark.unit
class TestTokenResponse:
    def test_valid_token_response(self):
        token = TokenResponse(access_token="abc.def.ghi", refresh_token="jkl.mno.pqr", expires_in=1800)
        assert token.access_token == "abc.def.ghi"
        assert token.token_type == "bearer"


@pytest.mark.unit
class TestRefreshRequest:
    def test_valid_refresh_request(self):
        req = RefreshRequest(refresh_token="some.refresh.token")
        assert req.refresh_token == "some.refresh.token"


@pytest.mark.unit
class TestChangePasswordRequest:
    def test_valid_change_password(self):
        req = ChangePasswordRequest(current_password="oldpass123", new_password="newpass456")
        assert req.current_password == "oldpass123"
        assert req.new_password == "newpass456"

    def test_new_password_min_length(self):
        with pytest.raises(Exception):
            ChangePasswordRequest(current_password="oldpass", new_password="short")


@pytest.mark.unit
class TestUpdateProfileRequest:
    def test_valid_update_profile(self):
        req = UpdateProfileRequest(name="New Name", email="new@example.com")
        assert req.name == "New Name"

    def test_update_profile_empty(self):
        req = UpdateProfileRequest()
        assert req.name is None


@pytest.mark.unit
class TestUserResponse:
    def test_valid_user_response(self):
        user = UserResponse(
            id="USR-ABC123",
            name="Test User",
            email="test@example.com",
            role="admin",
            is_active=True,
            created_at="2025-01-01T00:00:00Z",
            updated_at="2025-06-01T00:00:00Z",
        )
        assert user.id == "USR-ABC123"


@pytest.mark.unit
class TestUserWithToken:
    def test_valid_user_with_token(self):
        user = UserWithToken(
            id="USR-ABC123",
            name="Test User",
            email="test@example.com",
            role="user",
            is_active=True,
            created_at="2025-01-01T00:00:00Z",
            updated_at="2025-06-01T00:00:00Z",
            access_token="access.token.here",
            refresh_token="refresh.token.here",
            expires_in=1800,
        )
        assert user.access_token == "access.token.here"
        assert user.expires_in == 1800
