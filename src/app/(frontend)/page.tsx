import React from 'react'

import { getMergedUpcomingEvents } from '@/frontend/lib/payload-data'
import Home from '@/frontend/pages/Home'

export const revalidate = 300

export default async function HomePage() {
  const events = await getMergedUpcomingEvents(50)

  return (
    <Home events={events} />
  )
}
