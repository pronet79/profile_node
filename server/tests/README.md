# Server Tests

Two layers, run with [Vitest](https://vitest.dev) + [Supertest](https://github.com/ladjs/supertest).

```bash
npm test            # run everything once
npm run test:watch  # watch mode
```

## Unit tests (`tests/unit.*.test.js`)
Pure-logic tests with no database. They cover the security-critical pieces:
- **Payment signature verification** — valid, forged, missing, and tampered signatures.
- **JWT tokens** — sign/verify round-trip and tamper rejection.
- **Zod validators** — login, testimonial, contact, and donation schemas.
- **Middleware** — honeypot rejection and the validation wrapper.
- **slugify** — casing, punctuation, and separator collapsing.

These run anywhere, immediately.

## Integration tests (`tests/integration.api.test.js`)
Real HTTP requests through the Express app against a throwaway MongoDB. They cover:
- Auth (bad creds → 401, good creds → cookie + token, protected routes gated).
- Testimonial moderation (public submit → `pending`, hidden until approved, honeypot blocked).
- Contact validation.
- **Donation verification** (forged signature → `failed`, valid signature → `successful`).
- Sitemap XML.

### Database for integration tests
The suite picks a database in this order:
1. `MONGO_TEST_URI` env var, if set (e.g. a local `mongod` or CI service).
2. Otherwise it starts an in-memory MongoDB via `mongodb-memory-server` (downloads a binary on first run).

If neither is reachable (e.g. an offline environment with no binary), the integration
suite **skips itself** with a message instead of failing — so `npm test` still passes on
the unit layer. To force them to run:

```bash
# Option A: point at any MongoDB
MONGO_TEST_URI="mongodb://127.0.0.1:27017/portfolio_test" npm test

# Option B: let mongodb-memory-server download a binary (needs network on first run)
npm test
```
