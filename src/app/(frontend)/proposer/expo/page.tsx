import React from 'react'
import type { Metadata } from 'next'

import ProposerExpoLecture from '@/frontend/components/proposer/ProposerExpoLecture'

export const metadata: Metadata = {
  title: 'Exposer sur nos murs — La Brassée',
  description:
    "Conditions complètes pour exposer sur les murs de La Brassée. 4 semaines, vernissage 5à7, 10% commission, matériel d'accrochage fourni. Étapes du cycle Surnosmurs.",
}

export default function ExpoPage() {
  return (
    <main style={{ width: '100%', background: 'var(--color-dark)' }}>
      <ProposerExpoLecture />
    </main>
  )
}
