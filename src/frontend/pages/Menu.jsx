'use client'

import React from 'react';
import MenuHero from '../components/menu/MenuHero';
import MenuGallery from '../components/menu/MenuGallery';

/**
 * @param {{ menuItems?: import('../lib/payload-data').FrontendMenuItem[] }} props
 */
const Menu = ({ menuItems = [] }) => {
  return (
    <div style={{ width: '100%', background: 'var(--color-dark)' }}>
      <MenuHero />
      <MenuGallery menuItems={menuItems} />
    </div>
  );
};

export default Menu;
