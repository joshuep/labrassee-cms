import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ViewerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ViewerContainer = styled(motion.div)`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 80px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0 60px;
  }
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ViewerImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  user-select: none;
  pointer-events: none;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(16, 15, 9, 0.8);
  border: 2px solid var(--color-brand);
  color: var(--color-brand);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 10001;
  backdrop-filter: blur(4px);
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(247, 209, 53, 0.2);
  }
  
  &:hover i {
    transform: scale(1.1);
  }
  
  i {
    transition: transform 0.3s ease;
  }
  
  &:disabled {
    opacity: 0.3;
  }
  
  &.prev {
    left: 20px;
  }
  
  &.next {
    right: 20px;
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 18px;
    
    &.prev {
      left: 10px;
    }
    
    &.next {
      right: 10px;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(16, 15, 9, 0.8);
  border: 2px solid var(--color-brand);
  color: var(--color-brand);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  z-index: 10001;
  backdrop-filter: blur(4px);
  
  &:hover {
    background: rgba(247, 209, 53, 0.2);
  }
  
  &:hover i {
    transform: scale(1.1);
  }
  
  i {
    transition: transform 0.3s ease;
  }
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;


const ImageViewer = ({ isOpen, onClose, images, currentIndex, onIndexChange }) => {
  const [localIndex, setLocalIndex] = useState(currentIndex || 0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (currentIndex !== undefined) {
      setLocalIndex(currentIndex);
    }
  }, [currentIndex]);

  // Reset zoom when changing images
  useEffect(() => {
    setIsZoomed(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [localIndex]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, localIndex]);

  // Disable scroll when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [isOpen]);

  const handlePrevious = () => {
    const newIndex = localIndex > 0 ? localIndex - 1 : images.length - 1;
    setLocalIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = localIndex < images.length - 1 ? localIndex + 1 : 0;
    setLocalIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = (e) => {
    if (isZoomed) {
      setIsZoomed(false);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Position du clic relative au centre de l'image
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Calcul du décalage pour centrer le zoom sur le point cliqué
      const offsetX = (centerX - clickX) * 1; // Multiplier par le facteur de zoom - 1
      const offsetY = (centerY - clickY) * 1;
      
      setIsZoomed(true);
      setScale(2);
      setPosition({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseDown = (e) => {
    if (isZoomed) {
      setIsDragging(true);
      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;

      const handleMouseMove = (e) => {
        setPosition({
          x: e.clientX - startX,
          y: e.clientY - startY
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  if (!isOpen || !images.length) return null;

  const currentImage = images[localIndex];

  return (
    <AnimatePresence>
      <ViewerOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleOverlayClick}
      >
        <ViewerContainer
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ImageContainer
            $isZoomed={isZoomed}
            className={isZoomed ? "cursor-hover" : "cursor-event"}
            onClick={handleImageClick}
            onMouseDown={handleMouseDown}
            animate={{
              scale: scale,
              x: position.x,
              y: position.y
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <ViewerImage
              key={localIndex}
              src={currentImage.image}
              alt={currentImage.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </ImageContainer>
          
          <NavigationButton
            className="prev cursor-hover"
            onClick={handlePrevious}
          >
            <i className="fas fa-chevron-left"></i>
          </NavigationButton>
          
          <NavigationButton
            className="next cursor-hover"
            onClick={handleNext}
          >
            <i className="fas fa-chevron-right"></i>
          </NavigationButton>
        </ViewerContainer>
        
        <CloseButton
          className="cursor-hover"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </CloseButton>
        
      </ViewerOverlay>
    </AnimatePresence>
  );
};

export default ImageViewer;