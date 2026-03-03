'use client'

import React from 'react';
import Hero from '../components/home/Hero';
import CalendarSignup from '../components/home/CalendarSignup';
import EventsCarousel from '../components/home/EventsCarousel';
import Testimonials from '../components/home/Testimonials';

/**
 * @param {{ events?: import('../lib/payload-data').FrontendEvent[] }} props
 */
const Home = ({ events = [] }) => {
  return (
    <div style={{ width: '100%', background: 'var(--color-dark)' }}>
      <Hero />
      <EventsCarousel events={events} />
      <Testimonials />
      <CalendarSignup />
    </div>
  );
};

export default Home;
