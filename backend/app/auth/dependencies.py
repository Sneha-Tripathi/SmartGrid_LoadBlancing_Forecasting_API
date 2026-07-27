"""
Authentication & Authorization Dependencies

Provides dependency injection functions for role-based access control (RBAC).
Compatible with the main backend's in-memory user dict structure.

Role hierarchy:
    - admin:   full access (level 3)
    - operator: read/write on meters (level 2)
    - viewer:   read-only access (level 1)

Usage:
    @router.get("/admin-only")
    def admin_endpoint(user: dict = Depends(require_role("admin"))):
        ...
"""

from fastapi import Depends, HTTPException, status

# Allowed roles in the system
ALLOWED_ROLES = ["admin", "operator", "viewer"]

# Role hierarchy (higher number = more privileges)
ROLE_HIERARCHY = {
    "admin": 3,
    "operator": 2,
    "viewer": 1,
}


def require_role(required_role: str):
    """
    Factory function that returns a dependency which checks
    if the authenticated user has the required role.

    The returned dependency expects a user dict (from the existing auth flow)
    with a 'role' field. The caller must chain this with the existing
    authentication dependency.

    Args:
        required_role: Minimum role required (admin, operator, or viewer).

    Returns:
        A FastAPI dependency callable that validates the user's role.
    """
    if required_role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid role requirement: {required_role}",
        )

    def role_checker(current_user: dict):
        if not current_user or not isinstance(current_user, dict):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
            )

        user_role = current_user.get("role", "viewer")
        user_level = ROLE_HIERARCHY.get(user_role, 0)
        required_level = ROLE_HIERARCHY.get(required_role, 0)

        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Insufficient permissions. "
                    f"Required role: {required_role}, "
                    f"Your role: {user_role}"
                ),
            )
        return current_user

    return role_checker


def get_admin_user(
    current_user: dict = Depends(require_role("admin")),
):
    """
    Dependency that ensures the current user has admin role.
    Shorthand for require_role("admin").
    """
    return current_user
