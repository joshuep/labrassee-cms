import configPromise from '@payload-config'
import { getPayload } from 'payload'

export class UnauthorizedCalendarNewsletterError extends Error {}

export const requirePayloadUser = async (request: Request) => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({
    canSetHeaders: false,
    headers: request.headers,
  })

  if (!user) {
    throw new UnauthorizedCalendarNewsletterError('Authentification requise.')
  }

  return { payload, user }
}
