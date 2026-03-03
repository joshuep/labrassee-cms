import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ImageViewer from '../common/ImageViewer';

const GallerySection = styled.section`
  width: 100%;
  padding: 40px 0;
  background-color: var(--color-dark);
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 0 15px;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
    gap: 10px;
    padding: 0 10px;
  }
`;

const MenuCard = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
  aspect-ratio: 0.61;
  background-color: var(--color-dark);
`;

const MenuImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
  
  ${MenuCard}:hover & {
    transform: scale(1.05);
  }
`;

const MenuTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: var(--color-white);
  font-size: 24px;
  font-weight: 500;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  
  ${MenuCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MenuGallery = ({ menuItems = [] }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const sortedCategories = [...menuItems].sort((a, b) => a.order - b.order);

  const handleImageClick = (categoryId) => {
    const index = sortedCategories.findIndex(cat => cat.id === categoryId);
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  const handleIndexChange = (newIndex) => {
    setCurrentImageIndex(newIndex);
  };

  if (sortedCategories.length === 0) {
    return (
      <GallerySection>
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-accent)' }}>
          Le menu est vide pour le moment.
        </div>
      </GallerySection>
    );
  }

  return (
    <GallerySection>
      <GalleryGrid
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {sortedCategories.map((category) => (
          <MenuCard
            key={category.id}
            className="cursor-event"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleImageClick(category.id)}
          >
            <MenuImage src={category.image} alt={category.title} />
            <MenuTitle>{category.title}</MenuTitle>
          </MenuCard>
        ))}
      </GalleryGrid>
      
      <ImageViewer
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
        images={sortedCategories}
        currentIndex={currentImageIndex}
        onIndexChange={handleIndexChange}
      />
    </GallerySection>
  );
};

export default MenuGallery;
