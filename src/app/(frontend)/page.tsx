import React from 'react'

import { getEventsCarousel } from '@/frontend/lib/payload-data'
import Home from '@/frontend/pages/Home'

export const revalidate = 300

export default async function HomePage() {
  // Stratégie home (2026-05-16) : carousel spotlight = 1 event passé (hier, tronqué
  // à gauche) + 6 events futurs (aujourd'hui focus + 5 prochains). Reversible via
  // chevrons + drag + clavier. Focus initial = premier event futur.
  const { events, initialIndex } = await getEventsCarousel(1, 6)

  return (
    <Home events={events} initialIndex={initialIndex} />
  )
}
