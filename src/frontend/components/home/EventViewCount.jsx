'use client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const SUPABASE_URL = 'https://xjlpttrziisldlclhsth.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbHB0dHJ6aWlzbGRsY2xoc3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjkyODMsImV4cCI6MjA5MjA0NTI4M30.JpkTnJF1ZP08ybzFdM8fFUJOTiKYx8ltTe2nxiDPk24'

const MIN_COUNT_TO_SHOW = 1

const CurieuxLine = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 300;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);

  @media (max-width: 768px) {
    font-size: 10px;
  }
`

function getOrCreateVisitorId() {
  try {
    let vid = localStorage.getItem('lb_visitor_id')
    if (!vid) {
      vid = crypto.randomUUID()
      localStorage.setItem('lb_visitor_id', vid)
    }
    return vid
  } catch {
    return null
  }
}

/** Enregistre un clic unique (fire-and-forget). Appelé depuis EventCard onClick. */
export function trackEventView(concertKey) {
  if (!concertKey) return
  const visitorId = getOrCreateVisitorId()
  if (!visitorId) return
  try {
    fetch(`${SUPABASE_URL}/rest/v1/event_views`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal, resolution=ignore-duplicates',
      },
      body: JSON.stringify({ concert_key: concertKey, visitor_id: visitorId }),
      keepalive: true,
    })
  } catch {}
}

/** Affiche "N curieux ont voulu en savoir plus" si N ≥ MIN_COUNT_TO_SHOW. */
export function EventViewCount({ concertKey }) {
  const [count, setCount] = useState(null)

  useEffect(() => {
    if (!concertKey) return
    fetch(`${SUPABASE_URL}/rest/v1/rpc/get_event_view_count`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_key: concertKey }),
    })
      .then((r) => r.json())
      .then((n) => { if (typeof n === 'number') setCount(n) })
      .catch(() => {})
  }, [concertKey])

  if (!count || count < MIN_COUNT_TO_SHOW) return null

  return (
    <CurieuxLine>
      {count} curieux {count === 1 ? 'a voulu' : 'ont voulu'} en savoir plus
    </CurieuxLine>
  )
}
