'use client'

import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  padding: 80px 24px 120px;
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

  .u { color: var(--color-brand); }
`

const Intro = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  max-width: 640px;
  margin: 0 auto 48px;
  font-size: 16px;
`

const Grille = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  margin-bottom: 36px;
`

const Carte = styled.div`
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 3px solid var(--color-brand);
  padding: 22px;
  border-radius: 16px;
`

const TitreCarte = styled.div`
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 13px;
  color: var(--color-brand);
  margin-bottom: 10px;
`

const Desc = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;

  strong { color: var(--color-brand); }
`

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 36px;
`

const Btn = styled.a`
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 13px;
  padding: 16px 32px;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid;

  &.primaire {
    background: var(--color-brand);
    color: var(--color-dark);
    border-color: var(--color-brand);
    box-shadow: 0 8px 24px rgba(247, 209, 53, 0.18);
  }
  &.primaire:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(247, 209, 53, 0.35);
  }
  &.secondaire {
    background: transparent;
    color: var(--color-brand);
    border-color: rgba(247, 209, 53, 0.3);
  }
  &.secondaire:hover {
    background: rgba(247, 209, 53, 0.12);
    border-color: var(--color-brand);
  }
`

const cards = [
  {
    titre: '💸 Rémunération',
    desc: (
      <>
        Pas de billetterie. Le public donne ce qu'il veut. La Brassée ajoute 10 % sur
        les factures pendant le show — <strong>100 % reversé aux artistes</strong>.
        Plus 30 $ de conso offerte/artiste, plafond 120 $/soirée.
      </>
    ),
  },
  {
    titre: '🎤 Soundcheck + format',
    desc: (
      <>
        Soundcheck dès <strong>18 h 30</strong> avec Cédric à la console. Show à{' '}
        <strong>19 h 30</strong>. Format : <strong>2 sets de 45 min</strong> avec
        pause de 15 min.
      </>
    ),
  },
  {
    titre: '📅 Cadence',
    desc: (
      <>
        5 shows/semaine (lun, mar, jeu, ven, sam). Un artiste peut revenir{' '}
        <strong>max 3 fois/an</strong> — on aime faire tourner.
      </>
    ),
  },
  {
    titre: '🎥 Captation',
    desc: (
      <>
        Sur demande : <strong>enregistrement audio + vidéo stéréo sur clé USB</strong>{' '}
        de ta prestation pour <strong>40 $</strong>. Pratique pour ta promo.
        (Multipiste à venir avec l'upgrade de console.)
      </>
    ),
  },
  {
    titre: '📷 Promo',
    desc: (
      <>
        On t'annonce sur Facebook (event créé dès réception de ta photo +
        descriptif), Instagram, newsletter, TV interne. Réels FB+Insta pendant le
        show. Droit d'image pour la promo (et 6 mois après).
      </>
    ),
  },
  {
    titre: '❌ Annulation',
    desc: (
      <>
        Préavis 7 jours minimum, sauf force majeure. Aucun dédommagement prévu — on
        reprogramme dès que possible.
      </>
    ),
  },
  {
    titre: '🪑 Pas de réservation',
    desc: (
      <>
        Pas de réservation de table possible à La Brassée — c'est{' '}
        <strong>premier arrivé, mieux placé</strong>. Conseille à ton public d'arriver
        30-45 min avant.
      </>
    ),
  },
  {
    titre: '🛡️ Matériel',
    desc: (
      <>
        Tu es responsable de ton matos personnel. La Brassée fournit la sono + le
        piano numérique Kawai ES110. Batterie et amplis : artiste apporte.
      </>
    ),
  },
]

const mailtoBody = encodeURIComponent(
  `Salut !

Nom artiste / groupe :
Genre :
Nb de personnes sur scène :
Période souhaitée :
Lien écoute (Spotify/Bandcamp/YouTube) :
Un mot sur toi :

Merci !`,
)

export default function SceneConditions() {
  return (
    <Section id="proposer">
      <Container>
        <Label>Tu veux jouer chez nous ?</Label>
        <Titre>
          Les <span className="u">conditions</span>
        </Titre>
        <Intro>
          On accepte des artistes en autonomie qui aiment l'intimité d'une salle
          ouverte. Pas besoin d'être connu, juste d'avoir un set rodé.
        </Intro>

        <Grille>
          {cards.map((c) => (
            <Carte key={c.titre}>
              <TitreCarte>{c.titre}</TitreCarte>
              <Desc>{c.desc}</Desc>
            </Carte>
          ))}
        </Grille>

        <Actions>
          <Btn
            href={`mailto:contact@labrassee.cafe?subject=Proposition%20de%20performance%20-%20Sur%20la%20sc%C3%A8ne&body=${mailtoBody}`}
            className="primaire"
          >
            Écrire à Cédric
          </Btn>
          <Btn href="#agenda" className="secondaire">
            Revoir l'agenda
          </Btn>
        </Actions>
      </Container>
    </Section>
  )
}
