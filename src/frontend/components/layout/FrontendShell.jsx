'use client'

import React from 'react'

import { useLenis } from '../../hooks/useLenis'
import { useResetLenis } from '../../hooks/useResetLenis'
import CustomCursor from '../common/CustomCursor'
import Footer from './Footer'
import Header from './Header'

const FrontendShell = ({ businessInfo, children }) => {
  useLenis()
  useResetLenis()

  return (
    <>
      <CustomCursor />
      <Header businessInfo={businessInfo} />
      <main style={{ minHeight: '100vh', paddingTop: '0', position: 'relative' }}>{children}</main>
      <Footer businessInfo={businessInfo} />
    </>
  )
}

export default FrontendShell
