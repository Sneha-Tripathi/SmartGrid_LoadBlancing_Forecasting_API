"""
Logging System

Provides structured logging with:
- Request and response logging
- Execution time tracking
- Error logging with full tracebacks
- Audit logging for security events
- Log rotation and file management
"""

import logging
import sys
from datetime import UTC, datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

# ──────────────────────────────────────────────
#  Log Directory Setup
# ──────────────────────────────────────────────

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

# Log file paths
APP_LOG_FILE = LOG_DIR / "app.log"
ERROR_LOG_FILE = LOG_DIR / "error.log"
AUDIT_LOG_FILE = LOG_DIR / "audit.log"


# ──────────────────────────────────────────────
#  Log Formatters
# ──────────────────────────────────────────────


class CustomFormatter(logging.Formatter):
    """Custom log formatter with UTC timestamps."""

    def formatTime(self, record, datefmt=None):
        dt = datetime.fromtimestamp(record.created, tz=UTC)
        if datefmt:
            return dt.strftime(datefmt)
        return dt.strftime("%Y-%m-%d %H:%M:%S UTC")

    def format(self, record):
        # Ensure exception info is always captured in error logs
        if record.exc_info and not record.exc_text:
            record.exc_text = super().formatException(record.exc_info)
        return super().format(record)


# Console formatter (human-readable, colored levels for dev)
CONSOLE_FORMAT = CustomFormatter("%(asctime)s | %(levelname)-8s | %(name)s | %(message)s")

# File formatter (detailed, structured)
FILE_FORMAT = CustomFormatter(
    "%(asctime)s | %(levelname)-8s | %(name)s | %(module)s:%(lineno)d | %(message)s"
)

# Audit formatter (clean, with correlation ID)
AUDIT_FORMAT = CustomFormatter("%(asctime)s | AUDIT | %(message)s")


# ──────────────────────────────────────────────
#  Logger Configuration
# ──────────────────────────────────────────────


def get_logger(name: str) -> logging.Logger:
    """
    Get or create a logger with the given name.
    All loggers share the same handlers configured once.
    """
    return logging.getLogger(name)


def configure_logging():
    """
    Configure all loggers with handlers and formatters.
    Called once at application startup.
    """
    # ── Root Logger ───────────────────────────
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    # Prevent duplicate handlers on reload
    if root_logger.handlers:
        return

    # ── Console Handler ───────────────────────
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(CONSOLE_FORMAT)
    root_logger.addHandler(console_handler)

    # ── Application Log File ──────────────────
    app_handler = RotatingFileHandler(
        APP_LOG_FILE,
        maxBytes=10 * 1024 * 1024,  # 10 MB
        backupCount=5,
        encoding="utf-8",
    )
    app_handler.setLevel(logging.INFO)
    app_handler.setFormatter(FILE_FORMAT)
    root_logger.addHandler(app_handler)

    # ── Error Log File (ERROR+) ───────────────
    error_handler = RotatingFileHandler(
        ERROR_LOG_FILE,
        maxBytes=10 * 1024 * 1024,  # 10 MB
        backupCount=5,
        encoding="utf-8",
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(FILE_FORMAT)
    root_logger.addHandler(error_handler)

    # ── Audit Logger ──────────────────────────
    audit_logger = logging.getLogger("audit")
    audit_logger.setLevel(logging.INFO)

    audit_handler = RotatingFileHandler(
        AUDIT_LOG_FILE,
        maxBytes=10 * 1024 * 1024,  # 10 MB
        backupCount=5,
        encoding="utf-8",
    )
    audit_handler.setLevel(logging.INFO)
    audit_handler.setFormatter(AUDIT_FORMAT)
    audit_logger.addHandler(audit_handler)

    # Prevent audit logs from propagating to root (avoid duplication)
    audit_logger.propagate = False

    # ── Third-party logger levels ─────────────
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


# ──────────────────────────────────────────────
#  Audit Log Helper
# ──────────────────────────────────────────────


def log_audit(
    event: str,
    user: str | None = None,
    resource: str | None = None,
    details: str | None = None,
):
    """
    Log an audit event for security-sensitive operations.

    Args:
        event: The type of event (e.g., "LOGIN", "PASSWORD_CHANGE", "DEACTIVATE")
        user: Username who performed the action
        resource: The resource affected
        details: Additional context
    """
    audit_logger = logging.getLogger("audit")
    parts = [event]
    if user:
        parts.append(f"user={user}")
    if resource:
        parts.append(f"resource={resource}")
    if details:
        parts.append(f"details={details}")
    audit_logger.info(" | ".join(parts))


# ══════════════════════════════════════════════
#  DAY 14: Request Logging Middleware
# ══════════════════════════════════════════════


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that logs all incoming requests and outgoing responses.
    Timing headers are handled by RequestTimingMiddleware.
    """

    async def dispatch(self, request: Request, call_next):
        logger = get_logger("api.request")
        request_id = getattr(request.state, "request_id", "-")

        # Log incoming request
        logger.info(
            "→ [%s] %s %s",
            request_id,
            request.method,
            request.url.path,
        )

        try:
            response: Response = await call_next(request)
        except Exception:
            # Log the exception with full traceback
            logger.exception(
                "✗ [%s] %s %s failed",
                request_id,
                request.method,
                request.url.path,
            )
            raise

        # Log response (timing is handled by RequestTimingMiddleware)
        logger.info(
            "← [%s] %s %s → %s",
            request_id,
            request.method,
            request.url.path,
            response.status_code,
        )

        return response
