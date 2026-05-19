'use client'

import React from 'react'
import styled from 'styled-components'

/**
 * Logo permanent en arrière-plan de TOUTES les pages.
 *
 * - Position fixed → reste centré quand on scrolle (la page glisse par-dessus).
 * - z-index 0 → derrière le contenu, devant le bg solide de body.
 * - pointer-events none → ne capte aucun clic, n'interfère avec rien.
 * - Tailles responsive : ~55vw desktop, plus petit sur cell pour ne pas trop
 *   déborder hors viewport.
 *
 * L'effet « liquid glass » naît du jeu entre ce logo plein et les sections
 * du contenu qui ont un fond semi-transparent + backdrop-filter (cf. app.css).
 * Le logo apparaît donc flouté/assombri à travers les sections, et net dans
 * les espaces ouverts (hero, transitions).
 */
const Wrap = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const Logo = styled.img`
  width: min(60vw, 720px);
  height: auto;
  opacity: 0.92;
  filter:
    drop-shadow(0 20px 80px rgba(247, 209, 53, 0.18))
    drop-shadow(0 0 40px rgba(247, 209, 53, 0.08));

  @media (max-width: 760px) {
    width: min(78vw, 520px);
  }

  @media (max-width: 480px) {
    width: 86vw;
  }
`

export default function BigLogoBackground() {
  return (
    <Wrap aria-hidden="true">
      <Logo src="/images/brand/full_logo_white.svg" alt="" />
    </Wrap>
  )
}
