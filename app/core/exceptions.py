"""
Exception Handlers

Global exception handling for the FastAPI application.
Provides consistent error responses across all endpoints.
"""

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


def register_exception_handlers(app: FastAPI):
    """Register all global exception handlers."""

    @app.exception_handler(404)
    async def not_found_handler(request: Request, _exc):
        """Handle 404 Not Found errors."""
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": "Resource not found",
            },
        )

    @app.exception_handler(401)
    async def unauthorized_handler(request: Request, _exc):
        """Handle 401 Unauthorized errors."""
        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "message": "Unauthorized",
            },
        )

    @app.exception_handler(403)
    async def forbidden_handler(request: Request, _exc):
        """Handle 403 Forbidden errors."""
        return JSONResponse(
            status_code=403,
            content={
                "success": False,
                "message": "Forbidden",
            },
        )

    # Day 16: Enhanced Validation Error Handling
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        """
        Handle Pydantic validation errors with structured responses.
        Returns field-level error details for easier debugging.
        """
        errors = []
        for error in exc.errors():
            field = " -> ".join(str(loc) for loc in error.get("loc", []))
            errors.append(
                {
                    "field": field,
                    "message": error.get("msg", "Invalid value"),
                    "type": error.get("type", "value_error"),
                }
            )

        logger.warning(
            "Validation error: %s %s",
            request.method,
            request.url.path,
        )

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "message": "Validation failed",
                "errors": errors,
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc):
        """Handle all unhandled exceptions with logging."""
        logger.exception(
            "Unhandled exception: %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal Server Error",
            },
        )