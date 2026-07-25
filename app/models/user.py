"""
User Model

Represents a registered user in the system.
Includes role-based access control and activity timestamps.
"""

from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.db.base import Base


class User(Base):
    """User model for authentication and authorization."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    hashed_password = Column(
        String(255),
        nullable=False,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    # --- Day 12: Role & Profile Fields ---

    role = Column(
        String(20),
        default="viewer",
        nullable=False,
    )

    full_name = Column(
        String(100),
        nullable=True,
    )

    phone = Column(
        String(20),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    last_login = Column(
        DateTime,
        nullable=True,
    )