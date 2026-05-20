import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { businessInfo as fallbackBusinessInfo, menuCategories as fallbackMenuItems } from '@/frontend/data/menu'
import {
  getRecentSurlasceneEvents,
  getUpcomingShowDetails,
  getUpcomingSurlasceneEvents,
  type SurlasceneShowDetail,
} from '@/frontend/lib/surlascene-data'
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
  // Genre musical / type d'event affiché sur la vignette (Jazz, Jam, Karaoké…)
  genre?: string | null
  // --- Extensions Surlascène (présentes seulement pour les events lus depuis
  // la BD Supabase Surlascène, ignorées par les cards Payload events) ---
  surlasceneSource?: 'surlascene'
  surlasceneShowId?: string
  surlasceneType?: string
  surlascenePosterPhoto?: string | null
  surlasceneArtiste?: {
    id: string
    nom_artiste: string
    genre: string | null
    bio: string | null
    permanence: boolean
    recurrence_notes: string | null
    heure_debut_speciale: string | null
    site_web: string | null
    instagram: string | null
    spotify_url: string | null
    bandcamp_url: string | null
    soundcloud_url: string | null
    youtube_url: string | null
    photo_artiste_path: string | null
    photos_hd_paths: string[] | null
  } | null
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
  // Horaires 100% dynamiques (2026-05-16) : 7 jours glissants à partir d'aujourd'hui.
  // Chaque entrée a { key, label, open, close, isToday } et est calculée selon les
  // events du jour spécifique. Pas d'event → fermeture 19h00. Event → début + 2h30.
  // Le tableau est trié chronologiquement (aujourd'hui en premier).
  hours: Array<{
    key: string          // 'YYYY-MM-DD' (ID unique React)
    label: string        // 'SAMEDI 16 MAI' ou 'AUJOURD'HUI'
    open: string         // '9h00'
    close: string        // '19h00' ou '22h00' etc.
    isToday: boolean
  }>
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
  // event.genre est une relation vers event-genres (avec depth>=1 = objet, sinon id)
  const rawGenre = (event as unknown as { genre?: unknown }).genre
  const genreTitle =
    rawGenre && typeof rawGenre === 'object' && 'title' in rawGenre
      ? (rawGenre as { title?: string }).title
      : null

  return {
    date: event.date,
    description: undefined,
    facebookLink: event.facebookLink || null,
    genre: genreTitle || null,
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

const JOURS_FR_LONG = [
  'DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI',
] as const
const MOIS_FR_LONG = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE',
] as const

// Horaires "par défaut" si calcul dynamique échoue (fallback statique : 7 jours
// glissants à partir d'aujourd'hui, tous fermés à 19h00)
function buildFallbackHours(): FrontendBusinessInfo['hours'] {
  const out: FrontendBusinessInfo['hours'] = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const iso =
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-` +
      String(d.getDate()).padStart(2, '0')
    out.push({
      key: iso,
      label: `${JOURS_FR_LONG[d.getDay()]} ${d.getDate()} ${MOIS_FR_LONG[d.getMonth()]}`,
      open: '9h00',
      close: '19h00',
      isToday: i === 0,
    })
  }
  return out
}

const businessHoursDefault: FrontendBusinessInfo['hours'] = buildFallbackHours()

/**
 * Parse une heure type "19h30" ou "19:30" ou "8h00" en minutes depuis minuit.
 * Retourne null si format inconnu.
 */
function parseHeureMinutes(s: string | null | undefined): number | null {
  if (!s) return null
  const m = String(s).match(/^(\d{1,2})[h:](\d{2})/)
  if (!m) return null
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10)
}

/** Formate des minutes en "19h30". */
function formatHeureFromMinutes(min: number): string {
  const h = Math.floor(min / 60) % 24
  const m = min % 60
  return `${h}h${String(m).padStart(2, '0')}`
}

/**
 * Calcule les horaires 100% dynamiques pour les 7 prochains jours glissants
 * (aujourd'hui + 6 suivants, en heure Montréal). Bascule auto à minuit chaque
 * jour grâce au revalidate Next.
 *
 * Pour CHAQUE jour individuel :
 *   - On cherche les events programmés ce jour précis (date_show égale)
 *   - Si event(s) → fermeture = début du PLUS TARD + 2h30
 *   - Sinon → fermeture 19h00 par défaut
 *
 * Ouverture : 9h00 (statique).
 * Source events : Payload + Surlascène fusionnés (priorité Payload).
 */
async function calculerHorairesSemaine(): Promise<FrontendBusinessInfo['hours']> {
  try {
    const [payloadEvents, surlasceneEvents] = await Promise.all([
      getUpcomingEventsData(80),
      getUpcomingSurlasceneEvents(80),
    ])
    const fusion = fusionnerEtDedoublonner(payloadEvents, surlasceneEvents)

    // Index : ISO date → heure de début la PLUS TARDIVE ce jour-là (en minutes)
    const latestStartParJour = new Map<string, number>()
    for (const e of fusion) {
      const iso = e.date.slice(0, 10)
      const min = parseHeureMinutes(e.time)
      if (min === null) continue
      const prev = latestStartParJour.get(iso) ?? -1
      if (min > prev) latestStartParJour.set(iso, min)
    }

    // Aujourd'hui en heure Montréal (YYYY-MM-DD)
    const todayMontreal = (() => {
      const f = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Toronto',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      const parts = f.formatToParts(new Date())
      const get = (t: string) => parts.find((p) => p.type === t)?.value || ''
      return `${get('year')}-${get('month')}-${get('day')}`
    })()

    const baseDate = new Date(todayMontreal + 'T00:00:00')
    const result: FrontendBusinessInfo['hours'] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate)
      d.setDate(baseDate.getDate() + i)
      const iso =
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-` +
        String(d.getDate()).padStart(2, '0')
      const latestMin = latestStartParJour.get(iso)
      const close =
        latestMin !== undefined ? formatHeureFromMinutes(latestMin + 150) : '19h00'
      const jourLabel = JOURS_FR_LONG[d.getDay()]
      const dateLabel = `${d.getDate()} ${MOIS_FR_LONG[d.getMonth()]}`
      result.push({
        key: iso,
        label: i === 0 ? `AUJOURD'HUI · ${jourLabel} ${dateLabel}` : `${jourLabel} ${dateLabel}`,
        open: '9h00',
        close,
        isToday: i === 0,
      })
    }
    return result
  } catch {
    return businessHoursDefault
  }
}

const formatBusinessInfo = (
  info: BusinessInfo,
  hoursOverride?: FrontendBusinessInfo['hours'],
): FrontendBusinessInfo => ({
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
  hours: hoursOverride || businessHoursDefault,
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
  const horairesDynamiques = await calculerHorairesSemaine()
  try {
    const payload = await getPayloadClient()
    const info = await payload.findGlobal({
      slug: 'business-info',
    })

    return formatBusinessInfo(info, horairesDynamiques)
  } catch {
    const { hours: _legacyHours, ...fallbackInfo } = fallbackBusinessInfo
    return {
      ...fallbackInfo,
      hours: horairesDynamiques,
    }
  }
})

/**
 * Proxy vers la prod API Payload (labrassee.cafe) — utilisé en fallback quand
 * le Payload local crash (typiquement en dev sans `.env.local` configuré avec
 * PAYLOAD_SECRET). Retourne les events au format Event natif, prêts pour
 * formatEvent. Évite de retomber sur src/frontend/data/events.js dont les dates
 * sont figées en 2025.
 */
async function fetchProdEventsAPI(qs: string): Promise<Event[]> {
  try {
    const res = await fetch(`https://labrassee.cafe/api/events?${qs}`, {
      next: { revalidate: 300, tags: ['payload-events-proxy'] },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.docs || []) as Event[]
  } catch {
    return []
  }
}

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
    // Fallback : proxy prod API (images Facebook officielles incluses via
    // facebookCover), au lieu du fichier statique events.js (dates 2025).
    const today = todayISO()
    const qs = new URLSearchParams({
      limit: String(limit),
      depth: '1',
      sort: 'date',
      'where[status][equals]': 'published',
      'where[date][greater_than_equal]': today,
    }).toString()
    const docs = await fetchProdEventsAPI(qs)
    return docs.map(formatEvent)
  }
})

/**
 * Fusion Payload events + concerts Surlascène, avec dédoublonnage par date.
 *
 * Stratégie « phase de transition » (gravée par Cédric 2026-05-16) :
 *   - Tant qu'un artiste n'a pas déposé son EPK, l'event Facebook créé manuellement
 *     par Joshué dans Payload reste la SOURCE de la vignette (affiche FB + infos).
 *   - Dès qu'un dépôt EPK arrive, la vignette est régénérée automatiquement à
 *     partir du dépôt (photo HD + bio + liens) ET les events FB/Insta sont
 *     auto-générés à partir de cette même source.
 *   - À terme (Phase 2 = 100 % dépôts) : plus de saisie manuelle Joshué.
 *
 * Règle de dédoublonnage : si une date donnée a BOTH un event Payload AND un
 * concert Surlascène → on GARDE Payload (priorité 1) et on SKIP le Surlascène.
 * Sinon on garde ce qu'on a (Payload-only ou Surlascène-only).
 */
function fusionnerEtDedoublonner(
  payloadEvents: FrontendEvent[],
  surlasceneEvents: FrontendEvent[],
): FrontendEvent[] {
  const datesPayload = new Set(payloadEvents.map((e) => e.date.slice(0, 10)))
  const surlasceneFiltrees = surlasceneEvents.filter(
    (e) => !datesPayload.has(e.date.slice(0, 10)),
  )
  const fusion = [...payloadEvents, ...surlasceneFiltrees]
  fusion.sort((a, b) => a.date.localeCompare(b.date))
  return fusion
}

export const getMergedUpcomingEvents = cache(
  async (limit = 50): Promise<FrontendEvent[]> => {
    const [payloadEvents, surlasceneEvents] = await Promise.all([
      getUpcomingEventsData(limit),
      getUpcomingSurlasceneEvents(limit),
    ])
    const fusion = fusionnerEtDedoublonner(payloadEvents, surlasceneEvents)
    return fusion.slice(0, limit)
  },
)

/**
 * Calcule l'ISO date YYYY-MM-DD du lundi et du dimanche de la semaine actuelle
 * (en heure Montréal). La semaine commence lundi, finit dimanche.
 *
 * Utilisé par la home pour afficher uniquement les événements de la semaine
 * en cours (pas un carousel infini).
 */
function getSemaineCouranteISO(): { lundi: string; dimanche: string } {
  // On récupère "aujourd'hui" en heure Montréal via Intl.DateTimeFormat
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })
  const parts = fmt.formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value || ''
  const todayISO = `${get('year')}-${get('month')}-${get('day')}`
  const weekdayShort = get('weekday') // 'Mon', 'Tue', etc.

  const weekdayMap: Record<string, number> = {
    Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7,
  }
  const dow = weekdayMap[weekdayShort] || 1

  // Calc lundi en partant de "today" - (dow - 1) jours
  const todayDate = new Date(todayISO + 'T00:00:00')
  const lundiDate = new Date(todayDate)
  lundiDate.setDate(todayDate.getDate() - (dow - 1))
  const dimancheDate = new Date(lundiDate)
  dimancheDate.setDate(lundiDate.getDate() + 6)

  const isoOf = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const j = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${j}`
  }
  return { lundi: isoOf(lundiDate), dimanche: isoOf(dimancheDate) }
}

/**
 * Récupère uniquement les événements (Payload + Surlascène) de la semaine en cours
 * (lundi → dimanche, heure Montréal). Inclut vernissages et tout type d'event Payload.
 *
 * Si la semaine est terminée mais qu'on est dimanche soir, on bascule
 * automatiquement sur la suivante via getSemaineCouranteISO le lundi 00h Montréal.
 */
export const getEventsCetteSemaine = cache(async (): Promise<FrontendEvent[]> => {
  const { lundi, dimanche } = getSemaineCouranteISO()
  const [payloadEvents, surlasceneEvents] = await Promise.all([
    getUpcomingEventsData(50),
    getUpcomingSurlasceneEvents(50),
  ])
  // Dédoublonnage par date (priorité event Payload sur concert Surlascène)
  const fusion = fusionnerEtDedoublonner(payloadEvents, surlasceneEvents)
  return fusion.filter((e) => e.date >= lundi && e.date <= dimanche)
})

/**
 * Récupère les N prochains événements (Payload + Surlascène), en incluant celui
 * d'aujourd'hui s'il existe. Dédoublonnage par date avec priorité Payload (phase
 * de transition : si Joshué a créé un event Payload pour une date, il prend le
 * pas sur le concert Surlascène pour cette date).
 *
 * Utilisé par la home pour la section "Les prochains événements".
 */
export const getProchainsEvents = cache(async (n = 5): Promise<FrontendEvent[]> => {
  const [payloadEvents, surlasceneEvents] = await Promise.all([
    getUpcomingEventsData(Math.max(n * 3, 20)),
    getUpcomingSurlasceneEvents(Math.max(n * 3, 20)),
  ])
  const fusion = fusionnerEtDedoublonner(payloadEvents, surlasceneEvents)
  return fusion.slice(0, n)
})

/**
 * Récupère les shows Surlascène (agenda /scene) enrichis avec :
 *   - coverImage : l'affiche Facebook tirée du Payload event correspondant
 *     (matché par date). Si pas d'event Payload pour cette date → null,
 *     SceneAgenda retombe sur la photo artiste, puis sur l'initiale.
 *   - facebookLink : l'URL de l'event Facebook (clic sur la card → onglet FB)
 *
 * Stratégie de transition : tant qu'un concert Surlascène n'a pas son event
 * Facebook créé côté Payload (par Joshué), on affiche la photo artiste ou
 * un fallback. Dès qu'il a son event FB → l'affiche officielle prend le dessus.
 */
export const getSceneAgendaShows = cache(
  async (limit = 40): Promise<SurlasceneShowDetail[]> => {
    const [shows, payloadEvents] = await Promise.all([
      getUpcomingShowDetails(limit),
      getUpcomingEventsData(Math.max(limit, 50)),
    ])
    // Index Payload events par date YYYY-MM-DD → image + facebookLink
    const payloadByDate = new Map<string, { image: string | null; facebookLink: string | null }>()
    for (const e of payloadEvents) {
      const k = e.date.slice(0, 10)
      // Garde le premier (= le plus tôt en heure si plusieurs ce jour) avec image
      if (!payloadByDate.has(k)) {
        payloadByDate.set(k, { image: e.image || null, facebookLink: e.facebookLink || null })
      } else if (e.image && !payloadByDate.get(k)!.image) {
        // Si on n'a pas encore d'image pour cette date, prend celle-ci
        payloadByDate.set(k, { image: e.image, facebookLink: e.facebookLink || null })
      }
    }
    return shows.map((s) => {
      const matched = payloadByDate.get(s.date_show.slice(0, 10))
      // Priorité Supabase (= source de vérité live, alimentée par bulk
      // aspiration FB ou updates manuels) > Payload (CMS catch-all en retard).
      // Si Supabase a déjà rempli coverImage/facebookLink dans
      // getUpcomingShowDetails, on les garde. Sinon, Payload sert de fallback.
      return {
        ...s,
        coverImage: s.coverImage || matched?.image || null,
        facebookLink: s.facebookLink || matched?.facebookLink || null,
      }
    })
  },
)

/**
 * Récupère les events Payload récents (date < today), ordre chronologique
 * (plus ancien d'abord). Sert au carousel spotlight pour montrer l'event
 * d'hier tronqué à gauche du focus.
 */
export const getRecentPayloadEvents = cache(async (n = 1): Promise<FrontendEvent[]> => {
  try {
    const payload = await getPayloadClient()
    const today = todayISO()
    const response = await payload.find({
      collection: 'events',
      depth: 1,
      limit: n,
      overrideAccess: false,
      sort: '-date',
      where: {
        and: [
          { status: { equals: 'published' } },
          { date: { less_than: today } },
        ],
      },
    })
    return response.docs.map(formatEvent).reverse()
  } catch {
    // Fallback proxy prod API
    const today = todayISO()
    const qs = new URLSearchParams({
      limit: String(n),
      depth: '1',
      sort: '-date',
      'where[status][equals]': 'published',
      'where[date][less_than]': today,
    }).toString()
    const docs = await fetchProdEventsAPI(qs)
    return docs.map(formatEvent).reverse()
  }
})

/**
 * Carousel home (stratégie spotlight 2026-05-16) : N events passés + M events futurs,
 * concaténés en ordre chronologique. L'index initial pointe sur le premier event
 * futur (today ou prochain à venir) → c'est lui qui sera affiché en focus central.
 *
 * Le carousel défile dans les deux sens : utilisateur peut revenir sur l'event passé.
 */
export const getEventsCarousel = cache(
  async (nPasses = 1, nFuturs = 5): Promise<{ events: FrontendEvent[]; initialIndex: number }> => {
    const [futurs, passesPayload, passesSurlascene] = await Promise.all([
      getProchainsEvents(nFuturs),
      getRecentPayloadEvents(nPasses * 2),
      getRecentSurlasceneEvents(nPasses * 2),
    ])
    // Fusion + dédoublonnage des passés (priorité Payload)
    const passesAll = fusionnerEtDedoublonner(passesPayload, passesSurlascene)
    // On garde les nPasses les plus récents (qui sont à la fin après tri chrono)
    const passes = passesAll.slice(Math.max(0, passesAll.length - nPasses))
    const events = [...passes, ...futurs]
    return { events, initialIndex: passes.length }
  },
)

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
