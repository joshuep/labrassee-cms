'use client'

import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Keyboard } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

// Les 8 pages du menu V2 (printemps 2026) — copiées dans /public/images/menu-v2/
// Chaque entrée : { id, label (chip nav), titre (overlay coin), bg (couleur teinte fond) }
const PAGES = [
  { id: 'nouveau',          label: 'Nouveau',        titre: 'Nouveautés du moment', bg: '#e8895e' },
  { id: 'boissons_chaudes', label: 'Boissons chaudes', titre: 'Cafés · thés · lattes', bg: '#c49860' },
  { id: 'boissons_froides', label: 'Boissons froides', titre: 'Rafraîchissements · saisonniers', bg: '#88a8c8' },
  { id: 'sale',             label: 'Côté salé',      titre: 'Plats · grilled cheese · quiches · nachos', bg: '#a89968' },
  { id: 'sucre',            label: 'Côté sucré',     titre: 'Scones · muffins · desserts maison', bg: '#d4a574' },
  { id: 'biere_vin',        label: 'Bières & vin',   titre: 'Locaux · rotation régulière', bg: '#7a8c5a' },
  { id: 'cocktails',        label: 'Cocktails',      titre: '2 oz spiritueux · signatures', bg: '#9a6b8c' },
  { id: 'qui_on_est',       label: 'Qui on est',     titre: 'L\'esprit La Brassée', bg: '#5a7a8c' },
]

const Section = styled.section`
  width: 100vw;
  background: var(--color-dark);
  padding: 40px 0 80px;
  overflow: hidden;
  position: relative;
`

const Hero = styled.div`
  text-align: center;
  margin-bottom: 32px;
  padding: 0 24px;
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
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 200;
  letter-spacing: -1px;
  color: #ffffff;
  margin: 0 0 12px;
  line-height: 1;

  .accent { color: var(--color-brand); }
`

const Aide = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
`

const SwiperWrap = styled.div`
  position: relative;
  width: 100%;
  margin-top: 30px;

  .swiper {
    overflow: visible !important;
    padding: 20px 0 30px;
  }

  .swiper-slide {
    transition: transform 0.45s ease, opacity 0.45s ease, filter 0.45s ease;
    transform: scale(0.85);
    opacity: 0.42;
    filter: brightness(0.7) saturate(0.85);
  }

  .swiper-slide-active {
    transform: scale(1);
    opacity: 1;
    filter: none;
    z-index: 2;
  }

  .swiper-slide-prev,
  .swiper-slide-next {
    opacity: 0.55;
    transform: scale(0.88);
    filter: brightness(0.78);
  }
`

const PageCard = styled.div`
  position: relative;
  aspect-ratio: 2200 / 3400;
  max-height: 78vh;
  background: ${(p) => p.$bg || '#100f09'};
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(247, 209, 53, 0.15);
  cursor: grab;

  &:active { cursor: grabbing; }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`

const NavRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 26px;
  padding: 0 24px;
`

const NavBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(247, 209, 53, 0.4);
  background: rgba(247, 209, 53, 0.1);
  color: var(--color-brand);
  width: 52px;
  height: 52px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(247, 209, 53, 0.22);
    border-color: var(--color-brand);
    transform: scale(1.06);
  }

  &.swiper-button-disabled {
    opacity: 0.25;
    cursor: not-allowed;
    transform: none;
  }
  &.swiper-button-disabled:hover {
    background: rgba(247, 209, 53, 0.1);
    border-color: rgba(247, 209, 53, 0.4);
    transform: none;
  }
`

const Compteur = styled.div`
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 13px;
  font-weight: 500;
  min-width: 90px;
  text-align: center;

  .courant { font-size: 22px; }
  .sep { opacity: 0.4; margin: 0 4px; }
  .total { opacity: 0.5; font-size: 14px; }
  .label-page {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    font-size: 11px;
    letter-spacing: 2px;
    margin-top: 4px;
    text-transform: uppercase;
  }
`

const ThumbsRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 30px auto 0;
  max-width: 900px;
  padding: 0 24px;
`

const Thumb = styled.button`
  appearance: none;
  border: 1px solid ${(p) => (p.$active ? 'var(--color-brand)' : 'rgba(255,255,255,0.15)')};
  background: ${(p) => (p.$active ? 'rgba(247, 209, 53, 0.15)' : 'rgba(255,255,255,0.04)')};
  color: ${(p) => (p.$active ? 'var(--color-brand)' : 'rgba(255,255,255,0.7)')};
  font-family: var(--font-din);
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(247, 209, 53, 0.12);
    border-color: var(--color-brand);
    color: var(--color-brand);
  }
`

const Pied = styled.div`
  text-align: center;
  margin-top: 40px;
  padding: 0 24px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  line-height: 1.6;
  font-style: italic;

  strong { color: var(--color-brand); font-style: normal; font-weight: 500; }

  a {
    color: var(--color-brand);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
`

export default function MenuFlipbook() {
  const [active, setActive] = useState(0)
  const swiperRef = useRef(null)

  const goTo = (idx) => {
    if (swiperRef.current) swiperRef.current.slideTo(idx)
  }

  const pageCourante = PAGES[active]

  return (
    <Section>
      <Hero>
        <Eyebrow>Le menu</Eyebrow>
        <Titre>
          Feuillette <span className="accent">tout ça</span>
        </Titre>
        <Aide>Drag · flèches · clavier ← → · ou clique une page en bas</Aide>
      </Hero>

      <SwiperWrap>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Swiper
            modules={[Navigation, Keyboard]}
            centeredSlides
            slidesPerView={1.2}
            spaceBetween={20}
            keyboard={{ enabled: true }}
            grabCursor
            onSwiper={(s) => { swiperRef.current = s }}
            onSlideChange={(s) => setActive(s.activeIndex)}
            navigation={{ prevEl: '.flip-prev', nextEl: '.flip-next' }}
            breakpoints={{
              480: { slidesPerView: 1.4, spaceBetween: 24 },
              768: { slidesPerView: 1.8, spaceBetween: 28 },
              1024: { slidesPerView: 2.4, spaceBetween: 32 },
              1440: { slidesPerView: 2.8, spaceBetween: 36 },
            }}
          >
            {PAGES.map((p) => (
              <SwiperSlide key={p.id}>
                <PageCard $bg={p.bg}>
                  <img
                    src={`/images/menu-v2/${p.id}.png`}
                    alt={`Menu La Brassée — ${p.titre}`}
                    loading="lazy"
                    decoding="async"
                  />
                </PageCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <NavRow>
          <NavBtn
            type="button"
            className="flip-prev"
            aria-label="Page précédente"
          >
            <i className="fas fa-chevron-left" />
          </NavBtn>
          <Compteur>
            <div>
              <span className="courant">{active + 1}</span>
              <span className="sep">/</span>
              <span className="total">{PAGES.length}</span>
            </div>
            <span className="label-page">{pageCourante.label}</span>
          </Compteur>
          <NavBtn
            type="button"
            className="flip-next"
            aria-label="Page suivante"
          >
            <i className="fas fa-chevron-right" />
          </NavBtn>
        </NavRow>

        <ThumbsRow>
          {PAGES.map((p, i) => (
            <Thumb
              key={p.id}
              $active={i === active}
              onClick={() => goTo(i)}
            >
              {p.label}
            </Thumb>
          ))}
        </ThumbsRow>
      </SwiperWrap>

      <Pied>
        Menu mis à jour <strong>printemps 2026</strong> · les prix incluent les taxes
        · la version Koomi à jour est à la caisse.
        <br />
        Tu peux aussi <a href="/menu-complet.pdf" target="_blank" rel="noopener noreferrer">télécharger le PDF complet</a> à imprimer.
      </Pied>
    </Section>
  )
}
