import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LogoWrapper = styled(motion.div)`
  width: var(--hauteur-logo-svg);
  height: var(--hauteur-logo-svg);
  view-transition-name: main-logo;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Logo = ({ mixBlend = true, onClick, className }) => {
  return (
    <LogoWrapper
      $mixBlend={mixBlend}
      onClick={onClick}
      className={`cursor-logo ${className || ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <LogoImage 
        src="/images/brand/full_logo_white.svg" 
        alt="La Brassée"
      />
    </LogoWrapper>
  );
};

export default Logo;