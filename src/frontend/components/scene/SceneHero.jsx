'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const HeroSection = styled.section`
  min-height: 75vh;
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: calc(var(--header-height) + 60px) 24px 60px;
  background:
    radial-gradient(ellipse at 30% 10%, rgba(247, 209, 53, 0.12), transparent 50%),
    radial-gradient(ellipse at 80% 90%, rgba(247, 209, 53, 0.05), transparent 50%),
    var(--color-dark);
  text-align: center;
  overflow: hidden;
`

const Spot = styled.div`
  position: absolute;
  width: 60vmin;
  height: 100vmin;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(247, 209, 53, 0.08), transparent 60%);
  filter: blur(40px);
  top: -20vmin;
  &.left { left: -10vmin; transform: rotate(-15deg); animation: spotA 14s ease-in-out infinite; }
  &.right { right: -10vmin; transform: rotate(15deg); animation: spotB 18s ease-in-out infinite; }
  @keyframes spotA { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.95; } }
  @keyframes spotB { 0%, 100% { opacity: 0.95; } 50% { opacity: 0.45; } }
`

const Surtitre = styled(motion.div)`
  color: var(--color-creme, rgba(205, 196, 157, 0.6));
  font-family: var(--font-din-condensed, var(--font-din));
  text-transform: uppercase;
  letter-spacing: 6px;
  font-size: 12px;
  margin-bottom: 24px;
  position: relative;
  z-index: 2;
`

const Titre = styled(motion.h1)`
  color: #ffffff;
  font-family: var(--font-din);
  font-size: clamp(64px, 11vw, 180px);
  line-height: 0.9;
  font-weight: 200;
  letter-spacing: -2px;
  margin: 0 0 28px 0;
  position: relative;
  z-index: 2;

  .accent {
    color: var(--color-brand);
  }
`

const Pitch = styled(motion.p)`
  font-size: clamp(16px, 1.5vw, 19px);
  color: rgba(255, 255, 255, 0.85);
  max-width: 720px;
  margin: 0 auto 40px;
  line-height: 1.65;
  position: relative;
  z-index: 2;
`

const CTAs = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
`

const Btn = styled.a`
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 13px;
  padding: 16px 32px;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid;
  cursor: pointer;

  &.primaire {
    background: var(--color-brand);
    color: var(--color-dark);
    border-color: var(--color-brand);
    box-shadow: 0 8px 24px rgba(247, 209, 53, 0.18);
  }
  &.primaire:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(247, 209, 53, 0.35);
  }
  &.secondaire {
    background: transparent;
    color: var(--color-brand);
    border-color: rgba(247, 209, 53, 0.3);
  }
  &.secondaire:hover {
    background: rgba(247, 209, 53, 0.15);
    border-color: var(--color-brand);
  }
`

export default function SceneHero() {
  return (
    <HeroSection>
      <Spot className="left" />
      <Spot className="right" />
      <Surtitre
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        La Brassée · Sur la scène
      </Surtitre>
      <Titre
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        La <span className="accent">scène</span> est libre.
      </Titre>
      <Pitch
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Cinq soirs par semaine, La Brassée ouvre sa scène à des artistes qui veulent
        jouer pour de vrai. Sans billetterie, sans cachet figé. La salle écoute, met au
        chapeau, et la maison ajoute 10 % sur les factures du soir — 100 % pour les
        artistes. Soundcheck 18 h 30, premier set 19 h 30.
      </Pitch>
      <CTAs>
        <Btn href="#agenda" className="primaire">
          Voir le prochain show
        </Btn>
        <Btn href="#comment" className="secondaire">
          Comment ça marche
        </Btn>
      </CTAs>
    </HeroSection>
  )
}
