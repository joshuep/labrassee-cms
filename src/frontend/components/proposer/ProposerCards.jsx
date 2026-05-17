'use client'

import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  padding: 80px 24px 100px;
  background: var(--color-dark);
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Carte = styled.article`
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  padding: 44px 36px 36px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(247, 209, 53, 0.4);
  }
`

const Emoji = styled.div`
  font-size: 56px;
  line-height: 1;
`

const Eyebrow = styled.div`
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 11px;
`

const Titre = styled.h2`
  font-family: var(--font-din);
  font-weight: 200;
  font-size: clamp(36px, 4vw, 52px);
  letter-spacing: -1px;
  color: #ffffff;
  margin: 0;
  line-height: 1;
`

const Sous = styled.div`
  color: rgba(205, 196, 157, 0.85);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
  margin-top: -4px;
`

const Pitch = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.7;
  margin: 8px 0 0;
`

const Liste = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Item = styled.li`
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  &::before {
    content: '·';
    color: var(--color-brand);
    font-weight: 700;
    font-size: 22px;
    line-height: 1;
    flex-shrink: 0;
  }

  strong {
    color: var(--color-brand);
    font-weight: 500;
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
`

const BtnPrimaire = styled.a`
  background: var(--color-brand);
  color: var(--color-dark);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
  padding: 14px 24px;
  border-radius: 999px;
  text-decoration: none;
  border: 1px solid var(--color-brand);
  transition: all 0.3s ease;

  &:hover {
    background: transparent;
    color: var(--color-brand);
  }
`

const BtnSecondaire = styled.a`
  background: transparent;
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
  padding: 14px 24px;
  border-radius: 999px;
  text-decoration: none;
  border: 1px solid rgba(247, 209, 53, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(247, 209, 53, 0.12);
    border-color: var(--color-brand);
  }
`

export default function ProposerCards() {
  return (
    <Section id="cartes">
      <Container>
        {/* Carte SCÈNE */}
        <Carte>
          <Emoji>🎤</Emoji>
          <Eyebrow>Surlascène</Eyebrow>
          <Titre>Sur la scène</Titre>
          <Sous>Musique · poésie · cabaret</Sous>
          <Pitch>
            Cinq soirs par semaine, La Brassée ouvre sa scène à des artistes qui
            veulent jouer pour de vrai. Sans billetterie, sans cachet figé. La
            salle écoute, met au chapeau, et la maison ajoute 10 % sur les
            factures du soir — 100 % pour les artistes.
          </Pitch>
          <Liste>
            <Item>
              <span>
                <strong>Soundcheck dès 18 h 30</strong>, show à 19 h 30, format 2 ×
                45 min avec pause
              </span>
            </Item>
            <Item>
              <span>
                <strong>Chapeau + majoration 10 %</strong> sur les factures du soir
                — intégralement reversé aux artistes
              </span>
            </Item>
            <Item>
              <span>
                <strong>30 $ de consommation offerte</strong> par artiste (plafond
                120 $/soirée)
              </span>
            </Item>
            <Item>
              <span>
                Captation audio + vidéo stéréo sur clé USB en option (40 $)
              </span>
            </Item>
            <Item>
              <span>
                Un·e artiste peut revenir <strong>max 3 fois par année</strong>
              </span>
            </Item>
          </Liste>
          <Actions>
            <BtnPrimaire
              href="https://labrassee-surlascene-depot.vercel.app/?candidature=scene"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-event"
            >
              Proposer ma perfo
            </BtnPrimaire>
            <BtnSecondaire
              href="/proposer/equipement"
              className="cursor-event"
            >
              Découvre notre équipement
            </BtnSecondaire>
          </Actions>
        </Carte>

        {/* Carte MURS */}
        <Carte>
          <Emoji>🖼️</Emoji>
          <Eyebrow>Surnosmurs</Eyebrow>
          <Titre>Sur nos murs</Titre>
          <Sous>Expos · galerie</Sous>
          <Pitch>
            La Brassée accueille un·e nouvel·le artiste sur ses murs toutes les
            quatre semaines. Installation le dimanche matin, vernissage 5 à 7 le
            dimanche suivant, décrochage quatre semaines après. Tu accroches,
            tu fais l'événement, tu repars avec tes ventes.
          </Pitch>
          <Liste>
            <Item>
              <span>
                <strong>4 semaines d'expo</strong>, installation et décrochage
                dimanche matin en autonomie
              </span>
            </Item>
            <Item>
              <span>
                <strong>Vernissage 5 à 7 le dimanche J+7</strong> (présence
                artiste obligatoire)
              </span>
            </Item>
            <Item>
              <span>
                Matériel d'accrochage fourni (cimaises + cordon + crochets) —
                <strong> ne pas dégrader les murs</strong>
              </span>
            </Item>
            <Item>
              <span>
                <strong>10 % de commission</strong> La Brassée sur les ventes
                d'œuvres
              </span>
            </Item>
            <Item>
              <span>
                Promo Facebook + Instagram + newsletter + TV intérieure assurée
                par la maison
              </span>
            </Item>
          </Liste>
          <Actions>
            <BtnPrimaire
              href="https://labrassee-murs-depot.vercel.app/?candidature=murs"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-event"
            >
              Proposer mon expo
            </BtnPrimaire>
            <BtnSecondaire
              href="#cartes"
              className="cursor-event"
            >
              Conditions complètes
            </BtnSecondaire>
          </Actions>
        </Carte>
      </Container>
    </Section>
  )
}
