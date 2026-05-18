'use client'

import React from 'react'
import styled from 'styled-components'
import { grouperParMois } from '../../lib/dates-libres'

const Section = styled.section`
  padding: 60px 24px 100px;
  background: var(--color-dark);
`

const Container = styled.div`
  max-width: 1200px;
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
  margin: 0 auto 48px;
  font-size: 16px;
  line-height: 1.6;
`

const MoisBlock = styled.div`
  margin-bottom: 36px;

  &:last-child {
    margin-bottom: 0;
  }
`

const MoisTitre = styled.h3`
  font-family: var(--font-din);
  font-size: 22px;
  font-weight: 300;
  color: var(--color-brand);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 0 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(247, 209, 53, 0.2);

  .compteur {
    color: rgba(255, 255, 255, 0.45);
    font-size: 14px;
    letter-spacing: 1px;
    margin-left: 10px;
    font-weight: 400;
  }
`

const Grille = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
`

const Pastille = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;

  &:hover {
    background: rgba(247, 209, 53, 0.1);
    border-color: var(--color-brand);
    transform: translateY(-2px);
  }

  .jour {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 11px;
    color: rgba(205, 196, 157, 0.65);
  }

  .date {
    font-family: var(--font-din);
    font-size: 28px;
    font-weight: 300;
    color: #ffffff;
    line-height: 1;
  }

  .mois {
    font-family: var(--font-din);
    text-transform: lowercase;
    letter-spacing: 1px;
    font-size: 11px;
    color: rgba(205, 196, 157, 0.65);
  }

  &:hover .date {
    color: var(--color-brand);
  }
`

const Pied = styled.div`
  margin-top: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.7;

  strong {
    color: var(--color-brand);
    font-weight: 500;
  }
`

const Vide = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  color: rgba(255, 255, 255, 0.65);

  strong { color: var(--color-brand); }
`

function buildMailto(date) {
  const sujet = encodeURIComponent('Proposition Sur la scène - ' + date.iso)
  const corps = encodeURIComponent(
    'Salut !\n\n' +
    `Date visée : ${date.jourSemaine} ${date.jourMois} ${date.moisLong} ${date.annee}\n\n` +
    'Nom artiste / groupe : \n' +
    'Genre : \n' +
    'Nb de personnes sur scène : \n' +
    'Lien d\'écoute (Spotify / Bandcamp / YouTube) : \n' +
    'Un mot sur toi : \n\n' +
    'Merci !',
  )
  return `mailto:contact@labrassee.cafe?subject=${sujet}&body=${corps}`
}

export default function ProposerDatesLibres({ dates = [] }) {
  const groupes = grouperParMois(dates)

  return (
    <Section id="dates-libres">
      <Container>
        <Eyebrow>Quand puis-je jouer ?</Eyebrow>
        <Titre>
          Soirs <span className="accent">libres</span> sur notre scène
        </Titre>
        <Intro>
          La scène ouvre 5 soirs par semaine — lundi, mardi, jeudi, vendredi, samedi.
          Voici les dates qui n'ont pas encore d'artiste programmé pour les 4 prochains mois.
          Clique sur la date qui te convient pour nous écrire avec ta proposition.
        </Intro>

        {groupes.length === 0 ? (
          <Vide>
            Toutes les soirées des 4 prochains mois sont déjà programmées.<br />
            Écris-nous quand même à <strong>contact@labrassee.cafe</strong> — on garde une liste
            d'attente.
          </Vide>
        ) : (
          groupes.map((g) => (
            <MoisBlock key={g.cleMois}>
              <MoisTitre>
                {g.libelle}
                <span className="compteur">{g.dates.length} soir{g.dates.length > 1 ? 's' : ''}</span>
              </MoisTitre>
              <Grille>
                {g.dates.map((d) => (
                  <Pastille
                    key={d.iso}
                    href={buildMailto(d)}
                    className="cursor-event"
                    title={`${d.jourSemaine} ${d.jourMois} ${d.moisLong}`}
                  >
                    <span className="jour">{d.jourSemaineCourt}</span>
                    <span className="date">{d.jourMois}</span>
                    <span className="mois">{d.moisCourt}</span>
                  </Pastille>
                ))}
              </Grille>
            </MoisBlock>
          ))
        )}

        <Pied>
          Préavis minimum <strong>7 jours</strong>. Les dates en gris ne sont pas affichées
          — elles correspondent à des soirées déjà bookées ou à des récurrences (Bluegrass
          le mardi, Jazz Manouche un jeudi sur deux, etc.). Si on te répond <strong>oui</strong>,
          on t'envoie le lien personnel pour déposer ton dossier complet (photos, bio, fiche scène).
        </Pied>
      </Container>
    </Section>
  )
}
