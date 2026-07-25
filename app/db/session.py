"""
Database Session Management

Provides database session factory and dependency injection.
"""

from collections.abc import Generator

from sqlalchemy.orm import Session, sessionmaker

from app.db.database import engine

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.
    Ensures the session is closed after the request completes.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
