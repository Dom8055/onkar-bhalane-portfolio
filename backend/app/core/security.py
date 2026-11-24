from __future__ import annotations

import secrets
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

import bcrypt
from jose import JWTError, jwt

from app.core.config import get_settings


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def create_access_token(subject: str, role: str, email: str) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": subject,
        "role": role,
        "email": email,
        "type": "access",
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str, role: str, email: str) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": subject,
        "role": role,
        "email": email,
        "type": "refresh",
        "jti": secrets.token_urlsafe(16),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_REFRESH_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None


def decode_refresh_token(token: str) -> Optional[Dict[str, Any]]:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.JWT_REFRESH_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            return None
        return payload
    except JWTError:
        return None


def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)


class RateLimiter:
    """In-memory sliding window rate limiter for login attempts and contact submissions."""

    def __init__(self) -> None:
        self._attempts: Dict[str, List[datetime]] = defaultdict(list)

    def _prune(self, key: str, window_seconds: int) -> None:
        cutoff = datetime.now(timezone.utc) - timedelta(seconds=window_seconds)
        self._attempts[key] = [ts for ts in self._attempts[key] if ts > cutoff]

    def is_limited(self, key: str, max_attempts: int, window_seconds: int) -> Tuple[bool, int]:
        self._prune(key, window_seconds)
        count = len(self._attempts[key])
        if count >= max_attempts:
            oldest = self._attempts[key][0]
            retry_after = int((oldest + timedelta(seconds=window_seconds) - datetime.now(timezone.utc)).total_seconds())
            return True, max(retry_after, 1)
        return False, 0

    def record(self, key: str) -> None:
        self._attempts[key].append(datetime.now(timezone.utc))

    def clear(self, key: str) -> None:
        self._attempts.pop(key, None)


login_rate_limiter = RateLimiter()
contact_rate_limiter = RateLimiter()
