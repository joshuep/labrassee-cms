import React from 'react'
import type { Metadata } from 'next'

import Proposer from '@/frontend/pages/Proposer'
import { getCalendrierMois } from '@/frontend/lib/dates-libres'
import { getDossierTechnique } from '@/frontend/lib/surlascene-data'

export const metadata: Metadata = {
  title: 'Viens te faire voir — La Brassée',
  description:
    "Tu veux exposer aux murs ou jouer sur notre scène ? Modes d'emploi, calendrier des dates libres, dossier technique et contact pour les artistes invité·e·s.",
}

// Le calendrier bouge à chaque nouveau concert ajouté (sync Apple → Supabase
// toutes les 2h). Regen 1h pour rester frais sans flooder.
export const revalidate = 3600

export default async function ProposerPage() {
  // 8 mois pour aller de mai à décembre — sept→déc seront grisés
  // (« permanents prioritaires »).
  const [moisCalendrier, dossier] = await Promise.all([
    getCalendrierMois(8),
    getDossierTechnique(),
  ])
  return <Proposer moisCalendrier={moisCalendrier} dossier={dossier} />
}
