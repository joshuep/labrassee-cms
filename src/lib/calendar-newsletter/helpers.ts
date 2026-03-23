import { DEFAULT_ADMIN_RETURN_PATH } from './constants'

export const getServerURL = () => (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001').replace(/\/$/, '')

export const getGoogleOAuthRedirectURI = () => `${getServerURL()}/api/calendar-newsletter/google/callback`

export const getPublicSiteURL = () => {
  const configured = getServerURL()

  try {
    const parsed = new URL(configured)
    if (['127.0.0.1', '0.0.0.0', 'localhost'].includes(parsed.hostname)) {
      return 'https://www.labrassee.cafe'
    }
  } catch {
    return 'https://www.labrassee.cafe'
  }

  return configured
}

export const getSafeAdminReturnPath = (candidate?: null | string) => {
  if (!candidate || !candidate.startsWith('/')) {
    return DEFAULT_ADMIN_RETURN_PATH
  }

  return candidate.split('#')[0]
}

export const encodeState = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url')

export const decodeState = <T>(value?: null | string): null | T => {
  if (!value) return null

  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
}

export const parseISODate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export const formatISODate = (value: Date) => {
  const year = value.getUTCFullYear()
  const month = String(value.getUTCMonth() + 1).padStart(2, '0')
  const day = String(value.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const addDaysUTC = (value: Date, amount: number) => {
  const next = new Date(value)
  next.setUTCDate(next.getUTCDate() + amount)
  return next
}

export const getMonthLastDay = (monthValue: string) => {
  const [year, month] = monthValue.split('-').map(Number)
  return formatISODate(new Date(Date.UTC(year, month, 0)))
}

export const getMonthEnvelope = (monthValue: string) => {
  const [year, month] = monthValue.split('-').map(Number)
  const monthStart = new Date(Date.UTC(year, month - 1, 1))
  const monthEnd = new Date(Date.UTC(year, month, 0))
  const mondayIndex = (monthStart.getUTCDay() + 6) % 7
  const sundayIndex = (monthEnd.getUTCDay() + 6) % 7

  return {
    gridEnd: addDaysUTC(monthEnd, 6 - sundayIndex),
    gridStart: addDaysUTC(monthStart, -mondayIndex),
    monthEnd,
    monthStart,
    rangeEnd: formatISODate(addDaysUTC(monthEnd, 6 - sundayIndex)),
    rangeStart: formatISODate(addDaysUTC(monthStart, -mondayIndex)),
  }
}

export const todayKeyInTimeZone = (timeZone: string) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone,
    year: 'numeric',
  })

  const parts = formatter.formatToParts(new Date())
  const year = parts.find((part) => part.type === 'year')?.value || '0000'
  const month = parts.find((part) => part.type === 'month')?.value || '00'
  const day = parts.find((part) => part.type === 'day')?.value || '00'

  return `${year}-${month}-${day}`
}

export const formatDayKeyInTimeZone = (value: string, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone,
    year: 'numeric',
  })

  const parts = formatter.formatToParts(new Date(value))
  const year = parts.find((part) => part.type === 'year')?.value || '0000'
  const month = parts.find((part) => part.type === 'month')?.value || '00'
  const day = parts.find((part) => part.type === 'day')?.value || '00'

  return `${year}-${month}-${day}`
}

export const formatTimeInTimeZone = (value: string, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat('fr-CA', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    timeZone,
  })

  return formatter.format(new Date(value)).replace(':', 'h')
}

export const formatRangeLabel = (rangeStart: string, rangeEnd: string) => {
  const formatter = new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  })

  const startLabel = formatter.format(parseISODate(rangeStart))
  const endLabel = formatter.format(parseISODate(rangeEnd))

  return `${startLabel} au ${endLabel}`
}

export const formatMonthLabel = (monthValue: string) => {
  const [year, month] = monthValue.split('-').map(Number)

  return new Intl.DateTimeFormat('fr-CA', {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .replace(/^\w/, (letter) => letter.toUpperCase())
}

export const escapeHTML = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export const textToHTML = (value: string) => escapeHTML(value).replace(/\n/g, '<br />')
