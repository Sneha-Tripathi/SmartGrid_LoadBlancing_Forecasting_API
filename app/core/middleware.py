"""
Production Middleware

Provides production-grade middleware components:
- Request ID generation and propagation
- Request timing and metrics
- Security headers (Helmet-style, Swagger-safe CSP)
- Enhanced CORS configuration
- Global middleware registration
"""

import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.logging import RequestLoggingMiddleware
from app.core.monitoring import MetricsMiddleware

# Documentation paths that need relaxed CSP for Swagger/ReDoc CDN resources
DOCS_PATHS = (
    "/docs",
    "/redoc",
    "/openapi.json",
    "/docs/oauth2-redirect",
)


# ══════════════════════════════════════════════
#  DAY 17: Request ID Middleware
# ══════════════════════════════════════════════


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Assigns a unique request ID to every request.
    If the client sends an X-Request-ID header, it is reused;
    otherwise, a new UUID is generated.
    The ID is added to the response headers for tracing.
    """

    async def dispatch(self, request: Request, call_next):
        # Use existing request ID or generate new one
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        # Store in request state for use in endpoints/logging
        request.state.request_id = request_id

        response = await call_next(request)

        # Return the request ID in the response
        response.headers["X-Request-ID"] = request_id

        return response


# ══════════════════════════════════════════════
#  DAY 17: Request Timing Middleware
# ══════════════════════════════════════════════


class RequestTimingMiddleware(BaseHTTPMiddleware):
    """
    Records the processing time for each request.
    Adds timing headers and logs slow requests (>1s).
    """

    async def dispatch(self, request: Request, call_next):
        start_time = datetime.now(timezone.utc)

        response = await call_next(request)

        end_time = datetime.now(timezone.utc)
        execution_ms = (end_time - start_time).total_seconds() * 1000

        response.headers["X-Execution-Time-MS"] = str(round(execution_ms, 1))

        # Flag slow requests
        if execution_ms > settings.SLOW_REQUEST_THRESHOLD_MS:
            response.headers["X-Slow-Request"] = "true"

        return response


# ══════════════════════════════════════════════
#  DAY 17: Security Headers Middleware
# ══════════════════════════════════════════════


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds security-related HTTP headers to all responses.
    Inspired by Helmet.js for Express.
    Uses a relaxed CSP for documentation paths (Swagger/ReDoc CDN).
    """

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # Enable XSS filter in older browsers
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # HSTS (HTTP Strict Transport Security)
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )

        # Conditional CSP: relaxed for docs, strict for API
        if path in DOCS_PATHS or path.startswith("/docs") or path.startswith("/redoc"):
            # Relaxed CSP for Swagger/ReDoc CDN resources
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; "
                "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://fonts.googleapis.com; "
                "img-src 'self' data: https://cdn.jsdelivr.net https://unpkg.com https://fastapi.tiangolo.com; "
                "font-src 'self' data: https://cdn.jsdelivr.net https://unpkg.com https://fonts.gstatic.com; "
                "connect-src 'self' https://cdn.jsdelivr.net; "
                "object-src 'none'"
            )
        else:
            # Strict CSP for API responses
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data:; "
                "font-src 'self'; "
                "object-src 'none'"
            )

        # Cache control for API responses (not docs - they need caching)
        if (
            path not in DOCS_PATHS
            and not path.startswith("/docs")
            and not path.startswith("/redoc")
        ):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"

        return response


# ══════════════════════════════════════════════
#  DAY 17: CORS Configuration
# ══════════════════════════════════════════════


def configure_cors(app: FastAPI):
    """
    Configure CORS middleware with secure defaults.
    Origins can be customized via settings.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allow_headers=[
            "Authorization",
            "Content-Type",
            "X-Request-ID",
            "X-Client-Version",
        ],
        expose_headers=[
            "X-Request-ID",
            "X-Execution-Time-MS",
        ],
        max_age=600,  # Cache preflight for 10 minutes
    )


# ══════════════════════════════════════════════
#  DAY 17: Register All Middleware
# ══════════════════════════════════════════════


def register_middleware(app: FastAPI):
    """
    Register all production middleware in the correct order.
    Order matters: first registered = first to process requests.
    """
    # CORS should be first to handle preflight quickly
    configure_cors(app)

    # Order: Request ID → Security Headers → Timing → Metrics → Logging
    app.add_middleware(RequestIDMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestTimingMiddleware)
    app.add_middleware(MetricsMiddleware)
    app.add_middleware(RequestLoggingMiddleware)
