import { NextResponse } from 'next/server'

import { NEWSLETTER_GLOBAL_SLUG } from '@/lib/calendar-newsletter/constants'
import { UnauthorizedCalendarNewsletterError, requirePayloadUser } from '@/lib/calendar-newsletter/auth'
import { renderCustomEmail } from '@/lib/calendar-newsletter/custom-email-template'
import { getPublicSiteURL } from '@/lib/calendar-newsletter/helpers'
import { sendResendTestEmail } from '@/lib/calendar-newsletter/resend'
import { assertCustomEmailSendConfig, getCalendarNewsletterSettings, mergeNewsletterSettings } from '@/lib/calendar-newsletter/settings'

type SendCustomTestBody = {
  content?: string
  fromEmail?: string
  fromName?: string
  replyToEmail?: string
  testEmail?: string
  title?: string
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(request: Request) {
  try {
    const { payload } = await requirePayloadUser(request)
    const body = (await request.json()) as SendCustomTestBody
    const persistedSettings = await getCalendarNewsletterSettings(payload)
    const settings = mergeNewsletterSettings(persistedSettings, {
      fromEmail: body.fromEmail,
      fromName: body.fromName,
      replyToEmail: body.replyToEmail,
    })
    const testEmail = body.testEmail?.trim().toLowerCase() || ''
    const title = body.title?.trim() || ''
    const content = body.content?.trim() || ''

    if (!isValidEmail(testEmail)) {
      return NextResponse.json({ error: 'Courriel de test invalide.' }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: 'Le titre du courriel est requis.' }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: 'Le contenu du courriel est requis.' }, { status: 400 })
    }

    assertCustomEmailSendConfig(settings)

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

    const result = await sendResendTestEmail({
      fromEmail: settings.fromEmail || '',
      fromName: settings.fromName || '',
      html,
      replyToEmail: settings.replyToEmail,
      subject: title,
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
