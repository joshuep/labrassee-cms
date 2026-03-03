import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../common/Logo';
import { businessInfo as fallbackBusinessInfo } from '../../data/menu';

const HeaderSection = styled(motion.section)`
  height: ${props => props.$isHidden ? '0' : 'calc(var(--hauteur-logo-svg) + var(--header-space) + 15px)'};
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  padding-top: ${props => props.$isHidden ? '0' : 'var(--header-space)'};
  opacity: ${props => props.$isHidden ? '0' : '1'};
  transform: translateY(${props => props.$isHidden ? '-20px' : '0'});
  transition: 
    height 0.3s ease,
    opacity 0.3s ease,
    transform 0.3s ease,
    padding-top 0.3s ease;
  background: linear-gradient(
    to bottom,
    rgba(16, 15, 9, 0.5) 50%,
    rgba(16, 15, 9, 0.4) 65%,
    rgba(16, 15, 9, 0.2) 85%,
    rgba(16, 15, 9, 0.05) 95%,
    transparent 100%
  );
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 80vw;
  height: var(--hauteur-logo-svg);
  margin: 0 auto;
  font-family: var(--font-din);
  
  @media (max-width: 960px) {
    width: 60vw;
  }
`;

const Tagline = styled(motion.span)`
  color: var(--color-brand);
  font-size: clamp(1.2rem, 1.25vw, 1.6rem);
  font-weight: 100;
  letter-spacing: 0.02em;
  font-family: var(--font-din-condensed);
  
  @media (max-width: 960px) {
    display: none;
  }
`;

const MenuLink = styled(Link)`
  color: var(--color-brand);
  font-size: 30px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
  }
  
  @media (max-width: 480px) {
    margin-left: 0;
  }
`;

const Header = ({ businessInfo: providedBusinessInfo }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const businessInfo = providedBusinessInfo || fallbackBusinessInfo;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si on est tout en haut, toujours montrer le header
      if (currentScrollY < 10) {
        setIsHidden(false);
      }
      // Si on a scrollé assez pour cacher le header
      else if (currentScrollY > 100) {
        // Si on scroll vers le bas, cacher le header
        if (currentScrollY > lastScrollY) {
          setIsHidden(true);
        }
        // Si on scroll vers le haut, montrer le header
        else if (currentScrollY < lastScrollY) {
          setIsHidden(false);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    // Écouter les événements de scroll (compatible avec Lenis)
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <HeaderSection
      $isHidden={isHidden}
      className="site-header"
      style={{
        animation: 'slideInDown 0.4s ease-out'
      }}
    >
      <HeaderContainer>
        <Tagline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {businessInfo.tagline}
        </Tagline>
        
        <Logo onClick={() => {
          if (pathname !== '/') {
            router.push('/');
          }
        }} />
        
        <MenuLink 
          href="/menu" 
          className="cursor-menu" 
          onClick={(e) => {
            if (pathname === '/menu') {
              e.preventDefault();
            }
          }}
          style={{
            pointerEvents: pathname === '/menu' ? 'none' : 'auto'
          }}
        >
          NOTRE MENU
        </MenuLink>
      </HeaderContainer>
    </HeaderSection>
  );
};

export default Header;
