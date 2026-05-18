'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

/** @typedef {import('../../lib/dates-libres').MoisCalendrier} MoisCalendrier */

const Section = styled.section`
  padding: 60px 24px 100px;
  background: var(--color-dark);
`

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`

const Eyebrow = styled.div`
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
  letter-spacing: -1px;
  text-align: center;
  color: #ffffff;
  margin: 0 0 16px;
  line-height: 1;

  .accent { color: var(--color-brand); }
`

const Intro = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  max-width: 680px;
  margin: 0 auto 32px;
  font-size: 16px;
  line-height: 1.6;
`

const Legende = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px 24px;
  margin: 0 auto 36px;
  max-width: 760px;

  .puce {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-din);
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.78);
  }

  .swatch {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    flex-shrink: 0;
  }
`

const MoisGrille = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px 28px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`

const MoisBlock = styled.div`
  /* En grid 2-col, plus besoin de margin-bottom : le gap gère l'espacement */
`

const MoisTitre = styled.h3`
  font-family: var(--font-din);
  font-size: 18px;
  font-weight: 300;
  color: var(--color-brand);
  text-transform: uppercase;
  letter-spacing: 2.5px;
  margin: 0 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(247, 209, 53, 0.2);
`

/* Mini-rappel programmation type, affiché AU-DESSUS de chaque mois pour aider
   l'artiste à viser le bon jour pour son genre. Synthèse 7 jours. */
const LigneDirectrice = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;

  .col {
    text-align: center;
    padding: 6px 2px;
    background: rgba(247, 209, 53, 0.04);
    border: 1px solid rgba(247, 209, 53, 0.12);
    border-radius: 6px;
    font-family: var(--font-din);
    font-size: 9px;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.25;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 38px;
  }

  .col.repos {
    background: rgba(255, 255, 255, 0.02);
    border-style: dashed;
    border-color: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.4);
  }

  .col .label {
    display: block;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 8px;
    color: var(--color-brand);
    opacity: 0.7;
    margin-bottom: 3px;
    font-weight: 500;
  }

  .col.repos .label {
    color: rgba(255, 255, 255, 0.4);
  }
`

const PermanentsWrap = styled.div`
  position: relative;
`

const PermanentsBanner = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(16, 15, 9, 0.78);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  z-index: 2;
  pointer-events: none;

  .titre {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 11px;
    color: var(--color-brand);
    margin-bottom: 8px;
  }

  .msg {
    color: rgba(255, 255, 255, 0.92);
    font-size: clamp(12px, 1.2vw, 14px);
    line-height: 1.4;
    max-width: 320px;
    font-weight: 300;
  }

  .msg em {
    color: var(--color-brand);
    font-style: normal;
    font-weight: 500;
  }
`

const GridSemaine = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;

  .head {
    text-align: center;
    font-family: var(--font-din);
    font-size: 10px;
    letter-spacing: 1.5px;
    color: rgba(205, 196, 157, 0.55);
    text-transform: uppercase;
    padding: 2px 0;
  }
`

const GridMois = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`

const Case = styled.div`
  aspect-ratio: 1;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
  user-select: none;
  padding: 2px;

  .num {
    font-family: var(--font-din);
    font-size: clamp(12px, 1.3vw, 15px);
    font-weight: 300;
    line-height: 1;
  }

  .tag {
    font-family: var(--font-din);
    font-size: 7px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 2px;
    opacity: 0.85;
  }

  /* Statut LIBRE → cliquable, brand */
  &.libre {
    background: rgba(247, 209, 53, 0.12);
    border: 1px solid rgba(247, 209, 53, 0.45);
    color: var(--color-brand);
    cursor: pointer;

    &:hover {
      background: rgba(247, 209, 53, 0.25);
      transform: translateY(-2px);
      border-color: var(--color-brand);
    }
  }

  /* Statut IMPRO → mauve/violet (réservé en récurrence éditoriale) */
  &.impro {
    background: rgba(155, 110, 220, 0.18);
    border: 1px solid rgba(155, 110, 220, 0.5);
    color: rgba(210, 185, 240, 0.95);
  }

  /* Statut VERNISSAGE → cyan/turquoise + forme RONDE (différenciation visuelle
     forte des concerts/karaokés qui sont carrés). Couvre Sur nos murs (vernissage
     + accrochage J-7) ET futures sorties littéraires dominicales. */
  &.vernissage {
    background: rgba(99, 200, 220, 0.18);
    border: 1px solid rgba(99, 200, 220, 0.55);
    color: rgba(180, 230, 240, 0.95);
    border-radius: 50%;
  }

  /* Statut RÉSERVÉE → orange (en attente confirmation) */
  &.reservee {
    background: rgba(255, 159, 64, 0.18);
    border: 1px solid rgba(255, 159, 64, 0.55);
    color: rgba(255, 200, 145, 0.95);
  }

  /* Statut BOOKÉE → vert (artiste confirmé) */
  &.bookee {
    background: rgba(86, 180, 110, 0.18);
    border: 1px solid rgba(86, 180, 110, 0.55);
    color: rgba(180, 230, 195, 0.95);
  }

  /* Statut FERMÉ → gris (mercredi, dimanche, préavis insuffisant) */
  &.ferme {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.28);
  }

  /* Date PASSÉE → très atténuée */
  &.passee {
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.18);
  }

  /* Padding HORS-MOIS → invisible */
  &.horsmois {
    background: transparent;
    border: 1px solid transparent;
  }
`

// ─────────────────────────────────────────────────────────────────────
// Modal de choix (scène vs murs) au clic sur une case libre
// ─────────────────────────────────────────────────────────────────────

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 8, 4, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const ModalCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 540px;
  background: linear-gradient(180deg, #1a1810 0%, #100f09 100%);
  border: 1px solid rgba(247, 209, 53, 0.3);
  border-radius: 22px;
  padding: 38px 30px 30px;
  text-align: center;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);

  .ferme {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.7);
    width: 32px;
    height: 32px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(247, 209, 53, 0.15);
      color: var(--color-brand);
      border-color: var(--color-brand);
    }
  }

  .eyebrow {
    color: var(--color-brand);
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 4px;
    font-size: 11px;
    margin-bottom: 12px;
  }

  h3 {
    font-family: var(--font-din);
    color: #ffffff;
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 200;
    letter-spacing: -0.5px;
    margin: 0 0 8px;
    line-height: 1.1;

    .accent { color: var(--color-brand); }
  }

  .date {
    color: rgba(255, 255, 255, 0.65);
    font-size: 14px;
    margin-bottom: 30px;
    font-style: italic;
  }
`

const ChoixGrille = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const Choix = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 22px 16px;
  background: rgba(247, 209, 53, 0.05);
  border: 1px solid rgba(247, 209, 53, 0.3);
  border-radius: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(247, 209, 53, 0.18);
    border-color: var(--color-brand);
    transform: translateY(-2px);
  }

  .emo {
    font-size: 32px;
    line-height: 1;
  }

  .label {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 12px;
    color: var(--color-brand);
    font-weight: 500;
  }

  .ss {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    line-height: 1.4;
    margin-top: 2px;
  }
`

const NoteModal = styled.div`
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px dashed rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  line-height: 1.6;
  font-style: italic;
`

const JOURS_HEAD = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']
const MOIS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]
const JOURS_FR_LONG = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

const DEPOT_SCENE_URL = 'https://labrassee-surlascene-depot.vercel.app/?candidature=scene'
const DEPOT_MURS_URL = 'https://labrassee-murs-depot.vercel.app/?candidature=murs'

function labelDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  return `${JOURS_FR_LONG[dateObj.getDay()]} ${d} ${MOIS_FR[m - 1]} ${y}`
}

function urlDepot(type, iso) {
  const base = type === 'murs' ? DEPOT_MURS_URL : DEPOT_SCENE_URL
  return iso ? `${base}&date=${encodeURIComponent(iso)}` : base
}

function tagPour(statut, vernissageRole) {
  switch (statut) {
    case 'libre': return null
    case 'impro': return 'impro'
    case 'vernissage':
      return vernissageRole === 'accrochage' ? 'acc.' : 'vern.'
    case 'reservee': return 'résa'
    case 'bookee': return 'booké'
    case 'ferme': return null
    case 'passee': return null
    default: return null
  }
}

/**
 * Mini-rappel programmation type d'un mois. Indique pour chaque jour de la
 * semaine le genre éditorial visé. Affiché au-dessus de chaque grille de mois.
 * `moisHum` (1..12) : le contenu varie pour juillet/août (été · ven-sam) et
 * septembre→novembre (permanents prioritaires → on n'affiche pas).
 */
function LigneDirectricePourMois({ moisHum }) {
  // Juillet (7) et août (8) : été · seulement ven + sam ouverts
  const eteRestrictif = moisHum === 7 || moisHum === 8
  const colonnes = [
    {
      jour: 'LUN',
      genre: 'Impro',
      repos: eteRestrictif,
    },
    {
      jour: 'MAR',
      genre: eteRestrictif ? '—' : 'Jam · open mic',
      repos: eteRestrictif,
    },
    {
      jour: 'MER',
      genre: 'Repos',
      repos: true,
    },
    {
      jour: 'JEU',
      genre: eteRestrictif ? '—' : 'Jazz · jazz manouche',
      repos: eteRestrictif,
    },
    {
      jour: 'VEN',
      genre: 'Jazz · karaoké · poésie',
    },
    {
      jour: 'SAM',
      genre: 'Musique du monde',
    },
    {
      jour: 'DIM',
      // 5 à 7 dominicaux : vernissages Sur nos murs (4 sem) + sorties littéraires
      genre: 'Vernissage · 5à7 littéraire',
    },
  ]
  return (
    <LigneDirectrice>
      {colonnes.map((c) => (
        <div key={c.jour} className={'col' + (c.repos ? ' repos' : '')}>
          <span className="label">{c.jour}</span>
          {c.genre}
        </div>
      ))}
    </LigneDirectrice>
  )
}

/**
 * @param {{ mois?: MoisCalendrier[] }} props
 */
export default function ProposerCalendrier({ mois = [] }) {
  const [dateChoisie, setDateChoisie] = useState(null)

  // Ferme la modal sur Esc
  useEffect(() => {
    if (!dateChoisie) return
    const onKey = (e) => { if (e.key === 'Escape') setDateChoisie(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dateChoisie])

  return (
    <Section id="calendrier">
      <Container>
        <Eyebrow>Quand puis-je jouer ?</Eyebrow>
        <Titre>
          Soirs <span className="accent">libres</span> sur notre scène
        </Titre>
        <Intro>
          Vue calendrier des 3 prochains mois. Clique sur une case <strong style={{ color: 'var(--color-brand)' }}>jaune</strong> pour
          nous proposer ta candidature à cette date — le mail s'ouvre pré-rempli.
        </Intro>

        <Legende>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(247, 209, 53, 0.5)', border: '1px solid var(--color-brand)' }} />
            Libre · clique pour proposer
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(155, 110, 220, 0.4)', border: '1px solid rgba(155, 110, 220, 0.8)' }} />
            Impro (lundis)
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(99, 200, 220, 0.4)', border: '1px solid rgba(99, 200, 220, 0.8)' }} />
            Sur nos murs (vernissage · accrochage)
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(255, 159, 64, 0.4)', border: '1px solid rgba(255, 159, 64, 0.8)' }} />
            Réservée (en attente)
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(86, 180, 110, 0.4)', border: '1px solid rgba(86, 180, 110, 0.8)' }} />
            Bookée
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.18)' }} />
            Fermé
          </span>
        </Legende>

        {mois.length === 0 ? (
          <Intro>Calendrier en cours de préparation — reviens dans quelques minutes.</Intro>
        ) : (
          <MoisGrille>
          {mois.map((m) => (
            <MoisBlock key={m.cleMois}>
              <MoisTitre>{m.libelle}</MoisTitre>
              {!m.permanentsPriority && <LigneDirectricePourMois moisHum={m.mois} />}
              <GridSemaine>
                {JOURS_HEAD.map((j) => (
                  <div className="head" key={j}>{j}</div>
                ))}
              </GridSemaine>
              <PermanentsWrap>
                {m.permanentsPriority && (
                  <PermanentsBanner>
                    <div className="titre">Permanents prioritaires</div>
                    <div className="msg">
                      Nos artistes en permanence ont la priorité sur cette période.
                      <br />
                      <em>Restez à l'affût</em> — le calendrier ponctuel ouvrira plus tard.
                    </div>
                  </PermanentsBanner>
                )}
              <GridMois>
                {m.jours.map((j, idx) => {
                  if (j.statut === 'horsmois') {
                    return <Case key={`hm-${m.cleMois}-${idx}`} className="horsmois" />
                  }
                  const tag = tagPour(j.statut, j.vernissageRole)
                  const isClickable = j.statut === 'libre'
                  // Tooltips génériques uniquement — on ne révèle pas le nom des shows
                  const titleHover =
                    j.statut === 'bookee'
                      ? 'Date bookée'
                      : j.statut === 'reservee'
                        ? 'Date réservée (en attente)'
                        : j.statut === 'impro'
                          ? 'Lundi : soirée Impro (récurrence éditoriale)'
                          : j.statut === 'vernissage'
                            ? (j.vernissageRole === 'accrochage'
                                ? 'Dimanche AM : décrochage / accrochage Sur nos murs'
                                : 'Dimanche : vernissage Sur nos murs · 5 à 7')
                            : j.statut === 'ferme'
                              ? (j.dow === 3 ? 'Mercredi : repos' :
                                 j.dow === 0 ? 'Dimanche : réservé aux vernissages' :
                                 (j.iso && j.iso.slice(5, 7) >= '07' && j.iso.slice(5, 7) <= '08' ? 'Juillet–août : on garde la scène pour ven + sam' :
                                  'Trop proche — préavis minimum 7 jours'))
                              : ''
                  return (
                    <Case
                      key={j.iso}
                      className={j.statut}
                      title={titleHover || undefined}
                      onClick={isClickable ? () => setDateChoisie(j.iso) : undefined}
                    >
                      <span className="num">{j.jourMois}</span>
                      {tag && <span className="tag">{tag}</span>}
                    </Case>
                  )
                })}
              </GridMois>
              </PermanentsWrap>
            </MoisBlock>
          ))}
          </MoisGrille>
        )}
      </Container>

      {dateChoisie && (
        <ModalBackdrop onClick={() => setDateChoisie(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ferme"
              onClick={() => setDateChoisie(null)}
              aria-label="Fermer"
            >
              ✕
            </button>
            <div className="eyebrow">Date visée · {labelDate(dateChoisie)}</div>
            <h3>
              Tu veux te faire <span className="accent">voir</span> sur quoi ?
            </h3>
            <div className="date">On t'ouvre le bon dépôt selon ta réponse.</div>
            <ChoixGrille>
              <Choix
                href={urlDepot('scene', dateChoisie)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="emo">🎤</span>
                <span className="label">Sur la scène</span>
                <span className="ss">Concert · jam · poésie · karaoké</span>
              </Choix>
              <Choix
                href={urlDepot('murs', dateChoisie)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="emo">🖼️</span>
                <span className="label">Sur les murs</span>
                <span className="ss">Expo · peinture · photo · illustration</span>
              </Choix>
            </ChoixGrille>
            <NoteModal>
              La date est juste indicative — on regarde ton dossier puis on te
              propose un créneau qui colle (scène : la date choisie · murs :
              prochaine rotation 4 sem libre).
            </NoteModal>
          </ModalCard>
        </ModalBackdrop>
      )}
    </Section>
  )
}
