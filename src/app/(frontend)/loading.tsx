'use client'

import { useEffect } from 'react'

import { ROUTE_LOADING_DONE_EVENT, ROUTE_LOADING_START_EVENT } from '@/frontend/lib/routeLoadingEvents'

export default function Loading() {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(ROUTE_LOADING_START_EVENT))

    return () => {
      window.dispatchEvent(new CustomEvent(ROUTE_LOADING_DONE_EVENT))
    }
  }, [])

  return null
}
