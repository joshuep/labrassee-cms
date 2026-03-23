import { NextResponse } from 'next/server'

import {
  DEFAULT_ADMIN_RETURN_PATH,
  GOOGLE_OAUTH_STATE_COOKIE,
  NEWSLETTER_GLOBAL_SLUG,
} from '@/lib/calendar-newsletter/constants'
import { UnauthorizedCalendarNewsletterError, requirePayloadUser } from '@/lib/calendar-newsletter/auth'
import { decodeState, getSafeAdminReturnPath } from '@/lib/calendar-newsletter/helpers'
import { exchangeGoogleAuthCode, fetchGoogleUserEmail } from '@/lib/calendar-newsletter/google-calendar'
import { assertGoogleConnectionConfig, getCalendarNewsletterSettings } from '@/lib/calendar-newsletter/settings'

type OAuthState = {
  nonce: string
  returnPath: string
  userID: number | string
}

const redirectToAdmin = (request: Request, path: string, status: 'error' | 'success', reason?: string) => {
  const redirectURL = new URL(path || DEFAULT_ADMIN_RETURN_PATH, request.url)
  redirectURL.searchParams.set('oauth', status)

  if (reason) {
    redirectURL.searchParams.set('reason', reason)
  }

  const response = NextResponse.redirect(redirectURL)
  response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE)
  return response
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const errorParam = url.searchParams.get('error')
  const code = url.searchParams.get('code')
  const stateParam = url.searchParams.get('state')
  const cookieState = request.headers
    .get('cookie')
    ?.split('; ')
    .find((entry) => entry.startsWith(`${GOOGLE_OAUTH_STATE_COOKIE}=`))
    ?.split('=')
    .slice(1)
    .join('=')

  const parsedState = decodeState<OAuthState>(stateParam)
  const parsedCookieState = decodeState<OAuthState>(cookieState)
  const returnPath = getSafeAdminReturnPath(parsedState?.returnPath || parsedCookieState?.returnPath)

  if (errorParam) {
    return redirectToAdmin(request, returnPath, 'error', errorParam)
  }

  if (!code || !parsedState || !parsedCookieState || stateParam !== cookieState) {
    return redirectToAdmin(request, returnPath, 'error', 'Etat OAuth invalide.')
  }

  try {
    const { payload, user } = await requirePayloadUser(request)

    if (String(parsedState.userID) !== String(user.id)) {
      return redirectToAdmin(request, returnPath, 'error', 'Session admin invalide.')
    }

    const settings = await getCalendarNewsletterSettings(payload)
    assertGoogleConnectionConfig(settings)

    const tokenData = await exchangeGoogleAuthCode(settings, code)
    const refreshToken = tokenData.refresh_token

    if (!refreshToken && !settings.googleRefreshTokenEncrypted) {
      return redirectToAdmin(
        request,
        returnPath,
        'error',
        'Google n’a pas renvoyé de refresh token. Reessaie avec une nouvelle autorisation.',
      )
    }

    const connectedEmail = await fetchGoogleUserEmail(tokenData.access_token as string)

    await payload.updateGlobal({
      data: {
        googleConnectedEmail: connectedEmail || settings.googleConnectedEmail || '',
        googleRefreshTokenEncrypted: refreshToken
          ? payload.encrypt(refreshToken)
          : settings.googleRefreshTokenEncrypted,
        googleTokenUpdatedAt: new Date().toISOString(),
      },
      overrideAccess: true,
      slug: NEWSLETTER_GLOBAL_SLUG,
    })

    return redirectToAdmin(request, returnPath, 'success')
  } catch (error) {
    if (error instanceof UnauthorizedCalendarNewsletterError) {
      return redirectToAdmin(request, DEFAULT_ADMIN_RETURN_PATH, 'error', 'Authentification requise.')
    }

    const message = error instanceof Error ? error.message : 'Connexion Google impossible.'
    return redirectToAdmin(request, returnPath, 'error', message)
  }
}
