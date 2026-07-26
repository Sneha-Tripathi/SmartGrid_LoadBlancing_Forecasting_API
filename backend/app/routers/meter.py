from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.data.dummyData import (
    meter_data,
    meter_history,
    meter_alerts,
    meter_timeline,
)

class MeterCreate(BaseModel):
    meter_id: str = Field(..., description="Unique meter identifier")
    zone: str = Field(..., description="Zone name")
    location: Optional[str] = Field(None, description="Physical location")
    load: str = Field(..., description="Current load")
    voltage: Optional[str] = Field(None, description="Voltage reading")
    frequency: Optional[str] = Field(None, description="Frequency reading")
    current: Optional[str] = Field(None, description="Current reading")
    power_factor: Optional[str] = Field(None, description="Power factor")
    status: str = Field("Normal", description="Meter status")
    type: Optional[str] = Field("Smart Meter", description="Meter type")
    install_date: Optional[str] = Field(None, description="Installation date")
    last_maintenance: Optional[str] = Field(None, description="Last maintenance")
    consumer: Optional[str] = Field(None, description="Consumer name")

class MeterUpdate(BaseModel):
    zone: Optional[str] = None
    location: Optional[str] = None
    load: Optional[str] = None
    voltage: Optional[str] = None
    frequency: Optional[str] = None
    current: Optional[str] = None
    power_factor: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None
    install_date: Optional[str] = None
    last_maintenance: Optional[str] = None
    consumer: Optional[str] = None

class MeterResponse(BaseModel):
    id: str
    meter_id: str
    zone: str
    location: Optional[str] = None
    load: str
    voltage: Optional[str] = None
    frequency: Optional[str] = None
    current: Optional[str] = None
    power_factor: Optional[str] = None
    status: str
    type: str = "Smart Meter"
    install_date: Optional[str] = None
    last_maintenance: Optional[str] = None
    consumer: Optional[str] = None

class PaginatedMeterResponse(BaseModel):
    items: List[MeterResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

router = APIRouter(
    prefix="/meters",
    tags=["Meters"],
)

ZONES = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"]
STATUSES = ["Normal", "Warning", "High", "Critical"]

def _meter_to_response(m):
    return {
        "id": m.get("id", m.get("meter_id", "")),
        "meter_id": m.get("meter_id", m.get("id", "")),
        "zone": m.get("zone", ""),
        "location": m.get("location"),
        "load": m.get("load", ""),
        "voltage": m.get("voltage"),
        "frequency": m.get("frequency"),
        "current": m.get("current"),
        "power_factor": m.get("power_factor"),
        "status": m.get("status", "Normal"),
        "type": m.get("type", "Smart Meter"),
        "install_date": m.get("install_date"),
        "last_maintenance": m.get("last_maintenance"),
        "consumer": m.get("consumer"),
    }

@router.get("/", response_model=PaginatedMeterResponse)
def get_all_meters(
    search: Optional[str] = Query(None, description="Search query"),
    zone: Optional[str] = Query(None, description="Filter by zone"),
    status: Optional[str] = Query(None, description="Filter by status"),
    type: Optional[str] = Query(None, alias="meter_type", description="Filter by type"),
    sort_by: str = Query("meter_id", description="Sort field"),
    sort_order: str = Query("asc", description="Sort order"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
):
    filtered = list(meter_data)
    if search:
        q = search.lower()
        filtered = [m for m in filtered if q in m.get("meter_id","").lower() or q in m.get("zone","").lower() or q in m.get("location","").lower() or q in m.get("consumer","").lower() or q in m.get("status","").lower()]
    if zone:
        filtered = [m for m in filtered if m.get("zone","").lower() == zone.lower()]
    if status:
        filtered = [m for m in filtered if m.get("status","").lower() == status.lower()]
    if type:
        filtered = [m for m in filtered if m.get("type","").lower() == type.lower()]
    reverse = sort_order.lower() == "desc"
    if sort_by in {"meter_id","zone","load","voltage","frequency","status","type","consumer"}:
        filtered.sort(key=lambda m: m.get(sort_by,"").lower(), reverse=reverse)
    total = len(filtered)
    total_pages = max(1, (total + page_size - 1) // page_size)
    start = (page - 1) * page_size
    page_items = filtered[start:start+page_size]
    return {"items": [_meter_to_response(m) for m in page_items], "total": total, "page": page, "page_size": page_size, "total_pages": total_pages}

@router.get("/zones")
def get_zones():
    return ZONES

@router.get("/statuses")
def get_statuses():
    return STATUSES

@router.post("/", response_model=MeterResponse, status_code=201)
def create_meter(payload: MeterCreate):
    if any(m.get("meter_id","").lower() == payload.meter_id.lower() for m in meter_data):
        raise HTTPException(status_code=409, detail=f"Meter {payload.meter_id} already exists")
    new = {"id": payload.meter_id, "meter_id": payload.meter_id, "zone": payload.zone, "location": payload.location, "load": payload.load, "voltage": payload.voltage, "frequency": payload.frequency, "current": payload.current, "power_factor": payload.power_factor, "status": payload.status, "type": payload.type or "Smart Meter", "install_date": payload.install_date, "last_maintenance": payload.last_maintenance, "consumer": payload.consumer}
    meter_data.append(new)
    return _meter_to_response(new)

@router.get("/{meter_id}")
def get_meter(meter_id: str):
    meter = next((m for m in meter_data if m.get("meter_id","").lower() == meter_id.lower()), None)
    if not meter:
        raise HTTPException(status_code=404, detail=f"Meter {meter_id} not found")
    hist = next((h.get("records",[]) for h in meter_history if h.get("meter_id","").lower() == meter_id.lower()), [])
    alerts = next((a.get("alerts",[]) for a in meter_alerts if a.get("meter_id","").lower() == meter_id.lower()), [])
    tl = next((t.get("events",[]) for t in meter_timeline if t.get("meter_id","").lower() == meter_id.lower()), [])
    result = _meter_to_response(meter)
    result["history"] = hist
    result["alerts"] = alerts
    result["timeline"] = tl
    return result

@router.put("/{meter_id}", response_model=MeterResponse)
def update_meter(meter_id: str, payload: MeterUpdate):
    idx = next((i for i,m in enumerate(meter_data) if m.get("meter_id","").lower() == meter_id.lower()), None)
    if idx is None:
        raise HTTPException(status_code=404, detail=f"Meter {meter_id} not found")
    upd = payload.model_dump(exclude_none=True)
    for k,v in upd.items():
        if v is not None:
            meter_data[idx][k] = v
    return _meter_to_response(meter_data[idx])

@router.delete("/{meter_id}")
def delete_meter(meter_id: str):
    idx = next((i for i,m in enumerate(meter_data) if m.get("meter_id","").lower() == meter_id.lower()), None)
    if idx is None:
        raise HTTPException(status_code=404, detail=f"Meter {meter_id} not found")
    removed = meter_data.pop(idx)
    return {"message": f"Meter {removed['meter_id']} deleted successfully", "meter": _meter_to_response(removed)}