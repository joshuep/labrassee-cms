'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

/** @typedef {import('../../lib/surnosmurs-data').ArtisteMurs} ArtisteMurs */

const Section = styled.section`
  width: 100%;
  background: var(--color-dark);
  min-height: 100vh;
`

// ─────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────

/**
 * Stacking order du hero (de bas en haut) :
 *   0. HeroBg : image floutée plein cadre (l'œuvre vedette)
 *   1. ::after : gradient sombre overlay (pour la lisibilité du texte)
 *   2. HeroContent : eyebrow + titre + nom + bandeau dates
 *
 * `isolation: isolate` crée un nouveau stacking context propre — sans ça,
 * le z-index négatif de HeroBg pouvait le faire passer DERRIÈRE le body
 * et disparaître complètement (bug remonté par Cédric 2026-05-18).
 */
const Hero = styled(motion.section)`
  position: relative;
  width: 100%;
  min-height: 70vh;
  display: flex;
  align-items: flex-end;
  padding: 80px 24px 60px;
  overflow: hidden;
  isolation: isolate;
  background: var(--color-dark);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(16, 15, 9, 0.35) 0%,
      rgba(16, 15, 9, 0.55) 60%,
      rgba(16, 15, 9, 0.92) 100%
    );
    z-index: 1;
    pointer-events: none;
  }
`

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background-image: ${(p) => p.$src ? `url('${p.$src}')` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  filter: blur(2px) brightness(0.7);
  transform: scale(1.05);
`

const HeroContent = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`

const Eyebrow = styled.div`
  color: rgba(200, 240, 250, 1);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 18px;

  .puce {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: rgba(99, 200, 220, 1);
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
    box-shadow: 0 0 12px rgba(99, 200, 220, 0.6);
  }

  @media (max-width: 640px) {
    font-size: 12px;
    letter-spacing: 2px;
  }

  @media (max-width: 380px) {
    font-size: 11px;
    letter-spacing: 1.5px;
    /* À cette taille, le séparateur · prend trop de place — wrap propre */
    line-height: 1.4;
  }
`

const TitreExpo = styled.h1`
  font-family: var(--font-din);
  font-size: clamp(48px, 9vw, 120px);
  font-weight: 200;
  letter-spacing: -2px;
  color: #ffffff;
  margin: 0 0 12px;
  line-height: 0.95;
`

const NomArtiste = styled.div`
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: clamp(14px, 1.6vw, 18px);
  color: var(--color-brand);
  margin-bottom: 30px;

  .par { color: rgba(255, 255, 255, 0.45); margin-right: 8px; }
`

const DatesBande = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 20px 32px;
  padding: 16px 22px;
  background: rgba(16, 15, 9, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 200, 220, 0.3);
  border-radius: 14px;

  .date-bloc {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .lbl {
      font-family: var(--font-din);
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 10px;
      color: rgba(180, 230, 240, 0.7);
    }
    .val {
      font-family: var(--font-din);
      color: #ffffff;
      font-size: 15px;
      font-weight: 300;
    }
    .val.surlign {
      color: var(--color-brand);
    }
  }
`

// ─────────────────────────────────────────────────────────────────────
// BIO
// ─────────────────────────────────────────────────────────────────────

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px 100px;
`

const BioBloc = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 40px;
  margin-bottom: 60px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`

const BioTexte = styled.div`
  color: rgba(255, 255, 255, 0.88);
  font-size: 17px;
  line-height: 1.75;
  white-space: pre-line;

  &::first-letter {
    font-family: var(--font-din);
    font-size: 56px;
    font-weight: 200;
    line-height: 1;
    float: left;
    margin: 4px 12px 0 0;
    color: var(--color-brand);
  }
`

const Asides = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Aside = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(247, 209, 53, 0.08);
    border-color: rgba(247, 209, 53, 0.45);
    transform: translateX(4px);
  }

  .icone {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 999px;
    background: rgba(247, 209, 53, 0.12);
    color: var(--color-brand);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .corps {
    flex: 1;
    min-width: 0;
  }

  .label {
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 10px;
    color: rgba(180, 230, 240, 0.75);
  }

  .val {
    color: #ffffff;
    font-size: 14px;
    word-break: break-word;
  }
`

// ─────────────────────────────────────────────────────────────────────
// GALERIE
// ─────────────────────────────────────────────────────────────────────

const GalerieTitre = styled.div`
  text-align: center;
  margin-bottom: 30px;

  .eyebrow {
    color: var(--color-brand);
    font-family: var(--font-din);
    text-transform: uppercase;
    letter-spacing: 5px;
    font-size: 12px;
    margin-bottom: 10px;
  }

  h2 {
    font-family: var(--font-din);
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 200;
    color: #ffffff;
    margin: 0;
  }

  .count {
    color: rgba(255, 255, 255, 0.55);
    font-size: 14px;
    margin-top: 8px;
    font-style: italic;
  }
`

const Galerie = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`

const Vignette = styled.button`
  appearance: none;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: zoom-in;
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(247, 209, 53, 0.15);
  }
  &:hover img {
    transform: scale(1.06);
  }
`

const LightboxBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.94);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const LightboxImg = styled.img`
  max-width: 100%;
  max-height: 95vh;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
`

const LightboxFermeBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
  width: 42px;
  height: 42px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    background: rgba(247, 209, 53, 0.2);
    color: var(--color-brand);
    border-color: var(--color-brand);
  }
`

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  ${(p) => p.$side === 'left' ? 'left: 18px;' : 'right: 18px;'}
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
  width: 52px;
  height: 52px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    background: rgba(247, 209, 53, 0.18);
    color: var(--color-brand);
    border-color: var(--color-brand);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
`

const LightboxCompteur = styled.div`
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-din);
  letter-spacing: 3px;
  text-transform: uppercase;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 999px;
  backdrop-filter: blur(8px);
`

const PiedAchat = styled.div`
  margin-top: 60px;
  padding: 30px;
  background: rgba(247, 209, 53, 0.06);
  border: 1px solid rgba(247, 209, 53, 0.25);
  border-radius: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.7;

  strong { color: var(--color-brand); font-weight: 500; }

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

    &:hover { transform: translateY(-2px); }
  }
`

const Vide = styled.div`
  max-width: 720px;
  margin: 80px auto;
  padding: 50px 30px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  font-size: 15px;
  line-height: 1.7;

  h2 {
    color: var(--color-brand);
    font-family: var(--font-din);
    font-weight: 300;
    margin: 0 0 14px;
    font-size: 26px;
    text-transform: uppercase;
    letter-spacing: 3px;
  }
`

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const MOIS = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

function formaterDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${JOURS[dt.getDay()]} ${d} ${MOIS[m - 1]} ${y}`
}

function normaliserInsta(input) {
  if (!input) return null
  const v = input.trim()
  if (v.startsWith('http')) return v
  const handle = v.replace(/^@/, '')
  return `https://instagram.com/${handle}`
}

// ─────────────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────────────

/**
 * @param {{
 *   artiste: ArtisteMurs | null
 *   photosUrls?: string[]
 *   portraitUrl?: string | null
 * }} props
 */
export default function ExpoActuelle({ artiste, photosUrls = [], portraitUrl = null }) {
  const [lightbox, setLightbox] = useState(null) // index ou null

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      else if (e.key === 'ArrowRight') setLightbox((i) => i < photosUrls.length - 1 ? i + 1 : i)
      else if (e.key === 'ArrowLeft') setLightbox((i) => i > 0 ? i - 1 : i)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, photosUrls.length])

  if (!artiste) {
    return (
      <Section>
        <Vide>
          <h2>Entre deux expos</h2>
          <p>La prochaine artiste accroche bientôt — reviens jeter un œil dans quelques jours.</p>
          <p style={{ marginTop: 14 }}>
            Tu veux exposer chez nous ? <a href="/proposer/expo" style={{ color: 'var(--color-brand)', textDecoration: 'underline' }}>Vois nos conditions</a>.
          </p>
        </Vide>
      </Section>
    )
  }

  const titre = artiste.titre_expo || 'Sans titre'
  const nom = artiste.nom_artiste || ''
  const heroBg = photosUrls[0] || portraitUrl || null
  const instaUrl = normaliserInsta(artiste.instagram)

  return (
    <Section>
      <Hero
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeroBg $src={heroBg} />
        <HeroContent>
          <Eyebrow>
            <span className="puce" />
            L'expo en cours · Sur nos murs
          </Eyebrow>
          <TitreExpo>{titre}</TitreExpo>
          <NomArtiste>
            <span className="par">par</span> {nom}
          </NomArtiste>
          <DatesBande>
            {artiste.date_install && (
              <div className="date-bloc">
                <span className="lbl">Accrochage</span>
                <span className="val">{formaterDate(artiste.date_install)}</span>
              </div>
            )}
            {artiste.date_vernissage && (
              <div className="date-bloc">
                <span className="lbl">Vernissage · 5 à 7</span>
                <span className="val surlign">{formaterDate(artiste.date_vernissage)}</span>
              </div>
            )}
            {artiste.date_decrochage && (
              <div className="date-bloc">
                <span className="lbl">Jusqu'au</span>
                <span className="val">{formaterDate(artiste.date_decrochage)}</span>
              </div>
            )}
          </DatesBande>
        </HeroContent>
      </Hero>

      <Container>
        <BioBloc>
          {artiste.bio && <BioTexte>{artiste.bio}</BioTexte>}
          <Asides>
            {instaUrl && (
              <Aside href={instaUrl} target="_blank" rel="noopener noreferrer">
                <span className="icone"><i className="fab fa-instagram" /></span>
                <div className="corps">
                  <div className="label">Instagram</div>
                  <div className="val">{artiste.instagram}</div>
                </div>
              </Aside>
            )}
            {artiste.site_web && (
              <Aside href={artiste.site_web} target="_blank" rel="noopener noreferrer">
                <span className="icone"><i className="fas fa-link" /></span>
                <div className="corps">
                  <div className="label">Site web</div>
                  <div className="val">{artiste.site_web.replace(/^https?:\/\//, '')}</div>
                </div>
              </Aside>
            )}
            {artiste.facebook && (
              <Aside href={artiste.facebook} target="_blank" rel="noopener noreferrer">
                <span className="icone"><i className="fab fa-facebook" /></span>
                <div className="corps">
                  <div className="label">Facebook</div>
                  <div className="val">page artiste</div>
                </div>
              </Aside>
            )}
            {artiste.courriel && (
              <Aside href={`mailto:${artiste.courriel}?subject=${encodeURIComponent('Une œuvre de « ' + titre + ' » m\'intéresse')}`}>
                <span className="icone"><i className="fas fa-envelope" /></span>
                <div className="corps">
                  <div className="label">Écrire à l'artiste</div>
                  <div className="val">{artiste.courriel}</div>
                </div>
              </Aside>
            )}
          </Asides>
        </BioBloc>

        {photosUrls.length > 0 && (
          <>
            <GalerieTitre>
              <div className="eyebrow">Les œuvres</div>
              <h2>{photosUrls.length} pièce{photosUrls.length > 1 ? 's' : ''} à voir en vrai</h2>
              <div className="count">Clique pour zoomer · flèches ← → pour naviguer</div>
            </GalerieTitre>
            <Galerie>
              {photosUrls.map((url, i) => (
                <Vignette
                  key={url}
                  type="button"
                  onClick={() => setLightbox(i)}
                  aria-label={`Œuvre ${i + 1} de ${photosUrls.length}`}
                >
                  <img src={url} alt={`Œuvre ${i + 1} de ${nom}`} loading="lazy" decoding="async" />
                </Vignette>
              ))}
            </Galerie>
          </>
        )}

        <PiedAchat>
          Une œuvre te parle ? Les ventes se font <strong>en direct</strong> entre toi et l'artiste —
          on fait le pont quand tu viens au café (ou tu lui écris directement via les liens ci-dessus).
          <br />
          <a
            href="/proposer/expo"
            className="cta cursor-event"
          >
            Toi aussi, expose sur nos murs →
          </a>
        </PiedAchat>
      </Container>

      {lightbox !== null && photosUrls[lightbox] && (
        <LightboxBackdrop onClick={() => setLightbox(null)}>
          <LightboxFermeBtn
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightbox(null) }}
            aria-label="Fermer"
          >
            ✕
          </LightboxFermeBtn>
          <LightboxNav
            type="button"
            $side="left"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => i > 0 ? i - 1 : i) }}
            disabled={lightbox === 0}
            aria-label="Œuvre précédente"
          >
            <i className="fas fa-chevron-left" />
          </LightboxNav>
          <LightboxImg
            src={photosUrls[lightbox]}
            alt={`Œuvre ${lightbox + 1} de ${nom}`}
            onClick={(e) => e.stopPropagation()}
          />
          <LightboxNav
            type="button"
            $side="right"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => i < photosUrls.length - 1 ? i + 1 : i) }}
            disabled={lightbox === photosUrls.length - 1}
            aria-label="Œuvre suivante"
          >
            <i className="fas fa-chevron-right" />
          </LightboxNav>
          <LightboxCompteur>
            {lightbox + 1} / {photosUrls.length}
          </LightboxCompteur>
        </LightboxBackdrop>
      )}
    </Section>
  )
}
