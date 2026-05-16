import React from 'react'
import type { Metadata } from 'next'

import SceneHero from '@/frontend/components/scene/SceneHero'
import SceneCommentCaMarche from '@/frontend/components/scene/SceneCommentCaMarche'
import SceneAgenda from '@/frontend/components/scene/SceneAgenda'
import SceneDossierTechnique from '@/frontend/components/scene/SceneDossierTechnique'
import SceneConditions from '@/frontend/components/scene/SceneConditions'
import {
  getDossierTechnique,
  getUpcomingShowDetails,
} from '@/frontend/lib/surlascene-data'

export const metadata: Metadata = {
  title: 'Sur la scène — La Brassée',
  description:
    "Cinq soirs par semaine, La Brassée ouvre sa scène. Entrée libre, chapeau, et 10 % des factures du soir pour les artistes. Agenda, dossier technique et conditions.",
}

// La BD Surlascène est sync 2h depuis le calendrier Apple → regen 5 min suffit
export const revalidate = 300

export default async function ScenePage() {
  const [shows, dossier] = await Promise.all([
    getUpcomingShowDetails(40),
    getDossierTechnique(),
  ])

  return (
    <main style={{ width: '100%', background: 'var(--color-dark)' }}>
      <SceneHero />
      <SceneCommentCaMarche />
      <SceneAgenda shows={shows} />
      <SceneDossierTechnique dossier={dossier} />
      <SceneConditions />
    </main>
  )
}
