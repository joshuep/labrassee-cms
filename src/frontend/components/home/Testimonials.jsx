import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TestimonialsSection = styled.section`
  width: 100vw;
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
`;

const TestimonialsContainer = styled.div`
  width: 100vw;
  display: block;
`;

const Title = styled(motion.h2)`
  font-size: 40px;
  color: var(--color-accent);
  text-align: center;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const GoogleReviewsImage = styled(motion.img)`
  width: 50%;
  margin: 0 auto;
  display: flex;
  border-radius: 10px;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 80%;
  }
  
  @media (max-width: 480px) {
    width: 95%;
  }
`;

const StarBadge = styled(motion.div)`
  position: relative;
  width: 120px;
  height: 120px;
  margin-left: 70%;
  margin-top: -5%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin-top: -6%;
  }
  
  @media (max-width: 480px) {
    width: 90px;
    height: 90px;
    margin-top: -10%;
    margin-left: 65%;
  }
`;

const StarText = styled.p`
  position: absolute;
  text-align: center;
  color: var(--color-dark);
  z-index: 1;
  font-size: 11px;
  line-height: 0.9;
  font-weight: bold;
  margin: 0;
  padding: 0;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 70px;
  
  @media (max-width: 768px) {
    font-size: 10px;
    max-width: 60px;
  }
  
  @media (max-width: 480px) {
    font-size: 8px;
    max-width: 55px;
  }
`;

const StarSvg = styled.svg`
  position: absolute;
  width: 120px;
  height: 120px;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 480px) {
    width: 90px;
    height: 90px;
  }
`;

const Testimonials = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <TestimonialsSection
      as={motion.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <TestimonialsContainer>
        <Title variants={itemVariants}>
          CE QUE NOS VOISINS DISENT DE NOUS!
        </Title>
        
        <GoogleReviewsImage
          src="/images/landing/Capture-decran-le-2024-06-15-a-23.18.34.png"
          alt="Avis Google"
          onClick={() => window.open('https://g.co/kgs/pw7bq7F', '_blank')}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        
        <StarBadge variants={itemVariants}>
          <StarText>
            PAYÉE 5000$<br />
            POUR<br />
            DIRE ÇA!
          </StarText>
          <StarSvg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="var(--color-brand)"
          >
            <path d="M50 5 L61.8 38.2 L95 38.2 L69.1 58.6 L80.9 91.8 L50 71.4 L19.1 91.8 L30.9 58.6 L5 38.2 L38.2 38.2 Z" />
          </StarSvg>
        </StarBadge>
      </TestimonialsContainer>
    </TestimonialsSection>
  );
};

export default Testimonials;