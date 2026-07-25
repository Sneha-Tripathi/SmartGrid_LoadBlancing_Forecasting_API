"""
Authentication & User Profile Module

Handles user registration, login, profile management,
password changes, and account deactivation.
"""

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.security import create_access_token, hash_password, verify_password
from app.core.logging import log_audit
from app.core.security import PasswordPolicy, rate_limiter
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    ChangePasswordRequest,
    DeactivateAccountRequest,
    Token,
    UserCreate,
    UserProfileResponse,
    UserProfileUpdate,
    UserResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ──────────────────────────────────────────────
#  Existing: User Registration
# ──────────────────────────────────────────────


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    response_description="User registered successfully",
    responses={
        400: {"description": "Username or email already exists"},
        422: {"description": "Validation error (e.g., weak password)"},
    },
)
def register_user(
    request: Request,  # Injected automatically by FastAPI
    user: UserCreate,
    db: Session = Depends(get_db),
):
    """
    Register a new user in the system.
    Username and email must be unique.
    Password must meet strength requirements.
    """
    # Check rate limit for registration
    rate_limiter.check_rate_limit(request)

    # Validate password policy
    is_valid, error_msg = PasswordPolicy.validate(user.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=error_msg,
        )

    existing_user = db.query(User).filter(User.username == user.username).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists",
        )

    existing_email = db.query(User).filter(User.email == user.email).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    now = datetime.now(UTC)

    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role="viewer",
        is_active=True,
        created_at=now,
        updated_at=now,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Audit log for new user registration
    log_audit(
        event="USER_REGISTERED",
        user=user.username,
        details="Role: viewer",
    )

    return db_user


# ──────────────────────────────────────────────
#  Existing: User Login
# ──────────────────────────────────────────────


@router.post(
    "/login",
    response_model=Token,
    summary="Login and get access token",
    response_description="JWT access token",
    responses={
        401: {"description": "Invalid username or password"},
        403: {"description": "Account is deactivated"},
    },
)
def login(
    request: Request,  # Injected automatically by FastAPI
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate user and return JWT access token.
    Includes rate limiting and brute force protection.
    Updates last_login timestamp on successful login.
    """
    username = form_data.username

    # Check rate limit for login attempts per username
    rate_limiter.check_login_rate_limit(username, request)

    user = db.query(User).filter(User.username == username).first()

    if not user:
        rate_limiter.record_failed_login(username)
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    if not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        rate_limiter.record_failed_login(username)
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Account is deactivated. Contact administrator.",
        )

    # Clear rate limit data on successful login
    rate_limiter.record_successful_login(username)

    # Update last login timestamp
    user.last_login = datetime.now(UTC)
    db.commit()

    # Audit log for successful login
    log_audit(
        event="LOGIN_SUCCESS",
        user=username,
        details=f"Role: {user.role}",
    )

    access_token = create_access_token({"sub": user.username, "role": user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# ══════════════════════════════════════════════
#  DAY 12: User Profile Endpoints
# ══════════════════════════════════════════════


@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Get current user profile",
    response_description="Authenticated user profile",
    responses={
        401: {"description": "Not authenticated"},
    },
)
def get_profile(
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve the profile of the currently authenticated user.
    """
    return current_user


@router.put(
    "/me",
    response_model=UserProfileResponse,
    summary="Update current user profile",
    response_description="Updated user profile",
    responses={
        400: {"description": "No fields provided or email already in use"},
        401: {"description": "Not authenticated"},
    },
)
def update_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update the authenticated user's profile fields.
    Supports partial updates.
    """
    update_fields = profile_data.model_dump(exclude_unset=True)

    if not update_fields:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update",
        )

    if "email" in update_fields and update_fields["email"] != current_user.email:
        existing_email = db.query(User).filter(User.email == update_fields["email"]).first()
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Email already in use",
            )

    for field, value in update_fields.items():
        setattr(current_user, field, value)

    current_user.updated_at = datetime.now(UTC)
    db.commit()
    db.refresh(current_user)

    return current_user


@router.put(
    "/change-password",
    summary="Change current user password",
    response_description="Password changed confirmation",
    responses={
        400: {"description": "Current password is incorrect"},
        401: {"description": "Not authenticated"},
    },
)
def change_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Change the authenticated user's password.
    Requires current password for verification.
    """
    if not verify_password(
        password_data.current_password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect",
        )

    current_user.hashed_password = hash_password(password_data.new_password)
    current_user.updated_at = datetime.now(UTC)
    db.commit()

    return {
        "success": True,
        "message": "Password changed successfully",
    }


@router.post(
    "/deactivate",
    summary="Deactivate current user account",
    response_description="Account deactivation confirmation",
    responses={
        400: {"description": "Password is incorrect"},
        401: {"description": "Not authenticated"},
    },
)
def deactivate_account(
    deactivate_data: DeactivateAccountRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Deactivate the authenticated user's account.
    Requires password confirmation.
    """
    if not verify_password(
        deactivate_data.password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=400,
            detail="Password is incorrect",
        )

    current_user.is_active = False
    current_user.updated_at = datetime.now(UTC)
    db.commit()

    return {
        "success": True,
        "message": "Account deactivated successfully",
    }
