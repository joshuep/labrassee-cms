'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const partenaires = [
  {
    slug: 'beauregard',
    nom: 'Microbrasserie Beauregard',
    role: 'Bières artisanales',
    description:
      'Brasserie indépendante de Rosemont qui élabore des bières de caractère en petites séries. On les retrouve à la pression à La Brassée.',
    url: 'https://beauregard.beer',
    logo: '/images/partenaires/beauregard.png',
  },
  {
    slug: 'carrement-tarte',
    nom: 'Carrément Tarte',
    role: 'Tartes artisanales',
    description:
      'Tartes sucrées et salées faites à la main avec des ingrédients locaux. Elles trônent chaque semaine dans notre vitrine.',
    url: 'https://carrement-tarte.com',
    logo: '/images/partenaires/carrement-tarte.png',
  },
  {
    slug: 'madeleine',
    nom: 'Pâtisserie Madeleine',
    role: 'Pâtisseries & viennoiseries',
    description:
      'Pâtisserie française de quartier dont les viennoiseries fraîches composent notre offre du matin.',
    url: 'https://patisseriemadeleine.ca',
    logo: '/images/partenaires/madeleine.png',
  },
  {
    slug: 'lufa',
    nom: 'Fermes Lufa',
    role: 'Agriculture urbaine',
    description:
      "Pionnières de l'agriculture sur toits à Montréal. Leurs légumes frais cueillis le jour même arrivent directement dans notre cuisine.",
    url: 'https://lufa.com',
    logo: '/images/partenaires/lufa.png',
  },
  {
    slug: 'grenouille-rouge',
    nom: 'La Grenouille Rouge',
    role: 'Partenaire culturel',
    description:
      'Un espace culturel ancré dans Rosemont qui partage notre vision : des arts vivants accessibles, portés par la communauté.',
    url: 'https://lagrenouillerouge.com',
    logo: '/images/partenaires/grenouille-rouge.png',
  },
]

/* ── Styled components ── */

const Page = styled.div`
  width: 100%;
  background: var(--color-dark);
  min-height: 100vh;
`

const Hero = styled.section`
  width: 100%;
  padding: 160px 5vw 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  position: relative;
  overflow: hidden;
`

const HeroLabel = styled(motion.span)`
  font-family: var(--font-din-condensed);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--color-brand);
`

const HeroTitle = styled(motion.h1)`
  font-family: var(--font-din);
  font-size: clamp(56px, 10vw, 140px);
  font-weight: 400;
  line-height: 0.9;
  color: var(--color-white);
  text-transform: uppercase;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.15);
  margin: 0;
`

const HeroAccent = styled.span`
  -webkit-text-stroke: 2px var(--color-brand);
  color: transparent;
`

const HeroDivider = styled(motion.div)`
  width: 60px;
  height: 3px;
  background: var(--color-brand);
  margin-top: 8px;
`

const HeroLead = styled(motion.p)`
  font-family: var(--font-acumin);
  font-size: 18px;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  max-width: 520px;
  margin: 0;
`

const Grid = styled.section`
  width: 100%;
  padding: 0 5vw 120px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled(motion.article)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 44px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`

const CardRole = styled.span`
  font-family: var(--font-din-condensed);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-brand);
`

const CardName = styled.h2`
  font-family: var(--font-din);
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 400;
  text-transform: uppercase;
  color: var(--color-white);
  line-height: 1.1;
  margin: 0;
`

const CardDesc = styled.p`
  font-family: var(--font-acumin);
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  flex: 1;
`

const CardLink = styled.a`
  font-family: var(--font-din-condensed);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--color-brand);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::after {
    content: '→';
    font-size: 13px;
  }
`

/* ── Animation variants ── */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ── Component ── */

const Partenaires = () => {
  return (
    <Page>
      <Hero>
        <HeroLabel
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          La Brassée · Rosemont
        </HeroLabel>

        <HeroTitle
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.1 } } }}
        >
          NOS<br />
          <HeroAccent>PARTENAIRES</HeroAccent>
        </HeroTitle>

        <HeroDivider
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />

        <HeroLead
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5 } } }}
        >
          Des gens du quartier, des producteurs locaux, des lieux qui partagent
          nos valeurs. Ensemble on fait de La Brassée un endroit qui compte
          vraiment à Rosemont.
        </HeroLead>
      </Hero>

      <Grid
        as={motion.section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
      >
        {partenaires.map((p) => (
          <Card key={p.slug} variants={fadeUp}>
            <CardRole>{p.role}</CardRole>
            <CardName>{p.nom}</CardName>
            <CardDesc>{p.description}</CardDesc>
            <CardLink href={p.url} target="_blank" rel="noopener noreferrer">
              {p.url.replace(/^https?:\/\//, '')}
            </CardLink>
          </Card>
        ))}
      </Grid>
    </Page>
  )
}

export default Partenaires
