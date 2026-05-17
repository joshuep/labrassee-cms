import React from 'react'

import { getUpcomingEventsData } from '@/frontend/lib/payload-data'
import Home from '@/frontend/pages/Home'

export const revalidate = 300

export default async function HomePage() {
  const events = await getUpcomingEventsData(50)

  return (
    <Home events={events} />
  )
}
