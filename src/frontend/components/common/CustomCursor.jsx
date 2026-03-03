import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue } from 'framer-motion';

const CursorContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10002;
  will-change: transform, opacity;
  view-transition-name: custom-cursor;
  
  /* Safari fixes */
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
`;

const CursorInner = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--color-brand);
`;

const CustomCursor = () => {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(true);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Detecter si on est sur mobile
  const isMobile = typeof window !== 'undefined' && 
    (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  useEffect(() => {
    if (isMobile) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
    };

    // Pour s'assurer que le curseur suit même pendant les interactions Swiper
    const moveOnDrag = (e) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Gestion des éléments cliquables
    const addCursorListeners = () => {
      // Sélecteurs pour différents types d'éléments
      const clickableElements = document.querySelectorAll(
        'a, button, [role="button"], .swiper-slide, .cursor-hover, .cursor-pointer'
      );
      
      const eventElements = document.querySelectorAll('.cursor-event');
      const logoElements = document.querySelectorAll('.cursor-logo');
      const menuElements = document.querySelectorAll('.cursor-menu');

      // Éléments cliquables normaux
      clickableElements.forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('hover'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });

      // Éléments avec animations spéciales
      eventElements.forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('event'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });

      logoElements.forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('logo'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });

      menuElements.forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('menu'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });
    };

    // Events
    document.addEventListener('mousemove', moveCursor);
    // Meilleure gestion de la visibilité
    const handleFirstMove = () => setIsVisible(true);
    window.addEventListener('mousemove', handleFirstMove, { once: true });
    
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    // Événements pour capturer le mouvement même pendant les drags
    document.addEventListener('pointermove', moveOnDrag);
    document.addEventListener('touchmove', moveOnDrag);
    
    // Observer pour les nouveaux éléments
    const observer = new MutationObserver(addCursorListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial setup
    addCursorListeners();

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('pointermove', moveOnDrag);
      document.removeEventListener('touchmove', moveOnDrag);
      observer.disconnect();
    };
  }, [cursorX, cursorY, isMobile]);

  // Variants pour différents états
  const variants = {
    default: {
      scale: 1,
      backgroundColor: 'var(--color-brand)',
    },
    hover: {
      scale: 2,
      backgroundColor: 'var(--color-brand)',
    },
    event: {
      scale: 2,
      backgroundColor: 'var(--color-brand)',
    },
    logo: {
      scale: 2,
      backgroundColor: 'var(--color-brand)',
    },
    menu: {
      scale: 2,
      backgroundColor: 'var(--color-brand)',
    }
  };

  // Ne pas rendre sur mobile
  if (isMobile) return null;

  return (
    <CursorContainer
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <CursorInner
        variants={variants}
        animate={cursorVariant}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
    </CursorContainer>
  );
};

export default CustomCursor;
