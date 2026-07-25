"""
Smart Meter Schemas

Pydantic models for Smart Meter CRUD operations with:
- Enhanced validation (Day 16)
- Pagination, filtering, sorting support (Day 15)
"""

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.validation import (
    validate_consumer_name,
    validate_load_value,
    validate_meter_number,
    validate_zone_name,
)


class SmartMeterBase(BaseModel):
    """Base schema with all Smart Meter fields."""

    meter_number: str
    zone: str
    consumer_name: str
    current_load: float

    # Day 16: Field Validators
    _validate_meter = field_validator("meter_number")(validate_meter_number)
    _validate_zone = field_validator("zone")(validate_zone_name)
    _validate_consumer = field_validator("consumer_name")(validate_consumer_name)
    _validate_load = field_validator("current_load")(validate_load_value)


class SmartMeterCreate(SmartMeterBase):
    """Schema for creating a new Smart Meter."""


class SmartMeterResponse(SmartMeterBase):
    """Schema for Smart Meter response."""

    id: int

    model_config = ConfigDict(from_attributes=True)


# Day 15: Pagination & Filtering Schemas


class PaginationParams(BaseModel):
    """
    Query parameters for pagination.
    - page: Page number (1-indexed, minimum 1)
    - page_size: Number of items per page (1-100)
    """

    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    page_size: int = Field(default=10, ge=1, le=100, description="Items per page (max 100)")


class MeterFilterParams(BaseModel):
    """
    Query parameters for filtering, sorting, and searching meters.
    """

    zone: str | None = None
    consumer_name: str | None = None
    meter_number: str | None = None
    min_load: float | None = None
    max_load: float | None = None
    search: str | None = None
    sort_by: str = Field(
        default="id",
        description="Sort field. Allowed: id, meter_number, zone, consumer_name, current_load",
    )
    sort_order: str = Field(default="asc", description="Sort order. Allowed: asc, desc")


class PaginatedResponse(BaseModel):
    """
    Generic paginated response wrapper.
    """

    items: list[SmartMeterResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

    model_config = ConfigDict(from_attributes=True)
