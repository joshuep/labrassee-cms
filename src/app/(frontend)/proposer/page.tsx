import React from 'react'
import type { Metadata } from 'next'

import Proposer from '@/frontend/pages/Proposer'

export const metadata: Metadata = {
  title: 'Artistes — La Brassée',
  description:
    'Tu veux exposer aux murs ou jouer sur notre scène ? Conditions, contact et formulaires de candidature pour les artistes invité·e·s.',
}

export const revalidate = 86400 // page statique, regen 1×/jour suffit

export default function ProposerPage() {
  return <Proposer />
}
