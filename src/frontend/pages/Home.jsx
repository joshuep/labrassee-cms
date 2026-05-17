'use client'

import React from 'react';
import Hero from '../components/home/Hero';
import CalendarSignup from '../components/home/CalendarSignup';
import EventsSpotlight from '../components/home/EventsSpotlight';
import Testimonials from '../components/home/Testimonials';

/**
 * @param {{
 *   events?: import('../lib/payload-data').FrontendEvent[];
 *   initialIndex?: number;
 * }} props
 */
const Home = ({ events = [], initialIndex = 0 }) => {
  return (
    <div style={{ width: '100%', background: 'var(--color-dark)' }}>
      <Hero />
      <EventsSpotlight events={events} initialIndex={initialIndex} />
      <Testimonials />
      <CalendarSignup />
    </div>
  );
};

export default Home;
