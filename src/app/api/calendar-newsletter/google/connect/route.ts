import { randomUUID } from 'crypto'

import { NextResponse } from 'next/server'

import {
  DEFAULT_ADMIN_RETURN_PATH,
  GOOGLE_CALENDAR_SCOPES,
  GOOGLE_OAUTH_STATE_COOKIE,
} from '@/lib/calendar-newsletter/constants'
import { UnauthorizedCalendarNewsletterError, requirePayloadUser } from '@/lib/calendar-newsletter/auth'
import { encodeState, getGoogleOAuthRedirectURI, getSafeAdminReturnPath } from '@/lib/calendar-newsletter/helpers'
import { assertGoogleConnectionConfig, getCalendarNewsletterSettings } from '@/lib/calendar-newsletter/settings'

export async function GET(request: Request) {
  const returnPath = getSafeAdminReturnPath(new URL(request.url).searchParams.get('returnTo'))

  try {
    const { payload, user } = await requirePayloadUser(request)
    const settings = await getCalendarNewsletterSettings(payload)
    assertGoogleConnectionConfig(settings)

    const state = encodeState({
      nonce: randomUUID(),
      returnPath,
      userID: user.id,
    })

    const authURL = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authURL.searchParams.set('access_type', 'offline')
    authURL.searchParams.set('client_id', settings.googleClientId || '')
    authURL.searchParams.set('include_granted_scopes', 'true')
    authURL.searchParams.set('prompt', 'consent')
    authURL.searchParams.set('redirect_uri', getGoogleOAuthRedirectURI())
    authURL.searchParams.set('response_type', 'code')
    authURL.searchParams.set('scope', GOOGLE_CALENDAR_SCOPES.join(' '))
    authURL.searchParams.set('state', state)

    const response = NextResponse.redirect(authURL)

    response.cookies.set({
      httpOnly: true,
      maxAge: 60 * 10,
      name: GOOGLE_OAUTH_STATE_COOKIE,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      value: state,
    })

    return response
  } catch (error) {
    if (error instanceof UnauthorizedCalendarNewsletterError) {
      return NextResponse.redirect(new URL(DEFAULT_ADMIN_RETURN_PATH, request.url))
    }

    const message = error instanceof Error ? error.message : 'Connexion Google impossible.'
    const redirectURL = new URL(returnPath || DEFAULT_ADMIN_RETURN_PATH, request.url)
    redirectURL.searchParams.set('oauth', 'error')
    redirectURL.searchParams.set('reason', message)

    return NextResponse.redirect(redirectURL)
  }
}
