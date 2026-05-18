'use client'

import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const Section = styled.section`
  padding: 60px 24px 100px;
  background: var(--color-dark);
  min-height: 80vh;
`

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

const Retour = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
  margin-bottom: 32px;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-brand);
  }

  i { font-size: 11px; }
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

const Titre = styled.h1`
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
  max-width: 720px;
  margin: 0 auto 40px;
  font-size: 16px;
  line-height: 1.6;
`

const Grille = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
`

const Carte = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(247, 209, 53, 0.35);
    background: rgba(247, 209, 53, 0.03);
  }

  .emo {
    font-size: 28px;
    line-height: 1;
    margin-bottom: 10px;
  }

  .titre {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 13px;
    color: var(--color-brand);
    margin-bottom: 8px;
  }

  .corps {
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    line-height: 1.6;

    strong {
      color: var(--color-brand);
      font-weight: 500;
    }
  }
`

const ChronoBande = styled.div`
  margin: 0 auto 44px;
  max-width: 760px;
  padding: 22px 26px;
  background: rgba(99, 200, 220, 0.07);
  border: 1px solid rgba(99, 200, 220, 0.3);
  border-left: 3px solid rgba(99, 200, 220, 0.7);
  border-radius: 12px;

  .head {
    font-family: var(--font-din);
    color: rgba(180, 230, 240, 0.95);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 12px;
    margin-bottom: 12px;
  }

  ol {
    color: rgba(255, 255, 255, 0.88);
    font-size: 14px;
    line-height: 1.7;
    padding-left: 22px;
    margin: 0;
  }

  ol li {
    margin-bottom: 6px;
  }

  ol li strong {
    color: rgba(180, 230, 240, 0.95);
    font-weight: 500;
  }
`

const Pied = styled.div`
  margin: 50px auto 0;
  max-width: 760px;
  padding: 26px 28px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  text-align: center;
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
  line-height: 1.6;

  strong {
    color: var(--color-brand);
    font-weight: 500;
  }

  .cta {
    display: inline-flex;
    margin-top: 14px;
    padding: 12px 24px;
    background: var(--color-brand);
    color: var(--color-dark);
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 12px;
    text-decoration: none;
    border-radius: 999px;
    font-weight: 500;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }
`

const CARDS = [
  {
    emo: '🖼️',
    titre: 'Durée',
    corps: (
      <>
        <strong>4 semaines d'expo</strong> par rotation. Accrochage le dimanche
        matin (10 h–14 h) en autonomie · décrochage le dimanche matin 4 semaines
        après.
      </>
    ),
  },
  {
    emo: '🥂',
    titre: 'Vernissage',
    corps: (
      <>
        <strong>5 à 7 le dimanche suivant l'installation</strong>. Présence
        artiste <strong>obligatoire</strong>. La maison s'occupe du service,
        des bulles et de l'ambiance.
      </>
    ),
  },
  {
    emo: '💸',
    titre: 'Vente · commission',
    corps: (
      <>
        Vente <strong>directe au public</strong>, sans intermédiaire.{' '}
        <strong>10 % de commission</strong> reversée à La Brassée sur chaque
        œuvre vendue (la maison fait le pont entre toi et l'acheteur).
      </>
    ),
  },
  {
    emo: '🔧',
    titre: 'Matériel d\'accrochage',
    corps: (
      <>
        <strong>Cimaises + cordon + crochets fournis.</strong> Tu accroches en
        autonomie le dimanche matin. <strong>Ne pas dégrader les murs</strong>{' '}
        (pas de perçage, pas de scotch agressif).
      </>
    ),
  },
  {
    emo: '📣',
    titre: 'Promo complète',
    corps: (
      <>
        On s'occupe de tout : <strong>event Facebook</strong>, post Instagram,
        newsletter, TV cuisine. Plus ton dépôt est rodé (photos d'œuvres, bio,
        liens), plus on a de matière pour te mettre en avant.
      </>
    ),
  },
  {
    emo: '📷',
    titre: 'Droit d\'image',
    corps: (
      <>
        Droit d'image des œuvres pour la <strong>communication de l'expo
        (et 6 mois après)</strong>. Nom de l'artiste systématiquement
        mentionné. Tu restes propriétaire de tes œuvres et seul·e responsable
        en cas de dégradation.
      </>
    ),
  },
]

export default function ProposerExpoLecture() {
  return (
    <Section>
      <Container>
        <Retour href="/proposer">
          <i className="fas fa-arrow-left" /> Retour à la candidature
        </Retour>

        <Eyebrow>Avant de postuler</Eyebrow>
        <Titre>
          Exposer <span className="accent">sur nos murs</span>
        </Titre>
        <Intro>
          Tout ce qu'il faut savoir avant de proposer ton expo : durée, vernissage,
          vente, accrochage, communication. La sélection du créneau précis se
          fera <strong style={{ color: 'var(--color-brand)' }}>après</strong> que
          Cédric et Joshué aient accepté ta candidature.
        </Intro>

        <ChronoBande>
          <div className="head">Le cycle, étape par étape</div>
          <ol>
            <li><strong>Candidature</strong> · tu déposes ton dossier (bio, photos d'œuvres, technique, dimensions)</li>
            <li><strong>Validation</strong> · Cédric et Joshué arbitrent et te proposent une rotation</li>
            <li><strong>Accrochage</strong> · dimanche matin (10 h–14 h), en autonomie, matériel fourni</li>
            <li><strong>Vernissage 5 à 7</strong> · le dimanche suivant, présence artiste obligatoire</li>
            <li><strong>4 semaines d'expo</strong> · ventes directes au public, La Brassée fait le pont</li>
            <li><strong>Décrochage</strong> · dimanche matin 4 semaines après l'accrochage</li>
          </ol>
        </ChronoBande>

        <Grille>
          {CARDS.map((c, i) => (
            <Carte key={i}>
              <div className="emo">{c.emo}</div>
              <div className="titre">{c.titre}</div>
              <div className="corps">{c.corps}</div>
            </Carte>
          ))}
        </Grille>

        <Pied>
          Ces conditions te conviennent ? <strong>Reviens proposer ton expo</strong>{' '}
          — on regarde ton dossier et, si on s'accorde, on cale ton créneau sur la
          prochaine rotation libre.
          <br />
          <a
            href="https://labrassee-murs-depot.vercel.app/?candidature=murs"
            target="_blank"
            rel="noopener noreferrer"
            className="cta cursor-event"
          >
            Proposer mon expo →
          </a>
        </Pied>
      </Container>
    </Section>
  )
}
