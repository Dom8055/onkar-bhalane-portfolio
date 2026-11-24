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

    async def connect(self) -> None:
        settings = get_settings()
        try:
            client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2500,
                connectTimeoutMS=2500,
            )
            await client.admin.command("ping")
            self.client = client
            self.db = client[settings.MONGODB_DB_NAME]
            self.using_mock = False
            logger.info("Connected to MongoDB at %s (db=%s)", settings.MONGODB_URI, settings.MONGODB_DB_NAME)
        except Exception as exc:
            if not settings.MONGODB_FALLBACK_MOCK:
                logger.error("Failed to connect to MongoDB: %s", exc)
                raise
            logger.warning(
                "MongoDB unreachable (%s). Falling back to mongomock-motor for local dev/testing.",
                exc,
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
