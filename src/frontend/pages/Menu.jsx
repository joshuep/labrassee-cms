'use client'

import React from 'react'
import MenuV2 from '../components/menu/MenuV2'

// Note (2026-05-17) : Menu refondu — passage d'une gallerie d'images PNG
// (legacy MenuGallery / MenuHero) à un rendu HTML structuré tiré de
// `src/frontend/data/menu_v2.json` (source : menu_v2 printemps 2026
// validé par Cédric 2026-04-26).
//
// L'ancien MenuHero + MenuGallery + getMenuItemsData restent disponibles
// dans le code source pour réutilisation future ; ils ne sont juste plus
// branchés sur la page publique /menu.

const Menu = () => {
  return (
    <div style={{ width: '100%', background: 'var(--color-dark)' }}>
      <MenuV2 />
    </div>
  )
}

export default Menu
