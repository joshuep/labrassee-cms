# Google Analytics (GA4)

Intégration de Google Analytics 4 sur le **site public uniquement** (l'admin Payload
n'est pas tracké), via le composant officiel `@next/third-parties/google`.

## Vue d'ensemble

| Élément | Emplacement |
| --- | --- |
| Package | `@next/third-parties` (officiel Next.js / Google) |
| Composant wrapper | `src/frontend/components/analytics/Analytics.tsx` |
| Point d'injection | `src/app/(frontend)/layout.tsx` (dans le `<body>`) |
| Variable d'env | `NEXT_PUBLIC_GA_ID` |

Le tracking est **actif uniquement** quand **les deux** conditions sont remplies :

1. `process.env.NODE_ENV === 'production'` (donc pas en `pnpm run dev`)
2. `NEXT_PUBLIC_GA_ID` est défini et non vide

Sinon, le composant `Analytics` renvoie `null` : aucun script gtag.js n'est chargé,
et il n'y a aucune collecte de données.

## Mise en place

### 1. Obtenir un ID de mesure GA4

1. Aller sur [Google Analytics](https://analytics.google.com/).
2. **Admin → Créer une propriété** (ou utiliser une propriété GA4 existante).
3. Créer un **flux de données Web** pour le domaine du site.
4. Copier l'**ID de mesure**, au format `G-XXXXXXXXXX`.

> ⚠️ GA4 utilise un ID `G-...`. Les anciens identifiants Universal Analytics
> (`UA-...`) ne sont plus supportés.

### 2. Configurer la variable d'environnement

Dans `.env` (local) et dans la configuration de l'hébergeur (ex. Vercel →
Project Settings → Environment Variables) :

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Le préfixe `NEXT_PUBLIC_` est **obligatoire** : la variable doit être exposée au
navigateur pour que gtag.js fonctionne.

### 3. Déployer en production

Le tracking ne s'active qu'en build de production (`pnpm run build` + `pnpm start`,
ou via le déploiement Vercel). En local (`pnpm run dev`), GA reste désactivé même
si `NEXT_PUBLIC_GA_ID` est défini.

## Fonctionnement

- Le composant `GoogleAnalytics` de `@next/third-parties` charge `gtag.js` de
  manière optimisée (script `afterInteractive`).
- Les **changements de route côté client** (navigation App Router) sont suivis
  automatiquement comme des `page_view` — aucune configuration manuelle requise.

## Envoyer des événements personnalisés

Pour tracker une action spécifique (clic sur un bouton, inscription, etc.),
utiliser le helper `sendGAEvent` depuis un composant client :

```tsx
'use client'
import { sendGAEvent } from '@next/third-parties/google'

export function BoutonInscription() {
  return (
    <button
      onClick={() => sendGAEvent('event', 'inscription_calendrier', { method: 'barre_accueil' })}
    >
      S'inscrire
    </button>
  )
}
```

## Vérifier que ça fonctionne

1. Déployer en production avec `NEXT_PUBLIC_GA_ID` défini.
2. Ouvrir le site et vérifier dans les DevTools (onglet Network) le chargement de
   `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`.
3. Dans Google Analytics : **Rapports → Temps réel**, naviguer sur le site et
   vérifier que la session apparaît.

## Confidentialité / RGPD

> Cette intégration charge GA dès le chargement de page, sans bannière de
> consentement. Selon la juridiction et l'audience (UE/Québec — Loi 25), il peut
> être nécessaire d'ajouter un **bandeau de consentement** et de conditionner le
> chargement de GA à l'acceptation de l'utilisateur. Adapter `Analytics.tsx` en
> conséquence (ex. n'injecter `<GoogleAnalytics />` qu'après consentement).
