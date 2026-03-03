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
  padding: 0;
  pointer-events: none;

  @media (min-width: 640px) {
    padding: 16px;
  }
`;

const SignupBar = styled(motion.div)`
  width: 100%;
  padding: 16px 20px;
  background: rgba(16, 15, 9, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(247, 209, 53, 0.3);
  border-radius: 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.5);
  pointer-events: auto;

  @media (min-width: 640px) {
    max-width: 780px;
    margin: 0 auto;
    padding: 20px 28px;
    border: 1px solid rgba(247, 209, 53, 0.25);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;

  @media (min-width: 640px) {
    justify-content: space-between;
    gap: 40px;
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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(247, 209, 53, 0.12);
  border-radius: 12px;
  color: var(--color-brand);
  font-size: 18px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    font-size: 20px;
  }
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-white);
  letter-spacing: -0.01em;
  line-height: 1.3;

  @media (min-width: 640px) {
    font-size: 18px;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    gap: 10px;
  }
`;

const EmailInput = styled.input`
  width: 130px;
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

  &:hover {
    background: rgba(247, 209, 53, 0.85);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 640px) {
    width: auto;
    height: auto;
    padding: 14px 24px;
    font-size: 15px;
    font-weight: 600;
    border-radius: 14px;
  }
`;

const ButtonText = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`;

const ButtonIcon = styled.span`
  display: inline;

  @media (min-width: 640px) {
    display: none;
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
                    Confirmé!
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
                      <ButtonIcon>
                        <i className={status === 'loading' ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'}></i>
                      </ButtonIcon>
                      <ButtonText>
                        {status === 'loading' ? 'Envoi...' : "S'inscrire"}
                      </ButtonText>
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
