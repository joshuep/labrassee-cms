import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { businessInfo as fallbackBusinessInfo } from '../../data/menu';

const SocialContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  border-top: 1px solid #4a4a4a;
  border-bottom: 1px solid #4a4a4a;
  padding: 20px 0;
  margin: 40px 0;
`;

const SocialBlock = styled(motion.a)`
  display: grid;
  grid-template-rows: 40px auto;
  place-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--color-white);
`;

const IconWrapper = styled.div`
  font-size: 40px;
  color: ${props => props.$color};
  transition: transform 0.3s ease;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${SocialBlock}:hover & {
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    font-size: 30px;
    height: 30px;
  }
`;

const SocialText = styled.span`
  font-size: 12px;
  text-transform: uppercase;
`;

const OnlyFansIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const SocialLinks = ({ businessInfo }) => {
  const source = businessInfo || fallbackBusinessInfo;

  const socialData = [
    {
      name: 'FACEBOOK',
      icon: 'fab fa-facebook',
      color: '#359df8',
      link: source.social.facebook
    },
    {
      name: 'INSTAGRAM',
      icon: 'fab fa-instagram',
      color: '#f14179',
      link: source.social.instagram
    },
    {
      name: 'ONLYFANS',
      icon: 'onlyfans',
      link: source.social.onlyfans
    }
  ];

  return (
    <SocialContainer>
      {socialData.map((social, index) => (
        <SocialBlock
          key={social.name}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          {social.icon === 'onlyfans' ? (
            <OnlyFansIcon src="/images/misc/onlyfans-logo.svg" alt="OnlyFans" />
          ) : (
            <IconWrapper $color={social.color}>
              <i className={social.icon}></i>
            </IconWrapper>
          )}
          <SocialText>{social.name}</SocialText>
        </SocialBlock>
      ))}
    </SocialContainer>
  );
};

export default SocialLinks;
