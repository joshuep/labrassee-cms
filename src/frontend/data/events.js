export const events = [
  {
    id: 'mod-ltr-22',
    title: 'MOD LTR',
    date: '2025-06-06',
    time: '20h00',
    image: '/images/posters/MOD_AFF_LTR_-22.png',
    facebookLink: 'https://www.facebook.com/events/1055489439870825'
  },
  {
    id: 'swing-machine',
    title: 'Swing Machine',
    date: '2025-06-06',
    time: '19h30',
    image: '/images/posters/0403_SWINGMACHINE-3.png',
    facebookLink: 'https://www.facebook.com/events/1861388438009934'
  },
  {
    id: 'jardins-cairns',
    title: 'Jardins Cairns',
    date: '2025-06-07',
    time: '21h00',
    image: '/images/posters/0405_JARDINSCAIRNS.png',
    facebookLink: 'https://www.facebook.com/events/572751778567192'
  },
  {
    id: 'underdog-9',
    title: 'Underdog',
    date: '2025-06-09',
    image: '/images/posters/Underdog_SiteWEB_LaBrasseeVF-1-1582x2048.png',
    facebookLink: 'https://www.facebook.com/events/972004091364709'
  },
  {
    id: 'micro-ouvert-10',
    title: 'Micro Ouvert',
    date: '2025-06-10',
    image: '/images/posters/micro-ouvert-02-1583x2048.png',
    facebookLink: 'https://www.facebook.com/events/650084871362899/'
  },
  {
    id: '5a-sciences',
    title: '5 à Sciences',
    date: '2025-06-11',
    image: '/images/posters/thumbnail_5aSciences_DelabyJacq-1.jpg',
    facebookLink: 'https://www.facebook.com/events/718331784688812'
  },
  {
    id: 'rdv-nouvelles-musiques',
    title: 'RDV Nouvelles Musiques',
    date: '2025-06-11',
    image: '/images/posters/RDV-nouvelles-musiques-scaled.png',
    facebookLink: 'https://www.facebook.com/events/689820760452536'
  },
  {
    id: 'frame-12',
    title: 'Frame',
    date: '2025-06-12',
    image: '/images/posters/Frame-1-2.png',
    facebookLink: 'https://www.facebook.com/events/564792789970785'
  },
  {
    id: 'mod-ltr',
    title: 'MOD LTR',
    date: '2025-06-13',
    image: '/images/posters/MOD_AFF_LTR_.png',
    facebookLink: 'https://www.facebook.com/events/1342997256975076/'
  },
  {
    id: 'domlebo',
    title: 'Domlebo',
    date: '2025-06-20',
    image: '/images/posters/Affiche-Domlebo-01-01-1583x2048.png',
    facebookLink: 'https://www.facebook.com/events/972004091364709/972004098031375'
  },
  {
    id: 'micro-ouvert-08',
    title: 'Micro Ouvert',
    date: '2025-07-08',
    image: '/images/posters/micro-ouvert03-1583x2048.png',
    facebookLink: 'https://www.facebook.com/events/650084871362899/650084878029565'
  }
];

export const getUpcomingEvents = (currentDate = new Date()) => {
  // Créer une date à minuit pour la comparaison
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
  return events.filter(event => {
    // Parser la date en évitant le problème de fuseau horaire
    const [year, month, day] = event.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day); // month - 1 car les mois sont 0-indexés
    
    return eventDate >= today;
  });
};

export const getPastEvents = (currentDate = new Date()) => {
  // Créer une date à minuit pour la comparaison
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
  return events.filter(event => {
    // Parser la date en évitant le problème de fuseau horaire
    const [year, month, day] = event.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day); // month - 1 car les mois sont 0-indexés
    
    return eventDate < today;
  });
};