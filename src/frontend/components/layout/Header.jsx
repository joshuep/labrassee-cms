import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Header refondu 2026-05-18 :
 *   - Petit logo + tagline retirés (illisibles cell). Logo BG retiré aussi
 *     (2e itération Cédric : trop visuel, plus aéré sans).
 *   - Bandeau bas (64px desktop · 56px mobile) avec effet liquid glass :
 *     backdrop-filter blur + saturate + gradient dark + bordure top fine.
 *   - 4 onglets centrés horizontalement (justify-content: center).
 *   - Header toujours visible — pas d'auto-hide au scroll.
 *   - Header cliquable (retour home) sauf clic direct onglet.
 */

const HEADER_HEIGHT = 64; // px — bandeau slim

const HeaderSection = styled(motion.section)`
  height: ${HEADER_HEIGHT}px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  background:
    linear-gradient(
      to bottom,
      rgba(16, 15, 9, 0.62) 0%,
      rgba(16, 15, 9, 0.55) 70%,
      rgba(16, 15, 9, 0.35) 100%
    );
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;

  /* Très léger overlay clair en haut pour donner le côté frosted glass macOS */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.18), transparent);
    pointer-events: none;
  }

  @media (max-width: 640px) {
    height: 56px;
  }
`;

const HeaderContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 16px;
  font-family: var(--font-din);
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
  const router = useRouter();
  const pathname = usePathname();

  // 2026-05-18 : auto-hide au scroll retiré sur demande Cédric — le header
  // reste toujours visible (les onglets doivent être accessibles à tout moment).

  return (
    <HeaderSection
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
