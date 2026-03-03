'use client'

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const StickyWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1200;
  padding: 0;
  pointer-events: none;

  @media (min-width: 640px) {
    padding: 16px;
  }
`;

const SignupBar = styled(motion.div)`
  width: 100%;
  padding: 16px 20px calc(16px + max(0px, env(safe-area-inset-bottom)));
  background: rgba(16, 15, 9, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(247, 209, 53, 0.3);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.5);
  pointer-events: auto;

  @media (min-width: 640px) {
    max-width: 680px;
    margin: 0 auto;
    padding: 18px 24px;
    border: 1px solid rgba(247, 209, 53, 0.25);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  @media (min-width: 900px) {
    max-width: 780px;
    padding: 20px 28px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
`;

const TextContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  @media (min-width: 640px) {
    flex-shrink: 0;
    flex: none;
    gap: 14px;
  }
`;

const IconWrapper = styled.div`
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: rgba(247, 209, 53, 0.12);
  border-radius: 12px;
  color: var(--color-brand);
  font-size: 18px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    display: flex;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    font-size: 20px;
  }
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: 300;
  color: var(--color-white);
  letter-spacing: -0.01em;
  line-height: 1.3;
  width: 100%;
  text-align: center;

  @media (min-width: 640px) {
    font-size: 14px;
    width: auto;
    text-align: left;
  }

  @media (min-width: 900px) {
    font-size: 18px;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
    gap: 10px;
    flex-shrink: 0;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 12px 14px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: var(--color-white);
  outline: none;
  transition: all 0.25s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: rgba(247, 209, 53, 0.5);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(247, 209, 53, 0.1);
  }

  @media (min-width: 640px) {
    flex: none;
    width: 200px;
    padding: 14px 18px;
    font-size: 15px;
    border-radius: 14px;
  }
`;

const SubmitButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-size: 18px;
  background: var(--color-brand);
  color: var(--color-dark);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(247, 209, 53, 0.85);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 640px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
    border-radius: 14px;
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-brand);
  font-size: 14px;
  font-weight: 500;

  @media (min-width: 640px) {
    gap: 10px;
    font-size: 15px;
  }
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff8f8f;
  font-size: 13px;
  font-weight: 500;
  margin-top: 8px;
`;

const HoneypotInput = styled.input`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

const COOKIE_NAME = 'calendar_signup_subscribed';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

const hasSignupCookie = () => {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));
};

const setSignupCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
};

const CalendarSignup = () => {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsVisible(!hasSignupCookie());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/calendar-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, website }),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(result?.message || 'Erreur serveur, réessaie plus tard.');
        return;
      }

      if (result?.status === 'exists') {
        setStatus('exists');
        setMessage('Déjà inscrit!');
      } else {
        setStatus('success');
        setMessage('Inscription confirmée!');
      }

      setSignupCookie();
      setEmail('');

      setTimeout(() => {
        setIsVisible(false);
      }, 1400);
    } catch (_error) {
      setStatus('error');
      setMessage('Erreur réseau, réessaie plus tard.');
    }
  };

  const signupContent = (
    <StickyWrapper>
      <AnimatePresence>
        {isVisible && (
          <SignupBar
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25, delay: 0.5 }}
          >
            <Container>
              <TextContent>
                <IconWrapper>
                  <i className="far fa-calendar-alt"></i>
                </IconWrapper>
                <Title>REÇOIS LE CALENDRIER MENSUEL DES ÉVÉNEMENTS</Title>
              </TextContent>

              <AnimatePresence mode="wait">
                {status === 'success' || status === 'exists' ? (
                  <SuccessMessage
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <i className="fas fa-check"></i>
                    {message || 'Inscription confirmée!'}
                  </SuccessMessage>
                ) : (
                  <Form key="form" onSubmit={handleSubmit}>
                    <HoneypotInput
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      aria-hidden="true"
                    />
                    <EmailInput
                      type="email"
                      placeholder="Ton courriel"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === 'loading'}
                    />
                    <SubmitButton
                      type="submit"
                      disabled={status === 'loading'}
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <i className={status === 'loading' ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'}></i>
                    </SubmitButton>
                  </Form>
                )}
              </AnimatePresence>
            </Container>

            {status === 'error' && message ? (
              <ErrorMessage
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <i className="fas fa-circle-exclamation"></i>
                {message}
              </ErrorMessage>
            ) : null}
          </SignupBar>
        )}
      </AnimatePresence>
    </StickyWrapper>
  );

  if (!isMounted) return null;

  return createPortal(signupContent, document.body);
};

export default CalendarSignup;
