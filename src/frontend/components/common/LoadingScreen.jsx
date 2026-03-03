import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

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
  inset: 0;
  width: 100vw;
  min-height: 100dvh;
  height: 100dvh;
  background: var(--color-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: env(safe-area-inset-bottom);
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    const { body, documentElement } = document;
    if (!isLoading) {
      body.classList.remove('app-loading');
      documentElement.classList.remove('app-loading');
      return undefined;
    }

    const lockScrollY = window.scrollY;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyLeft = body.style.left;
    const previousBodyRight = body.style.right;
    const previousBodyWidth = body.style.width;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousHtmlOverscroll = documentElement.style.overscrollBehavior;

    const preventScroll = (event) => {
      event.preventDefault();
    };

    const preventScrollKeys = (event) => {
      const blockedKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

    const keepScrollPosition = () => {
      if (window.scrollY !== lockScrollY) {
        window.scrollTo(0, lockScrollY);
      }
    };

    body.classList.add('app-loading');
    documentElement.classList.add('app-loading');
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    body.style.position = 'fixed';
    body.style.top = `-${lockScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    documentElement.style.overflow = 'hidden';
    documentElement.style.overscrollBehavior = 'none';

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScrollKeys, { passive: false });
    window.addEventListener('scroll', keepScrollPosition, { passive: true });

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScrollKeys);
      window.removeEventListener('scroll', keepScrollPosition);

      body.classList.remove('app-loading');
      documentElement.classList.remove('app-loading');
      body.style.overflow = previousBodyOverflow;
      body.style.touchAction = previousBodyTouchAction;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.left = previousBodyLeft;
      body.style.right = previousBodyRight;
      body.style.width = previousBodyWidth;
      documentElement.style.overflow = previousHtmlOverflow;
      documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      window.scrollTo(0, lockScrollY);
    };
  }, [isLoading, mounted]);

  const overlay = (
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

  if (!mounted) {
    return overlay;
  }

  return createPortal(overlay, document.body);
};

export default LoadingScreen;
