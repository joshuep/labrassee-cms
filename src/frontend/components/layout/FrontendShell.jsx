'use client'

import React from 'react'

import { useLenis } from '../../hooks/useLenis'
import { useResetLenis } from '../../hooks/useResetLenis'
import CustomCursor from '../common/CustomCursor'
import LoadingScreen from '../common/LoadingScreen'
import BigLogoBackground from './BigLogoBackground'
import Footer from './Footer'
import Header from './Header'

const FrontendShell = ({ businessInfo, children }) => {
  useLenis()
  useResetLenis()

  return (
    <>
      <LoadingScreen minDuration={1000} />
      <CustomCursor />
      <BigLogoBackground />
      <Header businessInfo={businessInfo} />
      <main style={{ minHeight: '100vh', paddingTop: '0', position: 'relative', zIndex: 1 }}>{children}</main>
      <Footer businessInfo={businessInfo} />
    </>
  )
}

export default FrontendShell
