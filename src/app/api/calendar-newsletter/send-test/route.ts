import { NextResponse } from 'next/server'

import { NEWSLETTER_GLOBAL_SLUG } from '@/lib/calendar-newsletter/constants'
import { UnauthorizedCalendarNewsletterError, requirePayloadUser } from '@/lib/calendar-newsletter/auth'
import { buildEmailWeeks, renderCalendarNewsletterEmail } from '@/lib/calendar-newsletter/email-template'
import { formatMonthLabel, getPublicSiteURL } from '@/lib/calendar-newsletter/helpers'
import { fetchCalendarEvents } from '@/lib/calendar-newsletter/google-calendar'
import { sendResendTestEmail } from '@/lib/calendar-newsletter/resend'
import { assertNewsletterSendConfig, getCalendarNewsletterSettings, mergeNewsletterSettings } from '@/lib/calendar-newsletter/settings'
import type { NewsletterOverrides } from '@/lib/calendar-newsletter/types'

type SendTestBody = NewsletterOverrides & {
  rangeEnd?: string
  rangeStart?: string
  selectedMonth?: string
  testEmail?: string
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(request: Request) {
  try {
    const { payload } = await requirePayloadUser(request)
    const body = (await request.json()) as SendTestBody
    const persistedSettings = await getCalendarNewsletterSettings(payload)
    const settings = mergeNewsletterSettings(persistedSettings, body)
    const testEmail = body.testEmail?.trim().toLowerCase() || ''
    const rangeStart = body.rangeStart || ''
    const rangeEnd = body.rangeEnd || ''
    const periodLabel = body.displayMode === 'month' && body.selectedMonth ? formatMonthLabel(body.selectedMonth) : undefined

    if (!isValidEmail(testEmail)) {
      return NextResponse.json({ error: 'Courriel de test invalide.' }, { status: 400 })
    }

    if (!rangeStart || !rangeEnd || rangeEnd < rangeStart) {
      return NextResponse.json({ error: 'Plage de dates invalide.' }, { status: 400 })
    }

    assertNewsletterSendConfig(payload, settings)

    const events = await fetchCalendarEvents({
      payload,
      rangeEnd,
      rangeStart,
      settings,
    })

    const businessInfo = await payload.findGlobal({
      overrideAccess: true,
      slug: 'business-info',
    })

    const weeks = buildEmailWeeks({
      displayMode: body.displayMode,
      events,
      rangeEnd,
      rangeStart,
      selectedMonth: body.selectedMonth,
    })
    const { html, text } = renderCalendarNewsletterEmail({
      addressLine1: businessInfo.address?.street,
      addressLine2: businessInfo.address?.neighborhood,
      businessName: businessInfo.name || 'La Brassée',
      introMessage: settings.introMessage,
      periodLabel,
      rangeEnd,
      rangeStart,
      siteURL: getPublicSiteURL(),
      subject: settings.defaultSubject || 'La programmation de La Brassée',
      tagline: businessInfo.tagline,
      weeks,
    })

    const result = await sendResendTestEmail({
      fromEmail: settings.fromEmail || '',
      fromName: settings.fromName || '',
      html,
      replyToEmail: settings.replyToEmail,
      subject: settings.defaultSubject || 'La programmation de La Brassée',
      testEmail,
      text,
    })

    await payload.updateGlobal({
      data: {
        lastTestSentAt: new Date().toISOString(),
      },
      overrideAccess: true,
      slug: NEWSLETTER_GLOBAL_SLUG,
    })

    return NextResponse.json({
      emailID: result.id,
      eventsCount: events.length,
      message: `Courriel test envoyé à ${testEmail}.`,
    })
  } catch (error) {
    if (error instanceof UnauthorizedCalendarNewsletterError) {
      return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 })
    }

    const message = error instanceof Error ? error.message : 'Envoi du test impossible.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
