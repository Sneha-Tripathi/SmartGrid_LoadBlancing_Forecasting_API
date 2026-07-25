"""
Validation Improvements

Provides reusable Pydantic validators and enhanced validation utilities:
- Custom field validators for meter numbers, zones, and loads
- Reusable validation mixins
- Better error message formatting
"""

import re

# ──────────────────────────────────────────────
#  Day 16: Reusable Validation Patterns
# ──────────────────────────────────────────────

# Meter number format: e.g., "MTR-2024-001"
METER_NUMBER_PATTERN = re.compile(r"^MTR-\d{4}-\d{3,6}$")

# Zone name pattern: alphanumeric, spaces, hyphens
ZONE_PATTERN = re.compile(r"^[A-Za-z0-9\s\-]{2,50}$")

# Consumer name pattern: letters, spaces, hyphens, apostrophes
CONSUMER_NAME_PATTERN = re.compile(r"^[A-Za-z\s\-']{2,100}$")


# ──────────────────────────────────────────────
#  Day 16: Custom Pydantic Validators
# ──────────────────────────────────────────────


def validate_meter_number(value: str) -> str:
    """
    Validate meter number format.
    Expected format: MTR-YYYY-NNN (e.g., MTR-2024-001)
    """
    if not value or not value.strip():
        raise ValueError("Meter number cannot be empty")

    if not METER_NUMBER_PATTERN.match(value.strip()):
        raise ValueError(
            "Invalid meter number format. " "Expected format: MTR-YYYY-NNN (e.g., MTR-2024-001)"
        )
    return value.strip()


def validate_zone_name(value: str) -> str:
    """
    Validate zone name.
    Must be 2-50 characters, alphanumeric with spaces/hyphens.
    """
    if not value or not value.strip():
        raise ValueError("Zone name cannot be empty")

    if not ZONE_PATTERN.match(value.strip()):
        raise ValueError(
            "Zone name must be 2-50 characters and contain only "
            "letters, numbers, spaces, or hyphens"
        )
    return value.strip()


def validate_consumer_name(value: str) -> str:
    """
    Validate consumer name.
    Must be 2-100 characters, letters with spaces/hyphens/apostrophes.
    """
    if not value or not value.strip():
        raise ValueError("Consumer name cannot be empty")

    if not CONSUMER_NAME_PATTERN.match(value.strip()):
        raise ValueError(
            "Consumer name must be 2-100 characters and contain only "
            "letters, spaces, hyphens, or apostrophes"
        )
    return value.strip()


def validate_load_value(value: float) -> float:
    """
    Validate current load value.
    Must be between 0 and 10000 kW.
    """
    if value < 0:
        raise ValueError("Current load cannot be negative")

    if value > 10000:
        raise ValueError("Current load cannot exceed 10,000 kW")

    return round(value, 2)


def validate_phone_number(value: str | None) -> str | None:
    """
    Validate phone number format.
    Accepts formats: +1234567890, 123-456-7890, (123) 456-7890
    """
    if value is None or value.strip() == "":
        return value

    # Remove all non-digit characters except leading +
    cleaned = re.sub(r"[^\d+]", "", value.strip())

    # Ensure cleaned number has valid length (10-15 digits)
    digit_count = sum(1 for c in cleaned if c.isdigit())
    if digit_count < 10 or digit_count > 15:
        raise ValueError("Phone number must have between 10 and 15 digits")

    return cleaned


# ──────────────────────────────────────────────
#  Day 16: Enhanced Error Response Builder
# ──────────────────────────────────────────────


def format_validation_errors(errors: list) -> list:
    """
    Convert Pydantic validation errors into a clean, readable format.

    Args:
        errors: List of Pydantic validation errors.

    Returns:
        List of formatted error dicts with field, message, and type keys.
    """
    formatted = []
    for error in errors:
        formatted.append(
            {
                "field": " -> ".join(str(loc) for loc in error["loc"]),
                "message": error["msg"],
                "type": error["type"],
            }
        )
    return formatted
