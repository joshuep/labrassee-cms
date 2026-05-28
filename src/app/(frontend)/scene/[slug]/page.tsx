import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getArtisteParToken } from '@/frontend/lib/surlascene-artiste'
import ArtistePage from './ArtistePage'

// Regen toutes les 5 min (même cadence que le reste de la section /scene)
export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const fiche = await getArtisteParToken(slug)
  if (!fiche) {
    return {
      title: 'Artiste introuvable — La Brassée',
    }
  }
  const { artiste } = fiche
  const description = artiste.bio
    ? artiste.bio.slice(0, 160).replace(/\n/g, ' ')
    : `${artiste.nom_artiste} se produit sur la scène de La Brassée, café de quartier à Rosepatrie, Montréal.`

  return {
    title: `${artiste.nom_artiste} — Sur la scène de La Brassée`,
    description,
    openGraph: {
      title: `${artiste.nom_artiste} — La Brassée`,
      description,
      images: fiche.photoUrl ? [{ url: fiche.photoUrl }] : [],
    },
  }
}

export default async function ArtisteSlugPage({ params }: Props) {
  const { slug } = await params
  const fiche = await getArtisteParToken(slug)
  if (!fiche) notFound()

  return (
    <main style={{ width: '100%', background: '#100f09' }}>
      <ArtistePage fiche={fiche} />
    </main>
  )
}
