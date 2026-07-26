import pytest
from datetime import timedelta

from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_access_token,
    decode_refresh_token,
    get_token_expires_in,
)


@pytest.mark.unit
class TestPasswordHashing:
    def test_hash_password_returns_string(self):
        hashed = hash_password("testpass123")
        assert isinstance(hashed, str)
        assert len(hashed) > 0

    def test_verify_password_correct(self):
        hashed = hash_password("testpass123")
        assert verify_password("testpass123", hashed) is True

    def test_verify_password_incorrect(self):
        hashed = hash_password("testpass123")
        assert verify_password("wrongpass", hashed) is False

    def test_verify_password_empty(self):
        hashed = hash_password("testpass123")
        assert verify_password("", hashed) is False


@pytest.mark.unit
class TestAccessToken:
    def test_create_access_token_returns_string(self):
        token = create_access_token({"sub": "user123", "jti": "abc"})
        assert isinstance(token, str)
        assert len(token) > 0

    def test_decode_valid_access_token(self):
        payload = {"sub": "user123", "jti": "abc123"}
        token = create_access_token(payload)
        decoded = decode_access_token(token)
        assert decoded is not None
        assert decoded["sub"] == "user123"
        assert decoded["type"] == "access"

    def test_decode_invalid_access_token(self):
        assert decode_access_token("invalid.token.here") is None

    def test_decode_expired_access_token(self):
        token = create_access_token({"sub": "user1", "jti": "abc"}, timedelta(seconds=-1))
        assert decode_access_token(token) is None

    def test_get_token_expires_in_returns_positive(self):
        token = create_access_token({"sub": "user1", "jti": "abc"})
        assert get_token_expires_in(token) > 0

    def test_get_token_expires_in_invalid_token(self):
        assert get_token_expires_in("invalid.token.here") == 0


@pytest.mark.unit
class TestRefreshToken:
    def test_create_refresh_token_returns_string(self):
        token = create_refresh_token({"sub": "user123", "jti": "abc"})
        assert isinstance(token, str)

    def test_decode_valid_refresh_token(self):
        payload = {"sub": "user123", "jti": "abc123"}
        token = create_refresh_token(payload)
        decoded = decode_refresh_token(token)
        assert decoded is not None
        assert decoded["sub"] == "user123"
        assert decoded["type"] == "refresh"

    def test_decode_invalid_refresh_token(self):
        assert decode_refresh_token("invalid.token.here") is None

    def test_access_token_not_decoded_as_refresh(self):
        token = create_access_token({"sub": "user1", "jti": "abc"})
        assert decode_refresh_token(token) is None

    def test_refresh_token_not_decoded_as_access(self):
        token = create_refresh_token({"sub": "user1", "jti": "abc"})
        assert decode_access_token(token) is None
