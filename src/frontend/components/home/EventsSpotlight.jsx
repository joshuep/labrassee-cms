'use client'

import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Keyboard } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

import EventCard from './EventCard'

/** @typedef {import('../../lib/payload-data').FrontendEvent} FrontendEvent */

const Section = styled.section`
  width: 100vw;
  padding: 40px 0 70px;
  background: var(--color-dark);
  position: relative;
  overflow: hidden;
`

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
`

const Eyebrow = styled.div`
  text-align: center;
  color: rgba(205, 196, 157, 0.6);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 5px;
  font-size: 12px;
  margin-bottom: 12px;
`

const Titre = styled.h2`
  font-family: var(--font-din);
  font-size: clamp(26px, 3.4vw, 40px);
  font-weight: 200;
  letter-spacing: -1px;
  color: #ffffff;
  text-align: center;
  margin: 0 0 38px;
  line-height: 1;

  .accent {
    color: var(--color-brand);
  }
`

const SwiperWrap = styled.div`
  position: relative;
  width: 100%;

  .swiper {
    overflow: visible !important;
    padding: 20px 0 30px;
  }

  /* Toutes les slides : état "voisin" par défaut */
  .swiper-slide {
    transition: transform 0.45s ease, opacity 0.45s ease, filter 0.45s ease;
    transform: scale(0.82);
    opacity: 0.4;
    filter: brightness(0.65) saturate(0.85);
    transform-origin: center center;
    pointer-events: auto;
  }

  /* Slide focus : un peu plus grosse, opacité 1 */
  .swiper-slide-active {
    transform: scale(1.04);
    opacity: 1;
    filter: none;
    z-index: 2;
  }

  /* Cards voisines immédiates (prev/next) : à mi-chemin */
  .swiper-slide-prev,
  .swiper-slide-next {
    opacity: 0.55;
    transform: scale(0.88);
    filter: brightness(0.78);
  }
`

const SlideInner = styled.div`
  width: 100%;
  aspect-ratio: 8.5 / 11;
  cursor: pointer;
`

const NavRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  margin-top: 28px;

  @media (max-width: 768px) {
    margin-top: 18px;
    gap: 16px;
  }
`

const NavBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(247, 209, 53, 0.35);
  background: rgba(247, 209, 53, 0.08);
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
    background: rgba(247, 209, 53, 0.18);
    border-color: var(--color-brand);
    transform: scale(1.06);
  }

  &.swiper-button-disabled {
    opacity: 0.25;
    cursor: not-allowed;
    transform: none;
  }

  &.swiper-button-disabled:hover {
    background: rgba(247, 209, 53, 0.08);
    border-color: rgba(247, 209, 53, 0.35);
  }
`

const Compteur = styled.div`
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
  font-weight: 400;
  min-width: 70px;
  text-align: center;
  opacity: 0.85;

  .total {
    opacity: 0.5;
  }
`

const Vide = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 15px;
  line-height: 1.7;

  strong { color: var(--color-brand); }
`

const Aide = styled.p`
  margin: 36px auto 0;
  max-width: 640px;
  text-align: center;
  color: #ffffff;
  font-family: var(--font-din);
  font-size: clamp(16px, 1.6vw, 20px);
  line-height: 1.4;
  font-weight: 300;
  letter-spacing: 0.2px;

  .emo {
    font-size: 1.3em;
    vertical-align: middle;
    margin: 0 4px;
  }

  .clic {
    color: var(--color-brand);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.9em;
  }

  .chaise {
    color: var(--color-brand);
    font-style: italic;
    font-weight: 500;
  }

  @media (max-width: 480px) {
    margin-top: 24px;
    font-size: 15px;
  }
`

const MoreLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding: 14px 28px;
  background: transparent;
  border: 1px solid rgba(247, 209, 53, 0.4);
  border-radius: 999px;
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
  text-decoration: none;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(247, 209, 53, 0.12);
    border-color: var(--color-brand);
    transform: translateY(-2px);
  }

  i {
    font-size: 11px;
    transition: transform 0.25s ease;
  }

  &:hover i {
    transform: translateX(4px);
  }
`

const MoreWrap = styled.div`
  text-align: center;
`

/**
 * @param {{ events?: FrontendEvent[], initialIndex?: number }} props
 */
export default function EventsSpotlight({ events = [], initialIndex = 0 }) {
  const swiperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  if (!events || events.length === 0) {
    return (
      <Section id="prochains">
        <Container>
          <Eyebrow>À venir</Eyebrow>
          <Titre>
            Les prochains <span className="accent">événements</span>
          </Titre>
          <Vide>
            Aucun événement prévu pour le moment.<br />
            Consulte <strong>la programmation Sur la scène</strong>
            <br />ou jette un œil sur la page Facebook de La Brassée.
          </Vide>
        </Container>
      </Section>
    )
  }

  return (
    <Section id="prochains">
      <Container>
        <Eyebrow>À venir</Eyebrow>
        <Titre>
          Les prochains <span className="accent">événements</span>
        </Titre>

        <SwiperWrap>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Swiper
              modules={[Navigation, Keyboard]}
              centeredSlides
              slidesPerView={2}
              spaceBetween={14}
              initialSlide={initialIndex}
              keyboard={{ enabled: true }}
              grabCursor
              onSwiper={(s) => { swiperRef.current = s }}
              onSlideChange={(s) => setActiveIndex(s.activeIndex)}
              navigation={{
                prevEl: '.spotlight-prev',
                nextEl: '.spotlight-next',
              }}
              breakpoints={{
                480: { slidesPerView: 2.4, spaceBetween: 16 },
                768: { slidesPerView: 3.4, spaceBetween: 18 },
                1024: { slidesPerView: 4.4, spaceBetween: 20 },
                1440: { slidesPerView: 5.4, spaceBetween: 22 },
              }}
            >
              {events.map((event, i) => (
                <SwiperSlide key={event.id}>
                  <SlideInner>
                    <EventCard event={event} index={i} />
                  </SlideInner>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          <NavRow>
            <NavBtn
              type="button"
              className="spotlight-prev cursor-hover"
              aria-label="Événement précédent"
            >
              <i className="fas fa-chevron-left"></i>
            </NavBtn>
            <Compteur>
              {activeIndex + 1} <span className="total">/ {events.length}</span>
            </Compteur>
            <NavBtn
              type="button"
              className="spotlight-next cursor-hover"
              aria-label="Événement suivant"
            >
              <i className="fas fa-chevron-right"></i>
            </NavBtn>
          </NavRow>

          <Aide>
            Tu veux en savoir plus ? <span className="clic">Clique</span> — Facebook
            te donne tous les détails.
            <br />
            Et comme on ne prend jamais de réservation,{' '}
            <span className="chaise">t'es mieux de venir tôt</span>.
          </Aide>

          <MoreWrap>
            <MoreLink href={buildSceneHref(events)} className="cursor-event">
              Voir plus d'événements
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </MoreLink>
          </MoreWrap>
        </SwiperWrap>
      </Container>
    </Section>
  )
}

/**
 * Construit l'URL /scene avec ancrage sur la dernière card du carousel home.
 * L'agenda /scene scrollera automatiquement sur l'event correspondant, qui
 * sera le PREMIER que voit l'utilisateur après le hero — continuité visuelle.
 */
function buildSceneHref(events) {
  if (!events || events.length === 0) return '/scene#agenda'
  const last = events[events.length - 1]
  // Carousel events Surlascène : extension surlasceneShowId (UUID concert)
  if (last?.surlasceneShowId) return `/scene#concert-${last.surlasceneShowId}`
  // Carousel events Payload : pas de page détail interne → fallback agenda
  return '/scene#agenda'
}
