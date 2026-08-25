# Pradosh Mukherjee — Full-Stack Developer Portfolio (MERN)

A premium, production-oriented personal portfolio built as a **monorepo**: a React (Vite + Tailwind + Framer Motion) frontend and a Node.js/Express + MongoDB backend, with an authenticated admin dashboard, a moderated testimonials workflow, a contact system, a blog, and a Razorpay-based "Support My Work" flow with **server-side signature verification**.

> **Status of this build:** This is a complete, runnable application. The backend is fully implemented (models, auth, security middleware, payment verification, image uploads, analytics, sitemap, email, error handling) with a passing unit-test suite. The public site and admin console are fully wired to the API. See **"What's complete vs. where to extend"** below for an honest map.

---

## Features

- **Public site:** Hero (terminal visual), animated stats, About, Services, categorised Skills, Featured project case study, Projects grid, Experience timeline, Testimonials (with public submission), Support/donation, Contact.
- **Dynamic content:** Projects, services, skills, experience, testimonials and blog posts are loaded from the API and managed in the admin.
- **Moderated testimonials:** Visitors submit feedback → stored as `pending` → admin approves/rejects → only `approved` appears publicly.
- **Contact system:** Validated inquiries stored in MongoDB with status workflow (`new → read → replied → archived`) and optional email notification.
- **Support / tips:** Preset + custom amounts, Razorpay order creation, checkout, and **backend HMAC signature verification** before a payment is marked successful. Optional public supporter attribution.
- **Admin dashboard:** JWT auth (HttpOnly cookie + bearer fallback), stat cards, Recharts graphs, and CRUD for every resource.
- **Image uploads:** admin file picker backed by Cloudinary when configured, or local-disk storage otherwise (zero external accounts needed in dev). Used for project/blog cover images and the profile photo.
- **Markdown blog:** posts authored in Markdown with a live-preview editor in the admin and GitHub-flavoured rendering on the public site.
- **Privacy-friendly analytics:** cookieless pageview tracking (hashed IPs, 180-day TTL) with an admin analytics page — views, unique visitors, top pages, referrers, and a daily trend chart.
- **Dynamic sitemap:** `/sitemap.xml` generated from published projects and posts.
- **Security:** Helmet, CORS allow-list, layered rate limiting, Zod validation, honeypot, NoSQL-injection sanitization, bcrypt hashing, consistent error envelopes.
- **Tested:** Vitest + Supertest suite covering signature verification, auth, moderation and validation (unit layer runs anywhere; integration layer runs against MongoDB).
- **SEO:** Per-page titles/meta, Open Graph, Twitter cards, canonical URLs, `robots.txt`, JSON-LD (Person + Article), `noindex` on admin.
- **UX:** Dark/light mode (persisted), subtle Framer Motion animations, reduced-motion support, toast notifications, responsive from 320px up.

---

## Tech Stack

**Frontend:** React 18, Vite, React Router, Tailwind CSS, Framer Motion, Axios, React Hook Form, Zod, Recharts, lucide-react, react-helmet-async.

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Helmet, express-rate-limit, express-mongo-sanitize, Zod, Nodemailer, Razorpay.

---

## Architecture

```
portfolio/
├── client/                     # React (Vite) frontend
│   └── src/
│       ├── components/         # Navbar, Footer, cards, admin/ResourceManager, Seo...
│       ├── sections/           # Home-page sections (Hero, Stats, Services...)
│       ├── pages/              # Public pages + pages/admin/*
│       ├── layouts/            # PublicLayout, AdminLayout
│       ├── context/            # Theme, Auth, Toast
│       ├── hooks/              # useApi, useCountUp
│       ├── services/           # axios instance
│       └── utils/              # motion variants, formatters
│
├── server/                     # Express API
│   └── src/
│       ├── config/             # env, db
│       ├── models/             # 10 Mongoose models
│       ├── controllers/        # request handlers
│       ├── routes/             # REST routers
│       ├── middleware/         # auth, error, rate limits, validate, honeypot
│       ├── services/           # email, payment (Razorpay)
│       ├── validators/         # Zod schemas
│       └── utils/              # ApiError, ApiResponse, token, seed, logger
│
├── .env.example
└── package.json                # npm workspaces + dev scripts
```

**Request flow:** `React → Axios → Express route → validate/rate-limit/auth middleware → controller → Mongoose model → MongoDB`, with every response shaped as `{ success, message, data }` (or `{ success:false, message, errors }` on failure).

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on 22)
- A MongoDB instance (local `mongod` or MongoDB Atlas connection string)

### 1. Install
```bash
npm install            # installs root + client + server (workspaces)
# or per package:
npm install --workspace server
npm install --workspace client
```

### 2. Configure environment
```bash
cp .env.example server/.env       # fill in values (see below)
cp client/.env.example client/.env
```
Set at minimum `MONGODB_URI` and a strong `JWT_SECRET` in `server/.env`.

### 3. Seed the database (creates the admin + starter content)
```bash
npm run seed
```
This creates an admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`, plus starter skills, services, projects and an experience entry.

### 4. Run in development
```bash
npm run dev            # runs API (:5000) and client (:5173) together
```
- Site: http://localhost:5173
- Admin: http://localhost:5173/admin/login
- API health: http://localhost:5000/api/health

The Vite dev server proxies `/api` to the backend so auth cookies stay same-origin.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing admin JWTs (use a long random string) |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `COOKIE_SECURE` | `true` in production (HTTPS) for secure cookies |
| `FRONTEND_URL` | Allowed CORS origin |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seed admin credentials |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payments (donations disabled if unset) |
| `SMTP_*` / `MAIL_FROM` / `ADMIN_NOTIFY_EMAIL` | Email notifications (skipped if unset) |
| `CLOUDINARY_*` | Image storage; if unset, uploads are stored on local disk |
| `PUBLIC_URL` | Where the API is reachable (used to build local upload URLs) |
| `SITE_URL` | Deployed site origin, used for `/sitemap.xml` entries |
| `VITE_API_URL` (client) | API base URL for production builds |
| `VITE_RAZORPAY_KEY_ID` (client) | Public Razorpay key (optional; server also returns it) |

**Never commit `.env`.** Secrets are only read server-side; the frontend never sees `JWT_SECRET`, DB credentials, the Razorpay secret, SMTP password or API keys.

---

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Run API + client together |
| `npm run dev:server` / `npm run dev:client` | Run one side |
| `npm run seed` | Seed admin + starter content |
| `npm run build` | Production build of the client (`client/dist`) |
| `npm start` | Start the API in production mode |
| `npm test --workspace server` | Run the backend test suite (unit + integration) |

---

## API Overview

Base URL: `/api`. Public reads are open; writes to admin resources require a valid session.

```
GET    /health
POST   /auth/login            POST /auth/logout         GET /auth/me
GET    /projects              GET  /projects/slug/:slug
GET    /projects/admin/all    POST /projects   PUT /projects/:id   DELETE /projects/:id
GET    /experience  (+ admin/all, POST, PUT, DELETE)
GET    /services    (+ admin/all, POST, PUT, DELETE)
GET    /skills      (+ admin/all, POST, PUT, DELETE)
GET    /testimonials          POST /testimonials        (public submit → pending)
GET    /testimonials/admin/all   PATCH /testimonials/:id/status   DELETE /testimonials/:id
POST   /contact               (+ admin/all, PATCH :id/status, DELETE)
POST   /donations/order       POST /donations/verify    GET /donations/supporters
GET    /donations/admin/all   GET  /donations/admin/stats
GET    /blog                  GET  /blog/slug/:slug      (+ admin/all, POST, PUT, DELETE)
GET    /settings              PUT  /settings
GET    /admin/overview
POST   /uploads               (admin — multipart image upload → { url })
POST   /analytics/track       GET  /analytics/summary    (admin)
GET    /sitemap.xml           (public, not under /api)
```

---

## Payment (Razorpay) Setup

1. Create a Razorpay account and get **Key ID** + **Key Secret** (test mode is fine to start).
2. Put them in `server/.env`.
3. Flow: client calls `POST /donations/order` → backend creates an order → Razorpay checkout opens → on success the client calls `POST /donations/verify` → **backend recomputes the HMAC-SHA256 signature** (`orderId|paymentId` with the key secret) and only then marks the donation `successful`. A frontend "success" alone never marks a payment complete.
4. To add another gateway later, implement the same `createOrder` / `verifySignature` interface in `services/payment.service.js`.

**No card numbers, CVV, or UPI PINs are ever stored** — only gateway order/payment IDs and status.

---

## Deployment

- **Backend:** deploy `server/` to Railway/Render/Fly/VPS. Set all env vars, `NODE_ENV=production`, `COOKIE_SECURE=true`, and a real `FRONTEND_URL`. Run `npm run seed` once.
- **Frontend:** `npm run build` → deploy `client/dist` to Netlify/Vercel/static host. Set `VITE_API_URL` to your API origin. If frontend and API are on different domains, keep CORS `credentials` + `FRONTEND_URL` aligned and serve both over HTTPS so the auth cookie works.
- Add a real `sitemap.xml` (a generator stub can read published projects/posts).

---

## Security Notes

- Passwords hashed with bcrypt (cost 12); JWT via HttpOnly cookie with bearer fallback.
- Rate limits: global, stricter on auth, public forms and payments.
- Zod validation on every write; honeypot + duplicate-submission guard on public forms.
- `express-mongo-sanitize` strips `$`/`.` operators; Helmet sets secure headers; CORS is origin-locked.
- Stack traces are hidden in production responses.

---

## What's complete vs. where to extend

**Fully implemented & verified:** all 10 Mongoose models; auth; every REST route (boot-tested); security middleware; Razorpay order+verify; **image uploads (Cloudinary or local disk); Markdown blog with live-preview editor; privacy-friendly analytics with an admin dashboard; dynamic sitemap**; email service; seed (now including demo blog posts and testimonials); the entire public site with custom cursor and scroll-progress micro-interactions; admin login, dashboard, analytics, and CRUD for every resource plus custom feedback-approval, messages, donations (with CSV export) and settings screens. The client passes a production `vite build`, and the backend ships a **passing unit-test suite** (`npm test --workspace server`).

**Sensible next steps:**
- **Email deliverability:** plug in a real SMTP provider (the service already fails soft when unset).
- **Integration tests in CI:** the 13 Supertest integration tests need a MongoDB instance — wire `MONGO_TEST_URI` (or allow `mongodb-memory-server` to download its binary) in your CI. See `server/tests/README.md`.
- **Richer analytics:** the current pipeline tracks pageviews; add custom events (button clicks, form completions) via the same `/analytics/track` endpoint.
- **Image optimisation:** when using local storage, add resizing/WebP conversion (e.g. `sharp`) in the storage service.

---

## License

Personal project template. Review the legal pages (`/privacy`, `/terms`, `/payment-policy`) with a professional for your jurisdiction before going live.
