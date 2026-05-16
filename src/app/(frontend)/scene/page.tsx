import React from 'react'
import type { Metadata } from 'next'

import SceneHero from '@/frontend/components/scene/SceneHero'
import SceneCommentCaMarche from '@/frontend/components/scene/SceneCommentCaMarche'
import SceneAgenda from '@/frontend/components/scene/SceneAgenda'
import {
  getUpcomingShows,
  photoUrl,
} from '@/frontend/lib/surlascene-data'

export const metadata: Metadata = {
  title: 'Sur la scène — La Brassée',
  description:
    'Cinq soirs par semaine, La Brassée ouvre sa scène. Entrée libre, chapeau, et 10 % des factures du soir pour les artistes. Agenda et dossier technique.',
}

// Revalidation : la BD Surlascène est sync auto toutes les 2h depuis Calendar.app
// On regénère la page toutes les 5 min côté Next.js pour rester frais.
export const revalidate = 300

export default async function ScenePage() {
  const shows = await getUpcomingShows(30)

  return (
    <main style={{ width: '100%', background: 'var(--color-dark)' }}>
      <SceneHero />
      <SceneCommentCaMarche />
      <SceneAgenda shows={shows} photoUrl={photoUrl} />

      <section
        id="proposer"
        style={{
          padding: '80px 24px 120px',
          background: 'var(--color-dark)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div
            style={{
              color: 'var(--color-brand)',
              fontFamily: 'var(--font-din)',
              textTransform: 'uppercase',
              letterSpacing: 5,
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            Tu veux jouer chez nous ?
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-din)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 200,
              letterSpacing: 1,
              color: '#ffffff',
              margin: '0 0 16px',
            }}
          >
            Proposer une perfo
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 16,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Écris à Cédric avec ton nom, ton genre, le nombre de personnes sur scène,
            la période souhaitée et un lien d'écoute (Spotify, Bandcamp, YouTube). On
            accepte des artistes en autonomie qui aiment l'intimité d'une salle
            ouverte.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:contact@labrassee.cafe?subject=Proposition%20de%20performance%20-%20Sur%20la%20sc%C3%A8ne"
              style={{
                background: 'var(--color-brand)',
                color: 'var(--color-dark)',
                fontFamily: 'var(--font-din)',
                textTransform: 'uppercase',
                letterSpacing: 3,
                fontSize: 13,
                padding: '16px 32px',
                borderRadius: 999,
                textDecoration: 'none',
                border: '1px solid var(--color-brand)',
              }}
            >
              Écrire à Cédric
            </a>
            <a
              href="https://labrassee-surlascene-publique.vercel.app#dossier"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                color: 'var(--color-brand)',
                fontFamily: 'var(--font-din)',
                textTransform: 'uppercase',
                letterSpacing: 3,
                fontSize: 13,
                padding: '16px 32px',
                borderRadius: 999,
                textDecoration: 'none',
                border: '1px solid rgba(247,209,53,0.3)',
              }}
            >
              Dossier technique complet
            </a>
          </div>
          <p
            style={{
              marginTop: 28,
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
              fontStyle: 'italic',
            }}
          >
            La fiche détaillée de chaque artiste, le dossier technique complet et le
            formulaire de dépôt EPK sont sur{' '}
            <a
              href="https://labrassee-surlascene-publique.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-brand)' }}
            >
              surlascene-publique.vercel.app
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
