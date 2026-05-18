import React from 'react'
import type { Metadata } from 'next'

import Menu from '@/frontend/pages/Menu'

export const metadata: Metadata = {
  title: 'Le menu — La Brassée',
  description:
    "Ce qu'on sert à La Brassée. Cafés, plats du jour, grilled cheese, scones maison, bières d'ici, vins, cocktails. Printemps 2026.",
}

// Le menu V2 lit `src/frontend/data/menu_v2.json` (statique, build-time) —
// pas de revalidate utile. Quand le menu bouge, on regénère le JSON via le
// pipeline menu_v2/build.py (côté Cédric) puis on copie le fichier dans le
// repo et on push.
export default function MenuPage() {
  return <Menu />
}
