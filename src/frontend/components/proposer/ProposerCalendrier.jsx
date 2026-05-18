'use client'

import React from 'react'
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

  /* Statut LIBRE → cliquable, brand (concert / scène) */
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

  /* Statut LIBRE_EXPO → rond jaune cliquable (dim d'accrochage rotation 4 sem) */
  &.libre_expo {
    background: rgba(247, 209, 53, 0.12);
    border: 1px solid rgba(247, 209, 53, 0.45);
    color: var(--color-brand);
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: rgba(247, 209, 53, 0.28);
      transform: translateY(-2px);
      border-color: var(--color-brand);
      box-shadow: 0 6px 18px rgba(247, 209, 53, 0.2);
    }
  }

  /* Statut LIBRE_EXPO_ATTENTE → même jaune mais opacity réduite + non
     cliquable. Indique « dim libre mais déjà couvert par la rotation
     en cours » : visible pour cohérence mais l'artiste ne peut pas
     candidater dessus. */
  &.libre_expo_attente {
    background: rgba(247, 209, 53, 0.05);
    border: 1px dashed rgba(247, 209, 53, 0.28);
    color: rgba(247, 209, 53, 0.45);
    border-radius: 50%;
    cursor: default;
  }

  /* Statut IMPRO → DEPRECATED, conservé pour compat (plus émis par dates-libres) */
  &.impro {
    background: rgba(86, 180, 110, 0.18);
    border: 1px solid rgba(86, 180, 110, 0.55);
    color: rgba(180, 230, 195, 0.95);
  }

  /* Statut RÉSERVÉE (concert scène en attente) → orange CARRÉ */
  &.reservee {
    background: rgba(255, 159, 64, 0.18);
    border: 1px solid rgba(255, 159, 64, 0.55);
    color: rgba(255, 200, 145, 0.95);
  }

  /* Statut BOOKÉE (concert scène confirmé) → vert CARRÉ */
  &.bookee {
    background: rgba(86, 180, 110, 0.18);
    border: 1px solid rgba(86, 180, 110, 0.55);
    color: rgba(180, 230, 195, 0.95);
  }

  /* Statut BOOKEE_PERM (récurrence éditoriale : impro lundi, etc.) → même
     vert que les concerts bookés, mais SANS tag. Le jour de semaine dit
     déjà tout (lundi = impro pour les habitués). */
  &.bookee_perm {
    background: rgba(86, 180, 110, 0.18);
    border: 1px solid rgba(86, 180, 110, 0.55);
    color: rgba(180, 230, 195, 0.95);
  }

  /* Statut RÉSERVÉE_EXPO (vernissage/accrochage en attente) → orange ROND
     même couleur que les concerts en attente mais forme ronde = expo. */
  &.reservee_expo {
    background: rgba(255, 159, 64, 0.18);
    border: 1px solid rgba(255, 159, 64, 0.55);
    color: rgba(255, 200, 145, 0.95);
    border-radius: 50%;
  }

  /* Statut BOOKÉE_EXPO (vernissage/accrochage confirmé) → vert ROND
     même couleur que les concerts bookés mais forme ronde = expo. */
  &.bookee_expo {
    background: rgba(86, 180, 110, 0.18);
    border: 1px solid rgba(86, 180, 110, 0.55);
    color: rgba(180, 230, 195, 0.95);
    border-radius: 50%;
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

const JOURS_HEAD = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']

// 2026-05-18 : la modal de choix scène vs murs a été retirée. Le clic sur un
// carré jaune (libre) ouvre direct le dépôt Surlascène, le clic sur un rond
// jaune (libre_expo) ouvre direct le dépôt Surnosmurs. La forme dit déjà tout.

const DEPOT_SCENE_URL = 'https://labrassee-surlascene-depot.vercel.app/?candidature=scene'
const DEPOT_MURS_URL = 'https://labrassee-murs-depot.vercel.app/?candidature=murs'

function urlDepot(type, iso) {
  const base = type === 'murs' ? DEPOT_MURS_URL : DEPOT_SCENE_URL
  return iso ? `${base}&date=${encodeURIComponent(iso)}` : base
}

function tagPour(statut, vernissageRole) {
  switch (statut) {
    case 'libre': return null
    case 'libre_expo': return 'expo ?'
    case 'libre_expo_attente': return null
    case 'impro': return null // deprecated, plus émis
    case 'reservee': return 'résa'
    case 'bookee': return 'booké'
    case 'bookee_perm': return null // récurrence éditoriale : pas de tag
    case 'reservee_expo':
      return vernissageRole === 'accrochage' ? 'acc.' : 'vern.'
    case 'bookee_expo':
      return vernissageRole === 'accrochage' ? 'acc.' : 'vern.'
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
  // Plus de modal scène/murs : le clic sur un carré jaune (libre, soir scène)
  // ouvre direct le dépôt Surlascène avec date pré-remplie. Le clic sur un
  // rond jaune (libre_expo, dim) ouvre direct Surnosmurs. Symétrie complète.

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
            Soir libre — propose un show
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(247, 209, 53, 0.5)', border: '1px solid var(--color-brand)', borderRadius: '50%' }} />
            Dim libre — propose une expo
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(247, 209, 53, 0.08)', border: '1px dashed rgba(247, 209, 53, 0.4)', borderRadius: '50%' }} />
            Dim couvert (rotation 4 sem)
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(255, 159, 64, 0.4)', border: '1px solid rgba(255, 159, 64, 0.8)' }} />
            Concert en attente
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(86, 180, 110, 0.4)', border: '1px solid rgba(86, 180, 110, 0.8)' }} />
            Concert bookée
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(255, 159, 64, 0.4)', border: '1px solid rgba(255, 159, 64, 0.8)', borderRadius: '50%' }} />
            Expo en attente
          </span>
          <span className="puce">
            <span className="swatch" style={{ background: 'rgba(86, 180, 110, 0.4)', border: '1px solid rgba(86, 180, 110, 0.8)', borderRadius: '50%' }} />
            Expo bookée
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
                  const isClickableScene = j.statut === 'libre'
                  const isClickableExpo = j.statut === 'libre_expo'
                  // Tooltips génériques uniquement — on ne révèle pas le nom des shows
                  const titleHover =
                    j.statut === 'bookee'
                      ? 'Date bookée (concert)'
                      : j.statut === 'bookee_perm'
                        ? (j.dow === 1 ? 'Lundi : soirée Impro (récurrence éditoriale)' : 'Date bookée (récurrence éditoriale)')
                        : j.statut === 'reservee'
                          ? 'Date réservée — concert en attente de confirmation'
                          : j.statut === 'bookee_expo'
                          ? (j.vernissageRole === 'accrochage'
                              ? 'Dim AM : décrochage / accrochage Sur nos murs (confirmé)'
                              : 'Dim : vernissage Sur nos murs · 5 à 7 (confirmé)')
                          : j.statut === 'reservee_expo'
                            ? (j.vernissageRole === 'accrochage'
                                ? 'Dim AM : décrochage / accrochage Sur nos murs (en attente)'
                                : 'Dim : vernissage Sur nos murs · 5 à 7 (en attente)')
                            : j.statut === 'impro'
                              ? 'Lundi : soirée Impro (récurrence éditoriale)'
                              : j.statut === 'libre_expo'
                                ? 'Dimanche libre — clique pour proposer une expo Sur nos murs'
                                : j.statut === 'libre_expo_attente'
                                  ? 'Dim couvert par la rotation en cours (4 sem) — prochain accrochage indiqué en jaune cliquable'
                                  : j.statut === 'ferme'
                                  ? (j.dow === 3 ? 'Mercredi : repos' :
                                     j.dow === 0 ? 'Dimanche : réservé aux vernissages' :
                                     (j.iso && j.iso.slice(5, 7) >= '07' && j.iso.slice(5, 7) <= '08' ? 'Juillet–août : on garde la scène pour ven + sam' :
                                      'Trop proche — préavis minimum 7 jours'))
                                  : ''
                  const handleClick = isClickableScene
                    ? () => { window.open(urlDepot('scene', j.iso), '_blank', 'noopener,noreferrer') }
                    : isClickableExpo
                      ? () => { window.open(urlDepot('murs', j.iso), '_blank', 'noopener,noreferrer') }
                      : undefined
                  return (
                    <Case
                      key={j.iso}
                      className={j.statut}
                      title={titleHover || undefined}
                      onClick={handleClick}
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

    </Section>
  )
}
