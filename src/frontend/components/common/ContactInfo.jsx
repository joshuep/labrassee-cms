import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { businessInfo as fallbackBusinessInfo } from '../../data/menu';

const ContactContainer = styled.div`
  width: 800px;
  max-width: 800px;
  align-self: center;
  padding: 0 20px;
  margin: 40px 0;
  
  @media (max-width: 840px) {
    width: 90vw;
  }
  
  @media (max-width: 768px) {
    width: 90vw;
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    width: 95vw;
    padding: 0 10px;
  }
`;

const ContactHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const IconWrapper = styled.div`
  color: var(--color-brand);
  font-size: 32px;
  margin-right: 15px;
  margin-top:5px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
    margin-right: 10px;
  }
`;

const ContactTitle = styled.span`
  color: var(--color-brand);
  font-size: 32px;
  font-weight: bold;
  padding-right: 20px;
  letter-spacing: 1px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    white-space: normal;
    text-align: center;
    line-height: 1.2;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: var(--color-accent);
  opacity: 0.8;
`;

const ContactRow = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid rgba(205, 196, 157, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 480px) {
    padding: 16px 0;
  }
`;

const ContactLabel = styled.span`
  color: var(--color-brand);
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 8px;
  }
`;

const ContactEmail = styled.a`
  color: var(--color-white);
  font-size: 26px;
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 300;
  
  &:hover {
    color: var(--color-brand);
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const ContactInfo = ({ businessInfo }) => {
  const source = businessInfo || fallbackBusinessInfo;
  const isEmail = (value) => typeof value === 'string' && value.includes('@');

  const contactData = [
    {
      label: 'POUR TOUTES QUESTIONS',
      email: source.contact.general
    },
    {
      label: 'ARTISTES',
      email: source.contact.artists
    },
    {
      label: 'EXPOSITIONS',
      email: source.contact.exhibitions
    }
  ];

  return (
    <ContactContainer>
      <ContactHeader>
        <IconWrapper>
          <i className="ti-email"></i>
        </IconWrapper>
        <ContactTitle>N'HÉSITE PAS À NOUS ÉCRIRE!</ContactTitle>
        <Divider />
      </ContactHeader>
      
      {contactData.map((contact, index) => (
        <ContactRow
          key={contact.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.02, duration: 0.2 }}
        >
          <ContactLabel>{contact.label}</ContactLabel>
          {isEmail(contact.email) ? (
            <ContactEmail href={`mailto:${contact.email}`}>
              {contact.email}
            </ContactEmail>
          ) : (
            <ContactEmail as="span">
              {contact.email}
            </ContactEmail>
          )}
        </ContactRow>
      ))}
      
    </ContactContainer>
  );
};

export default ContactInfo;
