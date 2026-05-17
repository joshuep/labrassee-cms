'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import EventCard from './EventCard'

const Section = styled.section`
  width: 100%;
  padding: 60px 24px 100px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    var(--color-dark) 40%,
    var(--color-dark) 60%,
    rgba(0, 0, 0, 0) 100%
  );
`

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`

const Titre = styled.h2`
  font-family: var(--font-din);
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 200;
  letter-spacing: -1px;
  color: #ffffff;
  text-align: center;
  margin: 0 0 8px;
  line-height: 1;

  .accent {
    color: var(--color-brand);
  }
`

const SousTitre = styled.div`
  text-align: center;
  color: rgba(205, 196, 157, 0.65);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 12px;
  margin-bottom: 50px;
`

const JourBlock = styled(motion.div)`
  margin-bottom: 42px;

  &:last-child {
    margin-bottom: 0;
  }
`

const JourEntete = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(247, 209, 53, 0.18);

  .jour {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 4px;
    font-size: 14px;
    color: var(--color-brand);
    font-weight: 500;
  }

  .date {
    font-family: var(--font-din);
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    letter-spacing: 1px;
  }

  .aujourdhui {
    margin-left: auto;
    background: var(--color-brand);
    color: var(--color-dark);
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 999px;
    font-weight: 600;
  }
`

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`

const CardSlot = styled.div`
  /* On laisse EventCard imposer son aspect-ratio (8.5/11). */
  aspect-ratio: 8.5 / 11;
`

const Vide = styled.div`
  text-align: center;
  padding: 60px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 15px;
  line-height: 1.7;

  strong { color: var(--color-brand); }
`

const JOURS_LONG = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI']
const MOIS_LONG = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

function isoToLocalDate(iso) {
  // YYYY-MM-DD → Date locale à 00:00 (évite le décalage TZ qui ferait basculer d'un jour)
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function todayLocalISO() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Groupe les events par jour ISO (YYYY-MM-DD).
 * Retourne un tableau ordonné chronologiquement, jours vides exclus.
 */
function grouperParJour(events) {
  const map = new Map()
  for (const ev of events) {
    if (!ev?.date) continue
    const k = ev.date.slice(0, 10)
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(ev)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([iso, evs]) => ({
      iso,
      date: isoToLocalDate(iso),
      events: evs,
    }))
}

export default function EventsWeek({ events = [] }) {
  const groupes = grouperParJour(events)
  const todayISO = todayLocalISO()

  return (
    <Section id="cette-semaine">
      <Container>
        <SousTitre>À venir</SousTitre>
        <Titre>
          Les prochains <span className="accent">événements</span>
        </Titre>

        {groupes.length === 0 ? (
          <Vide style={{ marginTop: 50 }}>
            Aucun événement prévu pour le moment.<br />
            Consulte <strong>la programmation complète Sur la scène</strong>
            <br />ou jette un œil sur la page Facebook de La Brassée.
          </Vide>
        ) : (
          <div>
            {groupes.map((g, idx) => {
              const jourSemaine = JOURS_LONG[g.date.getDay()]
              const numero = g.date.getDate()
              const moisLong = MOIS_LONG[g.date.getMonth()]
              const isAujourdhui = g.iso === todayISO

              return (
                <JourBlock
                  key={g.iso}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <JourEntete>
                    <span className="jour">{jourSemaine}</span>
                    <span className="date">{numero} {moisLong}</span>
                    {isAujourdhui && <span className="aujourdhui">Aujourd'hui</span>}
                  </JourEntete>
                  <CardsRow>
                    {g.events.map((ev, eIdx) => (
                      <CardSlot key={ev.id}>
                        <EventCard event={ev} index={eIdx} />
                      </CardSlot>
                    ))}
                  </CardsRow>
                </JourBlock>
              )
            })}
          </div>
        )}
      </Container>
    </Section>
  )
}
