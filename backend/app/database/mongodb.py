from __future__ import annotations

import logging
from typing import Any, Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings

logger = logging.getLogger("portfolio.database")


class DatabaseManager:
    client: Optional[Any] = None
    db: Optional[Any] = None
    using_mock: bool = False
    last_error: Optional[str] = None

    async def connect(self) -> None:
        settings = get_settings()
        try:
            kwargs: dict = {
                "serverSelectionTimeoutMS": 10000,
                "connectTimeoutMS": 10000,
            }
            if settings.MONGODB_URI.startswith("mongodb+srv://") or "tls=true" in settings.MONGODB_URI.lower():
                import certifi

                kwargs["tlsCAFile"] = certifi.where()

            client = AsyncIOMotorClient(settings.MONGODB_URI, **kwargs)
            await client.admin.command("ping")
            self.client = client
            self.db = client[settings.MONGODB_DB_NAME]
            self.using_mock = False
            self.last_error = None
            logger.info("Connected to MongoDB (db=%s)", settings.MONGODB_DB_NAME)
        except Exception as exc:
            self.last_error = f"{type(exc).__name__}: {exc}"
            if not settings.MONGODB_FALLBACK_MOCK:
                logger.error("Failed to connect to MongoDB: %s", self.last_error)
                raise
            logger.warning(
                "MongoDB unreachable (%s). Falling back to mongomock-motor for local dev/testing.",
                self.last_error,
            )
            from mongomock_motor import AsyncMongoMockClient

            self.client = AsyncMongoMockClient()
            self.db = self.client[settings.MONGODB_DB_NAME]
            self.using_mock = True

    async def disconnect(self) -> None:
        if self.client is not None and not self.using_mock:
            self.client.close()
        self.client = None
        self.db = None

    def get_db(self) -> AsyncIOMotorDatabase:
        if self.db is None:
            raise RuntimeError("Database is not initialized. Call connect() first.")
        return self.db


db_manager = DatabaseManager()


def get_database() -> AsyncIOMotorDatabase:
    return db_manager.get_db()
