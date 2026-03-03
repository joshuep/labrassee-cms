'use client'

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SignupSection = styled.section`
  width: 100%;
  padding: 24px 20px;
  background: rgba(247, 209, 53, 0.04);
  border-top: 1px solid rgba(247, 209, 53, 0.1);
  border-bottom: 1px solid rgba(247, 209, 53, 0.1);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const TextContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-white);
`;

const CalendarIcon = styled.span`
  color: var(--color-brand);
  font-size: 18px;
  opacity: 0.9;
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.3px;
  opacity: 0.9;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EmailInput = styled.input`
  padding: 10px 16px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(247, 209, 53, 0.2);
  border-radius: 8px;
  color: var(--color-white);
  outline: none;
  transition: all 0.2s ease;
  width: 220px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: rgba(247, 209, 53, 0.5);
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 480px) {
    width: 180px;
    padding: 9px 12px;
    font-size: 13px;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  background: var(--color-brand);
  color: var(--color-dark);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(247, 209, 53, 0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 9px 14px;
    font-size: 13px;
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-brand);
  font-size: 14px;
`;

const CalendarSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Simulate API call - replace with actual implementation
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 800);
  };

  return (
    <SignupSection>
      <Container>
        <TextContent>
          <CalendarIcon>
            <i className="far fa-calendar-alt"></i>
          </CalendarIcon>
          <Title>Recevez notre calendrier événementiel</Title>
        </TextContent>

        {status === 'success' ? (
          <SuccessMessage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <i className="fas fa-check-circle"></i>
            Inscription confirmée!
          </SuccessMessage>
        ) : (
          <Form onSubmit={handleSubmit}>
            <EmailInput
              type="email"
              placeholder="Votre courriel"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
            />
            <SubmitButton
              type="submit"
              disabled={status === 'loading'}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'loading' ? 'Envoi...' : "S'inscrire"}
            </SubmitButton>
          </Form>
        )}
      </Container>
    </SignupSection>
  );
};

export default CalendarSignup;
