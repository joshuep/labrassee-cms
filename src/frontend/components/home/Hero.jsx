import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  min-height: 85vh;
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 0 40px 0;
`;

const BackgroundImage = styled.img`
  position: absolute;
  width: 100vw;
  height: 100%;
  object-fit: cover;
  object-position: 70% 70%;
  z-index: 0;
`;

const GradientOverlay = styled.div`
  position: absolute;
  width: 100vw;
  height: 100%;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0) 0%, 
    rgba(16, 15, 9, 0.3) 60%, 
    rgba(16, 15, 9, 0.8) 85%, 
    var(--color-dark) 100%
  );
  z-index: 1;
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: calc(var(--header-height) + 20px);
`;

const HeroTitle = styled(motion.h1)`
  color: var(--color-brand);
  font-size: 12vw;
  line-height: 0.9;
  font-weight: 200;
  letter-spacing: -1px;
  font-family: var(--font-din);
  
  @media (max-width: 768px) {
    font-size: 16vw;
  }
  
  @media (max-width: 480px) {
    font-size: 22vw;
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  z-index: 2;
  cursor: pointer;
  padding-bottom: 40px;
`;

const ScrollText = styled(motion.span)`
  color: var(--color-brand);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
  font-family: var(--font-din);
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ScrollArrow = styled(motion.div)`
  color: var(--color-brand);
  font-size: 20px;
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Hero = () => {
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.4
      }
    }
  };

  const arrowPulse = {
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const handleScrollClick = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth'
    });
  };

  return (
    <HeroSection>
      <BackgroundImage 
        src="/images/landing/311881317_532571722207461_4819818638383209062_n.jpg" 
        alt=""
      />
      <GradientOverlay />
      
      <HeroContent>
        <HeroTitle
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          ENTRE<br />VOISINS
        </HeroTitle>
      </HeroContent>

      <ScrollIndicator
        initial="hidden"
        animate="visible"
        variants={scrollIndicatorVariants}
        onClick={handleScrollClick}
        whileHover={{ scale: 1.05 }}
      >
        <ScrollArrow animate={arrowPulse}>
          <i className="fas fa-chevron-right"></i>
        </ScrollArrow>
        <ScrollText>Notre programmation</ScrollText>
        <ScrollArrow animate={arrowPulse}>
          <i className="fas fa-chevron-left"></i>
        </ScrollArrow>
      </ScrollIndicator>
    </HeroSection>
  );
};

export default Hero;
