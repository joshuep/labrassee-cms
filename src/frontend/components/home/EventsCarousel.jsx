import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import EventCard from './EventCard';

/** @typedef {import('../../lib/payload-data').FrontendEvent} FrontendEvent */

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const CarouselSection = styled.section`
  width: 100vw;
  overflow: hidden;
  padding: 10px 0;
  margin-bottom: 100px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0), var(--color-dark) 40%, rgba(0, 0, 0, 0));
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
`;

const NavigationControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 16px;
  }
`;

const NavigationButton = styled.button`
  appearance: none;
  border: none;
  position: relative;
  top: auto;
  left: auto;
  right: auto;
  margin-top: 0;
  color: var(--color-brand);
  font-size: 16px;
  transition: all 0.3s ease;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(247, 209, 53, 0.1);
  border: 1px solid rgba(247, 209, 53, 0.3);
  backdrop-filter: blur(8px);
  cursor: pointer;
  
  &:hover {
    background: rgba(247, 209, 53, 0.2);
    border-color: rgba(247, 209, 53, 0.5);
    transform: scale(1.05);
  }
  
  &.swiper-button-disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  /* Masquer les icônes par défaut de Swiper */
  &::after {
    display: none;
  }

  &.swiper-button-prev,
  &.swiper-button-next {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    margin-top: 0;
  }
`;

const InfoBlock = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  padding: 12px 24px;
  background: rgba(247, 209, 53, 0.08);
  border: 1px solid rgba(247, 209, 53, 0.2);
  border-radius: 24px;
  backdrop-filter: blur(8px);
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(247, 209, 53, 0.12);
    border-color: rgba(247, 209, 53, 0.3);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    max-width: 90%;
    padding: 10px 16px;
  }
`;

const InfoIcon = styled.div`
  color: var(--color-brand);
  font-size: 16px;
  margin-right: 12px;
  opacity: 0.8;
`;

const InfoText = styled.span`
  color: var(--color-white);
  font-size: 14px;
  font-weight: 300;
  opacity: 0.9;
`;

const StyledSwiper = styled(Swiper)`
  .swiper-slide {
    height: auto;
  }
`;

/**
 * @param {{ events?: FrontendEvent[] }} props
 */
const EventsCarousel = ({ events = [] }) => {
  return (
    <CarouselSection>
      <CarouselContainer>
        {events.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut",
              staggerChildren: 0.1,
              delayChildren: 0.2
            }}
          >
            <StyledSwiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={2}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 4,
                },
                1560: {
                  slidesPerView: 4,
                },
              }}
            >
              {events.map((event, index) => (
                <SwiperSlide key={event.id}>
                  <EventCard event={event} index={index} />
                </SwiperSlide>
              ))}
            </StyledSwiper>

            <NavigationControls>
              <NavigationButton
                type="button"
                className="swiper-button-prev cursor-hover"
                aria-label="Événement précédent"
              >
                <i className="fas fa-chevron-left"></i>
              </NavigationButton>

              <NavigationButton
                type="button"
                className="swiper-button-next cursor-hover"
                aria-label="Événement suivant"
              >
                <i className="fas fa-chevron-right"></i>
              </NavigationButton>
            </NavigationControls>
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-accent)' }}>
            Aucune programmation à venir pour le moment.
          </div>
        )}

        <InfoBlock
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <InfoIcon>
            <i className="fab fa-facebook"></i>
          </InfoIcon>
          <InfoText>
            Clique sur une affiche pour voir le détail du show ou l'événement Facebook.
          </InfoText>
        </InfoBlock>
      </CarouselContainer>
    </CarouselSection>
  );
};

export default EventsCarousel;
