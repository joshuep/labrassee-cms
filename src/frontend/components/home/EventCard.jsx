import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { EventViewCount, trackEventView } from './EventViewCount';

const CardWrapper = styled(motion.a)`
  display: block;
  text-decoration: none;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  aspect-ratio: 8.5 / 11; /* Format lettre (8.5" x 11") */
  position: relative; /* Pour permettre l'overlay absolu */
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Remplit complètement avec crop si nécessaire */
  object-position: center;
  display: block;
  background-color: var(--color-dark-alt);
  transition: opacity 0.2s ease-in-out;

  &:not([src]),
  &[src=""] {
    opacity: 0.5;
  }
`;

/* Poster de fallback pour les events SANS image (concert Surlascène dont
   l'artiste n'a pas encore déposé de photo HD). Gradient sobre + Maïa filigrane
   — le texte (nom + date) est géré par le TextOverlay standard en bas. */
const FallbackPoster = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #100f09;
  background-image:
    radial-gradient(ellipse at 30% 15%, rgba(247, 209, 53, 0.18), transparent 55%),
    radial-gradient(ellipse at 75% 85%, rgba(247, 209, 53, 0.08), transparent 55%),
    linear-gradient(180deg, #1a1810 0%, #100f09 100%);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    transform: translate(-50%, -65%);
    background-image: url('/picto_maia_white.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.16;
  }
`;

const TextOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7) 50%, transparent);
  color: var(--color-white);
  padding: 20px 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DayBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--color-brand);
  color: var(--color-dark);
  font-size: 12px;
  font-weight: 300;
  padding: 6px 12px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;

  strong {
    font-weight: 700;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 5px 10px;
  }
`;

const GenreBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(16, 15, 9, 0.7);
  border: 1px solid rgba(247, 209, 53, 0.4);
  color: var(--color-brand);
  font-family: var(--font-din);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 10px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    font-size: 9px;
    padding: 4px 8px;
    letter-spacing: 1px;
  }
`;

const EventTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const EventDate = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const EventCard = ({ event, index }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Fonction pour s'assurer que l'URL a un protocole
  const formatUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour formater la date et l'heure ensemble
  const formatDateTime = (dateString, timeString) => {
    const formattedDate = formatDate(dateString);
    if (timeString) {
      return `${formattedDate} • ${timeString}`;
    }
    return formattedDate;
  };

  // Fonction pour obtenir le badge du jour si l'événement est cette semaine
  const getDayBadge = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();

    // Mettre les heures à 0 pour comparer seulement les dates
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Calculer le début et la fin de la semaine en cours (lundi à dimanche)
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + mondayOffset);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Vérifier si l'événement est dans la semaine en cours
    if (eventDate >= startOfWeek && eventDate <= endOfWeek) {
      const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
      const eventDayIndex = eventDate.getDay();
      return { prefix: 'CE', day: days[eventDayIndex] };
    }

    return null;
  };

  const dayBadge = getDayBadge(event.date);
  const isSurlascene = event.surlasceneSource === 'surlascene';
  const concertKey = event.surlasceneShowId || String(event.id);

  // Lien de la card :
  // 1. event.facebookLink → onglet Facebook
  // 2. Concert Surlascène sans FB → ancre interne /scene#agenda
  // 3. Rien → ancre #agenda
  const linkHref = event.facebookLink
    ? formatUrl(event.facebookLink)
    : isSurlascene
      ? '/scene#agenda'
      : '#';
  const linkTarget = event.facebookLink ? '_blank' : undefined;

  return (
    <CardWrapper
      href={linkHref}
      target={linkTarget}
      rel={linkTarget ? 'noopener noreferrer' : undefined}
      className="cursor-event"
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => trackEventView(concertKey)}
    >
      {event.image ? (
        <EventImage
          src={event.image}
          alt={event.title}
          loading="eager"
          decoding="async"
        />
      ) : (
        <FallbackPoster />
      )}

      {/* Badge du jour pour les événements de la semaine en cours */}
      {dayBadge && <DayBadge>{dayBadge.prefix} <strong>{dayBadge.day}</strong></DayBadge>}

      {/* Badge genre musical (Jazz, Jam, Karaoké, Vernissage…) */}
      {event.genre && <GenreBadge>{event.genre}</GenreBadge>}

      {/* Overlay texte standard en bas */}
      <TextOverlay>
        <EventTitle>{event.title}</EventTitle>
        <EventDate>{formatDateTime(event.date, event.time)}</EventDate>
        <EventViewCount concertKey={concertKey} />
      </TextOverlay>
    </CardWrapper>
  );
};

export default EventCard;
