import type { BasePayload } from 'payload'

import { DEFAULT_CALENDAR_TIME_ZONE } from './constants'
import { addDaysUTC, formatDayKeyInTimeZone, formatISODate, formatTimeInTimeZone, getGoogleOAuthRedirectURI, parseISODate } from './helpers'
import { getGoogleRefreshToken } from './settings'
import type { CalendarNewsletterSettings, NormalizedCalendarEvent } from './types'

type GoogleTokenResponse = {
  access_token?: string
  error?: string
  error_description?: string
  refresh_token?: string
}

type GoogleCalendarEvent = {
  htmlLink?: string
  location?: string
  start?: {
    date?: string
    dateTime?: string
  }
  status?: string
  summary?: string
}

const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const COMPACT_TITLE_MAX_LENGTH = 28

const buildCompactTitle = (title: string) => {
  const normalized = title.replace(/\s+/g, ' ').trim()

  if (normalized.length <= COMPACT_TITLE_MAX_LENGTH) {
    return normalized
  }

  const sliced = normalized.slice(0, COMPACT_TITLE_MAX_LENGTH - 1)
  const lastSpaceIndex = sliced.lastIndexOf(' ')
  const safeSlice = lastSpaceIndex > 12 ? sliced.slice(0, lastSpaceIndex) : sliced

  return `${safeSlice.trim()}…`
}

const postGoogleToken = async (params: URLSearchParams) => {
  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    body: params.toString(),
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })

  const data = (await response.json()) as GoogleTokenResponse

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Impossible de récupérer un token Google.')
  }

  return data
}

export const exchangeGoogleAuthCode = async (settings: CalendarNewsletterSettings, code: string) => {
  return postGoogleToken(
    new URLSearchParams({
      client_id: settings.googleClientId || '',
      client_secret: settings.googleClientSecret || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: getGoogleOAuthRedirectURI(),
    }),
  )
}

export const refreshGoogleAccessToken = async (
  payload: BasePayload,
  settings: CalendarNewsletterSettings,
) => {
  const refreshToken = getGoogleRefreshToken(payload, settings)

  if (!refreshToken) {
    throw new Error('Aucun token Google connecté. Reconnecte le calendrier dans Payload.')
  }

  const data = await postGoogleToken(
    new URLSearchParams({
      client_id: settings.googleClientId || '',
      client_secret: settings.googleClientSecret || '',
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  )

  return data.access_token as string
}

export const fetchGoogleUserEmail = async (accessToken: string) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) return null

  const data = (await response.json()) as { email?: string }
  return data.email || null
}

const normalizeGoogleEvent = (
  rawEvent: GoogleCalendarEvent,
  timeZone: string,
): NormalizedCalendarEvent | null => {
  if (rawEvent.status === 'cancelled') return null

  const title = rawEvent.summary?.trim() || 'Événement'

  if (rawEvent.start?.date) {
    return {
      compactTitle: buildCompactTitle(title),
      dayKey: rawEvent.start.date,
      htmlLink: rawEvent.htmlLink,
      isAllDay: true,
      location: rawEvent.location,
      sortValue: `${rawEvent.start.date}T00:00:00`,
      startDisplayTime: 'Toute la journée',
      title,
    }
  }

  if (!rawEvent.start?.dateTime) return null

  return {
    compactTitle: buildCompactTitle(title),
    dayKey: formatDayKeyInTimeZone(rawEvent.start.dateTime, timeZone),
    htmlLink: rawEvent.htmlLink,
    isAllDay: false,
    location: rawEvent.location,
    sortValue: rawEvent.start.dateTime,
    startDisplayTime: formatTimeInTimeZone(rawEvent.start.dateTime, timeZone),
    title,
  }
}

export const fetchCalendarEvents = async ({
  payload,
  rangeEnd,
  rangeStart,
  settings,
  timeZone = DEFAULT_CALENDAR_TIME_ZONE,
}: {
  payload: BasePayload
  rangeEnd: string
  rangeStart: string
  settings: CalendarNewsletterSettings
  timeZone?: string
}) => {
  const accessToken = await refreshGoogleAccessToken(payload, settings)
  const requestStart = addDaysUTC(parseISODate(rangeStart), -1)
  const requestEnd = addDaysUTC(parseISODate(rangeEnd), 2)
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(settings.googleCalendarId || '')}/events`,
  )

  url.searchParams.set('maxResults', '2500')
  url.searchParams.set('orderBy', 'startTime')
  url.searchParams.set('singleEvents', 'true')
  url.searchParams.set('timeMax', `${formatISODate(requestEnd)}T00:00:00Z`)
  url.searchParams.set('timeMin', `${formatISODate(requestStart)}T00:00:00Z`)
  url.searchParams.set('timeZone', timeZone)

  const response = await fetch(url.toString(), {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = (await response.json()) as { error?: { message?: string }; items?: GoogleCalendarEvent[] }

  if (!response.ok) {
    throw new Error(data.error?.message || 'Impossible de récupérer les événements du calendrier Google.')
  }

  const eventsByDay = new Map<string, NormalizedCalendarEvent>()

  for (const rawEvent of data.items || []) {
    const event = normalizeGoogleEvent(rawEvent, timeZone)

    if (!event) continue
    if (event.dayKey < rangeStart || event.dayKey > rangeEnd) continue

    const current = eventsByDay.get(event.dayKey)

    if (!current || event.sortValue < current.sortValue) {
      eventsByDay.set(event.dayKey, event)
    }
  }

  return Array.from(eventsByDay.values()).sort((left, right) => left.dayKey.localeCompare(right.dayKey))
}
