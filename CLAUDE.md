# Payload CMS - Notes Projet (La Brassée)

## Stack
- Next.js App Router (`next@15`)
- Payload CMS (`payload@3.40.0`)
- React 19
- Styled-components + Framer Motion
- Base de données PostgreSQL

## Commandes utiles
- Dev: `pnpm run dev` (port `3001`)
- Build: `pnpm run build`
- Lint: `pnpm run lint`
- Générer types Payload: `pnpm run generate:types`
- Générer import map admin: `pnpm run generate:importmap`

## Architecture

### API / CMS
- Config centrale: `src/payload.config.ts`
- Collections:
  - `users`
  - `media`
  - `events`
  - `event-genres`
  - `menu-items`
  - `calendar-subscribers`
- Globals:
  - `business-info`
  - `facebook-config`
  - `system-config`

### Frontend public
- Routes: `src/app/(frontend)`
- Composants: `src/frontend/components/*`
- Chargement des données: `src/frontend/lib/payload-data.ts` (server-side avec `getPayload`)

Important:
- Ne pas réintroduire un service client type `services/cms` / hooks `useCMS`.
- Les données frontend doivent passer par `payload-data.ts` (SSR/SSG).
- Pour tout élément `position: fixed` critique (barre sticky, modal, toast, overlay) sur mobile/Safari:
  - utiliser un portal vers `document.body`
  - ajouter la gestion safe area (`bottom: max(0px, env(safe-area-inset-bottom))` si ancré en bas)
  - éviter de le laisser dans un contexte parent transformé/scrollable

## Feature: barre d’inscription calendrier

### Backend
- Endpoint: `POST /api/calendar-signup` (`src/app/api/calendar-signup/route.ts`)
- Règles:
  - Crée un abonné si email nouveau
  - Retourne `Déjà inscrit!` si email existant
  - Pose cookie `calendar_signup_subscribed=1`

### Sécurité actuelle
- Validation email
- Gestion des doublons via contrainte unique + fallback
- `origin` / `referer` check
- Rate limit en mémoire (fenêtre glissante)
- Honeypot anti-bot (`website`)
- Cookie `secure` en production

### Frontend
- Composant: `src/frontend/components/home/CalendarSignup.jsx`
- Comportement:
  - Si cookie présent: barre cachée
  - Succès ou “déjà inscrit”: coche + message puis disparition barre
  - Sur mobile, la barre est rendue via portal (`document.body`) pour rester fixée en bas

## Feature: Google Analytics (GA4)
- Intégration sur le **site public uniquement** (admin Payload non tracké).
- Package: `@next/third-parties` (composant officiel `GoogleAnalytics`).
- Wrapper: `src/frontend/components/analytics/Analytics.tsx`
- Injecté dans `src/app/(frontend)/layout.tsx` (`<body>`).
- Variable d'env: `NEXT_PUBLIC_GA_ID` (format `G-XXXXXXXXXX`).
- Actif **uniquement** si `NODE_ENV=production` ET `NEXT_PUBLIC_GA_ID` défini.
  Sinon le composant renvoie `null` (aucun script chargé, pas de tracking en dev).
- Suivi auto des changements de route App Router (`page_view`).
- Doc complète: `docs/google-analytics.md` (setup, events custom, RGPD/Loi 25).

## Types Payload
- Le fichier `src/payload-types.ts` est versionné dans git.
- Après toute modification de collection/global:
  1. `pnpm run generate:types`
  2. commit de `src/payload-types.ts`

## Variables d’environnement critiques
- `NEXT_PUBLIC_SERVER_URL`
- `DATABASE_URI`
- `PAYLOAD_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `NEXT_PUBLIC_GA_ID` (optionnel — Google Analytics, voir section dédiée)

## Problèmes fréquents

### Mixed content média en prod
Si la page HTTPS charge des URLs `http://localhost:3001/...`, vérifier:
- `NEXT_PUBLIC_SERVER_URL` en prod
- Normalisation des URLs dans `src/frontend/lib/payload-data.ts`

### Sharp module error
Si erreur binaire `sharp`, réinstaller dépendances dans le bon runtime Node (`22.x`) et reconstruire.

### Node version
Le projet exige Node `22.x` (voir `package.json`).
