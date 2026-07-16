# Takfornying

Premium bilingual (Norwegian / English) roof-renewal marketing site with Payload CMS, built for self-hosting and future AI agent integrations.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **next-intl** — `/no` and `/en`
- **Tailwind CSS 4** + custom design tokens
- **Payload CMS 3** + PostgreSQL — content admin + leads
- **Resend** (optional) — lead email notifications
- **Docker Compose** — portable deploy anywhere

## Quick start (local)

### 1. Environment

```bash
cp .env.example .env
```

### 2. Database

**Local (default):** SQLite via `DATABASE_URL=file:./takfornying.db` — no Docker required.

**Production / optional Postgres:**

```bash
# in .env
DATABASE_URL=postgres://payload:payload@127.0.0.1:5432/takfornying
docker compose up -d db
```

### 3. Install & run

```bash
npm install --legacy-peer-deps
npm run dev
```

- Site: [http://localhost:3000/no](http://localhost:3000/no)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (create first user on first visit)

### 4. Optional email

Set `RESEND_API_KEY`, `LEAD_FROM_EMAIL`, and `LEAD_TO_EMAIL` in `.env`. Without Resend, leads are still stored in Payload (when DB is up) and logged to the server console.

## Production (Docker)

```bash
export PAYLOAD_SECRET="$(openssl rand -hex 32)"
export NEXT_PUBLIC_SITE_URL="https://your-domain.no"
docker compose up -d --build
```

The app image is **standalone** Next.js output — runs on any Node/Docker host (VPS, Hetzner, AWS, client server). Not locked to Vercel.

## Content & CMS

| Collection / Global | Purpose |
|---|---|
| Services | Service cards (NO/EN) |
| Projects | Before/after references |
| Products | Product cards |
| FAQ | Accordion + JSON-LD |
| Leads | Contact form submissions |
| Site settings | Phone, address, calculator rates, trust stats |

Marketing copy for the UI shell lives in:

- `src/i18n/messages/no.json`
- `src/i18n/messages/en.json`

Structured content defaults live in `src/content/site-content.ts` (used when CMS is empty / offline).

## Contact form / API

`POST /api/lead` validates with Zod, rate-limits, honeypot-checks, writes to Payload `leads`, and optionally emails via Resend.

Future AI agents can plug into the same route or Payload hooks without redesigning the frontend.

## Project structure

```
src/
  app/(site)/[locale]/   # Public landing
  app/(payload)/         # Admin + Payload REST
  app/api/lead/          # Lead intake
  components/            # Layout + sections + UI
  content/               # Static fallback content
  i18n/                  # Routing + messages
  payload/               # Collections + config
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run generate:types` | Payload TypeScript types |
| `npm run generate:importmap` | Payload admin import map |

## Notes

- Mobile-first: sticky call/book bar, compact hero, progressive contact form, swipeable references.
- Brand assets: replace Unsplash hero and placeholder project gradients with client photos via Media in Payload.
- Do not commit real secrets; use `.env` locally and host secrets in production.
