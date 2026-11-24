from __future__ import annotations

from typing import Any


async def ensure_indexes(db: Any) -> None:
    """Create MongoDB indexes for fast lookups and uniqueness constraints."""
    await db.admins.create_index("email", unique=True)
    await db.projects.create_index("slug", unique=True)
    await db.projects.create_index([("is_published", 1), ("order", 1)])
    await db.projects.create_index("category")
    await db.projects.create_index("is_featured")
    await db.skills.create_index([("category", 1), ("order", 1)])
    await db.experiences.create_index("order")
    await db.education.create_index("order")
    await db.achievements.create_index("order")
    await db.contact_messages.create_index([("status", 1), ("created_at", -1)])
    await db.media.create_index([("category", 1), ("created_at", -1)])
    await db.activity_logs.create_index([("created_at", -1)])
    await db.analytics.create_index([("event_type", 1), ("created_at", -1)])
