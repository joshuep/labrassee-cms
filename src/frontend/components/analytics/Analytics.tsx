import { GoogleAnalytics } from '@next/third-parties/google'
import React from 'react'

/**
 * Google Analytics (GA4) pour le site public uniquement.
 *
 * - Lit l'ID de mesure depuis `NEXT_PUBLIC_GA_ID` (format `G-XXXXXXXXXX`).
 * - Ne s'active qu'en production et seulement si l'ID est défini : aucun
 *   tracking en développement (`pnpm run dev`) ni quand la variable est absente.
 * - Le composant `GoogleAnalytics` de `@next/third-parties` charge gtag.js de
 *   façon optimisée et gère automatiquement les changements de route côté client
 *   (navigation App Router) sans configuration supplémentaire.
 *
 * Voir `docs/google-analytics.md` pour la mise en place complète.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  if (process.env.NODE_ENV !== 'production' || !gaId) {
    return null
  }

  return <GoogleAnalytics gaId={gaId} />
}
