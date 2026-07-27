from typing import Optional, List
from datetime import datetime, timezone
import uuid
from app.utils.auth import hash_password, verify_password

_users = {}
_active_refresh_tokens = {}

def _create_user_id() -> str:
    return f"USR-{uuid.uuid4().hex[:8].upper()}"

def register_user(name: str, email: str, password: str, phone: Optional[str] = None) -> Optional[dict]:
    for user in _users.values():
        if user["email"].lower() == email.lower():
            return None
    now = datetime.now(timezone.utc).isoformat()
    user_id = _create_user_id()
    user = {
        "id": user_id,
        "name": name,
        "email": email.lower(),
        "password": hash_password(password),
        "role": "admin",
        "phone": phone or "",
        "avatar": "",
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }
    _users[user_id] = user
    return _sanitize_user(user)

def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["password"]):
        return None
    if not user.get("is_active", True):
        return None
    return _sanitize_user(user)

def get_user_by_id(user_id: str) -> Optional[dict]:
    user = _users.get(user_id)
    return _sanitize_user(user) if user else None

def get_user_by_email(email: str) -> Optional[dict]:
    for user in _users.values():
        if user["email"].lower() == email.lower():
            return user
    return None

def update_user_profile(user_id: str, updates: dict) -> Optional[dict]:
    user = _users.get(user_id)
    if not user:
        return None
    if "email" in updates and updates["email"]:
        new_email = updates["email"].lower()
        if new_email != user["email"]:
            existing = get_user_by_email(new_email)
            if existing and existing["id"] != user_id:
                return None
        user["email"] = new_email
    if "name" in updates and updates["name"]:
        user["name"] = updates["name"]
    if "phone" in updates:
        user["phone"] = updates.get("phone", "")
    if "avatar" in updates:
        user["avatar"] = updates.get("avatar", "")
    user["updated_at"] = datetime.now(timezone.utc).isoformat()
    return _sanitize_user(user)

def change_user_password(user_id: str, current_password: str, new_password: str) -> bool:
    user = _users.get(user_id)
    if not user:
        return False
    if not verify_password(current_password, user["password"]):
        return False
    user["password"] = hash_password(new_password)
    user["updated_at"] = datetime.now(timezone.utc).isoformat()
    return True

def store_refresh_token(jti: str, user_id: str):
    _active_refresh_tokens[jti] = user_id

def validate_refresh_token(jti: str, user_id: str) -> bool:
    stored_uid = _active_refresh_tokens.get(jti)
    return stored_uid == user_id

def revoke_refresh_token(jti: str):
    _active_refresh_tokens.pop(jti, None)

def revoke_all_user_tokens(user_id: str):
    to_remove = [jti for jti, uid in _active_refresh_tokens.items() if uid == user_id]
    for jti in to_remove:
        _active_refresh_tokens.pop(jti, None)

def seed_default_users():
    if not _users:
        register_user("Admin User", "admin@smartgrid.com", "admin123", "+1-555-0100")
        register_user("Operator", "operator@smartgrid.com", "operator123", "+1-555-0101")
        op = get_user_by_email("operator@smartgrid.com")
        if op:
            _users[op["id"]]["role"] = "operator"

def _sanitize_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "phone": user.get("phone", ""),
        "avatar": user.get("avatar", ""),
        "is_active": user.get("is_active", True),
        "created_at": user.get("created_at", ""),
        "updated_at": user.get("updated_at", ""),
    }

def deactivate_user(user_id: str, password: str) -> bool:
    """
    Deactivate a user account.

    Verifies the password before deactivating.

    Returns:
        True if deactivated successfully, False if user not found or password incorrect.
    """
    user = _users.get(user_id)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    user["is_active"] = False
    user["updated_at"] = datetime.now(timezone.utc).isoformat()
    return True


def get_all_users() -> List[dict]:
    return [_sanitize_user(u) for u in _users.values()]
