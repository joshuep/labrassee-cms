'use client'

import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

const PageShell = styled.div`
  min-height: 100vh;
  padding: calc(var(--header-height) + 3rem) 1.25rem 5rem;
  background:
    radial-gradient(circle at top, rgba(247, 209, 53, 0.08), transparent 32%),
    linear-gradient(180deg, #17150f 0%, #100f09 55%, #0c0b07 100%);

  @media (min-width: 768px) {
    padding: calc(var(--header-height) + 4rem) 2rem 6rem;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
`;

const Eyebrow = styled.p`
  margin-bottom: 1rem;
  color: rgba(247, 209, 53, 0.78);
  font-size: 0.9rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
`;

const Heading = styled.h1`
  max-width: 12ch;
  margin-bottom: 1rem;
  color: var(--color-white);
  font-size: clamp(3rem, 12vw, 6.5rem);
  font-weight: 450;
  line-height: 0.92;
  letter-spacing: -0.04em;
  text-transform: uppercase;
`;

const Intro = styled.p`
  max-width: 36rem;
  margin-bottom: 2rem;
  color: rgba(241, 239, 228, 0.78);
  font-family: var(--font-acumin);
  font-size: 1rem;
  line-height: 1.7;

  @media (min-width: 768px) {
    margin-bottom: 2.5rem;
    font-size: 1.05rem;
  }
`;

const Card = styled(motion.section)`
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
  background: rgba(16, 15, 9, 0.92);
  border: 1px solid rgba(247, 209, 53, 0.22);
  border-radius: 1.5rem;
  box-shadow:
    0 22px 80px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);

  &::before {
    content: '';
    position: absolute;
    inset: auto -10% -45% auto;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(247, 209, 53, 0.14), transparent 70%);
    pointer-events: none;
  }

  @media (min-width: 768px) {
    padding: 2rem;
    border-radius: 1.75rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1rem;
`;

const IconBadge = styled.div`
  display: flex;
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  background: rgba(247, 209, 53, 0.12);
  border-radius: 1rem;
  color: var(--color-brand);
  font-size: 1.15rem;
  flex-shrink: 0;
`;

const CardTitle = styled.h2`
  margin: 0;
  color: var(--color-white);
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CardText = styled.p`
  margin-bottom: 1.5rem;
  color: rgba(241, 239, 228, 0.68);
  font-family: var(--font-acumin);
  font-size: 0.98rem;
  line-height: 1.65;
`;

const Form = styled.form`
  display: grid;
  gap: 0.9rem;

  @media (min-width: 768px) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }
`;

const InputWrap = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const EmailInput = styled.input`
  width: 100%;
  padding: 0.95rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.95rem;
  color: var(--color-white);
  font-size: 1rem;
  outline: none;
  transition: all 0.25s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  &:focus {
    border-color: rgba(247, 209, 53, 0.5);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(247, 209, 53, 0.1);
  }

  &:disabled {
    opacity: 0.75;
  }
`;

const SubmitButton = styled(motion.button)`
  display: inline-flex;
  min-height: 3.5rem;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.95rem 1.35rem;
  background: var(--color-brand);
  border: none;
  border-radius: 0.95rem;
  color: var(--color-dark);
  cursor: pointer;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  transition: background 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(247, 209, 53, 0.86);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Feedback = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.95rem 1rem;
  margin-top: 1rem;
  border-radius: 1rem;
  font-family: var(--font-acumin);
  font-size: 0.98rem;
  line-height: 1.5;
`;

const SuccessFeedback = styled(Feedback)`
  background: rgba(247, 209, 53, 0.08);
  border: 1px solid rgba(247, 209, 53, 0.22);
  color: var(--color-brand);
`;

const ErrorFeedback = styled(Feedback)`
  background: rgba(255, 143, 143, 0.08);
  border: 1px solid rgba(255, 143, 143, 0.22);
  color: #ff9a9a;
`;

const HoneypotInput = styled.input`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

const FooterNote = styled.p`
  margin-top: 1.15rem;
  color: rgba(241, 239, 228, 0.45);
  font-family: var(--font-acumin);
  font-size: 0.9rem;
  line-height: 1.6;
`;

const CalendarUnsubscribe = () => {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/calendar-unsubscribe', {
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

      setStatus('success');
      setMessage(result?.message || 'Courriel désabonné.');
      setEmail('');
      setWebsite('');
    } catch (_error) {
      setStatus('error');
      setMessage('Erreur réseau, réessaie plus tard.');
    }
  };

  return (
    <PageShell>
      <Content>
        <Eyebrow>Calendrier mensuel</Eyebrow>
        <Heading>Se désabonner</Heading>
        <Intro>
          Entre le courriel que tu avais utilisé pour t'abonner.
        </Intro>

        <Card
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <CardHeader>
            <IconBadge>
              <i className="far fa-envelope-open"></i>
            </IconBadge>
            <CardTitle>Je ne veux plus recevoir de courriels de la part de La Brassée.</CardTitle>
          </CardHeader>

          <CardText>
            Nous retirerons ton adresse courriel de la liste des abonné(e)s au calendrier mensuel des événements.
            Tu ne recevras plus de courriels de notre part.
          </CardText>

          <Form onSubmit={handleSubmit}>
            <InputWrap>
              <HoneypotInput
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                aria-hidden="true"
              />
              <EmailInput
                type="email"
                placeholder="Ton courriel"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={status === 'loading'}
              />
            </InputWrap>

            <SubmitButton
              type="submit"
              disabled={status === 'loading'}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
            >
              <i className={status === 'loading' ? 'fas fa-spinner fa-spin' : 'fas fa-user-minus'}></i>
              Se désabonner
            </SubmitButton>
          </Form>

          <AnimatePresence mode="wait">
            {status === 'success' && message ? (
              <SuccessFeedback
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <i className="fas fa-check"></i>
                {message}
              </SuccessFeedback>
            ) : null}

            {status === 'error' && message ? (
              <ErrorFeedback
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <i className="fas fa-circle-exclamation"></i>
                {message}
              </ErrorFeedback>
            ) : null}
          </AnimatePresence>

          <FooterNote>
            Tu pourras toujours te réinscrire plus tard depuis la page d’accueil si jamais tu changes d’idée.
          </FooterNote>
        </Card>
      </Content>
    </PageShell>
  );
};

export default CalendarUnsubscribe;
