"""
User Schemas

Pydantic models for user registration, authentication, profile management,
and role-based access control.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.config import settings


class UserBase(BaseModel):
    """Base user schema with common fields."""

    username: str
    email: EmailStr


class UserCreate(UserBase):
    """Schema for user registration."""

    username: str = Field(
        ..., min_length=3, max_length=50, description="Username (3-50 characters)"
    )
    password: str

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        """Ensure password meets minimum strength requirements."""
        min_length = settings.PASSWORD_MIN_LENGTH
        if len(value) < min_length:
            raise ValueError(f"Password must be at least {min_length} characters long")
        return value


class UserResponse(UserBase):
    """Schema for user response (returned to client)."""

    id: int
    is_active: bool
    role: str = "viewer"
    full_name: str | None = None
    phone: str | None = None
    created_at: datetime
    updated_at: datetime
    last_login: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(BaseModel):
    """Schema for the authenticated user's profile."""

    id: int
    username: str
    email: str
    is_active: bool
    role: str
    full_name: str | None = None
    phone: str | None = None
    created_at: datetime
    updated_at: datetime
    last_login: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class UserProfileUpdate(BaseModel):
    """Schema for updating user profile (partial update)."""

    full_name: str | None = None
    phone: str | None = None
    email: EmailStr | None = None


class ChangePasswordRequest(BaseModel):
    """Schema for changing password."""

    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if len(value) < 6:
            raise ValueError("New password must be at least 6 characters long")
        return value


class Token(BaseModel):
    """Schema for JWT token response."""

    access_token: str
    token_type: str


class DeactivateAccountRequest(BaseModel):
    """Schema for account deactivation confirmation."""

    password: str
