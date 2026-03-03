import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99999;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  animation: ${pulse} 1.5s ease-in-out infinite;

  @media (min-width: 640px) {
    width: 150px;
    height: 150px;
  }
`;

const LoadingBar = styled(motion.div)`
  width: 80px;
  height: 2px;
  background: rgba(247, 209, 53, 0.2);
  border-radius: 2px;
  margin-top: 24px;
  overflow: hidden;
  position: relative;

  @media (min-width: 640px) {
    width: 100px;
  }
`;

const LoadingProgress = styled(motion.div)`
  height: 100%;
  background: var(--color-brand);
  border-radius: 2px;
`;

const LoadingScreen = ({ minDuration = 800 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    // Ensure minimum display time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [minDuration]);

  return (
    <AnimatePresence>
      {isLoading && (
        <Overlay
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <LogoContainer
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <LogoImage 
              src="/images/brand/full_logo_white.svg" 
              alt="La Brassée"
            />
            <LoadingBar>
              <LoadingProgress
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </LoadingBar>
          </LogoContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
