'use client'

import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  padding: 80px 24px;
  background: var(--color-dark);
`

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`

const Label = styled.div`
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 5px;
  font-size: 12px;
  text-align: center;
  margin-bottom: 14px;
`

const Titre = styled.h2`
  font-family: var(--font-din);
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 200;
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;
  margin: 0 0 16px;

  .underline {
    color: var(--color-brand);
  }
`

const Intro = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  max-width: 640px;
  margin: 0 auto 48px;
  font-size: 16px;
  line-height: 1.7;
`

const Grille = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

const Carte = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 28px;
`

const Num = styled.div`
  font-family: var(--font-din);
  font-size: 96px;
  font-weight: 200;
  line-height: 0.8;
  color: var(--color-brand);
  opacity: 0.7;
  margin-bottom: 14px;
`

const TitreCarte = styled.div`
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 16px;
  color: #ffffff;
  font-weight: 400;
  margin-bottom: 10px;
`

const Desc = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;

  strong {
    color: var(--color-brand);
  }
`

const Pied = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  max-width: 620px;
  margin: 0 auto;
  padding: 16px 22px;
  border: 1px dashed rgba(247, 209, 53, 0.3);
  border-radius: 16px;
  background: rgba(247, 209, 53, 0.03);

  strong {
    color: var(--color-brand);
  }
`

export default function SceneCommentCaMarche() {
  return (
    <Section id="comment">
      <Container>
        <Label>Comment ça marche</Label>
        <Titre>
          Trois <span className="underline">choses simples</span>
        </Titre>
        <Intro>
          La Brassée n'est pas une salle de spectacle classique. C'est un café-bistro
          qui ouvre sa scène. Voici le modèle qu'on a fini par adopter et qui
          fonctionne.
        </Intro>

        <Grille>
          <Carte>
            <Num>1</Num>
            <TitreCarte>Entrée libre</TitreCarte>
            <Desc>
              Pas de billetterie, pas de cover, pas de réservation. Tu pousses la
              porte, tu prends une place, tu écoutes. <strong>Premier arrivé, mieux
              placé.</strong>
            </Desc>
          </Carte>
          <Carte>
            <Num>2</Num>
            <TitreCarte>Le chapeau circule</TitreCarte>
            <Desc>
              À la fin du show, les artistes passent (ou pas) le chapeau. Tu donnes
              ce que tu veux, directement à eux.
            </Desc>
          </Carte>
          <Carte>
            <Num>3</Num>
            <TitreCarte>La maison ajoute 10 %</TitreCarte>
            <Desc>
              Sur ta facture pendant le show, La Brassée ajoute une{' '}
              <strong>contribution artistes de 10 %</strong>.{' '}
              <strong>100 % reversé aux musiciens</strong>. Le café ne prend rien.
            </Desc>
          </Carte>
        </Grille>

        <Pied>
          Plus une <strong>consommation offerte par artiste</strong> (boire et manger
          pendant la prep) — parce qu'on aime bien recevoir.
        </Pied>
      </Container>
    </Section>
  )
}
