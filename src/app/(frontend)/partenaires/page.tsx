import React from 'react'
import Partenaires from '@/frontend/pages/Partenaires'

export const revalidate = 3600

export const metadata = {
  title: 'Nos partenaires — La Brassée',
  description: 'Les partenaires qui font de La Brassée un endroit unique à Rosemont.',
}

export default function PartenairesPage() {
  return <Partenaires />
}
