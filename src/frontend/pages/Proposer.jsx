'use client'

import React from 'react'
import ProposerHero from '../components/proposer/ProposerHero'
import ProposerCards from '../components/proposer/ProposerCards'

const Proposer = () => {
  return (
    <div style={{ width: '100%', background: 'var(--color-dark)' }}>
      <ProposerHero />
      <ProposerCards />
    </div>
  )
}

export default Proposer
