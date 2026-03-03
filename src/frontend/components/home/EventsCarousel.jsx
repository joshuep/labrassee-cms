import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import EventCard from './EventCard';

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

const NavigationButton = styled.div`
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  color: var(--color-brand);
  font-size: 16px;
  z-index: 10;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(247, 209, 53, 0.1);
  border: 1px solid rgba(247, 209, 53, 0.3);
  backdrop-filter: blur(8px);
  cursor: pointer;
  
  &:hover {
    background: rgba(247, 209, 53, 0.2);
    border-color: rgba(247, 209, 53, 0.5);
    transform: translateY(-50%) scale(1.05);
  }
  
  &.swiper-button-prev {
    left: 10px;
  }
  
  &.swiper-button-next {
    right: 10px;
  }
  
  &.swiper-button-disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  /* Masquer les icônes par défaut de Swiper */
  &::after {
    display: none;
  }

  @media (max-width: 768px) {
    display: none;
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
            Clique sur une affiche pour accéder à l'événement Facebook!
          </InfoText>
        </InfoBlock>

        <NavigationButton className="swiper-button-prev cursor-hover">
          <i className="fas fa-chevron-left"></i>
        </NavigationButton>
        
        <NavigationButton className="swiper-button-next cursor-hover">
          <i className="fas fa-chevron-right"></i>
        </NavigationButton>
      </CarouselContainer>
    </CarouselSection>
  );
};

export default EventsCarousel;
