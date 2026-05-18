/**
 * Surnosmurs — data fetcher pour les expos murales de La Brassée.
 *
 * Source de vérité : Supabase `artistes_murs` + bucket Storage `artistes-murs-photos`.
 * Une expo = un artiste avec `date_install <= today <= date_decrochage` et
 * `signature_acceptee = true`.
 *
 * Cycle Surnosmurs (rotation 4 semaines) :
 *   - Installation : dimanche AM (artiste, en autonomie)
 *   - Vernissage : dimanche suivant 5à7 (présence artiste obligatoire)
 *   - 4 semaines d'expo
 *   - Décrochage : dimanche matin 4 sem après l'installation
 */

import { cache } from 'react'

const SUPABASE_URL = 'https://xjlpttrziisldlclhsth.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbHB0dHJ6aWlzbGRsY2xoc3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjkyODMsImV4cCI6MjA5MjA0NTI4M30.JpkTnJF1ZP08ybzFdM8fFUJOTiKYx8ltTe2nxiDPk24'

const BUCKET_URL = SUPABASE_URL + '/storage/v1/object/public/artistes-murs-photos/'

export type ArtisteMurs = {
  id: string
  nom_artiste: string
  nom_complet: string | null
  courriel: string | null
  cellulaire: string | null
  instagram: string | null
  site_web: string | null
  facebook: string | null
  bio: string | null
  titre_expo: string | null
  technique: string | null
  nb_oeuvres: number | null
  dimensions_notes: string | null
  photo_artiste_path: string | null
  photos_oeuvres_paths: string[] | null
  date_install: string | null
  date_vernissage: string | null
  date_decrochage: string | null
  statut: string
  token_depot: string | null
}

export function mursImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  return BUCKET_URL + path
}

export function mursPhotosUrls(paths: string[] | null | undefined): string[] {
  if (!paths || !Array.isArray(paths)) return []
  return paths.map(mursImageUrl).filter((u): u is string => !!u)
}

async function supaFetch<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(SUPABASE_URL + path, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      },
      next: { revalidate, tags: ['surnosmurs'] },
    })
    if (!res.ok) {
      console.error('[surnosmurs] fetch fail', path, res.status)
      return null
    }
    return (await res.json()) as T
  } catch (e) {
    console.error('[surnosmurs] fetch error', e)
    return null
  }
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

/**
 * Retourne l'artiste actuellement exposé sur les murs (s'il y en a un).
 *   - date_install <= today
 *   - date_decrochage >= today
 *   - signature_acceptee = true
 *
 * S'il y a chevauchement (rare, en transition), on prend celui avec la
 * date_install la plus récente.
 */
export const getExpoActuelle = cache(async (): Promise<ArtisteMurs | null> => {
  const today = todayMontrealISO()
  const select = encodeURIComponent(
    'id,nom_artiste,nom_complet,courriel,cellulaire,instagram,site_web,facebook,bio,titre_expo,technique,nb_oeuvres,dimensions_notes,photo_artiste_path,photos_oeuvres_paths,date_install,date_vernissage,date_decrochage,statut,token_depot',
  )
  const path =
    `/rest/v1/artistes_murs?select=${select}` +
    `&date_install=lte.${today}&date_decrochage=gte.${today}` +
    '&signature_acceptee=eq.true&order=date_install.desc&limit=1'
  const rows = await supaFetch<ArtisteMurs[]>(path)
  return rows && rows[0] ? rows[0] : null
})

/**
 * Retourne la prochaine expo à venir (date_install > today).
 * Utile pour annoncer « bientôt : X » quand on est dans la période morte.
 */
export const getProchaineExpo = cache(async (): Promise<ArtisteMurs | null> => {
  const today = todayMontrealISO()
  const select = encodeURIComponent(
    'id,nom_artiste,nom_complet,courriel,instagram,site_web,facebook,bio,titre_expo,technique,date_install,date_vernissage,date_decrochage,statut',
  )
  const path =
    `/rest/v1/artistes_murs?select=${select}` +
    `&date_install=gt.${today}` +
    '&signature_acceptee=eq.true&order=date_install.asc&limit=1'
  const rows = await supaFetch<ArtisteMurs[]>(path)
  return rows && rows[0] ? rows[0] : null
})
