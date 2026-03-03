import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

  return (
    <CardWrapper
      href={formatUrl(event.facebookLink)}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-event"
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <EventImage 
        src={event.image} 
        alt={event.title}
        loading="eager"
        decoding="async"
      />
      
      {/* Afficher le texte overlay sur toutes les affiches */}
      <TextOverlay>
        <EventTitle>{event.title}</EventTitle>
        <EventDate>{formatDateTime(event.date, event.time)}</EventDate>
      </TextOverlay>
    </CardWrapper>
  );
};

export default EventCard;
