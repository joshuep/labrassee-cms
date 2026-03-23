import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { getUpcomingEvents as getFallbackUpcomingEvents } from '@/frontend/data/events'
import { businessInfo as fallbackBusinessInfo, menuCategories as fallbackMenuItems } from '@/frontend/data/menu'
import type { BusinessInfo, Event, Media, MenuItem } from '@/payload-types'

export type FrontendEvent = {
  date: string
  description?: unknown
  facebookLink?: string | null
  hasOfficialPoster: boolean
  id: number | string
  image: string | null
  time?: string | null
  title: string
}

export type FrontendMenuItem = {
  description?: unknown
  id: number | string
  image: string | null
  order: number
  title: string
}

export type FrontendBusinessInfo = {
  address: {
    googleMapsLink?: string | null
    neighborhood?: string | null
    street?: string | null
  }
  contact: {
    artists?: string | null
    exhibitions?: string | null
    general?: string | null
  }
  hours: {
    lundi: { close?: string | null; open?: string | null }
    'mardi-mercredi': { close?: string | null; open?: string | null }
    'jeudi-vendredi-samedi': { close?: string | null; open?: string | null }
    dimanche: { close?: string | null; open?: string | null }
  }
  message?: string | null
  name?: string | null
  slogan?: string | null
  social: {
    facebook?: string | null
    instagram?: string | null
    onlyfans?: string | null
  }
  tagline?: string | null
}

const getPayloadClient = cache(async () => getPayload({ config: configPromise }))

type MediaSizeKey = 'card' | 'desktop' | 'tablet' | 'thumbnail'
const PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')

const normalizeMediaURL = (rawURL: string) => {
  if (!rawURL) return null

  if (!rawURL.startsWith('http://') && !rawURL.startsWith('https://')) {
    return rawURL.startsWith('/') ? rawURL : `/${rawURL}`
  }

  try {
    const parsed = new URL(rawURL)
    const isLocalhost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname)

    if (isLocalhost) {
      if (PUBLIC_SERVER_URL) {
        return `${PUBLIC_SERVER_URL}${parsed.pathname}${parsed.search}${parsed.hash}`
      }

      return `${parsed.pathname}${parsed.search}${parsed.hash}`
    }

    return rawURL
  } catch {
    return rawURL
  }
}

const toMediaURL = (media: number | Media | null | undefined, size?: MediaSizeKey) => {
  if (!media || typeof media !== 'object') return null
  const mediaDoc = media as Media

  const sizedURL = size ? mediaDoc.sizes?.[size]?.url : null
  const rawURL = sizedURL || mediaDoc.url

  if (!rawURL) return null
  return normalizeMediaURL(rawURL)
}

const todayISO = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatEvent = (event: Event): FrontendEvent => {
  const imageToUse = event.image || event.facebookCover

  return {
    date: event.date,
    description: undefined,
    facebookLink: event.facebookLink || null,
    hasOfficialPoster: !!event.image && typeof event.image === 'object',
    id: event.slug || event.id,
    image: toMediaURL(imageToUse, 'desktop') || null,
    time: event.time || null,
    title: event.title,
  }
}

const formatMenuItem = (item: MenuItem): FrontendMenuItem => ({
  description: item.description,
  id: item.slug || item.id,
  image: toMediaURL(item.image, 'card') || null,
  order: item.order,
  title: item.title,
})

const businessHours: FrontendBusinessInfo['hours'] = {
  lundi: {
    close: '21h30',
    open: '9h00',
  },
  'mardi-mercredi': {
    close: '19h00',
    open: '9h00',
  },
  'jeudi-vendredi-samedi': {
    close: '21h30',
    open: '9h00',
  },
  dimanche: {
    close: '19h00',
    open: '9h00',
  },
}

const formatBusinessInfo = (info: BusinessInfo): FrontendBusinessInfo => ({
  address: {
    googleMapsLink: info.address?.googleMapsLink,
    neighborhood: info.address?.neighborhood,
    street: info.address?.street,
  },
  contact: {
    artists: info.contact?.artists,
    exhibitions: info.contact?.exhibitions,
    general: info.contact?.general,
  },
  hours: businessHours,
  message: info.message,
  name: info.name,
  slogan: info.slogan,
  social: {
    facebook: info.social?.facebook,
    instagram: info.social?.instagram,
    onlyfans: info.social?.onlyfans,
  },
  tagline: info.tagline,
})

export const getBusinessInfoData = cache(async (): Promise<FrontendBusinessInfo> => {
  try {
    const payload = await getPayloadClient()
    const info = await payload.findGlobal({
      slug: 'business-info',
    })

    return formatBusinessInfo(info)
  } catch {
    return fallbackBusinessInfo as FrontendBusinessInfo
  }
})

export const getUpcomingEventsData = cache(async (limit = 50): Promise<FrontendEvent[]> => {
  try {
    const payload = await getPayloadClient()
    const response = await payload.find({
      collection: 'events',
      depth: 1,
      limit,
      overrideAccess: false,
      sort: 'date',
      where: {
        and: [
          { status: { equals: 'published' } },
          { date: { greater_than_equal: todayISO() } },
        ],
      },
    })

    return response.docs.map(formatEvent)
  } catch {
    return getFallbackUpcomingEvents().slice(0, limit).map((event) => ({
      date: event.date,
      facebookLink: event.facebookLink || null,
      hasOfficialPoster: true,
      id: event.id,
      image: event.image || null,
      time: event.time || null,
      title: event.title,
    }))
  }
})

export const getMenuItemsData = cache(async (): Promise<FrontendMenuItem[]> => {
  try {
    const payload = await getPayloadClient()
    const response = await payload.find({
      collection: 'menu-items',
      depth: 1,
      limit: 100,
      overrideAccess: false,
      sort: 'order',
      where: {
        status: {
          equals: 'published',
        },
      },
    })

    return response.docs.map(formatMenuItem)
  } catch {
    return [...fallbackMenuItems]
  }
})
