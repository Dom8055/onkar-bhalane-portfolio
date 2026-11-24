# Onkar Bhalane — Premium Developer Portfolio Platform

A full-stack, dark-cinematic developer portfolio and CMS management platform built for **Onkar Bhalane — Flutter Developer | Mobile Application Engineer**.

All portfolio content is sourced directly from Onkar Bhalane's Resume and Portfolio 2026 PDFs, served dynamically from **MongoDB** via **FastAPI**, and fully manageable through a private JWT-authenticated **Admin Panel** (`/admin`).

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP + ScrollTrigger, React Three Fiber (Three.js), Lenis Smooth Scroll, Lucide React
- **Backend:** Python, FastAPI, Pydantic v2, Motor (async MongoDB), JWT (Access + Refresh tokens), bcrypt, RBAC, Rate Limiting, Swagger OpenAPI (`/api/docs`)
- **Database:** MongoDB / MongoDB Atlas (with automatic `mongomock-motor` fallback for local dev/CI when `MONGODB_FALLBACK_MOCK=true`)
- **Media & Email:** Local `/uploads` storage (optional Cloudinary), Resume PDF upload & download, SMTP contact notifications (console log fallback in dev)

---

## Monorepo Structure

```text
onkar-portfolio/
├── backend/
│   ├── app/
│   │   ├── api/           # auth.py, portfolio.py, admin.py, deps.py
│   │   ├── core/          # config.py, security.py, email_service.py
│   │   ├── database/      # mongodb.py, indexes.py, seed.py
│   │   ├── schemas/       # models.py (Pydantic v2)
│   │   └── main.py
│   ├── tests/             # test_api.py (Pytest async integration tests)
│   └── requirements.txt
├── frontend/
│   ├── public/            # favicon.svg, robots.txt, sitemap.xml
│   └── src/
│       ├── admin/         # Complete CMS Admin Panel (/admin)
│       ├── components/    # CinematicLoader, HeroCanvas3D, CustomCursor, MagneticButton, ProjectVisual, Navbar, SEOHead
│       ├── hooks/         # usePortfolio, useAuth
│       ├── pages/         # HomePage, ProjectDetailPage, NotFoundPage
│       ├── sections/      # Hero, About, Skills, Experience, Projects, Achievements, Education, Contact, Footer
│       ├── services/      # api.ts (Axios + JWT refresh interceptor)
│       └── types/         # portfolio.ts
├── uploads/               # Uploaded images & resume PDFs
├── docs/                  # Deployment guide
└── .env.example
```

---

## Quick Start (Local Development)

### 1. Configure Environment
```bash
cp .env.example backend/.env
```
Edit `backend/.env` to set `MONGODB_URI`, `JWT_SECRET_KEY`, `JWT_REFRESH_SECRET_KEY`, and `ADMIN_PASSWORD`.

### 2. Start the FastAPI Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Health: `http://127.0.0.1:8000/api/health`
- Interactive Swagger Docs: `http://127.0.0.1:8000/api/docs`

### 3. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
- Public Portfolio: `http://localhost:5173`
- Admin Panel: `http://localhost:5173/admin`
- Admin Login: `http://localhost:5173/admin/login`

### 4. Run Automated Tests
```bash
backend/.venv/bin/pytest backend/tests/test_api.py -v
cd frontend && npm run build
```

---

## Admin Panel Capabilities (`/admin`)

- **Dashboard:** KPIs (published/draft/featured projects, inquiries, portfolio views, resume downloads), recent messages, and audit activity.
- **Profile & Resume:** Edit name, title, tagline, bio, portrait image upload, availability status toggle, social links, and upload a new Resume PDF.
- **Projects CRUD:** Full create/edit/delete, publish/draft toggle, featured toggle, cover + multi-gallery screenshot uploads, store links (Google Play, App Store, GitHub, Live Demo), and display order.
- **Skills, Experience, Education, Achievements CRUD:** Dynamic management with category filtering, visibility toggles, and ordering.
- **Contact Inquiries:** Search, status filter, mark read/unread, private notes, delete, and **Export to CSV**.
- **Media Library:** Upload images & PDFs, preview, copy URL, filter by category, delete.
- **Website CMS & Settings:** Site title, monogram, primary accent color, SEO metadata, animation & custom cursor toggles, maintenance mode, homepage section visibility & reordering, and admin password update.
- **Activity Logs:** Full audit trail of admin actions.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment on MongoDB Atlas, Render/Railway, and Vercel.
