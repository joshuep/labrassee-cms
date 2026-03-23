import { NextResponse } from 'next/server'

import { NEWSLETTER_GLOBAL_SLUG } from '@/lib/calendar-newsletter/constants'
import { UnauthorizedCalendarNewsletterError, requirePayloadUser } from '@/lib/calendar-newsletter/auth'
import { buildEmailWeeks, renderCalendarNewsletterEmail } from '@/lib/calendar-newsletter/email-template'
import { formatMonthLabel, getPublicSiteURL } from '@/lib/calendar-newsletter/helpers'
import { fetchCalendarEvents } from '@/lib/calendar-newsletter/google-calendar'
import { sendResendBatchEmails } from '@/lib/calendar-newsletter/resend'
import { assertNewsletterSendConfig, getCalendarNewsletterSettings, mergeNewsletterSettings } from '@/lib/calendar-newsletter/settings'
import type { NewsletterOverrides } from '@/lib/calendar-newsletter/types'

type SendLiveBody = NewsletterOverrides & {
  rangeEnd?: string
  rangeStart?: string
  selectedMonth?: string
}

const getSubscriberEmails = async (payload: Awaited<ReturnType<typeof requirePayloadUser>>['payload']) => {
  const emails = new Set<string>()
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'calendar-subscribers',
      limit: 200,
      overrideAccess: true,
      page,
      sort: 'email',
    })

    for (const doc of result.docs) {
      if (doc.email) {
        emails.add(doc.email.toLowerCase())
      }
    }

    hasNextPage = page < result.totalPages
    page += 1
  }

  return Array.from(emails)
}

export async function POST(request: Request) {
  try {
    const { payload } = await requirePayloadUser(request)
    const body = (await request.json()) as SendLiveBody
    const persistedSettings = await getCalendarNewsletterSettings(payload)
    const settings = mergeNewsletterSettings(persistedSettings, body)
    const rangeStart = body.rangeStart || ''
    const rangeEnd = body.rangeEnd || ''
    const periodLabel = body.displayMode === 'month' && body.selectedMonth ? formatMonthLabel(body.selectedMonth) : undefined

    if (!rangeStart || !rangeEnd || rangeEnd < rangeStart) {
      return NextResponse.json({ error: 'Plage de dates invalide.' }, { status: 400 })
    }

    assertNewsletterSendConfig(payload, settings)

    const recipients = await getSubscriberEmails(payload)

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'Aucun abonné à qui envoyer cette infolettre.' }, { status: 400 })
    }

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

    const ids = await sendResendBatchEmails({
      fromEmail: settings.fromEmail || '',
      fromName: settings.fromName || '',
      html,
      recipients,
      replyToEmail: settings.replyToEmail,
      subject: settings.defaultSubject || 'La programmation de La Brassée',
      text,
    })

    await payload.updateGlobal({
      data: {
        lastCampaignRangeEnd: rangeEnd,
        lastCampaignRangeStart: rangeStart,
        lastCampaignRecipientCount: recipients.length,
        lastCampaignSentAt: new Date().toISOString(),
      },
      overrideAccess: true,
      slug: NEWSLETTER_GLOBAL_SLUG,
    })

    return NextResponse.json({
      emailIDs: ids,
      eventsCount: events.length,
      message: `Infolettre envoyée à ${recipients.length} abonnés.`,
      recipientsCount: recipients.length,
    })
  } catch (error) {
    if (error instanceof UnauthorizedCalendarNewsletterError) {
      return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 })
    }

    const message = error instanceof Error ? error.message : 'Envoi aux abonnés impossible.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
