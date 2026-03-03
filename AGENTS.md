# AGENTS.md

## Scope
This repository is a Next.js + Payload CMS app (`@labrassee/cms`) that serves:
- Payload admin/API
- Public frontend (`src/app/(frontend)`)

## Runtime / Tooling
- Node: `22.x` (required)
- Package manager: `pnpm`
- Dev server: `pnpm run dev` (port `3001`)

## Key Architecture
- Payload config: `src/payload.config.ts`
- Collections: `src/collections/*`
- Frontend data loading: server-side via `getPayload` in `src/frontend/lib/payload-data.ts`
- Frontend UI: `src/frontend/components/*`

Do not reintroduce the old client-side CMS service/hook pattern (`services/cms`, `useCMS`).

### UI Positioning Rule (Important)
- For fixed overlays/bars/modals/toasts that must stay pinned on mobile/Safari, render through a portal to `document.body`.
- Reason: transformed/scroll contexts can break `position: fixed` on iOS and cause floating elements to move with page scroll.
- Also account for safe area: `bottom: max(0px, env(safe-area-inset-bottom))` when pinned at bottom.

## Calendar Signup Feature
- Collection: `calendar-subscribers`
- API endpoint: `POST /api/calendar-signup`
- Frontend bar: `src/frontend/components/home/CalendarSignup.jsx`

Expected behavior:
- Successful signup => cookie set + bar disappears.
- Existing email => message `Déjà inscrit!` with check icon + bar disappears.
- Cookie key: `calendar_signup_subscribed`

Security currently in place:
- Server-side validation
- Unique email handling
- Origin checks
- Basic in-memory rate limiting
- Honeypot field

## Important Env Vars
- `NEXT_PUBLIC_SERVER_URL` (must be production URL in production)
- `DATABASE_URI`
- `PAYLOAD_SECRET`
- `BLOB_READ_WRITE_TOKEN`

## Types
- `src/payload-types.ts` is committed in git.
- After collection/schema changes, run:
  - `pnpm run generate:types`
  - commit updated `src/payload-types.ts`

## Verification
- Type check: `pnpm exec tsc --noEmit`
- Lint: `pnpm run lint`
- Build: `pnpm run build`
