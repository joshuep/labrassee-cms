'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const HeroSection = styled.section`
  min-height: 60vh;
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
`

const Surtitre = styled(motion.div)`
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 20px;
  opacity: 0.95;

  @media (max-width: 640px) {
    font-size: 12px;
    letter-spacing: 3px;
    margin-bottom: 14px;
  }
`

const Titre = styled(motion.h1)`
  color: #ffffff;
  font-family: var(--font-din);
  font-size: clamp(54px, 9vw, 140px);
  line-height: 0.92;
  font-weight: 200;
  letter-spacing: -2px;
  margin: 0 0 28px 0;
  /* Évite les orphelins (un mot ou un signe seul sur la dernière ligne) */
  text-wrap: balance;

  .accent {
    color: var(--color-brand);
  }
`

const Pitch = styled(motion.p)`
  font-size: clamp(15px, 1.5vw, 19px);
  color: rgba(255, 255, 255, 0.88);
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.7;
`

export default function ProposerHero() {
  return (
    <HeroSection>
      <Surtitre
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Pour les artistes
      </Surtitre>
      <Titre
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Viens te faire <span className="accent">voir</span>.
      </Titre>
      <Pitch
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Aux murs ou sur la scène, La Brassée ouvre ses espaces aux artistes du
        quartier comme aux artistes invité·e·s. Pas de cachet figé, pas de gros
        machin formel — juste un café-bar qui aime montrer ce qui se fait autour
        et qui te traite avec respect.
      </Pitch>
    </HeroSection>
  )
}
