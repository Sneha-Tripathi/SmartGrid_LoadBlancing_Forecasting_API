"""
Authentication & Authorization Dependencies

Provides dependency injection functions for:
- JWT token validation (get_current_user)
- Role-based access control (require_role, get_admin_user)
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Extract and validate the current user from the JWT token.
    Used as a dependency for all protected endpoints.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.ALGORITHM],
        )

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    return user


# Day 13: Role-Based Authorization Dependencies

ALLOWED_ROLES = ["admin", "operator", "viewer"]


def require_role(required_role: str):
    """
    Factory function that returns a dependency which checks
    if the authenticated user has the required role.

    Role hierarchy:
        - admin: full access (level 3)
        - operator: read/write on meters (level 2)
        - viewer: read-only access (level 1)
    """
    if required_role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid role requirement: {required_role}",
        )

    def role_checker(current_user: User = Depends(get_current_user)):
        role_hierarchy = {
            "admin": 3,
            "operator": 2,
            "viewer": 1,
        }

        if role_hierarchy.get(current_user.role, 0) < role_hierarchy.get(required_role, 0):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Insufficient permissions. "
                    f"Required role: {required_role}, "
                    f"Your role: {current_user.role}"
                ),
            )
        return current_user

    return role_checker


def get_admin_user(
    current_user: User = Depends(require_role("admin")),
):
    """
    Dependency that ensures the current user has admin role.
    Shorthand for require_role("admin").
    """
    return current_user
