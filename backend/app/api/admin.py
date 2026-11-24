from __future__ import annotations

import csv
import io
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status
from fastapi.responses import StreamingResponse

from app.api.deps import get_current_admin, log_activity, parse_object_id, require_roles, serialize_doc
from app.core.config import get_settings
from app.database.mongodb import get_database
from app.schemas.models import (
    AchievementCreate,
    AchievementUpdate,
    ContactAdminUpdate,
    EducationCreate,
    EducationUpdate,
    ExperienceCreate,
    ExperienceUpdate,
    ProfileUpdate,
    ProjectCreate,
    ProjectUpdate,
    ReorderRequest,
    SkillCreate,
    SkillUpdate,
    WebsiteSettingsUpdate,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin Panel"],
    dependencies=[Depends(require_roles("super_admin", "admin"))],
)

ALLOWED_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg", ".gif"}
ALLOWED_DOC_EXTENSIONS = {".pdf"}


def slugify(value: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", value).strip().lower()
    return re.sub(r"[\s_-]+", "-", s)


# ==============================================================================
# DASHBOARD OVERVIEW
# ==============================================================================
@router.get("/dashboard")
async def get_dashboard() -> Dict[str, Any]:
    db = get_database()
    total_projects = await db.projects.count_documents({})
    published_projects = await db.projects.count_documents({"is_published": True})
    draft_projects = total_projects - published_projects
    featured_projects = await db.projects.count_documents({"is_featured": True})
    total_skills = await db.skills.count_documents({})
    total_inquiries = await db.contact_messages.count_documents({})
    unread_inquiries = await db.contact_messages.count_documents({"is_read": False})
    total_media = await db.media.count_documents({})
    total_views = await db.analytics.count_documents({"event_type": "page_view"})
    resume_downloads = await db.analytics.count_documents({"event_type": "resume_download"})

    recent_messages = await db.contact_messages.find({}).sort("created_at", -1).limit(5).to_list(length=5)
    recent_activity = await db.activity_logs.find({}).sort("created_at", -1).limit(10).to_list(length=10)

    return {
        "metrics": {
            "total_projects": total_projects,
            "published_projects": published_projects,
            "draft_projects": draft_projects,
            "featured_projects": featured_projects,
            "total_skills": total_skills,
            "total_inquiries": total_inquiries,
            "unread_inquiries": unread_inquiries,
            "total_media": total_media,
            "portfolio_views": total_views,
            "resume_downloads": resume_downloads,
        },
        "recent_messages": [serialize_doc(m) for m in recent_messages],
        "recent_activity": [serialize_doc(a) for a in recent_activity],
    }


# ==============================================================================
# PROFILE MANAGEMENT
# ==============================================================================
@router.get("/profile")
async def admin_get_profile() -> Dict[str, Any]:
    db = get_database()
    doc = await db.profiles.find_one({})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return serialize_doc(doc)  # type: ignore[return-value]


@router.put("/profile")
async def admin_update_profile(
    payload: ProfileUpdate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    update_data = payload.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    update_data["updated_at"] = datetime.now(timezone.utc)

    existing = await db.profiles.find_one({})
    if existing:
        await db.profiles.update_one({"_id": existing["_id"]}, {"$set": update_data})
        updated = await db.profiles.find_one({"_id": existing["_id"]})
    else:
        update_data["created_at"] = update_data["updated_at"]
        res = await db.profiles.insert_one(update_data)
        updated = await db.profiles.find_one({"_id": res.inserted_id})

    await log_activity(admin, "update", "profile", str(updated["_id"]), "Updated profile details", request)
    return serialize_doc(updated)  # type: ignore[return-value]


# ==============================================================================
# PROJECTS CRUD
# ==============================================================================
@router.get("/projects")
async def admin_list_projects() -> List[Dict[str, Any]]:
    db = get_database()
    docs = await db.projects.find({}).sort("order", 1).to_list(length=200)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.post("/projects", status_code=status.HTTP_201_CREATED)
async def admin_create_project(
    payload: ProjectCreate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    data = payload.model_dump()
    slug = slugify(data.get("slug") or data["title"])
    if await db.projects.find_one({"slug": slug}):
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"
    data["slug"] = slug
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now

    if data["order"] == 0:
        data["order"] = (await db.projects.count_documents({})) + 1

    res = await db.projects.insert_one(data)
    created = await db.projects.find_one({"_id": res.inserted_id})
    await log_activity(admin, "create", "project", str(res.inserted_id), f"Created project '{data['title']}'", request)
    return serialize_doc(created)  # type: ignore[return-value]


@router.put("/projects/reorder")
async def admin_reorder_projects(
    payload: ReorderRequest,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    for item in payload.items:
        oid = parse_object_id(item.id)
        await db.projects.update_one({"_id": oid}, {"$set": {"order": item.order, "updated_at": datetime.now(timezone.utc)}})
    await log_activity(admin, "reorder", "project", "", f"Reordered {len(payload.items)} projects", request)
    return {"message": "Projects reordered"}


@router.put("/projects/{project_id}")
async def admin_update_project(
    project_id: str,
    payload: ProjectUpdate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    oid = parse_object_id(project_id)
    update_data = payload.model_dump(exclude_none=True)
    if "slug" in update_data and update_data["slug"]:
        update_data["slug"] = slugify(update_data["slug"])
    update_data["updated_at"] = datetime.now(timezone.utc)

    res = await db.projects.update_one({"_id": oid}, {"$set": update_data})
    if res.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    updated = await db.projects.find_one({"_id": oid})
    await log_activity(admin, "update", "project", project_id, f"Updated project '{updated['title']}'", request)
    return serialize_doc(updated)  # type: ignore[return-value]


@router.delete("/projects/{project_id}")
async def admin_delete_project(
    project_id: str,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    oid = parse_object_id(project_id)
    doc = await db.projects.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    await db.projects.delete_one({"_id": oid})
    await log_activity(admin, "delete", "project", project_id, f"Deleted project '{doc.get('title', '')}'", request)
    return {"message": "Project deleted"}


# ==============================================================================
# SKILLS CRUD
# ==============================================================================
@router.get("/skills")
async def admin_list_skills() -> List[Dict[str, Any]]:
    db = get_database()
    docs = await db.skills.find({}).sort([("category", 1), ("order", 1)]).to_list(length=300)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.post("/skills", status_code=status.HTTP_201_CREATED)
async def admin_create_skill(
    payload: SkillCreate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    data = payload.model_dump()
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now
    res = await db.skills.insert_one(data)
    created = await db.skills.find_one({"_id": res.inserted_id})
    await log_activity(admin, "create", "skill", str(res.inserted_id), f"Added skill '{data['name']}'", request)
    return serialize_doc(created)  # type: ignore[return-value]


@router.put("/skills/{skill_id}")
async def admin_update_skill(
    skill_id: str,
    payload: SkillUpdate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    oid = parse_object_id(skill_id)
    update_data = payload.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    res = await db.skills.update_one({"_id": oid}, {"$set": update_data})
    if res.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    updated = await db.skills.find_one({"_id": oid})
    await log_activity(admin, "update", "skill", skill_id, f"Updated skill '{updated['name']}'", request)
    return serialize_doc(updated)  # type: ignore[return-value]


@router.delete("/skills/{skill_id}")
async def admin_delete_skill(
    skill_id: str,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    oid = parse_object_id(skill_id)
    doc = await db.skills.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    await db.skills.delete_one({"_id": oid})
    await log_activity(admin, "delete", "skill", skill_id, f"Deleted skill '{doc.get('name', '')}'", request)
    return {"message": "Skill deleted"}


# ==============================================================================
# EXPERIENCE CRUD
# ==============================================================================
@router.get("/experience")
async def admin_list_experience() -> List[Dict[str, Any]]:
    db = get_database()
    docs = await db.experiences.find({}).sort("order", 1).to_list(length=100)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.post("/experience", status_code=status.HTTP_201_CREATED)
async def admin_create_experience(
    payload: ExperienceCreate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    data = payload.model_dump()
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now
    res = await db.experiences.insert_one(data)
    created = await db.experiences.find_one({"_id": res.inserted_id})
    await log_activity(admin, "create", "experience", str(res.inserted_id), f"Added experience at '{data['company']}'", request)
    return serialize_doc(created)  # type: ignore[return-value]


@router.put("/experience/{exp_id}")
async def admin_update_experience(
    exp_id: str,
    payload: ExperienceUpdate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    oid = parse_object_id(exp_id)
    update_data = payload.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    res = await db.experiences.update_one({"_id": oid}, {"$set": update_data})
    if res.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience not found")
    updated = await db.experiences.find_one({"_id": oid})
    await log_activity(admin, "update", "experience", exp_id, f"Updated experience at '{updated['company']}'", request)
    return serialize_doc(updated)  # type: ignore[return-value]


@router.delete("/experience/{exp_id}")
async def admin_delete_experience(
    exp_id: str,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    oid = parse_object_id(exp_id)
    doc = await db.experiences.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience not found")
    await db.experiences.delete_one({"_id": oid})
    await log_activity(admin, "delete", "experience", exp_id, f"Deleted experience at '{doc.get('company', '')}'", request)
    return {"message": "Experience deleted"}


# ==============================================================================
# EDUCATION CRUD
# ==============================================================================
@router.get("/education")
async def admin_list_education() -> List[Dict[str, Any]]:
    db = get_database()
    docs = await db.education.find({}).sort("order", 1).to_list(length=50)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.post("/education", status_code=status.HTTP_201_CREATED)
async def admin_create_education(
    payload: EducationCreate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    data = payload.model_dump()
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now
    res = await db.education.insert_one(data)
    created = await db.education.find_one({"_id": res.inserted_id})
    await log_activity(admin, "create", "education", str(res.inserted_id), f"Added education '{data['degree']}'", request)
    return serialize_doc(created)  # type: ignore[return-value]


@router.put("/education/{edu_id}")
async def admin_update_education(
    edu_id: str,
    payload: EducationUpdate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    oid = parse_object_id(edu_id)
    update_data = payload.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    res = await db.education.update_one({"_id": oid}, {"$set": update_data})
    if res.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Education record not found")
    updated = await db.education.find_one({"_id": oid})
    await log_activity(admin, "update", "education", edu_id, f"Updated education '{updated['degree']}'", request)
    return serialize_doc(updated)  # type: ignore[return-value]


@router.delete("/education/{edu_id}")
async def admin_delete_education(
    edu_id: str,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    oid = parse_object_id(edu_id)
    doc = await db.education.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Education record not found")
    await db.education.delete_one({"_id": oid})
    await log_activity(admin, "delete", "education", edu_id, f"Deleted education '{doc.get('degree', '')}'", request)
    return {"message": "Education record deleted"}


# ==============================================================================
# ACHIEVEMENTS CRUD
# ==============================================================================
@router.get("/achievements")
async def admin_list_achievements() -> List[Dict[str, Any]]:
    db = get_database()
    docs = await db.achievements.find({}).sort("order", 1).to_list(length=100)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.post("/achievements", status_code=status.HTTP_201_CREATED)
async def admin_create_achievement(
    payload: AchievementCreate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    data = payload.model_dump()
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now
    res = await db.achievements.insert_one(data)
    created = await db.achievements.find_one({"_id": res.inserted_id})
    await log_activity(admin, "create", "achievement", str(res.inserted_id), f"Added achievement '{data['title']}'", request)
    return serialize_doc(created)  # type: ignore[return-value]


@router.put("/achievements/{ach_id}")
async def admin_update_achievement(
    ach_id: str,
    payload: AchievementUpdate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    oid = parse_object_id(ach_id)
    update_data = payload.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    res = await db.achievements.update_one({"_id": oid}, {"$set": update_data})
    if res.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")
    updated = await db.achievements.find_one({"_id": oid})
    await log_activity(admin, "update", "achievement", ach_id, f"Updated achievement '{updated['title']}'", request)
    return serialize_doc(updated)  # type: ignore[return-value]


@router.delete("/achievements/{ach_id}")
async def admin_delete_achievement(
    ach_id: str,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    oid = parse_object_id(ach_id)
    doc = await db.achievements.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")
    await db.achievements.delete_one({"_id": oid})
    await log_activity(admin, "delete", "achievement", ach_id, f"Deleted achievement '{doc.get('title', '')}'", request)
    return {"message": "Achievement deleted"}


# ==============================================================================
# CONTACT INQUIRIES MANAGEMENT + CSV EXPORT
# ==============================================================================
@router.get("/messages")
async def admin_list_messages(
    status_filter: Optional[str] = Query(default=None, alias="status"),
    search: Optional[str] = Query(default=None),
) -> List[Dict[str, Any]]:
    db = get_database()
    query: Dict[str, Any] = {}
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    docs = await db.contact_messages.find(query).sort("created_at", -1).to_list(length=500)
    results = [serialize_doc(d) for d in docs]
    if search:
        q = search.strip().lower()
        results = [
            m
            for m in results
            if m
            and (
                q in m.get("name", "").lower()
                or q in m.get("email", "").lower()
                or q in m.get("subject", "").lower()
                or q in m.get("message", "").lower()
            )
        ]
    return results  # type: ignore[return-value]


@router.get("/messages/export")
async def admin_export_messages_csv():
    db = get_database()
    docs = await db.contact_messages.find({}).sort("created_at", -1).to_list(length=2000)

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["ID", "Date", "Name", "Email", "Subject", "Message", "Status", "Read", "Internal Notes"])
    for d in docs:
        s = serialize_doc(d) or {}
        writer.writerow(
            [
                s.get("id", ""),
                s.get("created_at", ""),
                s.get("name", ""),
                s.get("email", ""),
                s.get("subject", ""),
                s.get("message", ""),
                s.get("status", ""),
                s.get("is_read", False),
                s.get("internal_notes", ""),
            ]
        )
    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=portfolio_inquiries.csv"},
    )


@router.put("/messages/{msg_id}")
async def admin_update_message(
    msg_id: str,
    payload: ContactAdminUpdate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    oid = parse_object_id(msg_id)
    update_data = payload.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    res = await db.contact_messages.update_one({"_id": oid}, {"$set": update_data})
    if res.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    updated = await db.contact_messages.find_one({"_id": oid})
    await log_activity(admin, "update", "inquiry", msg_id, f"Updated inquiry status/notes", request)
    return serialize_doc(updated)  # type: ignore[return-value]


@router.delete("/messages/{msg_id}")
async def admin_delete_message(
    msg_id: str,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    oid = parse_object_id(msg_id)
    res = await db.contact_messages.delete_one({"_id": oid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    await log_activity(admin, "delete", "inquiry", msg_id, "Deleted contact inquiry", request)
    return {"message": "Inquiry deleted"}


# ==============================================================================
# WEBSITE SETTINGS & CMS
# ==============================================================================
@router.get("/settings")
async def admin_get_settings() -> Dict[str, Any]:
    db = get_database()
    doc = await db.website_settings.find_one({})
    return serialize_doc(doc) or {}


@router.put("/settings")
async def admin_update_settings(
    payload: WebsiteSettingsUpdate,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    db = get_database()
    update_data = payload.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    existing = await db.website_settings.find_one({})
    if existing:
        await db.website_settings.update_one({"_id": existing["_id"]}, {"$set": update_data})
        updated = await db.website_settings.find_one({"_id": existing["_id"]})
    else:
        update_data["created_at"] = update_data["updated_at"]
        res = await db.website_settings.insert_one(update_data)
        updated = await db.website_settings.find_one({"_id": res.inserted_id})

    await log_activity(admin, "update", "settings", str(updated["_id"]), "Updated website CMS settings", request)
    return serialize_doc(updated)  # type: ignore[return-value]


# ==============================================================================
# MEDIA LIBRARY (IMAGES & RESUME PDF UPLOAD)
# ==============================================================================
@router.get("/media")
async def admin_list_media(category: Optional[str] = Query(default=None)) -> List[Dict[str, Any]]:
    db = get_database()
    query: Dict[str, Any] = {}
    if category and category != "all":
        query["category"] = category
    docs = await db.media.find(query).sort("created_at", -1).to_list(length=300)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]


@router.post("/media/upload", status_code=status.HTTP_201_CREATED)
async def admin_upload_media(
    request: Request,
    file: UploadFile = File(...),
    category: str = Form("general"),
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, Any]:
    settings = get_settings()
    orig_name = file.filename or "upload"
    ext = Path(orig_name).suffix.lower()

    if ext not in ALLOWED_IMAGE_EXTENSIONS and ext not in ALLOWED_DOC_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Allowed: images and PDF.",
        )

    content = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit.",
        )

    is_resume = category == "resume" or ext == ".pdf"
    sub_folder = "resume" if is_resume else "images"
    safe_stem = slugify(Path(orig_name).stem) or "asset"
    unique_name = f"{safe_stem}-{uuid.uuid4().hex[:8]}{ext}"
    target_path = settings.upload_path / sub_folder / unique_name
    target_path.write_bytes(content)

    public_url = f"/uploads/{sub_folder}/{unique_name}"
    db = get_database()
    now = datetime.now(timezone.utc)
    media_doc = {
        "filename": unique_name,
        "original_name": orig_name,
        "url": public_url,
        "file_type": "pdf" if ext == ".pdf" else "image",
        "mime_type": file.content_type or "application/octet-stream",
        "size_bytes": len(content),
        "category": "resume" if is_resume else category,
        "uploaded_by": admin["email"],
        "created_at": now,
    }
    res = await db.media.insert_one(media_doc)

    # If a resume PDF was uploaded, also keep profile resume_url pointed at /api/portfolio/resume
    if is_resume:
        await db.profiles.update_one({}, {"$set": {"resume_url": "/api/portfolio/resume", "updated_at": now}})

    await log_activity(admin, "upload", "media", str(res.inserted_id), f"Uploaded '{orig_name}' ({category})", request)
    created = await db.media.find_one({"_id": res.inserted_id})
    return serialize_doc(created)  # type: ignore[return-value]


@router.delete("/media/{media_id}")
async def admin_delete_media(
    media_id: str,
    request: Request,
    admin: Dict[str, Any] = Depends(get_current_admin),
) -> Dict[str, str]:
    db = get_database()
    oid = parse_object_id(media_id)
    doc = await db.media.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found")

    settings = get_settings()
    sub_folder = "resume" if doc.get("file_type") == "pdf" else "images"
    file_path = settings.upload_path / sub_folder / doc["filename"]
    if file_path.exists():
        file_path.unlink()

    await db.media.delete_one({"_id": oid})
    await log_activity(admin, "delete", "media", media_id, f"Deleted media '{doc.get('original_name', '')}'", request)
    return {"message": "Media asset deleted"}


# ==============================================================================
# ACTIVITY LOGS
# ==============================================================================
@router.get("/activity-logs")
async def admin_list_activity_logs(limit: int = Query(default=50, ge=1, le=200)) -> List[Dict[str, Any]]:
    db = get_database()
    docs = await db.activity_logs.find({}).sort("created_at", -1).limit(limit).to_list(length=limit)
    return [serialize_doc(d) for d in docs]  # type: ignore[return-value]
