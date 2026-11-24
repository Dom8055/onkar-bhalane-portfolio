# Production Deployment Guide

## 1. MongoDB Atlas Setup
1. Create a free or dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user with `readWrite` privileges on `onkar_portfolio`.
3. Whitelist your backend host IP (or `0.0.0.0/0` with strong credentials).
4. Copy the connection string:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=onkar_portfolio
   MONGODB_FALLBACK_MOCK=false
   ```

## 2. Backend Deployment (Render / Railway / Fly.io)
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Required Production Environment Variables:**
  - `ENVIRONMENT=production`
  - `DEBUG=false`
  - `MONGODB_URI=<atlas-uri>`
  - `MONGODB_FALLBACK_MOCK=false`
  - `JWT_SECRET_KEY=<64-char-random-secret>`
  - `JWT_REFRESH_SECRET_KEY=<64-char-random-secret>`
  - `ADMIN_EMAIL=obhalane@gmail.com`
  - `ADMIN_PASSWORD=<strong-unique-password>`
  - `CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com`
  - `FRONTEND_URL=https://your-domain.com`
  - Optional SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`) for contact form email notifications.
  - Optional Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) for persistent cloud image storage.

## 3. Frontend Deployment (Vercel / Netlify)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:**
  - `VITE_API_URL=https://api.your-domain.com/api`
- Configure SPA fallback rewrite (`/* -> /index.html`) so `/projects/:slug` and `/admin/*` resolve cleanly on direct page reloads.

## 4. Post-Deployment Security Checklist
- [ ] Sign in at `/admin/login` and immediately rotate `ADMIN_PASSWORD` via **CMS & Settings -> Change Admin Password**.
- [ ] Upload high-resolution portrait and real application screenshots via **Admin -> Media Library / Projects**.
- [ ] Verify `/api/health` reports `"database": "mongodb"` (not `mongomock`).
- [ ] Test contact form submission and verify email notification delivery.
