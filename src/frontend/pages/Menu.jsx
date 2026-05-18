'use client'

import React from 'react'
import MenuFlipbook from '../components/menu/MenuFlipbook'

// Note (2026-05-17) : Menu rendu en flipbook (carousel feuilletage) des 8
// pages PNG du menu V2 printemps 2026 (source : menu_v2/png/ généré par
// build.py côté Cédric). Format ludique, identique à l'objet papier.
//
// Legacy : MenuHero, MenuGallery, MenuV2 (rendu HTML structuré), menu.js
// fallback, getMenuItemsData() — gardés dans le code, plus branchés ici.

const Menu = () => {
  return (
    <div style={{ width: '100%', background: 'var(--color-dark)' }}>
      <MenuFlipbook />
    </div>
  )
}

export default Menu
