import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let globalLenisInstance: Lenis | null = null;
let isLenisPaused = false;

export function stopLenisScroll(): void {
  isLenisPaused = true;
  if (globalLenisInstance) {
    globalLenisInstance.stop();
  }
}

export function startLenisScroll(): void {
  isLenisPaused = false;
  if (globalLenisInstance) {
    globalLenisInstance.start();
  }
}

export function scrollToTopSmooth(): void {
  if (globalLenisInstance) {
    globalLenisInstance.scrollTo(0, { duration: 1.0 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function scrollToSectionSmooth(id: string, offset: number = -80): void {
  const element = document.getElementById(id);
  if (!element) return;

  if (globalLenisInstance) {
    globalLenisInstance.scrollTo(element, { offset, duration: 1.0 });
  } else {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY + offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

export function useLenisSmoothScroll(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Native touch scrolling on mobile/tablet is hardware-accelerated at 60-120Hz;
    // running Lenis rAF on touch devices or reduced-motion setups only adds main-thread overhead.
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (isCoarsePointer || prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2
    });

    globalLenisInstance = lenis;

    let animId: number | null = null;

    const raf = (time: number) => {
      if (!isLenisPaused) {
        lenis.raf(time);
      }
      animId = requestAnimationFrame(raf);
    };

    const startLoop = () => {
      if (animId === null) {
        animId = requestAnimationFrame(raf);
      }
    };

    const stopLoop = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopLoop();
      } else {
        startLoop();
      }
    };

    startLoop();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopLoop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      lenis.destroy();
      globalLenisInstance = null;
    };
  }, []);
}
