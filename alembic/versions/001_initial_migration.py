"""Initial Migration - Create smart_meters and users tables

Revision ID: 001
Revises:
Create Date: 2026-07-25
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create all tables."""
    # smart_meters table
    op.create_table(
        "smart_meters",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("meter_number", sa.String(length=50), nullable=False),
        sa.Column("zone", sa.String(length=100), nullable=False),
        sa.Column("consumer_name", sa.String(length=100), nullable=False),
        sa.Column("current_load", sa.Float(), nullable=True, server_default="0.0"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("meter_number"),
    )
    op.create_index(
        op.f("ix_smart_meters_id"), "smart_meters", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_smart_meters_meter_number"),
        "smart_meters",
        ["meter_number"],
        unique=True,
    )
    op.create_index(
        op.f("ix_smart_meters_zone"), "smart_meters", ["zone"], unique=False
    )

    # users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=True, server_default="1"),
        sa.Column("role", sa.String(length=20), nullable=False, server_default="viewer"),
        sa.Column("full_name", sa.String(length=100), nullable=True),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("last_login", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("username"),
        sa.UniqueConstraint("email"),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(
        op.f("ix_users_username"), "users", ["username"], unique=True
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)


def downgrade() -> None:
    """Drop all tables."""
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_username"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
    op.drop_index(op.f("ix_smart_meters_zone"), table_name="smart_meters")
    op.drop_index(
        op.f("ix_smart_meters_meter_number"), table_name="smart_meters"
    )
    op.drop_index(op.f("ix_smart_meters_id"), table_name="smart_meters")
    op.drop_table("smart_meters")
