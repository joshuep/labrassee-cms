import { randomUUID } from 'crypto'

import { RESEND_BATCH_SIZE } from './constants'

type ResendEmailPayload = {
  from: string
  headers?: Record<string, string>
  html: string
  reply_to?: string
  subject: string
  text: string
  to: string[]
}

const RESEND_BASE_URL = 'https://api.resend.com'

const getResendHeaders = () => {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('La variable d’environnement RESEND_API_KEY est manquante.')
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'User-Agent': '@labrassee/cms calendar-newsletter',
  }
}

const resendRequest = async <T>(path: string, body: object) => {
  const response = await fetch(`${RESEND_BASE_URL}${path}`, {
    body: JSON.stringify(body),
    cache: 'no-store',
    headers: getResendHeaders(),
    method: 'POST',
  })

  const data = (await response.json()) as T & { error?: string; message?: string }

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Erreur Resend inconnue.')
  }

  return data
}

const formatFromAddress = (fromName: string, fromEmail: string) => `${fromName} <${fromEmail}>`

const buildThreadBreakHeaders = () => ({
  'X-Entity-Ref-ID': `labrassee-calendar-${randomUUID()}`,
})

export const sendResendTestEmail = async ({
  fromEmail,
  fromName,
  html,
  replyToEmail,
  subject,
  testEmail,
  text,
}: {
  fromEmail: string
  fromName: string
  html: string
  replyToEmail?: null | string
  subject: string
  testEmail: string
  text: string
}) => {
  return resendRequest<{ id: string }>('/emails', {
    from: formatFromAddress(fromName, fromEmail),
    headers: buildThreadBreakHeaders(),
    html,
    reply_to: replyToEmail || undefined,
    subject,
    text,
    to: [testEmail],
  } satisfies ResendEmailPayload)
}

export const sendResendBatchEmails = async ({
  fromEmail,
  fromName,
  html,
  recipients,
  replyToEmail,
  subject,
  text,
}: {
  fromEmail: string
  fromName: string
  html: string
  recipients: string[]
  replyToEmail?: null | string
  subject: string
  text: string
}) => {
  const ids: string[] = []

  for (let index = 0; index < recipients.length; index += RESEND_BATCH_SIZE) {
    const chunk = recipients.slice(index, index + RESEND_BATCH_SIZE)
    const payload = chunk.map((recipient) => ({
      from: formatFromAddress(fromName, fromEmail),
      headers: buildThreadBreakHeaders(),
      html,
      reply_to: replyToEmail || undefined,
      subject,
      text,
      to: [recipient],
    }))

    const data = await resendRequest<{ data?: { id: string }[] }>('/emails/batch', payload)
    ids.push(...(data.data || []).map((entry) => entry.id))
  }

  return ids
}
