import type { BasePayload } from 'payload'

import { NEWSLETTER_GLOBAL_SLUG } from './constants'
import type { CalendarNewsletterSettings, NewsletterOverrides } from './types'

export const getCalendarNewsletterSettings = async (
  payload: BasePayload,
): Promise<CalendarNewsletterSettings> => {
  const settings = await payload.findGlobal({
    overrideAccess: true,
    slug: NEWSLETTER_GLOBAL_SLUG,
  })

  return settings as CalendarNewsletterSettings
}

export const mergeNewsletterSettings = (
  settings: CalendarNewsletterSettings,
  overrides: NewsletterOverrides,
): CalendarNewsletterSettings => {
  return {
    ...settings,
    ...Object.fromEntries(Object.entries(overrides).filter(([, value]) => value !== undefined)),
  }
}

export const getGoogleRefreshToken = (payload: BasePayload, settings: CalendarNewsletterSettings) => {
  if (!settings.googleRefreshTokenEncrypted) return null

  try {
    return payload.decrypt(settings.googleRefreshTokenEncrypted)
  } catch {
    return null
  }
}

export const assertGoogleConnectionConfig = (settings: CalendarNewsletterSettings) => {
  const missing = []

  if (!settings.googleClientId?.trim()) missing.push('Google Client ID')
  if (!settings.googleClientSecret?.trim()) missing.push('Google Client Secret')
  if (!settings.googleCalendarId?.trim()) missing.push('ID du calendrier Google')

  if (missing.length > 0) {
    throw new Error(`Configuration Google incomplète: ${missing.join(', ')}`)
  }
}

export const assertNewsletterSendConfig = (payload: BasePayload, settings: CalendarNewsletterSettings) => {
  assertGoogleConnectionConfig(settings)

  const missing = []

  if (!getGoogleRefreshToken(payload, settings)) missing.push('connexion Google')
  if (!settings.fromName?.trim()) missing.push('nom expéditeur')
  if (!settings.fromEmail?.trim()) missing.push('courriel expéditeur')
  if (!settings.defaultSubject?.trim()) missing.push('sujet du courriel')

  if (missing.length > 0) {
    throw new Error(`Configuration d’envoi incomplète: ${missing.join(', ')}`)
  }
}
