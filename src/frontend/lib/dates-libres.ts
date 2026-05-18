/**
 * Dates libres Sur la scène
 *
 * Calcule les soirs ouverts (lundi, mardi, jeudi, vendredi, samedi) NON bookés
 * dans une fenêtre future. Source de vérité : `concerts.date_show` (Supabase).
 *
 * Préavis minimum 7 jours (les artistes ne peuvent pas proposer à 48h, on a
 * besoin de temps pour la fan-out promo).
 *
 * Limite : si une permanence hebdomadaire (Bluegrass mardi, Jazz & Jam jeudi)
 * n'a pas encore son event créé en BD, la date apparaîtra « libre ». Le
 * sync calendrier Apple roule toutes les 2h, donc la dérive maximum est faible,
 * mais Cédric arbitre au moment de la confirmation s'il y a un conflit non visible.
 */

import { cache } from 'react'

const SUPABASE_URL = 'https://xjlpttrziisldlclhsth.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbHB0dHJ6aWlzbGRsY2xoc3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjkyODMsImV4cCI6MjA5MjA0NTI4M30.JpkTnJF1ZP08ybzFdM8fFUJOTiKYx8ltTe2nxiDPk24'

export type DateLibre = {
  iso: string           // 'YYYY-MM-DD'
  jourSemaine: string   // 'lundi' | 'mardi' | 'jeudi' | 'vendredi' | 'samedi'
  jourSemaineCourt: string // 'lun' | 'mar' | 'jeu' | 'ven' | 'sam'
  jourMois: number      // 1..31
  moisLong: string      // 'juin'
  moisCourt: string     // 'juin'
  annee: number
  cleMois: string       // 'YYYY-MM' (pour grouper)
  libelleMois: string   // 'Juin 2026' (pour afficher)
}

const JOURS_LONG = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const JOURS_COURT = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
const MOIS_LONG = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

// Soirs où La Brassée ouvre sa scène (5 fois/semaine) : lun, mar, jeu, ven, sam
const SOIRS_OUVERTS = new Set([1, 2, 4, 5, 6])
const PREAVIS_JOURS = 7
const HORIZON_DEFAUT_JOURS = 120

export const getDatesLibresScene = cache(
  async (joursHorizon = HORIZON_DEFAUT_JOURS): Promise<DateLibre[]> => {
    // 1. Fetch toutes les dates de concerts planifiés/confirmés dans l'horizon
    const today = new Date()
    const todayISO = today.toISOString().slice(0, 10)
    const url =
      SUPABASE_URL +
      '/rest/v1/concerts?select=date_show&statut=in.(planifie,confirme)' +
      `&date_show=gte.${todayISO}&limit=500`

    const bookes = new Set<string>()
    try {
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        },
        next: { revalidate: 300, tags: ['surlascene', 'dates-libres'] },
      })
      if (res.ok) {
        const rows: { date_show: string }[] = await res.json()
        for (const r of rows) bookes.add(r.date_show)
      }
    } catch (e) {
      console.error('[dates-libres] fetch concerts fail', e)
    }

    // 2. Génère les dates lun/mar/jeu/ven/sam dans (today + préavis, today + horizon)
    const minDate = new Date(today)
    minDate.setDate(minDate.getDate() + PREAVIS_JOURS)
    minDate.setHours(0, 0, 0, 0)

    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + joursHorizon)
    maxDate.setHours(0, 0, 0, 0)

    const result: DateLibre[] = []
    const cur = new Date(minDate)

    while (cur <= maxDate) {
      const dow = cur.getDay() // 0=dim, 1=lun, ..., 6=sam
      if (SOIRS_OUVERTS.has(dow)) {
        const iso = cur.toISOString().slice(0, 10)
        if (!bookes.has(iso)) {
          const moisIdx = cur.getMonth()
          const annee = cur.getFullYear()
          const cleMois = iso.slice(0, 7)
          const moisLong = MOIS_LONG[moisIdx]
          const libelleMois = moisLong.charAt(0).toUpperCase() + moisLong.slice(1) + ' ' + annee
          result.push({
            iso,
            jourSemaine: JOURS_LONG[dow],
            jourSemaineCourt: JOURS_COURT[dow],
            jourMois: cur.getDate(),
            moisLong,
            moisCourt: moisLong,
            annee,
            cleMois,
            libelleMois,
          })
        }
      }
      cur.setDate(cur.getDate() + 1)
    }

    return result
  },
)

/**
 * Helper : regroupe une liste de dates libres par clé de mois (YYYY-MM).
 * Conserve l'ordre chronologique.
 */
export function grouperParMois(dates: DateLibre[]): Array<{ cleMois: string; libelle: string; dates: DateLibre[] }> {
  const map = new Map<string, { libelle: string; dates: DateLibre[] }>()
  for (const d of dates) {
    const existing = map.get(d.cleMois)
    if (existing) existing.dates.push(d)
    else map.set(d.cleMois, { libelle: d.libelleMois, dates: [d] })
  }
  return Array.from(map.entries()).map(([cleMois, v]) => ({ cleMois, libelle: v.libelle, dates: v.dates }))
}

// ─────────────────────────────────────────────────────────────────────────
// Calendrier visuel (vue mois complet pour /proposer)
// ─────────────────────────────────────────────────────────────────────────

export type StatutJour =
  | 'libre'         // soir ouvert + aucun concert → cliquable pour proposer un show
  | 'libre_expo'    // dim sans vernissage/accrochage → cliquable pour proposer une expo
  | 'impro'         // lundi réservé d'office pour la soirée Impro (non cliquable)
  | 'reservee'      // concert (scène) statut='planifie' (option, attente confirmation)
  | 'bookee'        // concert (scène) statut='confirme'
  | 'reservee_expo' // dim expo statut='planifie' (rond orange, distinct des concerts carrés)
  | 'bookee_expo'   // dim expo statut='confirme' (rond vert)
  | 'ferme'         // soir non scène (mer + dim) ou hors préavis (< 7 jours)
  | 'passee'        // date dans le passé
  | 'horsmois'      // padding début/fin du mois pour avoir grille 7 colonnes

export type JourCalendrier = {
  iso: string
  dow: number              // 0=dim, 1=lun, ..., 6=sam
  jourMois: number         // 1..31
  statut: StatutJour
  eventTitre?: string | null
  // Pour les statuts 'vernissage' : distingue le 5à7 du dim d'avant (accrochage).
  vernissageRole?: 'vernissage' | 'accrochage'
}

export type MoisCalendrier = {
  cleMois: string                 // YYYY-MM
  annee: number
  mois: number                    // 1..12
  libelle: string                 // 'Juin 2026'
  jours: JourCalendrier[]         // 35 ou 42 cases (5 ou 6 sem × 7 jours)
  // Mois "permanents prioritaires" (septembre, octobre, novembre) : on grise
  // tout le mois et on affiche un message « restez à l'affût ». Pas de candidature
  // ponctuelle acceptée sur cette période — réservé aux permanences.
  permanentsPriority?: boolean
}

const MOIS_LONG_LOCAL = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

/**
 * Récupère le calendrier visuel sur N mois consécutifs (à partir du mois actuel).
 * Pour chaque jour : statut visuel (libre/réservée/bookée/fermé/passée) + titre event.
 *
 * Règles La Brassée :
 *   - Mer + Dim → 'ferme' (pas de scène musicale ces jours-là, sauf event spécial)
 *   - Si event présent (vernissage dimanche par ex) → écrase 'ferme' par 'bookee'/'reservee'
 *   - Date < today → 'passee'
 *   - Date < today + 7j → 'ferme' (préavis minimum 7 jours)
 *   - Sinon, soir ouvert (lun/mar/jeu/ven/sam) → 'libre'
 */
export const getCalendrierMois = cache(
  async (nMois = 3): Promise<MoisCalendrier[]> => {
    const today = new Date()
    const todayISO = today.toISOString().slice(0, 10)
    const preavisDate = new Date(today)
    preavisDate.setDate(today.getDate() + 7)
    const preavisISO = preavisDate.toISOString().slice(0, 10)

    // Fetch all concerts dans les nMois prochains mois (large)
    const limitDate = new Date(today.getFullYear(), today.getMonth() + nMois + 1, 0)
    const limitISO = limitDate.toISOString().slice(0, 10)

    const url =
      SUPABASE_URL +
      '/rest/v1/concerts?select=date_show,statut,titre_show,type_show' +
      `&date_show=gte.${todayISO}&date_show=lte.${limitISO}` +
      '&statut=in.(planifie,confirme)&limit=500'

    const concertsParDate = new Map<
      string,
      { statut: string; titre: string | null; type: string | null }
    >()
    try {
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        },
        next: { revalidate: 300, tags: ['surlascene', 'calendrier-mois'] },
      })
      if (res.ok) {
        const rows: {
          date_show: string
          statut: string
          titre_show: string | null
          type_show: string | null
        }[] = await res.json()
        for (const r of rows) {
          concertsParDate.set(r.date_show, {
            statut: r.statut,
            titre: r.titre_show,
            type: r.type_show,
          })
        }
      }
    } catch (e) {
      console.error('[calendrier-mois] fetch fail', e)
    }

    // Fetch les périodes d'expo Surnosmurs qui chevauchent la fenêtre.
    // Une expo = date_install → date_decrochage. Tous les dimanches dans cette
    // plage doivent être marqués comme « expo en cours » (rond vert/orange)
    // même s'ils n'ont pas de concert spécifique en BD.
    type ExpoRange = { start: string; end: string; signature: boolean }
    const exposEnCours: ExpoRange[] = []
    try {
      const urlExpos =
        SUPABASE_URL +
        '/rest/v1/artistes_murs?select=date_install,date_decrochage,signature_acceptee' +
        `&date_install=lte.${limitISO}&date_decrochage=gte.${todayISO}` +
        '&date_install=not.is.null&date_decrochage=not.is.null'
      const resExpos = await fetch(urlExpos, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        },
        next: { revalidate: 300, tags: ['surnosmurs', 'calendrier-mois'] },
      })
      if (resExpos.ok) {
        const rows: {
          date_install: string
          date_decrochage: string
          signature_acceptee: boolean
        }[] = await resExpos.json()
        for (const r of rows) {
          exposEnCours.push({
            start: r.date_install,
            end: r.date_decrochage,
            signature: !!r.signature_acceptee,
          })
        }
      }
    } catch (e) {
      console.error('[calendrier-mois] fetch expos fail', e)
    }

    function expoCouvrant(iso: string): ExpoRange | null {
      for (const e of exposEnCours) {
        if (iso >= e.start && iso <= e.end) return e
      }
      return null
    }

    const result: MoisCalendrier[] = []
    for (let i = 0; i < nMois; i++) {
      const annee = today.getFullYear() + Math.floor((today.getMonth() + i) / 12)
      const mois = (today.getMonth() + i) % 12 // 0..11
      const cleMois = `${annee}-${String(mois + 1).padStart(2, '0')}`
      const libelle =
        MOIS_LONG_LOCAL[mois].charAt(0).toUpperCase() +
        MOIS_LONG_LOCAL[mois].slice(1) +
        ' ' + annee

      // Padding début : on commence au LUNDI précédant ou égal au 1er du mois
      const premier = new Date(annee, mois, 1)
      const dowPremier = premier.getDay() // 0=dim, ..., 6=sam
      // En convention lundi=1, dimanche=7 → décalage pour grille lun-dim
      const offsetDebut = (dowPremier + 6) % 7 // 0 si lundi, 6 si dimanche

      // Fin du mois
      const dernier = new Date(annee, mois + 1, 0).getDate()
      const totalCells = Math.ceil((offsetDebut + dernier) / 7) * 7

      const jours: JourCalendrier[] = []
      for (let cell = 0; cell < totalCells; cell++) {
        const dayNumInMonth = cell - offsetDebut + 1
        if (dayNumInMonth < 1 || dayNumInMonth > dernier) {
          jours.push({
            iso: '',
            dow: 0,
            jourMois: 0,
            statut: 'horsmois',
          })
          continue
        }
        const d = new Date(annee, mois, dayNumInMonth)
        const iso = `${annee}-${String(mois + 1).padStart(2, '0')}-${String(dayNumInMonth).padStart(2, '0')}`
        const dow = d.getDay()
        const concert = concertsParDate.get(iso)
        let statut: StatutJour
        const eventTitre: string | null = null

        // Jours ouverts selon le mois :
        // - Juillet (7) + août (8)       : VEN + SAM uniquement (été)
        // - Sept (9) → déc (12)           : RIEN → permanents prioritaires
        // - Reste de l'année              : LUN, MAR, JEU, VEN, SAM (mer + dim fermés)
        const moisHum = mois + 1
        const isPermanentsMonth =
          moisHum === 9 || moisHum === 10 || moisHum === 11 || moisHum === 12
        const joursOuverts = isPermanentsMonth
          ? new Set<number>()
          : (moisHum === 7 || moisHum === 8)
            ? new Set([5, 6])
            : new Set([1, 2, 4, 5, 6])

        let vernissageRole: 'vernissage' | 'accrochage' | undefined
        // Cas particulier : si on est un DIMANCHE pendant une expo en cours
        // (date_install ≤ iso ≤ date_decrochage), on marque le dim comme
        // bookée/réservée expo MÊME s'il n'y a pas de concert spécifique en BD
        // ce jour-là (sinon les dim intermédiaires apparaissent à tort comme
        // « libre_expo »).
        const expoCe = dow === 0 ? expoCouvrant(iso) : null

        if (concert) {
          // Vernissage / accrochage : statut expo (rond vert/orange selon
          // confirme/planifie — cohérent avec les concerts mais en rond).
          if (concert.type === 'vernissage' || concert.type === 'accrochage' || concert.type === 'decrochage') {
            statut = concert.statut === 'confirme' ? 'bookee_expo' : 'reservee_expo'
            vernissageRole = concert.type === 'vernissage' ? 'vernissage' : 'accrochage'
          } else {
            statut = concert.statut === 'confirme' ? 'bookee' : 'reservee'
          }
        } else if (iso < todayISO) {
          statut = 'passee'
        } else if (expoCe) {
          // Dimanche pendant une expo en cours → bloqué (rond vert si signé,
          // rond orange si pas encore signé) — pas cliquable pour une nouvelle
          // candidature, l'artiste actuel·le occupe les murs.
          statut = expoCe.signature ? 'bookee_expo' : 'reservee_expo'
        } else if (dow === 0 && !isPermanentsMonth && iso >= preavisISO) {
          // Dimanche libre (pas de vernissage/accrochage prévu, hors mois
          // permanents prioritaires, préavis respecté) → cliquable pour
          // proposer une expo Surnosmurs (rond jaune, distinct des concerts).
          statut = 'libre_expo'
        } else if (!joursOuverts.has(dow)) {
          // Jour non ouvert ce mois-ci → fermé (mer, dim avec préavis pas
          // respecté ; + lun/mar/jeu en juillet/août ; + tout le mois en sept-déc)
          statut = 'ferme'
        } else if (iso < preavisISO) {
          // Préavis 7 jours minimum
          statut = 'ferme'
        } else if (dow === 1) {
          // Lundis bloqués pour la soirée Impro (récurrence éditoriale)
          statut = 'impro'
        } else {
          statut = 'libre'
        }

        jours.push({ iso, dow, jourMois: dayNumInMonth, statut, eventTitre, vernissageRole })
      }

      const moisNum = mois + 1
      const permanentsPriority =
        moisNum === 9 || moisNum === 10 || moisNum === 11 || moisNum === 12
      result.push({ cleMois, annee, mois: moisNum, libelle, jours, permanentsPriority })
    }
    return result
  },
)
