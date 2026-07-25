"""
Database Engine Configuration

Configures the SQLAlchemy engine with connection pooling and
SQLite-specific settings.
"""

from sqlalchemy import create_engine

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_pre_ping=True,
)