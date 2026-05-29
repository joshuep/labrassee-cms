import { useEffect } from 'react';
import Lenis from 'lenis';

export const useLenis = () => {
  useEffect(() => {
    // Détection mobile
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Ne pas activer Lenis sur mobile
    if (isMobile) {
      return;
    }

    // Initialiser Lenis — autoRaf:true délègue la boucle RAF à Lenis, qui
    // l'arrête proprement au destroy(). Évite les boucles RAF orphelines qui
    // figeaient le défilement après un remontage du composant (StrictMode/HMR).
    const lenis = new Lenis({
      autoRaf: true,
      duration: 0.8,
      easing: (t) => Math.min(1, 1 - Math.pow(5, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.5,
      touchMultiplier: 2,
      infinite: false,
    });

    // Attacher Lenis à window pour y accéder globalement
    window.lenis = lenis;

    // Cleanup
    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);
};