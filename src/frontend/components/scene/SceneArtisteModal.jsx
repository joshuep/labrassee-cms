'use client'

import React, { useEffect } from 'react'
import styled from 'styled-components'

import { SURLASCENE_BUCKET_URL, JOURS_LONG, MOIS_LONG } from '@/frontend/lib/surlascene-data'

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 9, 5, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1500;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
`

const Carte = styled.div`
  background: linear-gradient(180deg, rgba(31, 28, 15, 0.95), rgba(16, 15, 9, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  max-width: 800px;
  width: 100%;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 32px 100px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  position: relative;
  margin: auto;
`

const Ferme = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.2s;

  &:hover {
    background: #ff6b6b;
  }
`

const HeroModal = styled.div`
  width: 100%;
  aspect-ratio: 16 / 7;
  background-size: cover;
  background-position: center;
  background-color: #0a0905;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-din);
  color: rgba(205, 196, 157, 0.6);
  font-size: 120px;
  font-weight: 200;
`

const Corps = styled.div`
  padding: 28px 32px 32px;
`

const Meta = styled.div`
  font-family: var(--font-din);
  color: rgba(205, 196, 157, 0.6);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 11px;
  margin-bottom: 18px;
`

const NomArtiste = styled.h3`
  font-family: var(--font-din);
  font-weight: 200;
  font-size: clamp(28px, 4vw, 40px);
  color: #ffffff;
  letter-spacing: -0.5px;
  margin: 0 0 8px;
`

const ShowInfo = styled.div`
  background: rgba(247, 209, 53, 0.06);
  border-left: 3px solid var(--color-brand);
  padding: 14px 18px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;

  strong {
    color: var(--color-brand);
  }
`

const Permanence = styled.div`
  background: rgba(247, 209, 53, 0.08);
  border-left: 3px solid var(--color-brand);
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 18px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;

  strong {
    color: var(--color-brand);
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 11px;
    display: block;
    margin-bottom: 4px;
  }
`

const Bio = styled.div`
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  margin-bottom: 22px;
  font-size: 15px;
  font-style: ${(props) => (props.$empty ? 'italic' : 'normal')};
  opacity: ${(props) => (props.$empty ? 0.55 : 1)};
`

const GrilleLiens = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 22px;
`

const LienBtn = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-family: var(--font-din);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-brand);
    background: rgba(247, 209, 53, 0.12);
  }
`

const PiedActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
`

const BtnPrimaire = styled.button`
  background: var(--color-brand);
  color: var(--color-dark);
  border: none;
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
  padding: 12px 22px;
  border-radius: 999px;
  cursor: pointer;
`

const Galerie = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
  margin-top: 18px;
`

const Photo = styled.div`
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  background-color: #0a0905;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-brand);
    transform: scale(1.03);
  }
`

const Encart = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(247, 209, 53, 0.3);
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;

  strong {
    color: var(--color-brand);
  }
`

function premiereLettre(s) {
  return ((s || '?').trim()[0] || '?').toUpperCase()
}

function photoUrl(path) {
  if (!path) return null
  return SURLASCENE_BUCKET_URL + path
}

function formatDateLong(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return `${JOURS_LONG[d.getDay()]} ${d.getDate()} ${MOIS_LONG[d.getMonth()]} ${d.getFullYear()}`
}

function genererIcs(show, artiste) {
  const pad = (n) => String(n).padStart(2, '0')
  const toIcs = (d) =>
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    '00Z'
  const start = new Date(show.date_show + 'T' + (show.heure_debut || '19:30'))
  const end = new Date(show.date_show + 'T' + (show.heure_fin || '21:30'))
  const titre = artiste?.nom_artiste || show.titre_show || 'Show La Brassée'
  const desc =
    (artiste?.bio ? artiste.bio + '\\n\\n' : '') +
    'Soundcheck dès ' +
    (show.heure_soundcheck ? show.heure_soundcheck.slice(0, 5) : '18:30') +
    '. Show à ' +
    (show.heure_debut ? show.heure_debut.slice(0, 5) : '19:30') +
    '.\\n' +
    "Entrée libre · participation volontaire (chapeau + 10 % sur factures, 100 % aux artistes).\\n\\n" +
    'Détails : https://labrassee.cafe/scene'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//La Brassée//Surlascène//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:surlascene-' + show.id + '@labrassee.cafe',
    'DTSTAMP:' + toIcs(new Date()),
    'DTSTART:' + toIcs(start),
    'DTEND:' + toIcs(end),
    'SUMMARY:' + titre.replace(/\n/g, ' ') + ' · La Brassée',
    'DESCRIPTION:' + desc.replace(/\n/g, '\\n'),
    'LOCATION:La Brassée, 2522 rue Beaubien Est, Montréal, QC',
    'URL:https://labrassee.cafe/scene',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download =
    'labrassee-' +
    titre.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
    '-' +
    show.date_show +
    '.ics'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 1000)
}

export default function SceneArtisteModal({ show, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!show) return null
  const a = show.artiste
  if (!a) return null

  const photo =
    photoUrl(a.photo_artiste_path) ||
    (a.photos_hd_paths && a.photos_hd_paths[0] && photoUrl(a.photos_hd_paths[0]))
  const galerie = (a.photos_hd_paths || []).slice(1, 13)

  const liens = []
  if (a.spotify_url)
    liens.push({ href: a.spotify_url, label: '🎧 Écouter sur Spotify' })
  if (a.bandcamp_url) liens.push({ href: a.bandcamp_url, label: '💿 Bandcamp' })
  if (a.soundcloud_url) liens.push({ href: a.soundcloud_url, label: '🔊 SoundCloud' })
  if (a.youtube_url) liens.push({ href: a.youtube_url, label: '📺 YouTube' })
  if (a.vimeo_url) liens.push({ href: a.vimeo_url, label: '🎬 Vimeo' })
  if (a.site_web) liens.push({ href: a.site_web, label: '🌐 Site web' })
  if (a.instagram) {
    const ig = a.instagram.startsWith('http')
      ? a.instagram
      : 'https://instagram.com/' + a.instagram.replace('@', '')
    liens.push({ href: ig, label: '📷 Instagram' })
  }
  if (a.facebook) liens.push({ href: a.facebook, label: '👍 Facebook' })

  return (
    <Backdrop onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Carte role="dialog" aria-modal="true">
        <Ferme onClick={onClose} aria-label="Fermer">×</Ferme>

        {photo ? (
          <HeroModal style={{ backgroundImage: `url('${photo}')` }} />
        ) : (
          <HeroModal>{premiereLettre(a.nom_artiste)}</HeroModal>
        )}

        <Corps>
          <Meta>
            {a.genre || show.type_show || 'Concert'}
            {a.nb_personnes_scene ? ` · ${a.nb_personnes_scene} sur scène` : ''}
          </Meta>
          <NomArtiste>{a.nom_artiste}</NomArtiste>

          <ShowInfo>
            📅 <strong>{formatDateLong(show.date_show)}</strong> · show{' '}
            {show.heure_debut ? show.heure_debut.slice(0, 5) : '19:30'}
            {show.heure_fin && ` → ${show.heure_fin.slice(0, 5)}`} · soundcheck{' '}
            {show.heure_soundcheck ? show.heure_soundcheck.slice(0, 5) : '1 h avant'}
            {a.duree_set_minutes ? ` · set ${a.duree_set_minutes} min` : ''}
          </ShowInfo>

          {a.permanence && a.recurrence_notes && (
            <Permanence>
              <strong>⭐ Permanence La Brassée</strong>
              {a.recurrence_notes}
            </Permanence>
          )}

          <Bio $empty={!a.bio}>{a.bio || "Bio en cours d'écriture."}</Bio>

          {liens.length > 0 && (
            <GrilleLiens>
              {liens.map((l, i) => (
                <LienBtn key={i} href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </LienBtn>
              ))}
            </GrilleLiens>
          )}

          <Encart>
            🪑 <strong>Aucune réservation possible</strong> — premier arrivé, mieux
            placé. Arrive 30-45 min avant pour les meilleures places.
          </Encart>

          <PiedActions>
            <BtnPrimaire
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                genererIcs(show, a)
              }}
            >
              📅 Ajouter à mon calendrier
            </BtnPrimaire>
          </PiedActions>

          {galerie.length > 0 && (
            <>
              <div
                style={{
                  fontFamily: 'var(--font-din)',
                  textTransform: 'uppercase',
                  letterSpacing: 3,
                  fontSize: 11,
                  color: 'var(--color-brand)',
                  marginTop: 22,
                  marginBottom: 10,
                }}
              >
                Photos
              </div>
              <Galerie>
                {galerie.map((p) => (
                  <Photo
                    key={p}
                    style={{ backgroundImage: `url('${photoUrl(p)}')` }}
                    onClick={() => window.open(photoUrl(p), '_blank')}
                  />
                ))}
              </Galerie>
            </>
          )}
        </Corps>
      </Carte>
    </Backdrop>
  )
}
