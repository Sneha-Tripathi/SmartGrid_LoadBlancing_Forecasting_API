"""
Notification System

Manages user notifications with support for:
- Bell icon unread counter
- Notification history with pagination
- Mark as read / mark all read
- Delete notification
- Auto-generated notifications for events
"""

import uuid
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field

from app.core.logging import get_logger
from app.utils.auth import decode_access_token
from app.services.auth_service import get_user_by_id

logger = get_logger(__name__)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)

security = HTTPBearer(auto_error=False)

# ── In-Memory Notification Store ─────────────────────

_notifications_db: dict[str, list[dict]] = {}


def _get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")
    return user


def _notif_id() -> str:
    return f"N-{uuid.uuid4().hex[:8].upper()}"


def create_notification(
    user_id: str,
    title: str,
    message: str,
    ntype: str = "info",
    link: Optional[str] = None,
):
    """Create a notification for a user. This is the internal API."""
    if user_id not in _notifications_db:
        _notifications_db[user_id] = []

    notif = {
        "id": _notif_id(),
        "title": title,
        "message": message,
        "type": ntype,
        "link": link,
        "read": False,
        "created_at": datetime.utcnow().isoformat(),
    }
    _notifications_db[user_id].insert(0, notif)
    _notifications_db[user_id] = _notifications_db[user_id][:100]
    return notif


# ── Notification types enum ──────────────────────────

NOTIFICATION_TYPES = {
    "report_generated": {"icon": "file", "color": "cyan"},
    "alert_created": {"icon": "alert", "color": "red"},
    "settings_updated": {"icon": "settings", "color": "blue"},
    "login_success": {"icon": "user", "color": "green"},
    "login_failure": {"icon": "warning", "color": "red"},
    "system_warning": {"icon": "warning", "color": "amber"},
    "info": {"icon": "info", "color": "cyan"},
}


# ── Pydantic Schemas ─────────────────────────────────

class NotificationOut(BaseModel):
    id: str
    title: str
    message: str
    type: str = "info"
    link: Optional[str] = None
    read: bool = False
    created_at: str


class PaginatedNotifications(BaseModel):
    items: List[NotificationOut]
    total: int
    unread_count: int
    page: int
    page_size: int
    total_pages: int


class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "info"
    link: Optional[str] = None


# ── Helper to seed some initial notifications ────────

def seed_notifications(user_id: str):
    """Seed sample notifications for a new user."""
    if user_id in _notifications_db and _notifications_db[user_id]:
        return
    from datetime import timedelta
    now = datetime.utcnow()
    samples = [
        {"title": "Welcome to Smart Grid", "message": "Your account has been created successfully.", "type": "login_success", "created_at": (now - timedelta(minutes=5)).isoformat()},
        {"title": "System Ready", "message": "All grid monitoring systems are operational.", "type": "info", "created_at": (now - timedelta(minutes=3)).isoformat()},
        {"title": "Report Available", "message": "Your daily grid performance report is ready for download.", "type": "report_generated", "created_at": (now - timedelta(minutes=1)).isoformat()},
    ]
    if user_id not in _notifications_db:
        _notifications_db[user_id] = []
    for s in samples:
        notif = {"id": _notif_id(), "read": False, "link": None, **s}
        _notifications_db[user_id].append(notif)


# ── API Endpoints ─────────────────────────────────────

@router.get("/", response_model=PaginatedNotifications)
def list_notifications(
    unread_only: bool = Query(False, description="Show only unread notifications"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: dict = Depends(_get_current_user),
):
    """List notifications with pagination."""
    seed_notifications(user["id"])

    all_notifs = _notifications_db.get(user["id"], [])

    if unread_only:
        all_notifs = [n for n in all_notifs if not n["read"]]

    total = len(all_notifs)
    unread_count = sum(1 for n in _notifications_db.get(user["id"], []) if not n["read"])
    total_pages = max(1, (total + page_size - 1) // page_size)
    start = (page - 1) * page_size
    page_items = all_notifs[start:start + page_size]

    return {
        "items": [NotificationOut(**n) for n in page_items],
        "total": total,
        "unread_count": unread_count,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.get("/unread-count")
def get_unread_count(user: dict = Depends(_get_current_user)):
    """Get unread notification count for bell icon badge."""
    seed_notifications(user["id"])
    notifs = _notifications_db.get(user["id"], [])
    unread = sum(1 for n in notifs if not n["read"])
    return {"unread_count": unread, "total": len(notifs)}


@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: str,
    user: dict = Depends(_get_current_user),
):
    """Mark a single notification as read."""
    notifs = _notifications_db.get(user["id"], [])
    for n in notifs:
        if n["id"] == notification_id:
            n["read"] = True
            return {"success": True, "message": "Notification marked as read"}
    raise HTTPException(status_code=404, detail="Notification not found")


@router.put("/read-all")
def mark_all_as_read(user: dict = Depends(_get_current_user)):
    """Mark all notifications as read."""
    notifs = _notifications_db.get(user["id"], [])
    count = 0
    for n in notifs:
        if not n["read"]:
            n["read"] = True
            count += 1
    return {"success": True, "message": f"{count} notifications marked as read", "count": count}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: str,
    user: dict = Depends(_get_current_user),
):
    """Delete a single notification."""
    notifs = _notifications_db.get(user["id"], [])
    idx = next((i for i, n in enumerate(notifs) if n["id"] == notification_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    removed = notifs.pop(idx)
    return {"success": True, "message": f"Notification {removed['id']} deleted"}


@router.delete("/")
def clear_all_notifications(user: dict = Depends(_get_current_user)):
    """Clear all notifications for the current user."""
    _notifications_db[user["id"]] = []
    return {"success": True, "message": "All notifications cleared"}


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_notification_api(
    payload: NotificationCreate,
    user: dict = Depends(_get_current_user),
):
    """Create a custom notification (API endpoint)."""
    notif = create_notification(user["id"], payload.title, payload.message, payload.type, payload.link)
    return {"success": True, "notification": notif}
