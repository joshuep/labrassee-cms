import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  width: 100%;
  position: relative;
  display: flex;
  margin-top:80px;
  justify-content: center;
  background-color: var(--color-dark);
`;

const HeroContainer = styled.div`
  width: 100vw;
  min-height:80vh;
  position: relative;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const BackgroundImage = styled(motion.img)`
  position: absolute;
  align-self:center;
  z-index:4;
  margin-left:auto;
  margin-right:auto;
  aspect-ratio: 1;
  width: 40vw;
`;

const MenuText = styled(motion.h1)`
  position: relative;
  width: 100vw;
  text-align: center;
  font-size: 40vw;
  line-height: 1;
  font-weight: 400;
  font-family: var(--font-din);
  -webkit-text-stroke: 2px ${props => props.$strokeColor};
  color: ${props => props.$fillColor || 'transparent'};
  

`;

const MenuHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.2
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <HeroSection>
      <HeroContainer
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <BackgroundImage
          src="/images/menu/Scone_Anis-1.jpg"
          alt=""
          variants={imageVariants}
        />
        
        <MenuText
          $strokeColor="var(--color-brand)"
          $fillColor="rgba(205, 196, 157, 0)"
          variants={textVariants}

        >
          MENU
        </MenuText>
        
        <MenuText
          $strokeColor="#98c0f5"
          $fillColor="rgba(0, 0, 0, 0)"
        >
          MENU
        </MenuText>
      </HeroContainer>
    </HeroSection>
  );
};

export default MenuHero;