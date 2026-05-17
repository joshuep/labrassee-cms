'use client'

import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  padding: 60px 24px 30px;
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
  font-size: clamp(28px, 4.5vw, 48px);
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
  margin: 0 auto 36px;
  font-size: 16px;
  line-height: 1.6;
`

const Grille = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const Jour = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 18px 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;

  &.repos {
    background: rgba(255, 255, 255, 0.025);
    border-style: dashed;
    color: rgba(255, 255, 255, 0.55);
  }

  &:not(.repos):hover {
    background: rgba(247, 209, 53, 0.06);
    border-color: rgba(247, 209, 53, 0.3);
    transform: translateY(-2px);
  }

  .jour-nom {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 12px;
    color: var(--color-brand);
    font-weight: 500;
  }

  .genres {
    font-family: var(--font-din);
    color: #ffffff;
    font-size: clamp(14px, 1.6vw, 17px);
    font-weight: 300;
    line-height: 1.3;
    min-height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.repos .genres {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
  }

  .repos-pic {
    font-size: 22px;
    opacity: 0.5;
  }
`

const Note = styled.p`
  margin: 30px auto 0;
  max-width: 720px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  line-height: 1.6;
  font-style: italic;

  strong {
    color: var(--color-brand);
    font-style: normal;
    font-weight: 500;
  }
`

const PROGRAMMATION = [
  { jour: 'LUN', titre: 'Impro' },
  { jour: 'MAR', titre: 'Jam' },
  { jour: 'MER', titre: 'Repos', repos: true },
  { jour: 'JEU', titre: 'Jazz / Jazz manouche' },
  { jour: 'VEN', titre: 'Jazz · karaoké · poésie' },
  { jour: 'SAM', titre: 'Musique du monde' },
  { jour: 'DIM', titre: 'Vernissages', repos: false, dim: true },
]

export default function ProposerProgrammation() {
  return (
    <Section id="programmation">
      <Container>
        <Eyebrow>Notre semaine côté scène</Eyebrow>
        <Titre>
          Une <span className="accent">programmation type</span> · pas un règlement
        </Titre>
        <Intro>
          On a une idée de ce qu'on aimerait sur chaque soir — c'est l'ambiance qu'on
          cherche à cultiver. Mais si ton projet sonne juste, peu importe le jour, on en discute.
        </Intro>

        <Grille>
          {PROGRAMMATION.map((p) => (
            <Jour key={p.jour} className={p.repos ? 'repos' : ''}>
              <span className="jour-nom">{p.jour}</span>
              {p.repos ? (
                <>
                  <span className="repos-pic">🌿</span>
                  <span className="genres">Repos</span>
                </>
              ) : (
                <span className="genres">{p.titre}</span>
              )}
            </Jour>
          ))}
        </Grille>

        <Note>
          C'est un <strong>objectif éditorial</strong>, pas une loi. Une proposition qui
          détonne sur le bon soir, ou un genre qu'on n'a pas anticipé — <strong>on reste ouverts</strong>.
        </Note>
      </Container>
    </Section>
  )
}
