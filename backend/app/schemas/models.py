from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field


# ==============================================================================
# AUTHENTICATION SCHEMAS
# ==============================================================================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    admin: Dict[str, Any]


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=16)
    new_password: str = Field(..., min_length=8, max_length=128)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=8, max_length=128)


# ==============================================================================
# PROFILE SCHEMAS
# ==============================================================================
class SocialLinks(BaseModel):
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    portfolio: Optional[str] = ""
    twitter: Optional[str] = ""
    website: Optional[str] = ""


class HeroStat(BaseModel):
    value: str
    label: str


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    tagline: Optional[str] = None
    summary: Optional[str] = None
    about_paragraphs: Optional[List[str]] = None
    core_competencies: Optional[List[str]] = None
    stats: Optional[List[HeroStat]] = None
    profile_image: Optional[str] = None
    resume_url: Optional[str] = None
    location: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    availability_status: Optional[str] = None
    is_available: Optional[bool] = None
    social_links: Optional[SocialLinks] = None


# ==============================================================================
# PROJECT SCHEMAS
# ==============================================================================
class StoreLink(BaseModel):
    label: str
    platform: str  # google_play | app_store | github | live
    url: str


class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=160)
    slug: Optional[str] = None
    subtitle: Optional[str] = ""
    category: str = Field(..., min_length=2, max_length=100)
    short_description: str = Field(..., min_length=10)
    full_description: Optional[str] = ""
    contribution: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    cover_image: Optional[str] = ""
    gallery_images: List[str] = Field(default_factory=list)
    google_play_url: Optional[str] = ""
    app_store_url: Optional[str] = ""
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""
    extra_links: List[StoreLink] = Field(default_factory=list)
    is_featured: bool = False
    is_published: bool = True
    order: int = 0
    accent_color: Optional[str] = "#B68B50"
    industry_badge: Optional[str] = ""


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    subtitle: Optional[str] = None
    category: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    contribution: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    cover_image: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    google_play_url: Optional[str] = None
    app_store_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    extra_links: Optional[List[StoreLink]] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    order: Optional[int] = None
    accent_color: Optional[str] = None
    industry_badge: Optional[str] = None


# ==============================================================================
# SKILL SCHEMAS
# ==============================================================================
class SkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=2, max_length=100)
    icon_name: Optional[str] = ""
    icon_url: Optional[str] = ""
    proficiency_label: Optional[str] = None  # Only shown if explicitly configured
    proficiency_level: Optional[int] = Field(default=None, ge=0, le=100)
    is_visible: bool = True
    order: int = 0


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    icon_name: Optional[str] = None
    icon_url: Optional[str] = None
    proficiency_label: Optional[str] = None
    proficiency_level: Optional[int] = Field(default=None, ge=0, le=100)
    is_visible: Optional[bool] = None
    order: Optional[int] = None


# ==============================================================================
# EXPERIENCE SCHEMAS
# ==============================================================================
class ExperienceCreate(BaseModel):
    company: str = Field(..., min_length=2, max_length=160)
    role: str = Field(..., min_length=2, max_length=160)
    duration: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=120)
    is_current: bool = False
    responsibilities: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    order: int = 0
    is_visible: bool = True


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    location: Optional[str] = None
    is_current: Optional[bool] = None
    responsibilities: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None


# ==============================================================================
# EDUCATION SCHEMAS
# ==============================================================================
class EducationCreate(BaseModel):
    degree: str = Field(..., min_length=2, max_length=180)
    institution: str = Field(..., min_length=2, max_length=180)
    location: Optional[str] = "Nagpur"
    duration: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = ""
    order: int = 0
    is_visible: bool = True


class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None


# ==============================================================================
# ACHIEVEMENT SCHEMAS
# ==============================================================================
class AchievementCreate(BaseModel):
    badge: str = Field(..., min_length=1, max_length=24)
    title: str = Field(..., min_length=2, max_length=160)
    description: str = Field(..., min_length=10)
    is_published: bool = True
    order: int = 0


class AchievementUpdate(BaseModel):
    badge: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    is_published: Optional[bool] = None
    order: Optional[int] = None


# ==============================================================================
# CONTACT INQUIRY SCHEMAS
# ==============================================================================
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    subject: str = Field(..., min_length=2, max_length=200)
    message: str = Field(..., min_length=10, max_length=5000)
    honeypot: Optional[str] = ""  # Hidden spam trap field


class ContactAdminUpdate(BaseModel):
    is_read: Optional[bool] = None
    status: Optional[str] = Field(default=None, pattern="^(new|in_progress|replied|archived)$")
    internal_notes: Optional[str] = None


# ==============================================================================
# WEBSITE SETTINGS & CMS SCHEMAS
# ==============================================================================
class SectionConfig(BaseModel):
    key: str
    label: str
    is_visible: bool = True
    order: int = 0


class WebsiteSettingsUpdate(BaseModel):
    site_title: Optional[str] = None
    logo_text: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    primary_accent: Optional[str] = None
    secondary_accent: Optional[str] = None
    animations_enabled: Optional[bool] = None
    custom_cursor_enabled: Optional[bool] = None
    maintenance_mode: Optional[bool] = None
    maintenance_message: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    og_image: Optional[str] = None
    analytics_enabled: Optional[bool] = None
    ga_measurement_id: Optional[str] = None
    footer_tagline: Optional[str] = None
    copyright_text: Optional[str] = None
    sections: Optional[List[SectionConfig]] = None


# ==============================================================================
# ANALYTICS EVENT
# ==============================================================================
class AnalyticsEventCreate(BaseModel):
    event_type: str = Field(..., pattern="^(page_view|project_view|resume_download|store_click)$")
    path: Optional[str] = "/"
    target: Optional[str] = ""


class ReorderItem(BaseModel):
    id: str
    order: int


class ReorderRequest(BaseModel):
    items: List[ReorderItem]
