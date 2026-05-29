import { NextResponse } from 'next/server'

import { NEWSLETTER_GLOBAL_SLUG } from '@/lib/calendar-newsletter/constants'
import { UnauthorizedCalendarNewsletterError, requirePayloadUser } from '@/lib/calendar-newsletter/auth'
import { renderCustomEmail } from '@/lib/calendar-newsletter/custom-email-template'
import { getPublicSiteURL } from '@/lib/calendar-newsletter/helpers'
import { sendResendBatchEmails } from '@/lib/calendar-newsletter/resend'
import { assertCustomEmailSendConfig, getCalendarNewsletterSettings, mergeNewsletterSettings } from '@/lib/calendar-newsletter/settings'
import { getSubscriberEmails } from '@/lib/calendar-newsletter/subscribers'

type SendCustomLiveBody = {
  content?: string
  fromEmail?: string
  fromName?: string
  replyToEmail?: string
  title?: string
}

export async function POST(request: Request) {
  try {
    const { payload } = await requirePayloadUser(request)
    const body = (await request.json()) as SendCustomLiveBody
    const persistedSettings = await getCalendarNewsletterSettings(payload)
    const settings = mergeNewsletterSettings(persistedSettings, {
      fromEmail: body.fromEmail,
      fromName: body.fromName,
      replyToEmail: body.replyToEmail,
    })
    const title = body.title?.trim() || ''
    const content = body.content?.trim() || ''

    if (!title) {
      return NextResponse.json({ error: 'Le titre du courriel est requis.' }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: 'Le contenu du courriel est requis.' }, { status: 400 })
    }

    assertCustomEmailSendConfig(settings)

    const recipients = await getSubscriberEmails(payload)

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'Aucun abonné à qui envoyer ce courriel.' }, { status: 400 })
    }

    const businessInfo = await payload.findGlobal({
      overrideAccess: true,
      slug: 'business-info',
    })

    const { html, text } = renderCustomEmail({
      businessName: businessInfo.name || 'La Brassée',
      content,
      siteURL: getPublicSiteURL(),
      tagline: businessInfo.tagline,
      title,
    })

    const ids = await sendResendBatchEmails({
      fromEmail: settings.fromEmail || '',
      fromName: settings.fromName || '',
      html,
      recipients,
      replyToEmail: settings.replyToEmail,
      subject: title,
      text,
    })

    await payload.updateGlobal({
      data: {
        lastCampaignRecipientCount: recipients.length,
        lastCampaignSentAt: new Date().toISOString(),
      },
      overrideAccess: true,
      slug: NEWSLETTER_GLOBAL_SLUG,
    })

    return NextResponse.json({
      emailIDs: ids,
      message: `Courriel envoyé à ${recipients.length} abonnés.`,
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
