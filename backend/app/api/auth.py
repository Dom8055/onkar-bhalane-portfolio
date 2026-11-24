from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.api.deps import get_current_admin, log_activity
from app.core.config import get_settings
from app.core.email_service import send_password_reset_email
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    generate_reset_token,
    hash_password,
    login_rate_limiter,
    verify_password,
)
from app.database.mongodb import get_database
from app.schemas.models import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RefreshRequest,
    ResetPasswordRequest,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, request: Request) -> Dict[str, Any]:
    settings = get_settings()
    email = payload.email.lower().strip()
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"{client_ip}:{email}"

    limited, retry_after = login_rate_limiter.is_limited(
        rate_key, settings.LOGIN_MAX_ATTEMPTS, settings.LOGIN_LOCKOUT_MINUTES * 60
    )
    if limited:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed login attempts. Try again in {retry_after} seconds.",
        )

    db = get_database()
    admin = await db.admins.find_one({"email": email, "is_active": True})
    if not admin or not verify_password(payload.password, admin["password_hash"]):
        login_rate_limiter.record(rate_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    login_rate_limiter.clear(rate_key)
    admin_id = str(admin["_id"])
    role = admin.get("role", "super_admin")
    access_token = create_access_token(admin_id, role, admin["email"])
    refresh_token = create_refresh_token(admin_id, role, admin["email"])

    now = datetime.now(timezone.utc)
    await db.admins.update_one(
        {"_id": admin["_id"]},
        {"$set": {"last_login_at": now, "updated_at": now}},
    )

    admin_info = {
        "id": admin_id,
        "name": admin["name"],
        "email": admin["email"],
        "role": role,
    }
    await log_activity(admin_info, "login", "auth", admin_id, "Admin signed in", request)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "admin": admin_info,
    }


@router.post("/refresh")
async def refresh_token(payload: RefreshRequest) -> Dict[str, Any]:
    settings = get_settings()
    decoded = decode_refresh_token(payload.refresh_token)
    if not decoded:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    db = get_database()
    jti = decoded.get("jti")
    if jti and await db.revoked_tokens.find_one({"jti": jti}):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token has been revoked")

    admin_id = decoded.get("sub")
    if not admin_id or not ObjectId.is_valid(admin_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token subject")

    admin = await db.admins.find_one({"_id": ObjectId(admin_id), "is_active": True})
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin account inactive")

    role = admin.get("role", "super_admin")
    new_access = create_access_token(admin_id, role, admin["email"])
    return {
        "access_token": new_access,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


@router.post("/logout")
async def logout(
    request: Request,
    payload: RefreshRequest = None,  # type: ignore[assignment]
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    if payload and payload.refresh_token:
        decoded = decode_refresh_token(payload.refresh_token)
        if decoded and decoded.get("jti"):
            await db.revoked_tokens.insert_one(
                {"jti": decoded["jti"], "revoked_at": datetime.now(timezone.utc)}
            )
    await log_activity(admin, "logout", "auth", admin["id"], "Admin signed out", request)
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_me(admin: Dict[str, Any] = Depends(get_current_admin)) -> Dict[str, Any]:
    return admin


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest) -> Dict[str, Any]:
    db = get_database()
    email = payload.email.lower().strip()
    admin = await db.admins.find_one({"email": email, "is_active": True})

    # Always return generic message to avoid account enumeration
    response: Dict[str, Any] = {
        "message": "If an administrator account exists for this email, a password reset link has been sent."
    }
    if admin:
        token = generate_reset_token()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
        await db.admins.update_one(
            {"_id": admin["_id"]},
            {"$set": {"reset_token": token, "reset_token_expires": expires_at}},
        )
        await send_password_reset_email(email, token)
        if get_settings().DEBUG and not get_settings().SMTP_HOST:
            response["dev_reset_token"] = token
    return response


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest) -> Dict[str, str]:
    db = get_database()
    now = datetime.now(timezone.utc)
    admin = await db.admins.find_one({"reset_token": payload.token})
    if not admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    expires = admin.get("reset_token_expires")
    if expires:
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        if expires < now:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token has expired")

    await db.admins.update_one(
        {"_id": admin["_id"]},
        {
            "$set": {"password_hash": hash_password(payload.new_password), "updated_at": now},
            "$unset": {"reset_token": "", "reset_token_expires": ""},
        },
    )
    return {"message": "Password has been reset successfully. You may now sign in."}


@router.post("/change-password")
async def change_password(
    payload: ChangePasswordRequest,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    admin_doc = await db.admins.find_one({"_id": ObjectId(admin["id"])})
    if not admin_doc or not verify_password(payload.current_password, admin_doc["password_hash"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    await db.admins.update_one(
        {"_id": admin_doc["_id"]},
        {"$set": {"password_hash": hash_password(payload.new_password), "updated_at": datetime.now(timezone.utc)}},
    )
    await log_activity(admin, "change_password", "auth", admin["id"], "Changed admin password", request)
    return {"message": "Password updated successfully"}
