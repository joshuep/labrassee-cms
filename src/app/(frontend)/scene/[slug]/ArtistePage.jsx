'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

/**
 * @typedef {import('../../../../frontend/lib/surlascene-artiste').FicheArtiste} FicheArtiste
 * @typedef {import('../../../../frontend/lib/surlascene-artiste').ConcertPublic} ConcertPublic
 */

// ─────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────

const JOURS_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const MOIS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

/** Formate 'YYYY-MM-DD' → 'vendredi 30 mai 2025'. */
function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  return `${JOURS_FR[d.getDay()]} ${d.getDate()} ${MOIS_FR[d.getMonth()]} ${d.getFullYear()}`
}

/** Formate '19:30:00' → '19h30'. */
function formatHeure(heure) {
  if (!heure) return null
  return heure.slice(0, 5).replace(':', 'h')
}

/** S'assure qu'une URL a bien un protocole. */
function safeUrl(url) {
  if (!url) return null
  return url.startsWith('http') ? url : 'https://' + url
}

// ─────────────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ─────────────────────────────────────────────────────────────────────

const Page = styled.div`
  width: 100%;
  background: #100f09;
  color: #fff;
  min-height: 100vh;
`

/* ── HERO ── */

const Hero = styled(motion.section)`
  position: relative;
  width: 100%;
  min-height: 70vh;
  display: flex;
  align-items: flex-end;
  padding: 100px 24px 60px;
  overflow: hidden;
  isolation: isolate;
  background: #100f09;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(16, 15, 9, 0.2) 0%,
      rgba(16, 15, 9, 0.55) 55%,
      rgba(16, 15, 9, 0.95) 100%
    );
    z-index: 1;
    pointer-events: none;
  }
`

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background-image: ${(p) => (p.$src ? `url('${p.$src}')` : 'none')};
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  z-index: 0;
  filter: blur(1px) brightness(0.65);
  transform: scale(1.04);
`

const HeroContent = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`

const Eyebrow = styled.div`
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #f7d135;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    font-size: 11px;
    letter-spacing: 2px;
  }
`

const NomArtiste = styled.h1`
  font-family: var(--font-din);
  font-size: clamp(42px, 8vw, 110px);
  font-weight: 200;
  letter-spacing: -2px;
  color: #ffffff;
  margin: 0 0 16px;
  line-height: 0.95;

  @media (max-width: 640px) {
    letter-spacing: -1px;
  }
`

const Genre = styled.div`
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: clamp(12px, 1.4vw, 15px);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
`

const MetaBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(247, 209, 53, 0.12);
  border: 1px solid rgba(247, 209, 53, 0.3);
  border-radius: 999px;
  font-family: var(--font-din);
  font-size: 12px;
  color: #f7d135;
  text-transform: uppercase;
  letter-spacing: 1px;
`

/* ── CORPS ── */

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px 100px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 60px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const MainCol = styled.div`display: flex; flex-direction: column; gap: 60px;`

const SideCol = styled.div`display: flex; flex-direction: column; gap: 40px;`

/* ── BIO ── */

const SectionTitle = styled.h2`
  font-family: var(--font-din);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 20px;
`

const BioText = styled.p`
  font-family: var(--font-lato, 'Lato', sans-serif);
  font-size: 16px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  white-space: pre-line;
`

/* ── GALERIE ── */

const Galerie = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
`

const GalerieImg = styled(motion.img)`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  background: #1a1810;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }
`

/* ── LIGHTBOX ── */

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  cursor: zoom-out;
`

const LightboxImg = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
`

/* ── LIENS SOCIAUX ── */

const LiensBloc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const LienItem = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  text-decoration: none;
  font-family: var(--font-din);
  font-size: 14px;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    background: rgba(247, 209, 53, 0.08);
    border-color: rgba(247, 209, 53, 0.4);
    color: #f7d135;
  }

  .icon { font-size: 18px; opacity: 0.8; flex-shrink: 0; }
  .label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`

/* ── CONCERTS ── */

const ConcertListe = styled.div`display: flex; flex-direction: column; gap: 12px;`

const ConcertCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-decoration: none;
  color: #fff;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    background: rgba(247, 209, 53, 0.07);
    border-color: rgba(247, 209, 53, 0.35);
  }

  &.passe {
    opacity: 0.55;
    &:hover { opacity: 0.75; }
  }
`

const ConcertDate = styled.div`
  font-family: var(--font-din);
  font-size: 13px;
  font-weight: 600;
  color: #f7d135;
  text-transform: capitalize;
`

const ConcertTitre = styled.div`
  font-family: var(--font-din);
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
`

const ConcertHeure = styled.div`
  font-family: var(--font-din);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const Vide = styled.p`
  font-family: var(--font-din);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
`

/* ── RETOUR ── */

const RetourLien = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-din);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  margin-bottom: 40px;
  transition: color 0.2s;

  &:hover { color: #f7d135; }
`

// ─────────────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────────────

/**
 * Fiche publique d'un artiste Surlascène.
 *
 * @param {object} props
 * @param {FicheArtiste} props.fiche
 */
const ArtistePage = ({ fiche }) => {
  const { artiste, prochaines, passees, photoUrl, galerieUrls } = fiche
  const [lightboxSrc, setLightboxSrc] = useState(null)

  const liens = [
    artiste.site_web && { href: safeUrl(artiste.site_web), icon: 'fas fa-globe', label: 'Site web' },
    artiste.instagram && {
      href: safeUrl(
        artiste.instagram.startsWith('http') ? artiste.instagram : 'https://instagram.com/' + artiste.instagram.replace(/^@/, ''),
      ),
      icon: 'fab fa-instagram',
      label: 'Instagram',
    },
    artiste.spotify_url && { href: safeUrl(artiste.spotify_url), icon: 'fab fa-spotify', label: 'Spotify' },
    artiste.bandcamp_url && { href: safeUrl(artiste.bandcamp_url), icon: 'fab fa-bandcamp', label: 'Bandcamp' },
    artiste.youtube_url && { href: safeUrl(artiste.youtube_url), icon: 'fab fa-youtube', label: 'YouTube' },
    artiste.tiktok && {
      href: safeUrl(
        artiste.tiktok.startsWith('http') ? artiste.tiktok : 'https://tiktok.com/@' + artiste.tiktok.replace(/^@/, ''),
      ),
      icon: 'fab fa-tiktok',
      label: 'TikTok',
    },
  ].filter(Boolean)

  return (
    <Page>
      {/* HERO */}
      <Hero initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        {photoUrl && <HeroBg $src={photoUrl} />}
        <HeroContent>
          <Eyebrow>Sur la scène de La Brassée</Eyebrow>
          <NomArtiste>{artiste.nom_artiste}</NomArtiste>
          {artiste.genre && <Genre>{artiste.genre}</Genre>}
          <MetaBadges>
            {artiste.nb_personnes_scene != null && (
              <Badge>
                <i className="fas fa-users" />
                {artiste.nb_personnes_scene === 1 ? 'Solo' : `${artiste.nb_personnes_scene} musicien·nes`}
              </Badge>
            )}
            {artiste.duree_set_minutes != null && (
              <Badge>
                <i className="fas fa-clock" />
                {artiste.duree_set_minutes} min
              </Badge>
            )}
          </MetaBadges>
        </HeroContent>
      </Hero>

      {/* CORPS */}
      <Container>
        <RetourLien href="/scene">← Retour à l&apos;agenda</RetourLien>

        <Grid>
          <MainCol>
            {/* BIO */}
            {artiste.bio && (
              <section>
                <SectionTitle>À propos</SectionTitle>
                <BioText>{artiste.bio}</BioText>
              </section>
            )}

            {/* GALERIE */}
            {galerieUrls.length > 0 && (
              <section>
                <SectionTitle>Galerie</SectionTitle>
                <Galerie>
                  {galerieUrls.map((url, i) => (
                    <GalerieImg
                      key={i}
                      src={url}
                      alt={`Photo ${i + 1} — ${artiste.nom_artiste}`}
                      loading="lazy"
                      decoding="async"
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setLightboxSrc(url)}
                    />
                  ))}
                </Galerie>
              </section>
            )}

            {/* PROCHAINES DATES */}
            <section>
              <SectionTitle>Prochaines dates à La Brassée</SectionTitle>
              {prochaines.length === 0 ? (
                <Vide>Aucune date à venir pour l&apos;instant.</Vide>
              ) : (
                <ConcertListe>
                  {prochaines.map((c) => (
                    <ConcertCard
                      key={c.id}
                      href={c.fb_event_url ? safeUrl(c.fb_event_url) : '/scene#agenda'}
                      target={c.fb_event_url ? '_blank' : undefined}
                      rel={c.fb_event_url ? 'noopener noreferrer' : undefined}
                    >
                      <ConcertDate>{formatDate(c.date_show)}</ConcertDate>
                      {c.titre_show && <ConcertTitre>{c.titre_show}</ConcertTitre>}
                      {c.heure_debut && (
                        <ConcertHeure>{formatHeure(c.heure_debut)}</ConcertHeure>
                      )}
                    </ConcertCard>
                  ))}
                </ConcertListe>
              )}
            </section>

            {/* DATES PASSÉES */}
            {passees.length > 0 && (
              <section>
                <SectionTitle>Dates passées</SectionTitle>
                <ConcertListe>
                  {passees.map((c) => (
                    <ConcertCard
                      key={c.id}
                      as="div"
                      className="passe"
                    >
                      <ConcertDate>{formatDate(c.date_show)}</ConcertDate>
                      {c.titre_show && <ConcertTitre>{c.titre_show}</ConcertTitre>}
                      {c.heure_debut && (
                        <ConcertHeure>{formatHeure(c.heure_debut)}</ConcertHeure>
                      )}
                    </ConcertCard>
                  ))}
                </ConcertListe>
              </section>
            )}
          </MainCol>

          {/* SIDEBAR */}
          <SideCol>
            {/* Photo portrait dans la sidebar si pas de galerie */}
            {photoUrl && galerieUrls.length === 0 && (
              <img
                src={photoUrl}
                alt={artiste.nom_artiste}
                style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', aspectRatio: '3/4' }}
              />
            )}

            {/* Liens */}
            {liens.length > 0 && (
              <div>
                <SectionTitle>Retrouver l&apos;artiste</SectionTitle>
                <LiensBloc>
                  {liens.map((lien) => (
                    <LienItem key={lien.href} href={lien.href} target="_blank" rel="noopener noreferrer">
                      <i className={`${lien.icon} icon`} />
                      <span className="label">{lien.label}</span>
                      <i className="fas fa-external-link-alt" style={{ fontSize: '11px', opacity: 0.4 }} />
                    </LienItem>
                  ))}
                </LiensBloc>
              </div>
            )}

            {/* Appel à l'action — réserver */}
            <div
              style={{
                padding: '20px',
                background: 'rgba(247, 209, 53, 0.08)',
                border: '1px solid rgba(247, 209, 53, 0.25)',
                borderRadius: '14px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-din)',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '12px',
                  lineHeight: 1.5,
                }}
              >
                Tu veux te produire à La Brassée ? Les artistes locaux sont les bienvenus. Entrée libre, chapeau et 10 % de la soirée.
              </p>
              <a
                href="/proposer"
                style={{
                  display: 'inline-block',
                  padding: '10px 18px',
                  background: '#f7d135',
                  color: '#100f09',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-din)',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Proposer mon projet
              </a>
            </div>
          </SideCol>
        </Grid>
      </Container>

      {/* LIGHTBOX */}
      {lightboxSrc && (
        <LightboxOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightboxSrc(null)}
        >
          <LightboxImg src={lightboxSrc} alt="Photo agrandie" onClick={(e) => e.stopPropagation()} />
        </LightboxOverlay>
      )}
    </Page>
  )
}

export default ArtistePage
