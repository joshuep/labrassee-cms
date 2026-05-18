'use client'

import React from 'react'
import styled from 'styled-components'

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
  max-width: 700px;
  margin: 0 auto 28px;
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
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(247, 209, 53, 0.35);
    background: rgba(247, 209, 53, 0.03);
  }
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
  padding-left: 22px;
  position: relative;

  &::before {
    content: '☐';
    position: absolute;
    left: 0;
    top: 0;
    color: var(--color-brand);
    font-size: 14px;
    line-height: 1.5;
    opacity: 0.7;
  }

  strong {
    color: #ffffff;
    font-weight: 500;
  }
`

const Pied = styled.p`
  margin: 36px auto 0;
  max-width: 720px;
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  line-height: 1.7;
  font-style: italic;

  strong {
    color: var(--color-brand);
    font-style: normal;
    font-weight: 500;
  }
`

// Catégories que l'artiste peut demander avant son show.
// On ne liste QUE ce qui se "pick" — pas le matos interne (console, diffusion,
// éclairage, vidéo), pas l'info passive (format, espace), pas le backline
// (piano = toujours là, le reste = artiste apporte).
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
]

function labelDeCle(k) {
  return k
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
}

function trouverValeur(contenu, key) {
  if (!contenu) return null
  // On cherche la clé dans toutes les sections (sonorisation, backline, eclairage, etc.)
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

export default function ProposerDossierTech({ dossier }) {
  const contenu = dossier?.contenu || {}

  return (
    <Section id="dossier-technique">
      <Container>
        <Eyebrow>Pick what you need</Eyebrow>
        <Titre>
          Dis-nous ce dont tu as <span className="accent">besoin</span> pour qu'on se prépare
        </Titre>
        <Intro>
          Coche mentalement ce qui te sert · réponds à notre courriel avec ta liste.
          Comme ça la salle est réglée pour toi avant que tu arrives au soundcheck.
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
          Un besoin spécifique non listé (effet, micro particulier, format inhabituel) ?
          <br />
          Écris à <strong>contact@labrassee.cafe</strong> — on regarde ensemble.
        </Pied>
      </Container>
    </Section>
  )
}
