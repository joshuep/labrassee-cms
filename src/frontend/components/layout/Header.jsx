import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Header refondu 2026-05-18 :
 *   - Le petit logo + tagline ont été retirés (illisibles sur cell d'après
 *     Cédric).
 *   - Le GROS full_logo_white.svg est désormais en background du header,
 *     centré, semi-transparent, avec un effet "liquid glass" (backdrop-filter
 *     blur + saturate, gradient dark + bordure subtile) qui le fait apparaître
 *     comme givré.
 *   - Le Header entier est cliquable (retour home).
 *   - Onglets agrandis : 22px de base (vs 17 avant), avec 5 breakpoints
 *     responsive qui restent lisibles jusqu'à 380px.
 */

const HEADER_HEIGHT = 110; // px — plus haut qu'avant pour le logo en BG

const HeaderSection = styled(motion.section)`
  height: ${props => props.$isHidden ? '0' : `${HEADER_HEIGHT}px`};
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  opacity: ${props => props.$isHidden ? '0' : '1'};
  transform: translateY(${props => props.$isHidden ? '-20px' : '0'});
  transition:
    height 0.3s ease,
    opacity 0.3s ease,
    transform 0.3s ease;
  background:
    linear-gradient(
      to bottom,
      rgba(16, 15, 9, 0.62) 0%,
      rgba(16, 15, 9, 0.55) 60%,
      rgba(16, 15, 9, 0.25) 90%,
      transparent 100%
    );
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;

  /* GROS logo en filigrane derrière le glass — l'âme du header */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('/images/brand/full_logo_white.svg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: auto 70%;
    opacity: 0.22;
    pointer-events: none;
    filter: drop-shadow(0 4px 24px rgba(247, 209, 53, 0.18));
  }

  /* Très léger overlay clair en haut pour donner le côté frosted glass macOS */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.18), transparent);
    pointer-events: none;
  }

  @media (max-width: 640px) {
    height: ${props => props.$isHidden ? '0' : '88px'};
    &::before { background-size: auto 60%; opacity: 0.18; }
  }
`;

const HeaderContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 28px;
  font-family: var(--font-din);

  @media (max-width: 640px) {
    padding: 0 14px;
  }
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 960px) {
    gap: 6px;
  }
  @media (max-width: 480px) {
    gap: 3px;
  }
`;

/**
 * Onglets agrandis (2026-05-18) suite à retour Cédric :
 *   - Base 22px (vs 17 avant) pour la lisibilité réelle iPhone
 *   - 5 breakpoints qui restent solides jusqu'à 380px
 *   - Hover : chip glass avec fond brand léger + bordure
 *   - Active : chip plein brand avec ombre douce (l'onglet « pop » sur le BG glass)
 */
const MenuLink = styled(Link)`
  position: relative;
  color: var(--color-brand);
  background: rgba(16, 15, 9, 0.35);
  font-family: var(--font-din);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 11px 20px;
  border-radius: 999px;
  border: 1px solid rgba(247, 209, 53, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(247, 209, 53, 0.18);
    border-color: rgba(247, 209, 53, 0.6);
    transform: translateY(-1px);
  }

  &.active {
    background: var(--color-brand);
    color: var(--color-dark);
    border-color: var(--color-brand);
    box-shadow: 0 6px 18px rgba(247, 209, 53, 0.25);
  }

  @media (max-width: 1240px) {
    font-size: 19px;
    padding: 10px 17px;
  }

  @media (max-width: 1000px) {
    font-size: 16px;
    letter-spacing: 1px;
    padding: 9px 14px;
  }

  @media (max-width: 800px) {
    font-size: 13px;
    letter-spacing: 0.8px;
    padding: 8px 11px;
  }

  @media (max-width: 640px) {
    font-size: 11px;
    letter-spacing: 0.5px;
    padding: 7px 9px;
  }

  @media (max-width: 420px) {
    font-size: 10px;
    letter-spacing: 0.3px;
    padding: 6px 7px;
  }
`;

/**
 * @param {{ businessInfo?: unknown }} props
 */
const Header = ({ businessInfo: _providedBusinessInfo }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

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
      onClick={(e) => {
        // Le header entier est cliquable (retour home), sauf clic direct
        // sur un onglet (qui a sa propre navigation).
        if (e.target.closest('a')) return;
        if (pathname !== '/') router.push('/');
      }}
      style={{
        animation: 'slideInDown 0.4s ease-out'
      }}
    >
      <HeaderContainer>
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
