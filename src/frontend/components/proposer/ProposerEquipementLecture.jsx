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
  max-width: 1100px;
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

  i {
    font-size: 11px;
  }
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
  margin: 0 auto 32px;
  font-size: 16px;
  line-height: 1.6;
`

const NoteImportante = styled.div`
  max-width: 880px;
  margin: 0 auto 44px;
  padding: 22px 26px;
  background: rgba(247, 209, 53, 0.07);
  border: 1px solid rgba(247, 209, 53, 0.35);
  border-left: 3px solid var(--color-brand);
  border-radius: 12px;

  .head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    font-family: var(--font-din);
    color: var(--color-brand);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 13px;
    font-weight: 500;

    .nn {
      background: var(--color-brand);
      color: var(--color-dark);
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 10px;
      letter-spacing: 1.5px;
      font-weight: 700;
    }
  }

  .corps {
    color: rgba(255, 255, 255, 0.92);
    font-size: 15px;
    line-height: 1.65;
    font-weight: 300;
  }

  .corps strong {
    color: var(--color-brand);
    font-weight: 500;
  }
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
  padding: 22px;
`

const CarteTitre = styled.div`
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 13px;
  color: var(--color-brand);
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(247, 209, 53, 0.15);
`

const Liste = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Item = styled.li`
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  line-height: 1.5;
  padding-left: 16px;
  position: relative;

  &::before {
    content: '·';
    position: absolute;
    left: 0;
    top: 0;
    color: var(--color-brand);
    font-size: 22px;
    line-height: 1;
    font-weight: 700;
  }

  strong {
    color: #ffffff;
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

// On affiche le matériel disponible mais SANS la mention « pick what you need » —
// la sélection effective viendra au dépôt définitif (lien token personnel).
const SECTIONS = [
  {
    titre: '🎤 Micros voix',
    keys: ['micros_voix'],
  },
  {
    titre: '🥁 Micros pour sonoriser instruments',
    keys: ['micros_instruments', 'micros_statiques', 'di_box'],
  },
  {
    titre: '🦿 Pieds de micro',
    keys: ['pieds'],
  },
  {
    titre: '🔌 Câblages',
    keys: ['cablage'],
  },
  {
    titre: '🔊 Moniteur de scène',
    keys: ['diffusion_appoint'],
    fallback:
      "Disponible sur demande pour les artistes qui ne ramènent pas leur ampli (voix solo, percussions, etc.). Sinon, ton ampli est ton moniteur (voir note ci-dessus).",
  },
  {
    titre: '💿 Enregistrement vidéo/audio · clé USB',
    keys: ['format', 'prix_actuel', 'disponible'],
  },
  {
    titre: '🎹 Backline',
    keys: ['piano', 'batterie', 'ampli_guitare', 'ampli_basse'],
  },
]

function trouverValeur(contenu, key) {
  if (!contenu) return null
  for (const section of Object.values(contenu)) {
    if (section && typeof section === 'object' && !Array.isArray(section)) {
      if (key in section) return section[key]
    }
  }
  return null
}

function formaterValeur(v) {
  if (v === null || v === undefined || v === '') return null
  if (typeof v === 'boolean') return v ? 'oui' : 'non'
  if (Array.isArray(v)) return v.join(', ')
  return String(v)
}

export default function ProposerEquipementLecture({ dossier }) {
  const contenu = dossier?.contenu || {}

  return (
    <Section>
      <Container>
        <Retour href="/proposer">
          <i className="fas fa-arrow-left" /> Retour à la candidature
        </Retour>

        <Eyebrow>Avant de postuler</Eyebrow>
        <Titre>
          Notre <span className="accent">équipement</span>
        </Titre>
        <Intro>
          Voilà ce qu'on met à disposition. Tu peux y jeter un œil avant de proposer
          ta perfo pour savoir si on couvre tes besoins. La sélection précise du
          matériel que tu veux utiliser se fera <strong style={{ color: 'var(--color-brand)' }}>après</strong> qu'on
          ait accepté ta candidature — Cédric t'enverra un lien personnel pour ton
          dépôt définitif.
        </Intro>

        <NoteImportante>
          <div className="head">
            🎚️ Gestion du son <span className="nn">non négociable</span>
          </div>
          <div className="corps">
            Le son de la salle est <strong>géré et réglé par le technicien son</strong> ;
            tout passe par la console. Si tu amènes ton ampli, il devient ton{' '}
            <strong>moniteur</strong> et la <strong>source</strong> qui entre
            dans la console et qui est ensuite distribuée dans la salle.
          </div>
        </NoteImportante>

        <Grille>
          {SECTIONS.map((sec) => {
            const items = sec.keys
              .map((k) => ({ key: k, value: formaterValeur(trouverValeur(contenu, k)) }))
              .filter((it) => it.value)
            if (items.length === 0 && !sec.fallback) return null
            return (
              <Carte key={sec.titre}>
                <CarteTitre>{sec.titre}</CarteTitre>
                {items.length > 0 ? (
                  <Liste>
                    {items.map((it) => (
                      <Item key={it.key}>{it.value}</Item>
                    ))}
                  </Liste>
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: 14, lineHeight: 1.55 }}>
                    {sec.fallback}
                  </div>
                )}
              </Carte>
            )
          })}
        </Grille>

        <Pied>
          Tu as vu notre équipement ? <strong>Reviens proposer ta perfo</strong> —
          on regarde ton dossier, et si on s'accorde, tu auras la main pour
          détailler exactement ce dont tu as besoin.
          <br />
          <a
            href="https://labrassee-surlascene-depot.vercel.app/?candidature=scene"
            target="_blank"
            rel="noopener noreferrer"
            className="cta cursor-event"
          >
            Proposer ma perfo →
          </a>
        </Pied>
      </Container>
    </Section>
  )
}
