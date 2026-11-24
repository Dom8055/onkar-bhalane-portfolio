from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "Onkar Bhalane Portfolio API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_PREFIX: str = "/api"
    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "onkar_portfolio"
    MONGODB_FALLBACK_MOCK: bool = True

    # JWT
    JWT_SECRET_KEY: str = "change-this-to-a-long-random-secret-key-min-32-chars"
    JWT_REFRESH_SECRET_KEY: str = "change-this-to-another-long-random-secret-key-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Initial Admin Seed
    ADMIN_EMAIL: str = "obhalane@gmail.com"
    ADMIN_NAME: str = "Onkar Bhalane"
    ADMIN_PASSWORD: str = "ChangeMe@Onkar2026!"

    # Media
    UPLOAD_DIR: str = "../uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "obhalane@gmail.com"
    CONTACT_NOTIFY_EMAIL: str = "obhalane@gmail.com"

    # Rate Limiting
    LOGIN_MAX_ATTEMPTS: int = 5
    LOGIN_LOCKOUT_MINUTES: int = 15
    CONTACT_RATE_LIMIT_PER_HOUR: int = 10

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def upload_path(self) -> Path:
        import os

        if os.environ.get("VERCEL"):
            p = Path("/tmp/uploads")
        else:
            p = Path(self.UPLOAD_DIR)
            if not p.is_absolute():
                p = (BASE_DIR / p).resolve()
        p.mkdir(parents=True, exist_ok=True)
        (p / "images").mkdir(parents=True, exist_ok=True)
        (p / "resume").mkdir(parents=True, exist_ok=True)
        return p

    @property
    def bundled_resume_dir(self) -> Path:
        assets_dir = (BASE_DIR / "assets").resolve()
        if assets_dir.exists():
            return assets_dir
        return (BASE_DIR.parent / "uploads" / "resume").resolve()


@lru_cache()
def get_settings() -> Settings:
    return Settings()
