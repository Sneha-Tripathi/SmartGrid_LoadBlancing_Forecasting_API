"""
Security Utilities

Password hashing and JWT token creation utilities.
Uses bcrypt for password hashing and JWT for token-based authentication.
"""

from datetime import datetime, timedelta, UTC
from typing import Any, Dict

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: Dict[str, Any]) -> str:
    """
    Create a JWT access token with expiration.

    Args:
        data: Payload data to encode (e.g., {"sub": username, "role": role}).

    Returns:
        Encoded JWT token string.
    """
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt