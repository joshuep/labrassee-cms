'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  JOURS_FR,
  MOIS_FR,
  SURLASCENE_BUCKET_URL,
} from '@/frontend/lib/surlascene-data'
import SceneArtisteModal from './SceneArtisteModal'

/** @typedef {import('../../lib/surlascene-data').SurlasceneShowDetail} SurlasceneShowDetail */

const Section = styled.section`
  padding: 80px 24px;
  background: var(--color-dark);
`

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`

const Label = styled.div`
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 5px;
  font-size: 12px;
  text-align: center;
  margin-bottom: 14px;
`

const Titre = styled.h2`
  font-family: var(--font-din);
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 200;
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;
  margin: 0 0 16px;

  .u { color: var(--color-brand); }
`

const Intro = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  max-width: 640px;
  margin: 0 auto 40px;
  font-size: 16px;
`

const Vide = styled.div`
  text-align: center;
  padding: 60px 24px;
  color: rgba(255, 255, 255, 0.55);
  font-style: italic;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 16px;
`

const CountdownBloc = styled.div`
  background: linear-gradient(135deg, rgba(247, 209, 53, 0.1), rgba(247, 209, 53, 0.02));
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(247, 209, 53, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.4);
  padding: 28px;
  border-radius: 20px;
  margin-bottom: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;

  .gauche { flex: 1; min-width: 200px; }
  .label-cd {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 4px;
    font-size: 11px;
    color: rgba(205, 196, 157, 0.6);
    margin-bottom: 6px;
  }
  .titre-cd {
    font-family: var(--font-din);
    font-size: clamp(22px, 3vw, 32px);
    color: var(--color-brand);
    font-weight: 300;
    letter-spacing: 1px;
  }
  .meta-cd { color: rgba(255, 255, 255, 0.85); font-size: 14px; margin-top: 4px; }
  .timer { display: flex; gap: 16px; }
  .ct-cell { text-align: center; min-width: 56px; }
  .num {
    font-family: var(--font-din);
    font-size: 36px;
    color: var(--color-brand);
    font-weight: 300;
    line-height: 1;
  }
  .lbl {
    font-family: var(--font-din);
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.55);
    margin-top: 4px;
  }
`

const Feature = styled.article`
  background: linear-gradient(135deg, rgba(247, 209, 53, 0.1), rgba(247, 209, 53, 0.02));
  backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(247, 209, 53, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 16px 60px rgba(0, 0, 0, 0.5);
  border-radius: 28px;
  padding: 36px;
  margin-bottom: 36px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(247, 209, 53, 0.5);
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    padding: 28px;
    gap: 22px;
  }
`

const PhotoHD = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 22px;
  background-size: cover;
  background-position: center;
  background-color: #0a0905;
  border: 2px solid rgba(247, 209, 53, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-din);
  color: rgba(205, 196, 157, 0.6);
  font-size: 86px;
`

const InfosFeat = styled.div`
  .surtitre {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 5px;
    font-size: 11px;
    color: var(--color-brand);
    margin-bottom: 10px;
  }
  h3 {
    font-family: var(--font-din);
    font-weight: 200;
    font-size: clamp(28px, 4vw, 48px);
    line-height: 1;
    letter-spacing: -1px;
    color: #ffffff;
    margin: 0 0 8px;
  }
  .genre {
    font-family: var(--font-din);
    color: rgba(205, 196, 157, 0.6);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 12px;
    margin-bottom: 14px;
  }
  .perm {
    background: rgba(247, 209, 53, 0.08);
    border-left: 3px solid var(--color-brand);
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 14px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 13px;
  }
  .perm strong {
    color: var(--color-brand);
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 11px;
    display: block;
    margin-bottom: 2px;
  }
  .when {
    color: rgba(255, 255, 255, 0.85);
    font-size: 15px;
    margin-bottom: 14px;
  }
  .when strong { color: var(--color-brand); font-weight: 500; }
  .bio {
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    line-height: 1.7;
    margin-bottom: 18px;
  }
  .liens { display: flex; gap: 8px; flex-wrap: wrap; }
  .liens a {
    color: var(--color-brand);
    text-decoration: none;
    font-family: var(--font-din);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(247, 209, 53, 0.15);
    border: 1px solid rgba(247, 209, 53, 0.3);
    transition: all 0.2s ease;
  }
  .liens a:hover {
    background: var(--color-brand);
    color: var(--color-dark);
  }
`

const SubTitle = styled.div`
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 11px;
  color: rgba(205, 196, 157, 0.6);
  margin: 40px 0 16px;
  text-align: center;
`

const Carte = styled.article`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.4);
  padding: 20px 28px;
  border-radius: 20px;
  margin-bottom: 18px;
  display: grid;
  grid-template-columns: 100px 90px 1fr auto;
  gap: 20px;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(247, 209, 53, 0.3);
  }

  @media (max-width: 700px) {
    grid-template-columns: 80px 70px 1fr;
    gap: 14px;
    padding: 16px;
  }

  .date-bloc {
    text-align: center;
    padding: 14px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(247, 209, 53, 0.3);
    border-radius: 14px;
  }
  .jour {
    font-family: var(--font-din);
    text-transform: uppercase;
    color: rgba(205, 196, 157, 0.6);
    font-size: 11px;
    letter-spacing: 2px;
  }
  .jour-num {
    font-family: var(--font-din);
    font-size: 38px;
    font-weight: 400;
    color: var(--color-brand);
    line-height: 1;
    margin: 4px 0;
  }
  .mois {
    font-family: var(--font-din);
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.85);
  }
  .photo-mini {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-color: #0a0905;
    border: 2px solid rgba(247, 209, 53, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(205, 196, 157, 0.6);
    font-family: var(--font-din);
    font-size: 28px;

    @media (max-width: 700px) {
      width: 70px;
      height: 70px;
    }
  }
  .corps h3 {
    font-family: var(--font-din);
    font-weight: 300;
    font-size: clamp(22px, 3vw, 28px);
    letter-spacing: 1px;
    color: #ffffff;
    margin: 0 0 6px;
  }
  .corps .type {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 11px;
    color: var(--color-brand);
    margin-bottom: 8px;
  }
  .corps .desc {
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
  }
  .heures {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 13px;
    color: #ffffff;
    text-align: right;

    @media (max-width: 700px) {
      grid-column: 1 / -1;
      text-align: left;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }
  }
  .heures .h {
    color: var(--color-brand);
    font-size: 18px;
  }
`

function premiereLettre(nom) {
  return ((nom || '?').trim()[0] || '?').toUpperCase()
}

function photoUrl(path) {
  if (!path) return null
  return SURLASCENE_BUCKET_URL + path
}

function buildLiens(a) {
  const l = []
  if (a.spotify_url) l.push({ href: a.spotify_url, label: '🎧 Spotify' })
  if (a.bandcamp_url) l.push({ href: a.bandcamp_url, label: '💿 Bandcamp' })
  if (a.youtube_url) l.push({ href: a.youtube_url, label: '📺 YouTube' })
  if (a.site_web) l.push({ href: a.site_web, label: '🌐 Site' })
  if (a.instagram) {
    const ig = a.instagram.startsWith('http')
      ? a.instagram
      : 'https://instagram.com/' + a.instagram.replace('@', '')
    l.push({ href: ig, label: '📷 Instagram' })
  }
  return l
}

/**
 * @param {{ shows?: SurlasceneShowDetail[] }} props
 */
export default function SceneAgenda({ shows = [] }) {
  const [selectedShow, setSelectedShow] = useState(null)
  const [countdown, setCountdown] = useState({ j: 0, h: 0, m: 0 })
  const first = shows[0]

  useEffect(() => {
    if (!first) return
    const target = new Date(first.date_show + 'T' + (first.heure_debut || '19:30'))
    const tick = () => {
      const diff = target - new Date()
      if (diff <= 0) {
        setCountdown({ j: 0, h: 0, m: 0 })
        return
      }
      setCountdown({
        j: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
      })
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [first])

  if (!shows || shows.length === 0) {
    return (
      <Section id="agenda">
        <Container>
          <Label>Agenda</Label>
          <Titre>
            Les <span className="u">prochains shows</span>
          </Titre>
          <Intro>
            Cinq concerts par semaine (lundi, mardi, jeudi, vendredi, samedi). Entrée
            libre. Premier arrivé, mieux placé.
          </Intro>
          <Vide>
            L'agenda du moment se précise. Reviens bientôt — ou écris à Cédric pour
            proposer ta date.
          </Vide>
        </Container>
      </Section>
    )
  }

  const a = first.artiste
  // Priorité image : 1) affiche Facebook (event Payload matché par date)
  // 2) photo artiste déposée (EPK) 3) première lettre du nom (fallback)
  const photoFeat =
    first.coverImage ||
    (a
      ? photoUrl(a.photo_artiste_path) ||
        (a.photos_hd_paths && a.photos_hd_paths[0] && photoUrl(a.photos_hd_paths[0]))
      : null)
  const dF = new Date(first.date_show + 'T' + (first.heure_debut || '19:30'))
  const dateTxt = `${JOURS_FR[dF.getDay()]} ${dF.getDate()} ${MOIS_FR[dF.getMonth()]} · ${
    first.heure_debut ? first.heure_debut.slice(0, 5) : '19:30'
  }`
  const liens = a ? buildLiens(a) : []

  return (
    <Section id="agenda">
      <Container>
        <Label>Agenda</Label>
        <Titre>
          Les <span className="u">prochains shows</span>
        </Titre>
        <Intro>
          Cinq concerts par semaine (lundi, mardi, jeudi, vendredi, samedi). Entrée
          libre. Public en participation volontaire.
        </Intro>

        {first && a && (
          <CountdownBloc>
            <div className="gauche">
              <div className="label-cd">Prochain show</div>
              <div className="titre-cd">{a.nom_artiste}</div>
              <div className="meta-cd">{dateTxt}</div>
            </div>
            <div className="timer">
              <div className="ct-cell">
                <div className="num">{countdown.j}</div>
                <div className="lbl">jours</div>
              </div>
              <div className="ct-cell">
                <div className="num">{String(countdown.h).padStart(2, '0')}</div>
                <div className="lbl">h</div>
              </div>
              <div className="ct-cell">
                <div className="num">{String(countdown.m).padStart(2, '0')}</div>
                <div className="lbl">min</div>
              </div>
            </div>
          </CountdownBloc>
        )}

        {a && (
          <Feature onClick={() => setSelectedShow(first)}>
            {photoFeat ? (
              <PhotoHD style={{ backgroundImage: `url('${photoFeat}')` }} />
            ) : (
              <PhotoHD>{premiereLettre(a.nom_artiste)}</PhotoHD>
            )}
            <InfosFeat>
              <div className="surtitre">Prochain show · {dateTxt}</div>
              <h3>{a.nom_artiste}</h3>
              {a.genre && (
                <div className="genre">
                  {a.genre}
                  {a.nb_personnes_scene ? ` · ${a.nb_personnes_scene} sur scène` : ''}
                </div>
              )}
              {a.permanence && a.recurrence_notes && (
                <div className="perm">
                  <strong>⭐ Permanence La Brassée</strong>
                  {a.recurrence_notes}
                </div>
              )}
              <div className="when">
                📍 La Brassée · 2522 Beaubien Est · entrée libre · soundcheck{' '}
                <strong>
                  {first.heure_soundcheck ? first.heure_soundcheck.slice(0, 5) : '1 h avant'}
                </strong>{' '}
                · show <strong>{first.heure_debut ? first.heure_debut.slice(0, 5) : '19:30'}</strong>
              </div>
              {a.bio && <div className="bio">{a.bio}</div>}
              {liens.length > 0 && (
                <div className="liens">
                  {liens.map((l, i) => (
                    <a
                      key={i}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </InfosFeat>
          </Feature>
        )}

        {shows.length > 1 && <SubTitle>Les shows suivants</SubTitle>}

        {shows.slice(1).map((s) => {
          const art = s.artiste
          const nom = (art && art.nom_artiste) || 'À confirmer'
          const genre =
            (art && art.genre) || (s.type_show || 'Concert').toUpperCase()
          const dd = new Date(s.date_show + 'T' + (s.heure_debut || '19:30'))
          // Priorité image : Facebook (event Payload) > photo artiste > initiale
          const photo =
            s.coverImage ||
            (art
              ? photoUrl(art.photo_artiste_path) ||
                (art.photos_hd_paths && art.photos_hd_paths[0] && photoUrl(art.photos_hd_paths[0]))
              : null)
          const desc =
            (art && art.bio
              ? art.bio.slice(0, 160) + (art.bio.length > 160 ? '…' : '')
              : '') ||
            s.description_publique ||
            (art ? 'Avec ' + nom : 'Programmation à confirmer')
          return (
            <Carte id={`concert-${s.id}`} key={s.id} onClick={() => setSelectedShow(s)}>
              <div className="date-bloc">
                <div className="jour">{JOURS_FR[dd.getDay()]}</div>
                <div className="jour-num">{dd.getDate()}</div>
                <div className="mois">{MOIS_FR[dd.getMonth()]}</div>
              </div>
              {photo ? (
                <div className="photo-mini" style={{ backgroundImage: `url('${photo}')` }} />
              ) : (
                <div className="photo-mini">{premiereLettre(nom)}</div>
              )}
              <div className="corps">
                <div className="type">{genre}</div>
                <h3>{s.titre_show || nom}</h3>
                <div className="desc">{desc}</div>
              </div>
              <div className="heures">
                <div className="h">
                  {s.heure_debut ? s.heure_debut.slice(0, 5) : '19:30'}
                </div>
                {s.heure_fin && (
                  <div style={{ opacity: 0.6 }}>→ {s.heure_fin.slice(0, 5)}</div>
                )}
              </div>
            </Carte>
          )
        })}
      </Container>

      {selectedShow && (
        <SceneArtisteModal show={selectedShow} onClose={() => setSelectedShow(null)} />
      )}
    </Section>
  )
}
