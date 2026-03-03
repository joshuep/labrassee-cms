import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SocialLinks from '../common/SocialLinks';
import BusinessHours from '../common/BusinessHours';
import ContactInfo from '../common/ContactInfo';
import { businessInfo as fallbackBusinessInfo } from '../../data/menu';

const FooterSection = styled.section`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, var(--color-dark), #1f1c0f);
  border-top: 1px solid #2e2e2e;
`;

const FooterContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 3% 60px 0;

  @media (max-width: 480px) {
    padding-bottom: 140px;
  }
`;

const LocationBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LocationIcon = styled.div`
  position: relative;
  color: var(--color-brand);
  font-size: 60px;
  background: linear-gradient(45deg, #ff42a7, var(--color-brand));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 480px) {
    color: #f8595b;
  }
`;

const AddressLink = styled(motion.a)`
  color: var(--color-white);
  text-align: center;
  font-size: 4vw;
  line-height: 1;
  margin-bottom: 100px;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--color-brand);
  }
  
  @media (max-width: 480px) {
    font-size: 7vw;
  }
`;

const WelcomeSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 60px 0;
`;

const PictoImage = styled(motion.img)`
  height: 500px;
  filter: brightness(0.51);
  position: absolute;
  
  @media (max-width: 480px) {
    height: 200px;
  }
`;

const WelcomeText = styled(motion.h1)`
  color: var(--color-brand);
  font-weight: 100;
  text-align: center;
  font-size: 15vw;
  line-height: 1;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 19vw;
  }

  @media (max-width: 480px) {
    font-size: 22vw;
  }
`;

const SocialMessage = styled(motion.p)`
  color: var(--color-white);
  text-align: center;
  font-size: 19px;
  line-height: 1.3;
  width: 60vw;
  max-width: 670px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    text-align: center;
    width: 80vw;
    font-size: 14px;
  }
`;

const SocialSection = styled(motion.div)`
  max-width: 670px;
  width: 90vw;
  margin: 110px auto 20px auto;
  
  @media (max-width: 480px) {
    width: 80vw;
  }
`;

const Credits = styled(motion.div)`
  width: 100%;
  text-align: center;
  margin-top: 60px;
  padding: 20px 0;
`;

const CreditText = styled.span`
  color: var(--color-white);
  font-family: var(--font-acumin);
  font-size: 12px;
  
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const CreditName = styled.span`
  color: var(--color-brand);
  font-family: var(--font-acumin);
  font-size: 14px;
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const CreditEmail = styled.a`
  color: var(--color-white);
  font-family: var(--font-acumin);
  font-size: 12px;
  text-decoration: none;
  opacity: 0.8;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--color-brand);
    opacity: 1;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const Footer = ({ businessInfo: providedBusinessInfo }) => {
  const businessInfo = providedBusinessInfo || fallbackBusinessInfo;
  const slogan = businessInfo?.slogan?.trim() || 'BIENVENUE CHEZ TOI!'
  const firstSpaceIndex = slogan.indexOf(' ')
  const sloganLine1 = firstSpaceIndex === -1 ? slogan : slogan.slice(0, firstSpaceIndex)
  const sloganLine2 = firstSpaceIndex === -1 ? '' : slogan.slice(firstSpaceIndex + 1)

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <FooterSection>
      <FooterContainer
        as={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={footerVariants}
      >
        <LocationBlock variants={itemVariants}>
          <LocationIcon>
            <i className="fas fa-location-dot"></i>
          </LocationIcon>
          <AddressLink 
            href={businessInfo?.address?.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
          >
            {businessInfo?.address?.street}<br />
            {businessInfo?.address?.neighborhood}
          </AddressLink>
        </LocationBlock>

        <WelcomeSection variants={itemVariants}>
          <PictoImage 
            src="/images/brand/picto_outlined_white.svg"
            alt=""
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.51 }}
            transition={{ duration: 1 }}
          />
          <WelcomeText
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {sloganLine1}
            {sloganLine2 ? (
              <>
                <br />
                {sloganLine2}
              </>
            ) : null}
          </WelcomeText>
        </WelcomeSection>

        <SocialSection variants={itemVariants}>
          <SocialMessage>
            {businessInfo?.message || 'CHERCHE PAS NOTRE NUMÉRO DE TÉLÉPHONE. ON PRÉFÈRE TE RÉPONDRE SUR LES RÉSEAUX SOCIAUX!'}
          </SocialMessage>
          <SocialLinks businessInfo={businessInfo} />
        </SocialSection>

        <motion.div variants={itemVariants}>
          <BusinessHours businessInfo={businessInfo} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ContactInfo businessInfo={businessInfo} />
        </motion.div>

        <Credits variants={itemVariants}>
          <CreditText>Site web réalisé par</CreditText>
          <br />
          <CreditName>Joshué Collin</CreditName>
          <br />
          <CreditEmail href="mailto:pro@joshuep.com">pro@joshuep.com</CreditEmail>
        </Credits>
      </FooterContainer>
    </FooterSection>
  );
};

export default Footer;
