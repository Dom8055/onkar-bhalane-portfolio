from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Callable, Dict, Optional

from bson import ObjectId
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import decode_access_token
from app.database.mongodb import get_database

bearer_scheme = HTTPBearer(auto_error=False)


def serialize_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if doc is None:
        return None
    result: Dict[str, Any] = {}
    for k, v in doc.items():
        if k == "_id":
            result["id"] = str(v)
        elif isinstance(v, ObjectId):
            result[k] = str(v)
        elif isinstance(v, datetime):
            result[k] = v.isoformat()
        else:
            result[k] = v
    return result


def parse_object_id(id_str: str) -> ObjectId:
    if not ObjectId.is_valid(id_str):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid identifier format")
    return ObjectId(id_str)


async def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Dict[str, Any]:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db = get_database()
    admin_id = payload.get("sub")
    if not admin_id or not ObjectId.is_valid(admin_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

    admin = await db.admins.find_one({"_id": ObjectId(admin_id), "is_active": True})
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin account not found or inactive")

    return {
        "id": str(admin["_id"]),
        "name": admin["name"],
        "email": admin["email"],
        "role": admin.get("role", "admin"),
    }


def require_roles(*allowed_roles: str) -> Callable:
    async def _check_role(admin: Dict[str, Any] = Depends(get_current_admin)) -> Dict[str, Any]:
        if admin.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for this action",
            )
        return admin

    return _check_role


async def log_activity(
    admin: Dict[str, Any],
    action: str,
    entity_type: str,
    entity_id: str = "",
    details: str = "",
    request: Optional[Request] = None,
) -> None:
    db = get_database()
    ip_addr = request.client.host if request and request.client else "unknown"
    await db.activity_logs.insert_one(
        {
            "admin_id": admin.get("id", ""),
            "admin_name": admin.get("name", ""),
            "admin_email": admin.get("email", ""),
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "details": details,
            "ip_address": ip_addr,
            "created_at": datetime.now(timezone.utc),
        }
    )
