import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useResetLenis = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Reset Lenis scroll on route change
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname]);
};
