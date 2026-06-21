# StudyPilot AI — Backend

Standalone Node.js/Express API. See the root `README.md` for the full project status; this file is the backend-only quick reference.

## Setup

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, REDIS_URL, JWT secrets, GEMINI_API_KEY
npm run db:migrate:raw      # applies prisma/migrations/0001_init/migration.sql via psql
npm run db:seed             # 76 subjects, demo users, sample quiz content
npm run dev                 # http://localhost:4000
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start with hot reload (tsx watch) |
| `npm run build` / `npm start` | Compile to `dist/` and run the compiled output |
| `npm run typecheck` | `tsc --noEmit` — zero errors as of this build |
| `npm test` | Vitest — 38 tests against real local Postgres/Redis, Gemini SDK mocked |
| `npm run db:migrate:raw` | Apply the hand-written SQL migration directly via `psql` |
| `npm run db:migrate` / `db:generate` | Real Prisma CLI commands — only work in an environment with normal internet access (see root README) |
| `npm run db:seed` | Populate demo data |
| `npm run job:purge-old-answers` | Run the 30-day answer-retention purge once (schedule this via cron/Cloud Scheduler in production) |

## Docs

- `docs/API.md` — every endpoint, request/response shapes, error codes
- `docs/PROMPTS.md` — every Gemini prompt template and the reasoning behind it
- `docs/OFFLINE_SYNC.md` — the offline sync flow, idempotency, and conflict resolution

## Demo logins (after seeding)

All passwords: `Demo@1234`

- `student@studypilot.demo`
- `parent@studypilot.demo`
- `teacher@studypilot.demo`
- `admin@studypilot.demo`
