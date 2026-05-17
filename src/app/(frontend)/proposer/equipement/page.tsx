import React from 'react'
import type { Metadata } from 'next'

import ProposerEquipementLecture from '@/frontend/components/proposer/ProposerEquipementLecture'
import { getDossierTechnique } from '@/frontend/lib/surlascene-data'

export const metadata: Metadata = {
  title: 'Notre équipement — La Brassée',
  description:
    "Tour d'horizon du matériel disponible à La Brassée pour les artistes en scène. À consulter avant de postuler — la sélection précise se fait au dépôt définitif, après acceptation de ta candidature.",
}

export const revalidate = 3600

export default async function EquipementPage() {
  const dossier = await getDossierTechnique()
  return (
    <main style={{ width: '100%', background: 'var(--color-dark)' }}>
      <ProposerEquipementLecture dossier={dossier} />
    </main>
  )
}
