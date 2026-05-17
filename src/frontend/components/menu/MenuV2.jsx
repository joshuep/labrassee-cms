'use client'

import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import menuData from '../../data/menu_v2.json'

// ─────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────

const Section = styled.section`
  width: 100%;
  background: var(--color-dark);
  padding: 40px 0 100px;
  position: relative;
`

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
`

const Hero = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding-top: 20px;
`

const Eyebrow = styled.div`
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 5px;
  font-size: 12px;
  margin-bottom: 10px;
`

const Titre = styled.h1`
  font-family: var(--font-din);
  font-size: clamp(38px, 6vw, 64px);
  font-weight: 200;
  letter-spacing: -1px;
  color: #ffffff;
  margin: 0 0 12px;
  line-height: 1;

  .accent { color: var(--color-brand); }
`

const SousTitre = styled.p`
  color: rgba(255, 255, 255, 0.75);
  font-size: 15px;
  max-width: 560px;
  margin: 0 auto;
`

const NavSticky = styled.nav`
  position: sticky;
  top: var(--header-height, 90px);
  z-index: 50;
  background: rgba(16, 15, 9, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid rgba(247, 209, 53, 0.15);
  border-bottom: 1px solid rgba(247, 209, 53, 0.15);
  margin: 0 -24px 50px;
  padding: 12px 24px;

  .scroll {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .scroll::-webkit-scrollbar { display: none; }

  a {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.7);
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 11px;
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  a:hover {
    color: var(--color-brand);
    background: rgba(247, 209, 53, 0.08);
    border-color: rgba(247, 209, 53, 0.25);
  }
  a.active {
    color: var(--color-dark);
    background: var(--color-brand);
    border-color: var(--color-brand);
  }
`

const PageBloc = styled.div`
  margin-bottom: 64px;
  scroll-margin-top: 160px;

  &:last-child { margin-bottom: 0; }
`

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(247, 209, 53, 0.25);

  h2 {
    font-family: var(--font-din);
    font-size: clamp(26px, 4vw, 42px);
    font-weight: 300;
    letter-spacing: -0.5px;
    color: var(--color-brand);
    margin: 0 0 8px;
    text-transform: uppercase;
  }
  .ss {
    color: rgba(255, 255, 255, 0.65);
    font-size: 14px;
    line-height: 1.5;
    max-width: 560px;
    margin: 0 auto;
  }
  .ss .sub-sm { font-size: 13px; }
  .ss .badge-new {
    background: var(--color-brand);
    color: var(--color-dark);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    margin-left: 6px;
  }
`

const SectionInterne = styled.div`
  margin-bottom: 36px;

  &:last-child { margin-bottom: 0; }

  h3 {
    font-family: var(--font-din);
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.85);
    margin: 0 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.15);

    .h2-sub {
      font-size: 12px;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 300;
      margin-left: 8px;
    }
    .h2-main { display: inline; }
    .tip-bubble {
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
      font-size: 11px;
      letter-spacing: 1px;
      color: rgba(247, 209, 53, 0.75);
      background: rgba(247, 209, 53, 0.08);
      border: 1px solid rgba(247, 209, 53, 0.25);
      padding: 3px 8px;
      border-radius: 999px;
      font-weight: 400;
    }
  }
`

const ItemsListe = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`

const ItemRangee = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  &:last-child { border-bottom: none; }

  .gauche {
    flex: 1;
    min-width: 0;
  }

  .tag {
    display: inline-block;
    margin-right: 8px;
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 10px;
    color: var(--color-brand);
    background: rgba(247, 209, 53, 0.08);
    border: 1px solid rgba(247, 209, 53, 0.25);
    padding: 2px 8px;
    border-radius: 999px;
    vertical-align: middle;
  }

  .nom {
    font-family: var(--font-din);
    color: #ffffff;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.5px;

    .variants {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.55);
      font-weight: 300;
      letter-spacing: 0.5px;
      margin-left: 6px;
    }
    .badge-new, .badge-soft, .badge-ca {
      display: inline-block;
      vertical-align: middle;
      margin-left: 6px;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      letter-spacing: 1px;
    }
    .badge-new { background: var(--color-brand); color: var(--color-dark); }
    .badge-soft { background: rgba(247, 209, 53, 0.18); color: var(--color-brand); }
    .badge-ca { background: rgba(255, 80, 80, 0.18); color: rgba(255, 140, 140, 0.95); }
  }

  .desc {
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    line-height: 1.45;
    margin-top: 3px;
  }

  .format {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    font-style: italic;
    margin-left: 6px;
  }

  .prix {
    color: var(--color-brand);
    font-family: var(--font-din);
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    text-align: right;
    flex-shrink: 0;
    align-self: center;
  }

  .prix-array {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
    align-self: center;

    span {
      color: var(--color-brand);
      font-family: var(--font-din);
      font-size: 13px;
      background: rgba(247, 209, 53, 0.06);
      padding: 3px 7px;
      border-radius: 4px;
      min-width: 38px;
      text-align: center;
    }
    span.empty {
      color: rgba(255, 255, 255, 0.18);
    }
  }
`

const PiedNote = styled.div`
  text-align: center;
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  line-height: 1.6;
  font-style: italic;

  strong { color: var(--color-brand); font-style: normal; font-weight: 500; }
`

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function formaterPrix(p) {
  if (p === null || p === undefined) return null
  // Convertir 9.5 → "9,50 $", 11 → "11,00 $"
  return p.toFixed(2).replace('.', ',') + ' $'
}

function htmlSafe(html) {
  // Le menu_data autorise quelques tags inline (span.variants, badge-*, etc.).
  // On les injecte tels quels via dangerouslySetInnerHTML — contenu maîtrisé,
  // pas d'input utilisateur.
  return { __html: html || '' }
}

// ─────────────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────────────

export default function MenuV2() {
  const pages = menuData.pages || []
  const [active, setActive] = useState(pages[0]?.id || '')
  const refs = useRef({})

  // Scrollspy basique : update active selon section visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibles = entries.filter((e) => e.isIntersecting)
        if (visibles.length > 0) {
          visibles.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          const id = visibles[0].target.getAttribute('data-page-id')
          if (id) setActive(id)
        }
      },
      { rootMargin: '-170px 0px -60% 0px', threshold: 0 },
    )
    Object.values(refs.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <Section>
      <Container>
        <Hero>
          <Eyebrow>Le menu</Eyebrow>
          <Titre>
            Ce qu'on <span className="accent">sert</span>
          </Titre>
          <SousTitre>
            Printemps 2026 · cafés, bouffe, bières, vins, cocktails. Tout est fait
            maison ou par des producteurs d'ici. Les prix incluent les taxes.
          </SousTitre>
        </Hero>

        <NavSticky>
          <div className="scroll">
            {pages.map((p) => (
              <a
                key={p.id}
                href={'#page-' + p.id}
                className={active === p.id ? 'active' : ''}
              >
                {p.title}
              </a>
            ))}
          </div>
        </NavSticky>

        {pages.map((p) => (
          <PageBloc
            key={p.id}
            id={'page-' + p.id}
            ref={(el) => { refs.current[p.id] = el }}
            data-page-id={p.id}
          >
            <PageHeader>
              <h2>{p.title}</h2>
              {p.subtitle && (
                <div className="ss" dangerouslySetInnerHTML={htmlSafe(p.subtitle)} />
              )}
            </PageHeader>

            {(p.sections || []).map((sec, sIdx) => {
              const titre = sec.title
              const items = sec.items || []
              if (items.length === 0 && !titre) return null
              return (
                <SectionInterne key={p.id + '-' + sIdx}>
                  {titre && (
                    <h3 dangerouslySetInnerHTML={htmlSafe(titre)} />
                  )}
                  {items.length > 0 && (
                    <ItemsListe>
                      {items.map((it, iIdx) => {
                        const prix = it.prix
                        const isArray = Array.isArray(prix)
                        return (
                          <ItemRangee key={p.id + '-' + sIdx + '-' + iIdx}>
                            <div className="gauche">
                              <span>
                                {it.tag && <span className="tag">{it.tag}</span>}
                                <span className="nom" dangerouslySetInnerHTML={htmlSafe(it.name || '')} />
                                {it.format && <span className="format">· {it.format}</span>}
                              </span>
                              {it.desc && <div className="desc">{it.desc}</div>}
                            </div>
                            {prix !== undefined && prix !== null && (
                              isArray ? (
                                <div className="prix-array">
                                  {prix.map((v, vIdx) => (
                                    <span key={vIdx} className={v === null ? 'empty' : ''}>
                                      {v === null ? '—' : formaterPrix(v)}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <div className="prix">{formaterPrix(prix)}</div>
                              )
                            )}
                          </ItemRangee>
                        )
                      })}
                    </ItemsListe>
                  )}
                </SectionInterne>
              )
            })}
          </PageBloc>
        ))}

        <PiedNote>
          Menu mis à jour <strong>printemps 2026</strong> · les prix peuvent évoluer
          selon les producteurs et la saison.
          <br />
          La version papier complète et le menu Koomi à jour sont à la caisse.
        </PiedNote>
      </Container>
    </Section>
  )
}
