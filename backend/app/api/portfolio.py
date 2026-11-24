from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, Request, status
from fastapi.responses import FileResponse

from app.api.deps import serialize_doc
from app.core.config import get_settings
from app.core.email_service import notify_new_contact_inquiry
from app.core.security import contact_rate_limiter
from app.database.mongodb import get_database
from app.schemas.models import AnalyticsEventCreate, ContactCreate

router = APIRouter(prefix="/portfolio", tags=["Public Portfolio"])


@router.get("/profile")
async def get_profile() -> Dict[str, Any]:
    db = get_database()
    doc = await db.profiles.find_one({})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return serialize_doc(doc)  # type: ignore[return-value]


@router.get("/settings")
async def get_public_settings() -> Dict[str, Any]:
    db = get_database()
    doc = await db.website_settings.find_one({})
    if not doc:
        return {}
    return serialize_doc(doc)  # type: ignore[return-value]


@router.get("/projects")
async def list_projects(
    category: Optional[str] = Query(default=None),
    featured: Optional[bool] = Query(default=None),
    search: Optional[str] = Query(default=None),
) -> List[Dict[str, Any]]:
    db = get_database()
    query: Dict[str, Any] = {"is_published": True}
    if category and category.lower() != "all":
        query["category"] = category
    if featured is not None:
        query["is_featured"] = featured

    cursor = db.projects.find(query).sort("order", 1)
    docs = await cursor.to_list(length=100)
    results = [serialize_doc(d) for d in docs]

    if search:
        q = search.strip().lower()
        results = [
            p
            for p in results
            if p
            and (
                q in p.get("title", "").lower()
                or q in p.get("short_description", "").lower()
                or q in p.get("category", "").lower()
                or any(q in t.lower() for t in p.get("technologies", []))
            )
        ]
    return results  # type: ignore[return-value]


@router.get("/projects/{slug}")
async def get_project_by_slug(slug: str) -> Dict[str, Any]:
    db = get_database()
    doc = await db.projects.find_one({"slug": slug, "is_published": True})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return serialize_doc(doc)  # type: ignore[return-value]


@router.get("/skills")
async def list_skills(category: Optional[str] = Query(default=None)) -> List[Dict[str, Any]]:
    db = get_database()
    query: Dict[str, Any] = {"is_visible": True}
    if category and category.lower() != "all":
        query["category"] = category
    docs = await db.skills.find(query).sort([("category", 1), ("order", 1)]).to_list(length=200)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.get("/experience")
async def list_experience() -> List[Dict[str, Any]]:
    db = get_database()
    docs = await db.experiences.find({"is_visible": True}).sort("order", 1).to_list(length=50)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.get("/education")
async def list_education() -> List[Dict[str, Any]]:
    db = get_database()
    docs = await db.education.find({"is_visible": True}).sort("order", 1).to_list(length=50)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.get("/achievements")
async def list_achievements() -> List[Dict[str, Any]]:
    db = get_database()
    docs = await db.achievements.find({"is_published": True}).sort("order", 1).to_list(length=50)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.get("/full")
async def get_full_portfolio() -> Dict[str, Any]:
    """Single aggregated endpoint for fast initial page hydration."""
    db = get_database()
    profile = await db.profiles.find_one({})
    settings = await db.website_settings.find_one({})
    projects = await db.projects.find({"is_published": True}).sort("order", 1).to_list(length=100)
    skills = await db.skills.find({"is_visible": True}).sort([("category", 1), ("order", 1)]).to_list(length=200)
    experiences = await db.experiences.find({"is_visible": True}).sort("order", 1).to_list(length=50)
    education = await db.education.find({"is_visible": True}).sort("order", 1).to_list(length=50)
    achievements = await db.achievements.find({"is_published": True}).sort("order", 1).to_list(length=50)

    return {
        "profile": serialize_doc(profile),
        "settings": serialize_doc(settings),
        "projects": [serialize_doc(d) for d in projects],
        "skills": [serialize_doc(d) for d in skills],
        "experiences": [serialize_doc(d) for d in experiences],
        "education": [serialize_doc(d) for d in education],
        "achievements": [serialize_doc(d) for d in achievements],
    }


@router.post("/contact", status_code=status.HTTP_201_CREATED)
async def submit_contact(payload: ContactCreate, request: Request) -> Dict[str, Any]:
    # Honeypot spam check
    if payload.honeypot and payload.honeypot.strip():
        return {"message": "Thank you for reaching out. Your message has been received."}

    settings = get_settings()
    client_ip = request.client.host if request.client else "unknown"
    limited, retry_after = contact_rate_limiter.is_limited(
        f"contact:{client_ip}", settings.CONTACT_RATE_LIMIT_PER_HOUR, 3600
    )
    if limited:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Please try again in {retry_after} seconds.",
        )

    contact_rate_limiter.record(f"contact:{client_ip}")
    db = get_database()
    now = datetime.now(timezone.utc)
    doc = {
        "name": payload.name.strip(),
        "email": payload.email.lower().strip(),
        "subject": payload.subject.strip(),
        "message": payload.message.strip(),
        "is_read": False,
        "status": "new",
        "internal_notes": "",
        "ip_address": client_ip,
        "created_at": now,
        "updated_at": now,
    }
    res = await db.contact_messages.insert_one(doc)
    await notify_new_contact_inquiry(doc["name"], doc["email"], doc["subject"], doc["message"])
    return {
        "id": str(res.inserted_id),
        "message": "Thank you for your message! Onkar will get back to you shortly.",
    }


@router.post("/analytics", status_code=status.HTTP_202_ACCEPTED)
async def track_event(payload: AnalyticsEventCreate, request: Request) -> Dict[str, str]:
    db = get_database()
    settings_doc = await db.website_settings.find_one({})
    if settings_doc and not settings_doc.get("analytics_enabled", True):
        return {"status": "disabled"}

    await db.analytics.insert_one(
        {
            "event_type": payload.event_type,
            "path": payload.path or "/",
            "target": payload.target or "",
            "user_agent": request.headers.get("user-agent", "")[:200],
            "created_at": datetime.now(timezone.utc),
        }
    )
    return {"status": "recorded"}


@router.get("/resume")
async def download_resume():
    """Serve the latest uploaded resume PDF (or the seeded resume PDF)."""
    settings = get_settings()
    resume_dir = settings.upload_path / "resume"
    pdf_files = sorted(resume_dir.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not pdf_files:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume PDF has not been uploaded yet. Upload one via Admin > Profile.",
        )
    latest = pdf_files[0]
    return FileResponse(
        path=str(latest),
        media_type="application/pdf",
        filename="Onkar_Bhalane_Flutter_Developer_Resume.pdf",
    )
