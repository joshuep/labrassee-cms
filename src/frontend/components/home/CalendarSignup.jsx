'use client'

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const StickyWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px;
  pointer-events: none;
`;

const SignupBar = styled(motion.div)`
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 28px;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(247, 209, 53, 0.25);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  pointer-events: auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    gap: 40px;
  }
`;

const TextContent = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
`;

const IconWrapper = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(247, 209, 53, 0.12);
  border-radius: 14px;
  color: var(--color-brand);
  font-size: 20px;
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: var(--color-white);
  letter-spacing: -0.01em;

  @media (max-width: 480px) {
    font-size: 16px;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 14px 18px;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
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
    width: 200px;
    flex: none;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  background: var(--color-brand);
  color: var(--color-dark);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(247, 209, 53, 0.85);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-brand);
  font-size: 15px;
  font-weight: 500;
`;

const CalendarSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    }, 800);
  };

  return (
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
                <Title>Reçois le calendrier mensuel des événements</Title>
              </TextContent>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <SuccessMessage
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <i className="fas fa-check-circle"></i>
                    Inscription confirmée!
                  </SuccessMessage>
                ) : (
                  <Form key="form" onSubmit={handleSubmit}>
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
                      {status === 'loading' ? 'Envoi...' : "S'inscrire"}
                    </SubmitButton>
                  </Form>
                )}
              </AnimatePresence>
            </Container>
          </SignupBar>
        )}
      </AnimatePresence>
    </StickyWrapper>
  );
};

export default CalendarSignup;
