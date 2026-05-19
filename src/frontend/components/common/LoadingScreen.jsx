import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

import { ROUTE_LOADING_DONE_EVENT, ROUTE_LOADING_START_EVENT } from '@/frontend/lib/routeLoadingEvents';

const INITIAL_PROGRESS = 6;
const ROUTE_MIN_DURATION = 350;
const ROUTE_SHOW_DELAY = 500;
const MAX_PENDING_PROGRESS = 92;

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
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [mounted, setMounted] = useState(false);
  const [cycleStartedAt, setCycleStartedAt] = useState(() => Date.now());
  const [cycleMinDuration, setCycleMinDuration] = useState(minDuration);

  const progressRef = useRef(INITIAL_PROGRESS);
  const pendingCountRef = useRef(1);
  const isVisibleRef = useRef(true);
  const routeRevealTimerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  const startCycle = useCallback((nextMinDuration, nextStartProgress = INITIAL_PROGRESS) => {
    setCycleStartedAt(Date.now());
    setCycleMinDuration(nextMinDuration);
    progressRef.current = nextStartProgress;
    setProgress(nextStartProgress);
    setIsVisible(true);
  }, []);

  const clearRouteRevealTimer = useCallback(() => {
    if (routeRevealTimerRef.current) {
      clearTimeout(routeRevealTimerRef.current);
      routeRevealTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    if (document.readyState === 'complete') {
      pendingCountRef.current = 0;
      return undefined;
    }

    const handleWindowLoaded = () => {
      pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
    };

    window.addEventListener('load', handleWindowLoaded, { once: true });

    return () => {
      window.removeEventListener('load', handleWindowLoaded);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    const handleRouteLoadingStart = () => {
      const wasIdle = pendingCountRef.current === 0;
      pendingCountRef.current += 1;

      if (wasIdle) {
        clearRouteRevealTimer();
        routeRevealTimerRef.current = setTimeout(() => {
          routeRevealTimerRef.current = null;
          if (pendingCountRef.current > 0 && !isVisibleRef.current) {
            startCycle(ROUTE_MIN_DURATION, INITIAL_PROGRESS);
          }
        }, ROUTE_SHOW_DELAY);
      }
    };

    const handleRouteLoadingDone = () => {
      pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
      if (pendingCountRef.current === 0) {
        clearRouteRevealTimer();
      }
    };

    window.addEventListener(ROUTE_LOADING_START_EVENT, handleRouteLoadingStart);
    window.addEventListener(ROUTE_LOADING_DONE_EVENT, handleRouteLoadingDone);

    return () => {
      clearRouteRevealTimer();
      window.removeEventListener(ROUTE_LOADING_START_EVENT, handleRouteLoadingStart);
      window.removeEventListener(ROUTE_LOADING_DONE_EVENT, handleRouteLoadingDone);
    };
  }, [clearRouteRevealTimer, mounted, startCycle]);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    let rafId;

    const animate = () => {
      const elapsed = Date.now() - cycleStartedAt;
      const hasPendingWork = pendingCountRef.current > 0;
      let targetProgress;

      if (hasPendingWork) {
        const curve = 1 - Math.exp(-elapsed / 1600);
        targetProgress = Math.min(MAX_PENDING_PROGRESS, 18 + curve * (MAX_PENDING_PROGRESS - 18));
      } else if (elapsed < cycleMinDuration) {
        const ratio = cycleMinDuration === 0 ? 1 : elapsed / cycleMinDuration;
        targetProgress = 92 + ratio * 4;
      } else {
        targetProgress = 100;
      }

      const smoothing = targetProgress >= 99 ? 0.2 : 0.08;
      const nextProgress =
        progressRef.current + (targetProgress - progressRef.current) * smoothing;

      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (targetProgress === 100 && nextProgress >= 99.6) {
        progressRef.current = 100;
        setProgress(100);
        setIsVisible(false);
        return;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [cycleMinDuration, cycleStartedAt, isVisible]);

  useEffect(() => {
    if (!mounted || !isVisible) {
      return undefined;
    }

    const { body, documentElement } = document;
    const lockScrollY = window.scrollY;

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

    // Safe-guard : si après 5 sec le loading est toujours visible (event
    // route-loading-done perdu, animation bloquée, etc.) on force la
    // libération. Évite le bug iPhone « scroll mort après nav ».
    const failsafe = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearTimeout(failsafe);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScrollKeys);
      window.removeEventListener('scroll', keepScrollPosition);

      // RESET (pas restore) au cleanup. Restorer les valeurs capturées au
      // mount provoquait un bug iPhone : en cas de re-mount du LoadingScreen
      // pendant une navigation (App Router), les « previousBody* » capturaient
      // les valeurs DÉJÀ bloquantes du cycle précédent, et le cleanup les
      // restaurait → scroll resté bloqué.
      body.classList.remove('app-loading');
      documentElement.classList.remove('app-loading');
      body.style.overflow = '';
      body.style.touchAction = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      documentElement.style.overflow = '';
      documentElement.style.overscrollBehavior = '';
      window.scrollTo(0, lockScrollY);
    };
  }, [isVisible, mounted]);

  const progressWidth = `${Math.max(0, Math.min(progress, 100))}%`;

  const overlay = (
    <AnimatePresence>
      {isVisible && (
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
                animate={{ width: progressWidth }}
                transition={{ duration: 0.12, ease: 'linear' }}
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
