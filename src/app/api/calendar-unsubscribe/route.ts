import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

const COOKIE_NAME = 'calendar_signup_subscribed'
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 8
const rateLimitStore = new Map<string, number[]>()

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const getClientIdentifier = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for') || ''
  const realIP = request.headers.get('x-real-ip') || ''
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const ip = forwardedFor.split(',')[0]?.trim() || realIP || 'unknown-ip'
  return `${ip}:${userAgent}`
}

const isRateLimited = (clientId: string) => {
  const now = Date.now()
  const previous = rateLimitStore.get(clientId) || []
  const withinWindow = previous.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)
  withinWindow.push(now)
  rateLimitStore.set(clientId, withinWindow)
  return withinWindow.length > RATE_LIMIT_MAX_REQUESTS
}

const isAllowedOrigin = (request: Request) => {
  const originHeader = request.headers.get('origin')
  const refererHeader = request.headers.get('referer')

  if (!originHeader && !refererHeader) return true

  const requestURL = new URL(request.url)
  const allowedHosts = new Set<string>([requestURL.host])
  const configuredHost = process.env.NEXT_PUBLIC_SERVER_URL
    ? new URL(process.env.NEXT_PUBLIC_SERVER_URL).host
    : null
  if (configuredHost) allowedHosts.add(configuredHost)

  let originHost: string | null = null
  let refererHost: string | null = null

  try {
    originHost = originHeader ? new URL(originHeader).host : null
    refererHost = refererHeader ? new URL(refererHeader).host : null
  } catch {
    return false
  }

  return (originHost ? allowedHosts.has(originHost) : true) && (refererHost ? allowedHosts.has(refererHost) : true)
}

const clearSignupCookie = (response: NextResponse) => {
  response.cookies.set({
    maxAge: 0,
    name: COOKIE_NAME,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    value: '',
  })
}

export async function POST(request: Request) {
  try {
    const clientId = getClientIdentifier(request)
    if (isRateLimited(clientId)) {
      return NextResponse.json(
        { message: 'Trop de tentatives. Réessaie dans quelques minutes.', status: 'rate_limited' },
        { status: 429 },
      )
    }

    if (!isAllowedOrigin(request)) {
      return NextResponse.json(
        { message: 'Origine non autorisée', status: 'forbidden_origin' },
        { status: 403 },
      )
    }

    const { email, website } = (await request.json()) as { email?: string; website?: string }

    // Honeypot anti-bot: we silently accept.
    if (website && website.trim().length > 0) {
      const response = NextResponse.json({ message: 'Courriel désabonné.', status: 'removed' }, { status: 200 })
      clearSignupCookie(response)
      return response
    }

    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || normalizedEmail.length > 320 || !isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { message: 'Courriel invalide', status: 'invalid' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })
    const existing = await payload.find({
      collection: 'calendar-subscribers',
      limit: 1,
      overrideAccess: true,
      where: {
        email: {
          equals: normalizedEmail,
        },
      },
    })

    if (existing.totalDocs === 0 || !existing.docs[0]) {
      const response = NextResponse.json(
        { message: "Ce courriel n'était pas inscrit.", status: 'missing' },
        { status: 200 },
      )
      clearSignupCookie(response)
      return response
    }

    await payload.delete({
      collection: 'calendar-subscribers',
      id: existing.docs[0].id,
      overrideAccess: true,
    })

    const response = NextResponse.json({ message: 'Courriel désabonné.', status: 'removed' }, { status: 200 })
    clearSignupCookie(response)
    return response
  } catch (error) {
    console.error('Calendar unsubscribe error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur, réessaie plus tard.', status: 'error' },
      { status: 500 },
    )
  }
}
