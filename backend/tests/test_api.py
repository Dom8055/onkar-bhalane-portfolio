from __future__ import annotations

import os
import sys
from pathlib import Path

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

# Ensure backend directory is on sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["MONGODB_FALLBACK_MOCK"] = "true"
os.environ["MONGODB_URI"] = "mongodb://127.0.0.1:27099"  # Force fast mock fallback in isolated tests

from app.core.config import get_settings
from app.database.indexes import ensure_indexes
from app.database.mongodb import db_manager, get_database
from app.database.seed import seed_database
from app.main import app


@pytest_asyncio.fixture(scope="module", loop_scope="module")
async def client():
    await db_manager.connect()
    db = get_database()
    await ensure_indexes(db)
    await seed_database(db)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    await db_manager.disconnect()


@pytest.mark.asyncio(loop_scope="module")
async def test_health_and_public_portfolio(client: AsyncClient):
    res = await client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    full = await client.get("/api/portfolio/full")
    assert full.status_code == 200
    data = full.json()
    assert data["profile"]["name"] == "Onkar Bhalane"
    assert len(data["projects"]) == 11
    assert len(data["experiences"]) == 4
    assert len(data["education"]) == 3
    assert len(data["achievements"]) == 5
    assert len(data["skills"]) >= 30


@pytest.mark.asyncio(loop_scope="module")
async def test_project_detail_and_contact_submission(client: AsyncClient):
    proj = await client.get("/api/portfolio/projects/purti-super-bazar")
    assert proj.status_code == 200
    assert "purtibazar" in proj.json()["google_play_url"]

    contact = await client.post(
        "/api/portfolio/contact",
        json={
            "name": "Test Recruiter",
            "email": "recruiter@example.com",
            "subject": "Flutter Lead Opportunity",
            "message": "We loved your production Flutter apps and would like to connect.",
        },
    )
    assert contact.status_code == 201
    assert "id" in contact.json()


@pytest.mark.asyncio(loop_scope="module")
async def test_admin_auth_and_crud_lifecycle(client: AsyncClient):
    settings = get_settings()

    # Unauthorized access blocked
    unauth = await client.get("/api/admin/dashboard")
    assert unauth.status_code == 401

    # Login
    login = await client.post(
        "/api/auth/login",
        json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD},
    )
    assert login.status_code == 200
    tokens = login.json()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    # Dashboard
    dash = await client.get("/api/admin/dashboard", headers=headers)
    assert dash.status_code == 200
    assert dash.json()["metrics"]["total_projects"] == 11
    assert dash.json()["metrics"]["total_inquiries"] >= 1

    # Create, update, delete a draft project
    created = await client.post(
        "/api/admin/projects",
        headers=headers,
        json={
            "title": "Test Flutter Case Study",
            "category": "FinTech",
            "short_description": "A test case study created during automated verification.",
            "technologies": ["Flutter", "Dart"],
            "is_published": False,
        },
    )
    assert created.status_code == 201
    proj_id = created.json()["id"]

    updated = await client.put(
        f"/api/admin/projects/{proj_id}",
        headers=headers,
        json={"is_featured": True},
    )
    assert updated.status_code == 200
    assert updated.json()["is_featured"] is True

    deleted = await client.delete(f"/api/admin/projects/{proj_id}", headers=headers)
    assert deleted.status_code == 200

    # Export inquiries CSV
    csv_res = await client.get("/api/admin/messages/export", headers=headers)
    assert csv_res.status_code == 200
    assert "Test Recruiter" in csv_res.text

    # Activity logs recorded
    logs = await client.get("/api/admin/activity-logs", headers=headers)
    assert logs.status_code == 200
    assert len(logs.json()) >= 3
