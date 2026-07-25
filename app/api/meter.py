"""
Smart Meter API

Provides CRUD operations for Smart Meters with:
- Pagination, filtering, sorting, and search (Day 15)
- Enhanced validation (Day 16)
- Role-based access control (Day 13)
- JWT authentication
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_role
from app.db.session import get_db
from app.models.smart_meter import SmartMeter
from app.models.user import User
from app.schemas.smart_meter import (
    MeterFilterParams,
    PaginatedResponse,
    PaginationParams,
    SmartMeterCreate,
    SmartMeterResponse,
)

router = APIRouter(
    prefix="/meters",
    tags=["Meters"],
)


# Create Smart Meter


@router.post(
    "/",
    response_model=SmartMeterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new smart meter",
    response_description="Smart meter created successfully",
)
def create_meter(
    meter: SmartMeterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("operator")),
):
    """
    Register a new smart meter in the system.
    Requires operator or admin role.
    """
    new_meter = SmartMeter(**meter.model_dump())

    db.add(new_meter)
    db.commit()
    db.refresh(new_meter)

    return new_meter


# Get All Smart Meters (with Pagination)


@router.get(
    "/",
    response_model=PaginatedResponse,
    summary="Get all smart meters",
    response_description="Paginated list of smart meters",
)
def get_all_meters(
    pagination: PaginationParams = Depends(),
    filters: MeterFilterParams = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get paginated list of smart meters with optional filtering, sorting, and search.
    """
    query = db.query(SmartMeter)

    # Apply Filters
    if filters.zone:
        query = query.filter(SmartMeter.zone.ilike(f"%{filters.zone}%"))

    if filters.consumer_name:
        query = query.filter(
            SmartMeter.consumer_name.ilike(f"%{filters.consumer_name}%")
        )

    if filters.meter_number:
        query = query.filter(
            SmartMeter.meter_number.ilike(f"%{filters.meter_number}%")
        )

    if filters.min_load is not None:
        query = query.filter(SmartMeter.current_load >= filters.min_load)

    if filters.max_load is not None:
        query = query.filter(SmartMeter.current_load <= filters.max_load)

    # Global Search
    if filters.search:
        search_pattern = f"%{filters.search}%"
        query = query.filter(
            SmartMeter.meter_number.ilike(search_pattern)
            | SmartMeter.zone.ilike(search_pattern)
            | SmartMeter.consumer_name.ilike(search_pattern)
        )

    # Count Total (before pagination)
    total = query.count()

    # Apply Sorting with validation
    allowed_sort_fields = [
        "id", "meter_number", "zone", "consumer_name", "current_load",
    ]
    if filters.sort_by not in allowed_sort_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=[
                {
                    "loc": ["query", "sort_by"],
                    "msg": f"Invalid sort field. Allowed: {', '.join(allowed_sort_fields)}",
                    "type": "value_error",
                }
            ],
        )

    sort_column = getattr(SmartMeter, filters.sort_by, SmartMeter.id)

    if filters.sort_order.lower() not in ("asc", "desc"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=[
                {
                    "loc": ["query", "sort_order"],
                    "msg": "Sort order must be 'asc' or 'desc'",
                    "type": "value_error",
                }
            ],
        )

    if filters.sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    # Apply Pagination
    offset = (pagination.page - 1) * pagination.page_size
    query = query.offset(offset).limit(pagination.page_size)

    items = query.all()

    return PaginatedResponse(
        items=items,
        total=total,
        page=pagination.page,
        page_size=pagination.page_size,
        total_pages=max(1, (total + pagination.page_size - 1) // pagination.page_size),
    )


# Get Smart Meter by ID


@router.get(
    "/{meter_id}",
    response_model=SmartMeterResponse,
    summary="Get a smart meter by ID",
    response_description="Smart meter details",
    responses={
        404: {"description": "Smart meter not found"},
    },
)
def get_meter(
    meter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve a specific smart meter by its ID.
    """
    meter = (
        db.query(SmartMeter)
        .filter(SmartMeter.id == meter_id)
        .first()
    )

    if meter is None:
        raise HTTPException(
            status_code=404,
            detail="Smart Meter not found",
        )

    return meter


# Update Smart Meter


@router.put(
    "/{meter_id}",
    response_model=SmartMeterResponse,
    summary="Update a smart meter",
    response_description="Smart meter updated successfully",
    responses={
        404: {"description": "Smart meter not found"},
    },
)
def update_meter(
    meter_id: int,
    meter_data: SmartMeterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("operator")),
):
    """
    Update an existing smart meter's data.
    Requires operator or admin role.
    """
    meter = (
        db.query(SmartMeter)
        .filter(SmartMeter.id == meter_id)
        .first()
    )

    if meter is None:
        raise HTTPException(
            status_code=404,
            detail="Smart Meter not found",
        )

    meter.meter_number = meter_data.meter_number
    meter.zone = meter_data.zone
    meter.consumer_name = meter_data.consumer_name
    meter.current_load = meter_data.current_load

    db.commit()
    db.refresh(meter)

    return meter


# Delete Smart Meter


@router.delete(
    "/{meter_id}",
    summary="Delete a smart meter",
    response_description="Smart meter deleted successfully",
    responses={
        404: {"description": "Smart meter not found"},
        403: {"description": "Insufficient permissions (admin only)"},
    },
)
def delete_meter(
    meter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """
    Delete a smart meter from the system.
    Requires admin role only.
    """
    meter = (
        db.query(SmartMeter)
        .filter(SmartMeter.id == meter_id)
        .first()
    )

    if meter is None:
        raise HTTPException(
            status_code=404,
            detail="Smart Meter not found",
        )

    db.delete(meter)
    db.commit()

    return {
        "success": True,
        "message": "Smart Meter deleted successfully",
    }