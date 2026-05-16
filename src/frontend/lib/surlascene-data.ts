/**
 * Surlascène — data fetcher server-side
 *
 * Surlascène (pendant musical de Surnosmurs) a sa propre BD Supabase, alimentée
 * automatiquement par le calendrier Apple « La brassée » de Cédric (via LaunchAgent
 * sync toutes les 2h). Pas de duplication côté PayloadCMS.
 *
 * Source de vérité : calendrier Apple → Supabase concerts + artistes_scene.
 * Page publique standalone : https://labrassee-surlascene-publique.vercel.app
 */

import { cache } from 'react'

const SUPABASE_URL = 'https://xjlpttrziisldlclhsth.supabase.co'
// Anon key publique — déjà exposée sur le HTML statique surlascene-publique.vercel.app
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbHB0dHJ6aWlzbGRsY2xoc3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjkyODMsImV4cCI6MjA5MjA0NTI4M30.JpkTnJF1ZP08ybzFdM8fFUJOTiKYx8ltTe2nxiDPk24'
const BUCKET_URL =
  SUPABASE_URL + '/storage/v1/object/public/artistes-scene-epk/'

export type SurlasceneArtiste = {
  id: string
  nom_artiste: string
  genre: string | null
  bio: string | null
  titre_set: string | null
  duree_set_minutes: number | null
  nb_personnes_scene: number | null
  permanence: boolean
  recurrence_notes: string | null
  heure_debut_speciale: string | null
  site_web: string | null
  instagram: string | null
  facebook: string | null
  spotify_url: string | null
  bandcamp_url: string | null
  soundcloud_url: string | null
  youtube_url: string | null
  vimeo_url: string | null
  photo_artiste_path: string | null
  photos_hd_paths: string[] | null
}

export type SurlasceneConcert = {
  id: string
  date_show: string
  heure_debut: string | null
  heure_fin: string | null
  heure_soundcheck: string | null
  type_show: string
  titre_show: string | null
  description_publique: string | null
  statut: string
  artiste: SurlasceneArtiste | null
}

export type SurlasceneDossierTechnique = {
  version: string
  en_brouillon: boolean
  contenu: Record<string, unknown>
  notes_publiques: string | null
  maj_le: string
}

export function photoUrl(path: string | null | undefined): string | null {
  if (!path) return null
  return BUCKET_URL + path
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
      console.error('[surlascene] supa fetch fail', path, res.status)
      return null
    }
    return (await res.json()) as T
  } catch (e) {
    console.error('[surlascene] supa fetch error', e)
    return null
  }
}

type RawConcertRow = {
  id: string
  date_show: string
  heure_debut: string | null
  heure_fin: string | null
  heure_soundcheck: string | null
  type_show: string
  titre_show: string | null
  description_publique: string | null
  statut: string
  concerts_artistes?: Array<{ ordre: number; artistes_scene: SurlasceneArtiste }>
}

export const getUpcomingShows = cache(async (limit = 30): Promise<SurlasceneConcert[]> => {
  const today = new Date().toISOString().slice(0, 10)
  const select = encodeURIComponent(
    '*,concerts_artistes(ordre,artistes_scene(id,nom_artiste,genre,bio,titre_set,duree_set_minutes,nb_personnes_scene,permanence,recurrence_notes,heure_debut_speciale,site_web,instagram,facebook,spotify_url,bandcamp_url,soundcloud_url,youtube_url,vimeo_url,photo_artiste_path,photos_hd_paths))',
  )
  const path =
    `/rest/v1/concerts?select=${select}&date_show=gte.${today}` +
    `&statut=in.(planifie,confirme)&order=date_show.asc&limit=${limit}`
  const rows = await supaFetch<RawConcertRow[]>(path)
  if (!rows) return []
  return rows.map((r) => {
    const arts = (r.concerts_artistes || []).slice().sort((a, b) => a.ordre - b.ordre)
    const artiste = arts[0]?.artistes_scene || null
    return {
      id: r.id,
      date_show: r.date_show,
      heure_debut: r.heure_debut,
      heure_fin: r.heure_fin,
      heure_soundcheck: r.heure_soundcheck,
      type_show: r.type_show,
      titre_show: r.titre_show,
      description_publique: r.description_publique,
      statut: r.statut,
      artiste,
    }
  })
})

export const getDossierTechnique = cache(async (): Promise<SurlasceneDossierTechnique | null> => {
  const path = '/rest/v1/dossier_technique?select=*&order=cree_le.desc&limit=1'
  const rows = await supaFetch<SurlasceneDossierTechnique[]>(path)
  return rows && rows[0] ? rows[0] : null
})

// Formatters utiles côté composants
const JOURS_FR = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']
const MOIS_FR = [
  'janv.', 'févr.', 'mars', 'avril', 'mai', 'juin',
  'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
]

export function formatDateCourte(iso: string): { jour: string; num: number; mois: string } {
  const d = new Date(iso + 'T00:00:00')
  return { jour: JOURS_FR[d.getDay()], num: d.getDate(), mois: MOIS_FR[d.getMonth()] }
}

export function formatDateLongue(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return `${JOURS_FR[d.getDay()]} ${d.getDate()} ${MOIS_FR[d.getMonth()]} ${d.getFullYear()}`
}

export function formatHeure(t: string | null | undefined): string {
  if (!t) return '—'
  return t.slice(0, 5)
}
