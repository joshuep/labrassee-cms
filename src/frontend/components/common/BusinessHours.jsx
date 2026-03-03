import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { businessInfo as fallbackBusinessInfo } from '../../data/menu';

const HoursContainer = styled.div`
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

const HoursHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const HoursTitle = styled.span`
  color: var(--color-brand);
  font-size: 32px;
  font-weight: bold;
  padding-right: 20px;
  white-space: nowrap;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: var(--color-accent);
  opacity: 0.8;
`;

const HoursRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 18px 0;
  border-bottom: 1px solid rgba(205, 196, 157, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 480px) {
    padding: 15px 0;
  }
`;

const DayText = styled.span`
  color: var(--color-brand);
  font-size: 30px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 280px;
  
  @media (max-width: 768px) {
    font-size: 26px;
    min-width: 240px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
    min-width: 180px;
  }
`;

const TimeBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  flex: 1;
  justify-content: center;
  
  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const TimeText = styled.span`
  color: var(--color-white);
  font-size: 30px;
  font-weight: 300;
  min-width: 80px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 26px;
    min-width: 70px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
    min-width: 60px;
  }
`;

const TimeDivider = styled.div`
  width: 30px;
  height: 1px;
  background-color: var(--color-accent);
  opacity: 0.6;
  
  @media (max-width: 480px) {
    width: 20px;
  }
`;

const BusinessHours = ({ businessInfo }) => {
  const source = businessInfo || fallbackBusinessInfo;
  const hoursData = Object.entries(source.hours).map(([day, hours]) => ({
    day: day.toUpperCase(),
    open: hours.open,
    close: hours.close
  }));

  return (
    <HoursContainer>
      <HoursHeader>
        <HoursTitle>HORAIRE</HoursTitle>
        <Divider />
      </HoursHeader>
      
      {hoursData.map((schedule, index) => (
        <HoursRow
          key={schedule.day}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.02, duration: 0.2 }}
        >
          <DayText>{schedule.day}</DayText>
          <TimeBlock>
            <TimeText>{schedule.open}</TimeText>
            <TimeDivider />
            <TimeText>{schedule.close}</TimeText>
          </TimeBlock>
        </HoursRow>
      ))}
      
    </HoursContainer>
  );
};

export default BusinessHours;
