'use client'

import React from 'react'
import ProposerHero from '../components/proposer/ProposerHero'
import ProposerCards from '../components/proposer/ProposerCards'
import ProposerCalendrier from '../components/proposer/ProposerCalendrier'

// Note (2026-05-17) :
//  - ProposerProgrammation séparée → retirée, intégrée dans ProposerCalendrier
//    (mini-rappel LigneDirectrice au-dessus de chaque mois)
//  - ProposerDossierTech « Pick what you need » → déplacé vers la route
//    `/proposer/equipement` en LECTURE SEULE. La sélection effective du
//    matériel se fera au dépôt définitif (lien token personnel envoyé par
//    Cédric après acceptation de la candidature).

const Proposer = ({ moisCalendrier = [] }) => {
  return (
    <div style={{ width: '100%', background: 'var(--color-dark)' }}>
      <ProposerHero />
      <ProposerCards />
      <ProposerCalendrier mois={moisCalendrier} />
    </div>
  )
}

export default Proposer
