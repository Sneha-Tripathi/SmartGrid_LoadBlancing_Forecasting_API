"""
Settings Module

Persists user settings (theme, language, timezone, compact mode)
in memory and exposes CRUD endpoints.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field

from app.core.logging import get_logger
from app.utils.auth import decode_access_token
from app.services.auth_service import get_user_by_id

logger = get_logger(__name__)

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)

security = HTTPBearer(auto_error=False)

# ── In-Memory Settings Store ──────────────────────────

_settings_db: dict[str, dict] = {}
DEFAULT_SETTINGS = {
    "theme": "dark",
    "language": "en",
    "timezone": "UTC",
    "compactView": False,
    "emailAlerts": True,
    "pushAlerts": True,
    "criticalAlerts": True,
    "weeklyDigest": False,
    "autoRefresh": True,
    "refreshInterval": "30",
    "dataRetention": "90",
    "twoFactor": False,
    "sessionTimeout": "30",
}


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


class SettingsUpdate(BaseModel):
    theme: Optional[str] = Field(None, pattern="^(dark|light|system)$")
    language: Optional[str] = Field(None, pattern="^(en|es|fr|de)$")
    timezone: Optional[str] = None
    compactView: Optional[bool] = None
    emailAlerts: Optional[bool] = None
    pushAlerts: Optional[bool] = None
    criticalAlerts: Optional[bool] = None
    weeklyDigest: Optional[bool] = None
    autoRefresh: Optional[bool] = None
    refreshInterval: Optional[str] = None
    dataRetention: Optional[str] = None
    twoFactor: Optional[bool] = None
    sessionTimeout: Optional[str] = None


class SettingsResponse(BaseModel):
    theme: str = "dark"
    language: str = "en"
    timezone: str = "UTC"
    compactView: bool = False
    emailAlerts: bool = True
    pushAlerts: bool = True
    criticalAlerts: bool = True
    weeklyDigest: bool = False
    autoRefresh: bool = True
    refreshInterval: str = "30"
    dataRetention: str = "90"
    twoFactor: bool = False
    sessionTimeout: str = "30"


def _get_user_settings(user_id: str) -> dict:
    if user_id not in _settings_db:
        _settings_db[user_id] = dict(DEFAULT_SETTINGS)
    return _settings_db[user_id]


@router.get("/", response_model=SettingsResponse)
def get_settings(user: dict = Depends(_get_current_user)):
    """Get current user settings."""
    settings = _get_user_settings(user["id"])
    return SettingsResponse(**settings)


@router.put("/", response_model=SettingsResponse)
def update_settings(
    payload: SettingsUpdate,
    user: dict = Depends(_get_current_user),
):
    """Update user settings."""
    current = _get_user_settings(user["id"])
    updates = payload.model_dump(exclude_none=True)
    changed_keys = []

    for key, value in updates.items():
        if key in current:
            current[key] = value
            changed_keys.append(key)

    if changed_keys:
        try:
            from app.routers.notifications import create_notification
            create_notification(
                user["id"],
                "Settings Updated",
                f"Settings updated: {', '.join(k.replace('_', ' ').title() for k in changed_keys)}",
                "settings_updated"
            )
        except Exception as e:
            logger.warning(f"Failed to create notification: {e}")

    return SettingsResponse(**current)


@router.put("/{key}", response_model=SettingsResponse)
def update_single_setting(
    key: str,
    value: dict,
    user: dict = Depends(_get_current_user),
):
    """Update a single setting by key."""
    current = _get_user_settings(user["id"])
    new_value = value.get("value")

    if key not in current:
        raise HTTPException(status_code=400, detail=f"Invalid setting key: {key}")

    current[key] = new_value

    try:
        from app.routers.notifications import create_notification
        create_notification(
            user["id"],
            "Settings Updated",
            f"{key.replace('_', ' ').title()} has been updated.",
            "settings_updated"
        )
    except Exception as e:
        logger.warning(f"Failed to create notification: {e}")

    return SettingsResponse(**current)


@router.post("/reset", response_model=SettingsResponse)
def reset_settings(user: dict = Depends(_get_current_user)):
    """Reset settings to defaults."""
    _settings_db[user["id"]] = dict(DEFAULT_SETTINGS)

    try:
        from app.routers.notifications import create_notification
        create_notification(
            user["id"],
            "Settings Reset",
            "All settings have been reset to defaults.",
            "settings_updated"
        )
    except Exception as e:
        logger.warning(f"Failed to create notification: {e}")

    return SettingsResponse(**DEFAULT_SETTINGS)
