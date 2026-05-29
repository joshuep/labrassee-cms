/**
 * Surlascène — fiche publique d'un artiste (page /scene/[slug]).
 *
 * Fetche l'artiste par son token_depot (= slug URL), ainsi que ses concerts
 * à venir et ses trois derniers concerts passés à La Brassée.
 */

import { cache } from 'react'

import { SURLASCENE_BUCKET_URL } from './surlascene-data'

const SUPABASE_URL = 'https://xjlpttrziisldlclhsth.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbHB0dHJ6aWlzbGRsY2xoc3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjkyODMsImV4cCI6MjA5MjA0NTI4M30.JpkTnJF1ZP08ybzFdM8fFUJOTiKYx8ltTe2nxiDPk24'

/** Statuts d'artiste visibles publiquement. */
const STATUTS_PUBLICS = ['programme', 'confirme', 'depot_complet', 'candidature_complete']

export type ArtistePublic = {
  id: string
  token_depot: string
  nom_artiste: string
  bio: string | null
  genre: string | null
  nb_personnes_scene: number | null
  duree_set_minutes: number | null
  photo_artiste_path: string | null
  photos_hd_paths: string[] | null
  videos_paths: string[] | null
  titre_set: string | null
  categorie: string | null
  instagram: string | null
  site_web: string | null
  spotify_url: string | null
  bandcamp_url: string | null
  youtube_url: string | null
  tiktok: string | null
  statut: string
}

export type ConcertPublic = {
  id: string
  date_show: string
  heure_debut: string | null
  titre_show: string | null
  type_show: string
  fb_event_url: string | null
}

export type FicheArtiste = {
  artiste: ArtistePublic
  /** Concerts à venir (date >= aujourd'hui, statut confirme). */
  prochaines: ConcertPublic[]
  /** 3 derniers concerts passés. */
  passees: ConcertPublic[]
  /** URL de la photo principale (bucket public). */
  photoUrl: string | null
  /** URLs de la galerie HD (jusqu'à 6 photos). */
  galerieUrls: string[]
  /** URLs des vidéos (bucket public). */
  videosUrls: string[]
  /**
   * Vrai si la soirée est une soirée-bénéfice : la vidéo met alors en avant
   * la cause/objectif plutôt qu'une simple prestation musicale.
   */
  benefice: boolean
}

function todayMontrealISO(): string {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = f.formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value || ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

async function supaFetch<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(SUPABASE_URL + path, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      },
      next: { revalidate, tags: ['surlascene'] },
    })
    if (!res.ok) {
      console.error('[surlascene-artiste] fetch fail', path, res.status)
      return null
    }
    return (await res.json()) as T
  } catch (e) {
    console.error('[surlascene-artiste] fetch error', e)
    return null
  }
}

/**
 * Normalise un nom d'artiste pour le matching fuzzy : minuscules, sans accents,
 * sans ponctuation, espaces normalisés.
 */
function normaliser(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Retourne true si le titre du concert contient le nom de l'artiste
 * (matching insensible à la casse et aux accents).
 */
function matchNomArtiste(titreShow: string | null, nomArtiste: string): boolean {
  if (!titreShow) return false
  return normaliser(titreShow).includes(normaliser(nomArtiste))
}

/**
 * Fetche la fiche publique d'un artiste Surlascène par son token_depot.
 * Retourne null si l'artiste n'existe pas ou n'est pas dans un statut public.
 */
export const getArtisteParToken = cache(
  async (token: string): Promise<FicheArtiste | null> => {
    // 1. Chercher l'artiste
    const statutsFilter = STATUTS_PUBLICS.map((s) => `"${s}"`).join(',')
    const selectArtiste = encodeURIComponent(
      'id,token_depot,nom_artiste,bio,genre,nb_personnes_scene,duree_set_minutes,photo_artiste_path,photos_hd_paths,videos_paths,titre_set,categorie,instagram,site_web,spotify_url,bandcamp_url,youtube_url,tiktok,statut',
    )
    const pathArtiste =
      `/rest/v1/artistes_scene?select=${selectArtiste}` +
      `&token_depot=eq.${encodeURIComponent(token)}` +
      `&statut=in.(${encodeURIComponent(statutsFilter)})` +
      `&limit=1`

    const rows = await supaFetch<ArtistePublic[]>(pathArtiste)
    if (!rows || rows.length === 0) return null
    const artiste = rows[0]

    const today = todayMontrealISO()

    // 2. Concerts à venir (statut confirme, date >= aujourd'hui)
    const selectConcert = encodeURIComponent(
      'id,date_show,heure_debut,titre_show,type_show,fb_event_url',
    )
    const pathAvenir =
      `/rest/v1/concerts?select=${selectConcert}` +
      `&date_show=gte.${today}` +
      `&statut=in.("confirme","planifie")` +
      `&order=date_show.asc&limit=20`

    const concertsAvenir = await supaFetch<ConcertPublic[]>(pathAvenir)
    const prochaines = (concertsAvenir || []).filter((c) =>
      matchNomArtiste(c.titre_show, artiste.nom_artiste),
    )

    // 3. Concerts passés (date < aujourd'hui, 3 derniers)
    const pathPasses =
      `/rest/v1/concerts?select=${selectConcert}` +
      `&date_show=lt.${today}` +
      `&statut=in.("confirme","planifie")` +
      `&order=date_show.desc&limit=30`

    const concertsPasses = await supaFetch<ConcertPublic[]>(pathPasses)
    const passees = (concertsPasses || [])
      .filter((c) => matchNomArtiste(c.titre_show, artiste.nom_artiste))
      .slice(0, 3)

    // 4. URLs images
    const photoUrl = artiste.photo_artiste_path
      ? SURLASCENE_BUCKET_URL + artiste.photo_artiste_path
      : null
    const galerieUrls = (artiste.photos_hd_paths || [])
      .slice(0, 6)
      .map((p) => SURLASCENE_BUCKET_URL + p)

    // 5. Vidéos + détection soirée-bénéfice
    const videosUrls = (artiste.videos_paths || [])
      .slice(0, 4)
      .map((p) => SURLASCENE_BUCKET_URL + p)
    const benefice = [artiste.genre, artiste.titre_set]
      .filter((v): v is string => Boolean(v))
      .some((v) => normaliser(v).includes('benefice'))

    return { artiste, prochaines, passees, photoUrl, galerieUrls, videosUrls, benefice }
  },
)
