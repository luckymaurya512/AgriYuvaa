# AgriYuvaa — Agriculture Job Portal

Full-stack MVP implementation: **React (Vite) + Tailwind CSS** frontend and **Node.js/Express + MongoDB** backend,
built from the AgriYuvaa brand plan (black/green theme, four-role access system).

## Project Structure

```
agriyuvaa/
├── backend/     Node.js + Express API (MongoDB via Mongoose)
└── frontend/    React + Vite + Tailwind CSS client
```

## What's implemented

**Backend (Express + MongoDB)**
- JWT auth (access + refresh tokens), bcrypt password hashing
- 4 roles: `superadmin`, `admin`, `employer`, `seeker` — enforced via `authenticate` + `authorize()` middleware
- Models: User, EmployerProfile, SeekerProfile, Job, Application, Category, Notification, AuditLog
- Employer verification workflow (employers can't post jobs until approved)
- Job posting → pending → admin approval workflow
- Job search with filters (keyword, category, employment type, location, salary range) + pagination
- Application flow (apply, track status: applied → viewed → shortlisted → rejected/hired)
- Admin routes: approve/reject employers & jobs, manage users, platform stats, audit log
- Super Admin-only: create Admin accounts
- Seed script for job categories + bootstrap Super Admin account

**Frontend (React + Vite + Tailwind)**
- AgriYuvaa theme wired into `tailwind.config.js` (brand green/black palette from the logo)
- Public pages: Home (hero, search, categories, featured jobs, how-it-works), Job Listings (filters + pagination),
  Job Details (apply flow), Employers directory, About, Contact
- Auth: Login, Register (role toggle: Job Seeker / Employer)
- Role-based dashboards:
  - **Job Seeker** — application tracker
  - **Employer** — job management, post-a-job form, per-job applicant tracker
  - **Admin** — employer verification queue, job approval queue, platform stats
  - **Super Admin** — all users, suspend/reactivate, create new Admins, platform stats
- `ProtectedRoute` component enforces role-based access on the client; the API enforces it again server-side

## Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env     # edit MONGO_URI, JWT secrets, super admin credentials
npm install
npm run seed              # creates job categories + the Super Admin account
npm run dev                # starts the API on http://localhost:5000
```

Requires a running MongoDB instance (local or MongoDB Atlas) — set `MONGO_URI` in `.env` accordingly.

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # defaults to http://localhost:5000/api
npm install
npm run dev                # starts the client on http://localhost:5173
```

### 3. Log in

- Register a **Job Seeker** or **Employer** account from `/register`.
- Log in as **Super Admin** using the credentials set in `backend/.env` (`SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`)
  after running `npm run seed`.
- As Super Admin, use "+ New Admin" on `/superadmin` to create Admin accounts.
- New employer accounts must be approved from `/admin` before they can post jobs.
- New job postings must be approved from `/admin` before they appear publicly on `/jobs`.

## Not yet implemented (see the project plan doc for the full roadmap)

- File uploads (resumes, logos) — currently resume/document fields accept a URL; wire up Cloudinary via
  `multer-storage-cloudinary` (already in `package.json`) when ready.
- Email/SMS notifications (Nodemailer/Twilio are scaffolded in `.env.example` but not called yet).
- Payments for featured job listings (Razorpay).
- Multi-language (i18n) support.
- CMS-editable About/Blog content — currently static.

## Notes on the role system

- `authorize('admin', 'superadmin')` middleware in `backend/middleware/authMiddleware.js` gates every
  privileged route — see `backend/routes/adminRoutes.js` for the full permission wiring.
- Ownership checks (an employer can only edit/view its own jobs and applicants) are enforced in the
  controllers, not just the route middleware — see `jobController.js` and `applicationController.js`.
