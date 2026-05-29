import type { Metadata } from 'next'
import React from 'react'

import Analytics from '@/frontend/components/analytics/Analytics'
import FrontendShell from '@/frontend/components/layout/FrontendShell'
import StyledComponentsRegistry from '@/frontend/components/layout/StyledComponentsRegistry'
import { getBusinessInfoData } from '@/frontend/lib/payload-data'
import '@/frontend/styles/app.css'

export const metadata: Metadata = {
  description: 'Site web de La Brassée, café de quartier à Rosepatrie.',
  title: 'La Brassée - Café de Quartier',
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const businessInfo = await getBusinessInfoData()

  return (
    <html lang="fr" className="app-loading">
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
        <link href="/images/brand/full_logo_white.svg" rel="icon" type="image/svg+xml" />
        <link rel="stylesheet" href="https://use.typekit.net/ovt4lgv.css" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css"
          rel="stylesheet"
        />
      </head>
      <body className="app-loading">
        <StyledComponentsRegistry>
          <FrontendShell businessInfo={businessInfo}>{children}</FrontendShell>
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  )
}
