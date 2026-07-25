"""
Security Module

Provides enterprise-grade security features:
- Password policy enforcement
- Rate limiting (in-memory)
- Brute force protection with account lockout
- Security audit logging
- Input sanitization
- Token validation improvements
"""

import re
import time
from collections import defaultdict
from typing import Dict, Optional, Tuple

from fastapi import HTTPException, Request, status

from app.core.config import settings
from app.core.logging import get_logger, log_audit

logger = get_logger(__name__)


# ──────────────────────────────────────────────
#  Password Policy
# ──────────────────────────────────────────────


class PasswordPolicy:
    """
    Enforces password strength requirements.

    Rules:
    - Minimum length (configurable)
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """

    @staticmethod
    def validate(password: str) -> Tuple[bool, str]:
        """
        Validate password against configured policy.

        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(password) < settings.PASSWORD_MIN_LENGTH:
            return False, (
                f"Password must be at least {settings.PASSWORD_MIN_LENGTH} "
                f"characters long"
            )

        if settings.PASSWORD_REQUIRE_UPPERCASE and not re.search(
            r"[A-Z]", password
        ):
            return False, "Password must contain at least one uppercase letter"

        if settings.PASSWORD_REQUIRE_LOWERCASE and not re.search(
            r"[a-z]", password
        ):
            return False, "Password must contain at least one lowercase letter"

        if settings.PASSWORD_REQUIRE_DIGIT and not re.search(r"\d", password):
            return False, "Password must contain at least one digit"

        if settings.PASSWORD_REQUIRE_SPECIAL and not re.search(
            r"[!@#$%^&*(),.?\":{}|<>]", password
        ):
            return (
                False,
                "Password must contain at least one special character "
                r"(!@#$%^&*(),.?\":{}|<>)",
            )

        return True, ""


# ──────────────────────────────────────────────
#  Rate Limiter (In-Memory)
# ──────────────────────────────────────────────


class RateLimiter:
    """
    Simple in-memory rate limiter using sliding window.

    Tracks request counts per IP address and enforces limits.
    Separate limits for general API and login endpoints.
    """

    def __init__(self):
        self._requests: Dict[str, list] = defaultdict(list)
        self._login_attempts: Dict[str, list] = defaultdict(list)
        self._locked_accounts: Dict[str, float] = {}

    def check_rate_limit(self, request: Request) -> None:
        """
        Check if the request is within rate limits.
        Raises HTTPException if rate limit exceeded.
        """
        if not settings.RATE_LIMIT_ENABLED:
            return

        # Skip rate limiting for docs and health endpoints
        path = request.url.path
        if any(
            path.startswith(p)
            for p in ["/docs", "/redoc", "/openapi.json", "/health", "/metrics", "/"]
        ):
            return

        client_ip = self._get_client_ip(request)
        now = time.time()
        window = settings.RATE_LIMIT_WINDOW_SECONDS
        max_requests = settings.RATE_LIMIT_REQUESTS

        # Clean old entries
        self._requests[client_ip] = [
            t for t in self._requests[client_ip] if now - t < window
        ]

        # Check limit
        if len(self._requests[client_ip]) >= max_requests:
            log_audit(
                event="RATE_LIMIT_EXCEEDED",
                details=f"IP: {client_ip}, Path: {path}",
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later.",
            )

        self._requests[client_ip].append(now)

    def check_login_rate_limit(self, username: str, request: Request) -> None:
        """
        Check if login attempts are within limits for a username.
        Implements per-username rate limiting for login endpoint.
        """
        if not settings.RATE_LIMIT_ENABLED:
            return

        # Check if account is locked
        if username in self._locked_accounts:
            lockout_time = self._locked_accounts[username]
            if time.time() < lockout_time:
                remaining_minutes = int(
                    (lockout_time - time.time()) / 60
                ) + 1
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=(
                        f"Account temporarily locked due to too many failed "
                        f"attempts. Try again in {remaining_minutes} minute(s)."
                    ),
                )
            else:
                # Lockout expired
                del self._locked_accounts[username]
                self._login_attempts[username] = []

        now = time.time()
        window = settings.LOGIN_RATE_LIMIT_WINDOW_MINUTES * 60
        max_attempts = settings.LOGIN_RATE_LIMIT_REQUESTS

        # Clean old entries
        self._login_attempts[username] = [
            t for t in self._login_attempts[username] if now - t < window
        ]

        # Check limit
        if len(self._login_attempts[username]) >= max_attempts:
            lockout_duration = settings.ACCOUNT_LOCKOUT_MINUTES * 60
            self._locked_accounts[username] = now + lockout_duration

            log_audit(
                event="ACCOUNT_LOCKED",
                user=username,
                details=f"Too many failed login attempts. "
                f"Locked for {settings.ACCOUNT_LOCKOUT_MINUTES} minutes.",
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    f"Account locked due to too many failed attempts. "
                    f"Try again in {settings.ACCOUNT_LOCKOUT_MINUTES} minute(s)."
                ),
            )

        self._login_attempts[username].append(now)

    def record_failed_login(self, username: str) -> None:
        """Record a failed login attempt for brute force tracking."""
        log_audit(
            event="LOGIN_FAILED",
            user=username,
            details="Failed login attempt recorded",
        )

    def record_successful_login(self, username: str) -> None:
        """Clear login attempts on successful login."""
        if username in self._login_attempts:
            self._login_attempts[username] = []

    @staticmethod
    def _get_client_ip(request: Request) -> str:
        """Extract client IP from request, respecting proxies."""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        return request.client.host if request.client else "unknown"


# Global rate limiter instance
rate_limiter = RateLimiter()


# ──────────────────────────────────────────────
#  Input Sanitization
# ──────────────────────────────────────────────


def sanitize_input(value: str) -> str:
    """
    Sanitize user input by removing potentially dangerous characters.

    Strips HTML tags and trims whitespace.
    """
    if not value:
        return value
    # Remove HTML tags
    clean = re.sub(r"<[^>]*>", "", value)
    # Strip whitespace
    clean = clean.strip()
    return clean


def sanitize_object_id(value: str) -> str:
    """
    Sanitize and validate an object ID string.
    Ensures only alphanumeric characters, hyphens, and underscores.
    """
    if not value:
        return value
    # Remove any non-alphanumeric, non-hyphen, non-underscore characters
    clean = re.sub(r"[^\w\-]", "", value)
    return clean.strip()


# ──────────────────────────────────────────────
#  Token Validation Improvements
# ──────────────────────────────────────────────


def validate_token_payload(payload: dict) -> bool:
    """
    Validate JWT token payload structure.

    Checks for required fields and valid data types.
    """
    # Check required fields
    if "sub" not in payload:
        logger.warning("Token missing 'sub' claim")
        return False

    if "exp" not in payload:
        logger.warning("Token missing 'exp' claim")
        return False

    # Check expiration
    exp = payload.get("exp", 0)
    if isinstance(exp, (int, float)) and exp < time.time():
        logger.warning("Token has expired")
        return False

    # Check username is a string
    if not isinstance(payload.get("sub"), str):
        logger.warning("Token 'sub' claim is not a string")
        return False

    return True


# ──────────────────────────────────────────────
#  Rate Limiting Middleware
# ──────────────────────────────────────────────



