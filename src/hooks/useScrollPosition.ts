import { useState, useEffect, useRef, useCallback } from 'react';
import { scrollToSectionSmooth } from './useLenisSmoothScroll';

export function useScrollPosition() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const isScrolledRef = useRef<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const nextScrolled = window.scrollY > 40;
      if (nextScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    scrollToSectionSmooth(id, -80);
  }, []);

  return { isScrolled, scrollToSection };
}
