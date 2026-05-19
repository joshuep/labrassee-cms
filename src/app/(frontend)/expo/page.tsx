import React from 'react'
import type { Metadata } from 'next'

import ExpoActuelle from '@/frontend/components/expo/ExpoActuelle'
import {
  getExpoActuelle,
  getOeuvresArtiste,
  mursImageUrl,
  mursPhotosUrls,
} from '@/frontend/lib/surnosmurs-data'

export const metadata: Metadata = {
  title: "L'expo en cours — La Brassée",
  description:
    "L'artiste actuellement accroché·e sur les murs de La Brassée : titre, bio, œuvres, dates d'expo. Vente directe au public, vernissage 5à7 le dimanche.",
}

// 30 min de cache : l'expo bouge max 1 fois toutes les 4 semaines
export const revalidate = 1800

export default async function ExpoPage() {
  const artiste = await getExpoActuelle()
  const photosUrls = mursPhotosUrls(artiste?.photos_oeuvres_paths)
  const portraitUrl = mursImageUrl(artiste?.photo_artiste_path)
  const oeuvres = artiste?.id ? await getOeuvresArtiste(artiste.id) : []

  return (
    <main style={{ width: '100%', background: 'var(--color-dark)' }}>
      <ExpoActuelle
        artiste={artiste}
        photosUrls={photosUrls}
        portraitUrl={portraitUrl}
        oeuvres={oeuvres}
      />
    </main>
  )
}
