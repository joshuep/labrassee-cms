'use client'

import React from 'react'
import ProposerHero from '../components/proposer/ProposerHero'
import ProposerCards from '../components/proposer/ProposerCards'
import ProposerCalendrier from '../components/proposer/ProposerCalendrier'
import ProposerDossierTech from '../components/proposer/ProposerDossierTech'

// Note (2026-05-16) :
//  - ProposerProgrammation séparée → retirée, intégrée dans ProposerCalendrier (LigneDirectrice)
//  - Dossier technique → déplacé de /scene à /proposer (réservé aux artistes qui veulent réserver),
//    refondu en mode « Pick what you need » avec note importante non négociable

const Proposer = ({ moisCalendrier = [], dossier = null }) => {
  return (
    <div style={{ width: '100%', background: 'var(--color-dark)' }}>
      <ProposerHero />
      <ProposerCards />
      <ProposerCalendrier mois={moisCalendrier} />
      <ProposerDossierTech dossier={dossier} />
    </div>
  )
}

export default Proposer
