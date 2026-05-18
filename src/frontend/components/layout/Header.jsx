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

  @media (max-width: 480px) {
    width: 75vw;
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

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 960px) {
    gap: 4px;
  }
  @media (max-width: 480px) {
    gap: 2px;
  }
`;

/**
 * Menu de nav refait (2026-05-18) : passage de 30px texte brand à un format
 * type "chip" plus lisible avec hover marqué (sous-ligné + fond brand) et
 * état actif (chip plein). Avec 4 items au lieu de 3 (LES ÉVÉNEMENTS · L'EXPO
 * ACTUELLE · VIENS TE FAIRE VOIR · LE MENU), on a besoin de compacité.
 */
const MenuLink = styled(Link)`
  position: relative;
  color: var(--color-brand);
  background: transparent;
  font-family: var(--font-din);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(247, 209, 53, 0.12);
    border-color: rgba(247, 209, 53, 0.35);
  }

  &.active {
    background: var(--color-brand);
    color: var(--color-dark);
    border-color: var(--color-brand);
  }

  @media (max-width: 1100px) {
    font-size: 15px;
    letter-spacing: 1.5px;
    padding: 8px 12px;
  }

  @media (max-width: 880px) {
    font-size: 13px;
    letter-spacing: 1px;
    padding: 7px 10px;
  }

  @media (max-width: 640px) {
    font-size: 11px;
    letter-spacing: 0.5px;
    padding: 6px 8px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    letter-spacing: 0.3px;
    padding: 5px 7px;
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

        <NavGroup>
          <MenuLink
            href="/scene"
            className={`cursor-menu ${pathname === '/scene' ? 'active' : ''}`}
            onClick={(e) => { if (pathname === '/scene') e.preventDefault(); }}
            style={{ pointerEvents: pathname === '/scene' ? 'none' : 'auto' }}
          >
            Les événements
          </MenuLink>
          <MenuLink
            href="/expo"
            className={`cursor-menu ${pathname === '/expo' ? 'active' : ''}`}
            onClick={(e) => { if (pathname === '/expo') e.preventDefault(); }}
            style={{ pointerEvents: pathname === '/expo' ? 'none' : 'auto' }}
          >
            L'expo actuelle
          </MenuLink>
          <MenuLink
            href="/proposer"
            className={`cursor-menu ${pathname === '/proposer' || pathname?.startsWith('/proposer/') ? 'active' : ''}`}
            onClick={(e) => { if (pathname === '/proposer') e.preventDefault(); }}
            style={{ pointerEvents: pathname === '/proposer' ? 'none' : 'auto' }}
          >
            Viens te faire voir
          </MenuLink>
          <MenuLink
            href="/menu"
            className={`cursor-menu ${pathname === '/menu' ? 'active' : ''}`}
            onClick={(e) => { if (pathname === '/menu') e.preventDefault(); }}
            style={{ pointerEvents: pathname === '/menu' ? 'none' : 'auto' }}
          >
            Le menu
          </MenuLink>
        </NavGroup>
      </HeaderContainer>
    </HeaderSection>
  );
};

export default Header;
