"""
Test Configuration and Fixtures

Provides shared test fixtures for all test modules.
Uses an in-memory SQLite database for isolation.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.auth.security import create_access_token, hash_password
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.smart_meter import SmartMeter
from app.models.user import User

# Use an in-memory database for tests
TEST_DATABASE_URL = "sqlite:///./test_smartgrid.db"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=test_engine)
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with overridden database dependency."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_admin(db_session):
    """Create an admin user for testing."""
    user = User(
        username="admin",
        email="admin@test.com",
        hashed_password=hash_password("admin123"),
        role="admin",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_operator(db_session):
    """Create an operator user for testing."""
    user = User(
        username="operator",
        email="operator@test.com",
        hashed_password=hash_password("operator123"),
        role="operator",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_viewer(db_session):
    """Create a viewer user for testing."""
    user = User(
        username="viewer",
        email="viewer@test.com",
        hashed_password=hash_password("viewer123"),
        role="viewer",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def admin_token(test_admin):
    """Generate a JWT token for the admin user."""
    return create_access_token({"sub": test_admin.username, "role": test_admin.role})


@pytest.fixture(scope="function")
def operator_token(test_operator):
    """Generate a JWT token for the operator user."""
    return create_access_token(
        {"sub": test_operator.username, "role": test_operator.role}
    )


@pytest.fixture(scope="function")
def viewer_token(test_viewer):
    """Generate a JWT token for the viewer user."""
    return create_access_token({"sub": test_viewer.username, "role": test_viewer.role})


@pytest.fixture(scope="function")
def auth_header(admin_token):
    """Return Authorization header with admin token."""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture(scope="function")
def sample_meter(db_session):
    """Create a sample smart meter for testing."""
    meter = SmartMeter(
        meter_number="MTR-2024-001",
        zone="North Zone",
        consumer_name="John Doe",
        current_load=150.5,
    )
    db_session.add(meter)
    db_session.commit()
    db_session.refresh(meter)
    return meter
