'use client'

import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  padding: 80px 24px;
  background: var(--color-dark);
`

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`

const Label = styled.div`
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
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;
  margin: 0 0 16px;

  .u { color: var(--color-brand); }
`

const Intro = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  max-width: 640px;
  margin: 0 auto 40px;
  font-size: 16px;
`

const Bloc = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.4);
  border-radius: 24px;
  padding: 36px;
`

const Lead = styled.div`
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 24px;
  font-size: 15px;
  line-height: 1.7;

  &.brouillon {
    background: rgba(247, 209, 53, 0.06);
    border-left: 3px solid rgba(247, 209, 53, 0.3);
    padding: 14px 18px;
    border-radius: 8px;
    font-style: italic;
  }

  strong { color: var(--color-brand); }
`

const DetailsBloc = styled.details`
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: 18px 0;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }

  summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 14px;
    color: var(--color-brand);
    padding: 4px 0;
    user-select: none;

    &::after {
      content: '+';
      font-size: 24px;
      color: var(--color-brand);
      transition: transform 0.2s;
    }

    &::-webkit-details-marker {
      display: none;
    }
  }

  &[open] summary::after {
    content: '−';
  }

  .contenu {
    margin-top: 14px;
    padding-left: 4px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    line-height: 1.7;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 4px 0;
    position: relative;
    padding-left: 18px;
  }

  li::before {
    content: '·';
    color: var(--color-brand);
    position: absolute;
    left: 6px;
    font-weight: 700;
  }

  li strong {
    color: #ffffff;
  }

  .vide {
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
  }
`

// Métadonnées : titre + ordre d'affichage par clé JSON
const SECTION_META = {
  sonorisation: { titre: '🎤 Sonorisation', ordre: 1 },
  backline: { titre: '🎹 Backline', ordre: 2 },
  eclairage: { titre: '💡 Éclairage', ordre: 3 },
  video: { titre: '🎥 Vidéo · captation', ordre: 4 },
  format_show: { titre: '⏰ Format du show', ordre: 5 },
  service_enregistrement: { titre: '💿 Captation USB · service', ordre: 6 },
  loge: { titre: '🚪 Loge · coulisse · hospitality', ordre: 7 },
  personnel: { titre: '👥 Personnel La Brassée', ordre: 8 },
  espace: { titre: '📐 Espace scène', ordre: 9 },
  public: { titre: '🪑 Public · capacité', ordre: 10 },
  acces: { titre: '🚗 Accès · stationnement', ordre: 11 },
  electricite: { titre: '⚡ Électricité', ordre: 12 },
  notes_operationnelles: { titre: '⚠️ Notes opérationnelles', ordre: 13 },
  identite_etablissement: { titre: '🆔 Identité établissement', ordre: 14 },
}

function labelFromKey(k) {
  return k
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\b(m2|m\b)/gi, (m) => m.toUpperCase())
}

function renderValeur(v) {
  if (v === null || v === undefined || v === '')
    return <span className="vide">à confirmer</span>
  if (typeof v === 'boolean') return v ? 'oui' : 'non'
  if (typeof v === 'number') return String(v)
  if (Array.isArray(v)) return v.map((x) => String(x)).join(', ')
  return String(v)
}

export default function SceneDossierTechnique({ dossier }) {
  if (!dossier) {
    return (
      <Section id="dossier">
        <Container>
          <Label>Pour les artistes</Label>
          <Titre>
            Le <span className="u">dossier technique</span>
          </Titre>
          <Bloc>
            <Lead style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>
              Dossier technique en cours de finalisation. Écris à{' '}
              <a href="mailto:contact@labrassee.cafe" style={{ color: 'var(--color-brand)' }}>
                contact@labrassee.cafe
              </a>{' '}
              pour la version PDF.
            </Lead>
          </Bloc>
        </Container>
      </Section>
    )
  }

  const contenu = dossier.contenu || {}
  const presentKeys = Object.keys(contenu)
  presentKeys.sort((a, b) => {
    const oa = SECTION_META[a] ? SECTION_META[a].ordre : 99
    const ob = SECTION_META[b] ? SECTION_META[b].ordre : 99
    return oa - ob
  })

  return (
    <Section id="dossier">
      <Container>
        <Label>Pour les artistes</Label>
        <Titre>
          Le <span className="u">dossier technique</span>
        </Titre>
        <Intro>
          Tout ce qu'on fournit côté scène, son, lumière. Consulte avant d'envoyer
          ton rider, ça t'évitera les surprises.
        </Intro>

        <Bloc>
          {dossier.en_brouillon ? (
            <Lead className="brouillon">
              {dossier.notes_publiques ||
                'Dossier technique en cours de finalisation. Écris-nous pour la version PDF complète.'}
            </Lead>
          ) : (
            <Lead>
              Version <strong>{dossier.version || ''}</strong> · mis à jour le{' '}
              {new Date(dossier.maj_le).toLocaleDateString('fr-CA')}. Si tu as un
              besoin spécifique non couvert ci-dessous, écris-nous.
            </Lead>
          )}

          {presentKeys.map((cle) => {
            const meta = SECTION_META[cle] || {
              titre: '📄 ' + labelFromKey(cle),
              ordre: 99,
            }
            const sub = contenu[cle]
            const openByDefault = ['sonorisation', 'backline', 'format_show'].includes(cle)

            let inner
            if (typeof sub === 'object' && sub !== null && !Array.isArray(sub)) {
              inner = (
                <ul>
                  {Object.entries(sub).map(([k, v]) => (
                    <li key={k}>
                      <strong>{labelFromKey(k)} : </strong>
                      {renderValeur(v)}
                    </li>
                  ))}
                </ul>
              )
            } else {
              inner = <ul><li>{renderValeur(sub)}</li></ul>
            }

            return (
              <DetailsBloc key={cle} {...(openByDefault ? { open: true } : {})}>
                <summary>{meta.titre}</summary>
                <div className="contenu">{inner}</div>
              </DetailsBloc>
            )
          })}
        </Bloc>
      </Container>
    </Section>
  )
}
