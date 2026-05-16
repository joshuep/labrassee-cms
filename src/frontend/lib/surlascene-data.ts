/**
 * Surlascène — data fetcher server-side
 *
 * Surlascène (pendant musical de Surnosmurs) a sa propre BD Supabase, alimentée
 * automatiquement par le calendrier Apple « La brassée » de Cédric via LaunchAgent
 * sync toutes les 2h. Pas de duplication côté PayloadCMS.
 *
 * Source de vérité : calendrier Apple → Supabase concerts + artistes_scene.
 * Page publique riche standalone : https://labrassee-surlascene-publique.vercel.app
 * Formulaire de dépôt EPK personnalisé : https://labrassee-surlascene-depot.vercel.app/?t={TOKEN}
 */

import { cache } from 'react'

import type { FrontendEvent } from './payload-data'

const SUPABASE_URL = 'https://xjlpttrziisldlclhsth.supabase.co'
// Anon key publique — déjà exposée sur le HTML statique surlascene-publique.vercel.app
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbHB0dHJ6aWlzbGRsY2xoc3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjkyODMsImV4cCI6MjA5MjA0NTI4M30.JpkTnJF1ZP08ybzFdM8fFUJOTiKYx8ltTe2nxiDPk24'
export const SURLASCENE_BUCKET_URL =
  SUPABASE_URL + '/storage/v1/object/public/artistes-scene-epk/'
export const SURLASCENE_PUBLIC_URL = 'https://labrassee-surlascene-publique.vercel.app'
export const SURLASCENE_DEPOT_URL = 'https://labrassee-surlascene-depot.vercel.app'

export type SurlasceneArtiste = {
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
}

export function surlasceneImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  return SURLASCENE_BUCKET_URL + path
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
      console.error('[surlascene] fetch fail', path, res.status)
      return null
    }
    return (await res.json()) as T
  } catch (e) {
    console.error('[surlascene] fetch error', e)
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

/**
 * Convertit un concert Surlascène en FrontendEvent étendu (compatible avec EventCard).
 * - `image` = TOUJOURS null pour les events Surlascène → EventCard rend un poster CSS
 *   cohérent (badge "Sur la scène", style Maïa) même s'il y a une photo artiste.
 *   La photo artiste est passée séparément en `surlascenePosterPhoto` pour servir
 *   d'arrière-plan atténué du poster CSS.
 * - `facebookLink` = null par défaut (pas d'event FB encore lié)
 * - `surlasceneShowId` = id pour pointer vers la page détaillée
 */
const concertToEvent = (row: RawConcertRow): FrontendEvent => {
  const arts = (row.concerts_artistes || []).slice().sort((a, b) => a.ordre - b.ordre)
  const artiste = arts[0]?.artistes_scene || null
  const photoPath = artiste?.photo_artiste_path || artiste?.photos_hd_paths?.[0] || null
  const photoFull = surlasceneImageUrl(photoPath)
  const titre = artiste?.nom_artiste || row.titre_show || 'À confirmer'
  // Heure formatée "19h30"
  const hr = row.heure_debut?.slice(0, 5).replace(':', 'h') || null

  return {
    id: 'surlascene-' + row.id,
    title: titre,
    date: row.date_show,
    time: hr,
    image: null, // jamais d'image directe — le poster CSS Surlascène prend le relais
    facebookLink: null,
    hasOfficialPoster: false,
    description: undefined,
    // Extensions Surlascène (lues optionnellement par EventCard)
    surlasceneShowId: row.id,
    surlasceneSource: 'surlascene',
    surlasceneArtiste: artiste,
    surlasceneType: row.type_show,
    surlascenePosterPhoto: photoFull,
  } as FrontendEvent
}

export const getUpcomingSurlasceneEvents = cache(
  async (limit = 30): Promise<FrontendEvent[]> => {
    const today = new Date().toISOString().slice(0, 10)
    const select = encodeURIComponent(
      '*,concerts_artistes(ordre,artistes_scene(id,nom_artiste,genre,bio,permanence,recurrence_notes,heure_debut_speciale,site_web,instagram,spotify_url,bandcamp_url,soundcloud_url,youtube_url,photo_artiste_path,photos_hd_paths))',
    )
    const path =
      `/rest/v1/concerts?select=${select}&date_show=gte.${today}` +
      `&statut=in.(planifie,confirme)&order=date_show.asc&limit=${limit}`
    const rows = await supaFetch<RawConcertRow[]>(path)
    if (!rows) return []
    return rows.map(concertToEvent)
  },
)

/**
 * Récupère les concerts à venir au format "détaillé" (pour la page riche /scene
 * avec modal artiste, galeries de photos, etc.). Inclut tous les champs artistes
 * + heure_soundcheck + photos_hd_paths complets.
 */
export type SurlasceneShowDetail = {
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

type RawConcertDetailRow = {
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

export const getUpcomingShowDetails = cache(
  async (limit = 40): Promise<SurlasceneShowDetail[]> => {
    const today = new Date().toISOString().slice(0, 10)
    const select = encodeURIComponent(
      '*,concerts_artistes(ordre,artistes_scene(id,nom_artiste,genre,bio,permanence,recurrence_notes,heure_debut_speciale,site_web,instagram,facebook,spotify_url,bandcamp_url,soundcloud_url,youtube_url,vimeo_url,photo_artiste_path,photos_hd_paths,duree_set_minutes,nb_personnes_scene))',
    )
    const path =
      `/rest/v1/concerts?select=${select}&date_show=gte.${today}` +
      `&statut=in.(planifie,confirme)&order=date_show.asc&limit=${limit}`
    const rows = await supaFetch<RawConcertDetailRow[]>(path)
    if (!rows) return []
    return rows.map((r) => {
      const arts = (r.concerts_artistes || []).slice().sort((a, b) => a.ordre - b.ordre)
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
        artiste: arts[0]?.artistes_scene || null,
      }
    })
  },
)

/**
 * Dossier technique (singleton, v1.x publié ou brouillon).
 * Rendu dynamiquement par SceneDossierTechnique : itération sur les clés réelles
 * du JSON pour absorber les évolutions de structure sans toucher au front.
 */
export type SurlasceneDossierTechnique = {
  version: string
  en_brouillon: boolean
  contenu: Record<string, unknown>
  notes_publiques: string | null
  maj_le: string
  pdf_path: string | null
}

export const getDossierTechnique = cache(
  async (): Promise<SurlasceneDossierTechnique | null> => {
    const path = '/rest/v1/dossier_technique?select=*&order=cree_le.desc&limit=1'
    const rows = await supaFetch<SurlasceneDossierTechnique[]>(path)
    return rows && rows[0] ? rows[0] : null
  },
)

// Formatters réutilisables côté composants
export const JOURS_FR = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']
export const MOIS_FR = [
  'janv.', 'févr.', 'mars', 'avril', 'mai', 'juin',
  'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
]
export const JOURS_LONG = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
export const MOIS_LONG = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]
