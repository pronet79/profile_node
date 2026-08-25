# Architecture & Design Analysis

This document explains the key engineering decisions behind the portfolio, why each was made, and the trade-offs involved.

## 1. Monorepo with npm workspaces
`client/` and `server/` live in one repository with a root `package.json` using workspaces and `concurrently`. One `npm install`, one `npm run dev`. This keeps env conventions and API contracts in sync and simplifies deployment reasoning, while still allowing each side to be built and deployed independently.

## 2. Consistent API envelope
Every response is `{ success, message, data }` (success) or `{ success, message, errors }` (failure). A central `errorHandler` normalises Mongoose `ValidationError`, `CastError`, and duplicate-key (`11000`) errors into typed `ApiError`s, and hides stack traces in production. The frontend axios interceptor flattens this into a predictable `{ message, errors, status }`, so UI error handling is uniform everywhere.

## 3. Authentication: cookie-first, bearer-fallback
Admin auth issues a JWT stored in an **HttpOnly cookie** (not readable by JS, mitigating XSS token theft) with `SameSite`/`Secure` driven by env. A bearer-token fallback is kept for environments where third-party cookies are blocked. `protect` middleware reads either. This is a pragmatic balance: cookies are the safer default; the fallback prevents lockout in cross-site setups.

## 4. Validation in two layers
Zod validates on the **client** (React Hook Form resolver, instant UX feedback) and again on the **server** (never trust the client). The server schemas are the source of truth; the middleware replaces `req.body` with parsed/coerced data so controllers receive clean input.

## 5. Testimonials: moderation by default
Public submissions are created with `status: 'pending'` and the public endpoint only returns `approved`. This is the core anti-abuse requirement: nothing a stranger writes reaches the live site without an explicit admin action. Duplicate-submission and honeypot guards reduce spam before it hits moderation.

## 6. Payments: the frontend is never the source of truth
The donation flow is deliberately split: the backend creates the order, and after checkout the backend **recomputes the HMAC-SHA256 signature** (`orderId|paymentId` keyed with the Razorpay secret, compared with `timingSafeEqual`) before a donation is marked `successful`. A spoofed frontend "success" changes nothing. The payment service exposes a small `createOrder`/`verifySignature` interface so a second gateway can be added without touching controllers. No sensitive payment credentials are ever persisted.

## 7. Security posture
Defence in depth rather than one control: Helmet (headers), origin-locked CORS with credentials, `express-mongo-sanitize` (NoSQL injection), layered rate limits (global < auth/forms/payments), bcrypt (cost 12), Zod validation, honeypot fields. None of these are disabled to "make things work" — that's an explicit non-goal.

## 8. Frontend performance
Routes are code-split with `React.lazy`; admin and Recharts are never shipped to public visitors (verified in the build output — `charts` and every admin screen are separate chunks). Vendor/motion/charts are manual chunks. Animations use transform/opacity and respect `prefers-reduced-motion`. Images are `loading="lazy"`.

## 9. Admin CRUD: a config-driven manager
Rather than ten near-identical admin screens, a single `ResourceManager` renders a table + modal form from a `fields`/`columns` config. Projects, experience, services, skills and blog all reuse it; feedback, messages, donations and settings are bespoke because their interactions (status transitions, stats, CSV export, nested settings) differ. This keeps ~1,500 lines of would-be boilerplate down to a few dozen lines of config per resource.

## 10. Content is data, not markup
Services, skills, projects, experience and blog posts are stored in MongoDB and rendered dynamically, with static fallbacks in the UI so the site is presentable before seeding. This is what lets the owner change the site from the admin without a redeploy.

## 11. Pluggable image storage
Uploads go through a single `storageService` with two drivers: Cloudinary when credentials are present, local disk otherwise. Controllers and the admin UI don't know or care which is active — they receive a URL. This means the app is fully functional in development with zero external accounts, and switching to Cloudinary in production is a config change, not a code change. Multer runs in memory with type and size guards, and is pinned to 2.x to avoid the known 1.x advisories.

## 12. Markdown as the content format
Blog posts are authored in Markdown and rendered with `react-markdown` + `remark-gfm`. Raw HTML is escaped by default, so even though posts are authored by a trusted admin, a paste of untrusted content can't inject scripts. The admin editor has a live preview so authors see exactly what will render.

## 13. Privacy-conscious analytics
Rather than a third-party script, pageviews post to a first-party endpoint. No cookies are set; the visitor IP is hashed (truncated SHA-256) purely for a rough unique count, and raw events auto-expire after 180 days via a TTL index. Admin routes are never tracked. This keeps the feature useful without turning the site into a data-collection liability.

## 14. Testing strategy
The suite is split so value isn't gated on infrastructure. Pure logic — signature verification, JWT, validators, middleware — is unit-tested and runs anywhere. Full HTTP flows use Supertest against a throwaway MongoDB (in-memory or `MONGO_TEST_URI`), and the harness skips rather than fails when no database is reachable, so the unit layer always provides signal. The security-critical paths (auth gating, testimonial moderation, payment verification) are covered end-to-end.

## Known limitations (intentional, documented)
- Blog content is Markdown, not a WYSIWYG editor (a deliberate trade for portability and safety).
- Local image storage serves original files; production-grade resizing/WebP is an easy `sharp` addition in the storage service.
- Integration tests require a MongoDB instance in CI (documented in `server/tests/README.md`).
- Analytics tracks pageviews; custom event tracking reuses the same endpoint but isn't wired to specific UI events yet.
