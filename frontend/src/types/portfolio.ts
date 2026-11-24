export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  website?: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
  summary: string;
  about_paragraphs: string[];
  core_competencies: string[];
  stats: HeroStat[];
  profile_image: string;
  resume_url: string;
  location: string;
  email: string;
  phone: string;
  availability_status: string;
  is_available: boolean;
  social_links: SocialLinks;
}

export interface StoreLink {
  label: string;
  platform: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  industry_badge: string;
  short_description: string;
  full_description: string;
  contribution: string[];
  technologies: string[];
  cover_image: string;
  gallery_images: string[];
  google_play_url: string;
  app_store_url: string;
  github_url: string;
  live_url: string;
  extra_links: StoreLink[];
  is_featured: boolean;
  is_published: boolean;
  order: number;
  accent_color: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon_name: string;
  icon_url: string;
  proficiency_label?: string | null;
  proficiency_level?: number | null;
  is_visible: boolean;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  is_current: boolean;
  responsibilities: string[];
  technologies: string[];
  order: number;
  is_visible: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  description: string;
  order: number;
  is_visible: boolean;
}

export interface Achievement {
  id: string;
  badge: string;
  title: string;
  description: string;
  is_published: boolean;
  order: number;
}

export interface SectionConfig {
  key: string;
  label: string;
  is_visible: boolean;
  order: number;
}

export interface WebsiteSettings {
  id?: string;
  site_title: string;
  logo_text: string;
  logo_url: string;
  favicon_url: string;
  primary_accent: string;
  secondary_accent: string;
  animations_enabled: boolean;
  custom_cursor_enabled: boolean;
  maintenance_mode: boolean;
  maintenance_message: string;
  seo_description: string;
  seo_keywords: string;
  og_image: string;
  analytics_enabled: boolean;
  ga_measurement_id: string;
  footer_tagline: string;
  copyright_text: string;
  sections: SectionConfig[];
}

export interface FullPortfolioData {
  profile: Profile;
  settings: WebsiteSettings;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  achievements: Achievement[];
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  status: 'new' | 'in_progress' | 'replied' | 'archived';
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  file_type: 'image' | 'pdf';
  mime_type: string;
  size_bytes: number;
  category: string;
  uploaded_by: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  admin_name: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardResponse {
  metrics: {
    total_projects: number;
    published_projects: number;
    draft_projects: number;
    featured_projects: number;
    total_skills: number;
    total_inquiries: number;
    unread_inquiries: number;
    total_media: number;
    portfolio_views: number;
    resume_downloads: number;
  };
  recent_messages: ContactInquiry[];
  recent_activity: ActivityLog[];
}
