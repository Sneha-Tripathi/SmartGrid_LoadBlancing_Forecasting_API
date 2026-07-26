import uuid
from datetime import timedelta

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.schemas.auth import (
    UserCreate,
    UserLogin,
    TokenResponse,
    RefreshRequest,
    ChangePasswordRequest,
    UpdateProfileRequest,
    UserResponse,
    UserWithToken,
)
from app.utils.auth import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    decode_refresh_token,
    get_token_expires_in,
)
from app.services.auth_service import (
    register_user,
    authenticate_user,
    get_user_by_id,
    update_user_profile,
    change_user_password,
    store_refresh_token,
    validate_refresh_token,
    revoke_refresh_token,
    revoke_all_user_tokens,
    seed_default_users,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

ACCESS_EXPIRE_MINUTES = 30
REFRESH_EXPIRE_DAYS = 7

seed_default_users()

def _get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated", headers={"WWW-Authenticate": "Bearer"})
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token", headers={"WWW-Authenticate": "Bearer"})
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")
    return user

def _create_tokens(user_id: str) -> dict:
    token_jti = uuid.uuid4().hex
    access_token = create_access_token({"sub": user_id, "jti": uuid.uuid4().hex}, timedelta(minutes=ACCESS_EXPIRE_MINUTES))
    refresh_token = create_refresh_token({"sub": user_id, "jti": token_jti}, timedelta(days=REFRESH_EXPIRE_DAYS))
    store_refresh_token(token_jti, user_id)
    expires_in = get_token_expires_in(access_token)
    return {"access_token": access_token, "refresh_token": refresh_token, "expires_in": expires_in}

@router.post("/register", response_model=UserWithToken, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate):
    user = register_user(payload.name, payload.email, payload.password, payload.phone)
    if user is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    tokens = _create_tokens(user["id"])
    return {**user, **tokens, "token_type": "bearer"}

@router.post("/login", response_model=UserWithToken)
def login(payload: UserLogin):
    user = authenticate_user(payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    tokens = _create_tokens(user["id"])
    return {**user, **tokens, "token_type": "bearer"}

@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest):
    payload_data = decode_refresh_token(payload.refresh_token)
    if payload_data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")
    user_id = payload_data.get("sub")
    jti = payload_data.get("jti")
    if not user_id or not jti:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token payload")
    if not validate_refresh_token(jti, user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token has been revoked")
    revoke_refresh_token(jti)
    user = get_user_by_id(user_id)
    if not user or not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or deactivated")
    tokens = _create_tokens(user_id)
    return {**tokens, "token_type": "bearer"}

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(payload: RefreshRequest):
    payload_data = decode_refresh_token(payload.refresh_token)
    if payload_data:
        jti = payload_data.get("jti")
        if jti:
            revoke_refresh_token(jti)
    return {"message": "Logged out successfully"}

@router.post("/logout-all", status_code=status.HTTP_200_OK)
def logout_all(user: dict = Depends(_get_current_user)):
    revoke_all_user_tokens(user["id"])
    return {"message": "Logged out from all devices"}

@router.get("/me", response_model=UserResponse)
def get_me(user: dict = Depends(_get_current_user)):
    return user

@router.put("/profile", response_model=UserResponse)
def update_profile(payload: UpdateProfileRequest, user: dict = Depends(_get_current_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updated = update_user_profile(user["id"], updates)
    if updated is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")
    return updated

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(payload: ChangePasswordRequest, user: dict = Depends(_get_current_user)):
    success = change_user_password(user["id"], payload.current_password, payload.new_password)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    return {"message": "Password changed successfully"}
