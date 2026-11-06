import { useCallback, useRef, useEffect } from 'react';

export function useCardTilt(maxRotation: number = 7) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const enabledRef = useRef<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isCoarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    enabledRef.current = !isCoarse && !reduced;

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!enabledRef.current || !cardRef.current) return;
    rectRef.current = cardRef.current.getBoundingClientRect();
    cardRef.current.style.transition = 'transform 0.1s ease-out';
    cardRef.current.style.willChange = 'transform';
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabledRef.current || !cardRef.current) return;
      const rect = rectRef.current || cardRef.current.getBoundingClientRect();
      rectRef.current = rect;

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!cardRef.current) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2 || 1;
        const centerY = rect.height / 2 || 1;

        const rotateX = ((y - centerY) / centerY) * -maxRotation;
        const rotateY = ((x - centerX) / centerX) * maxRotation;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });
    },
    [maxRotation]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.45s ease-out';
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    cardRef.current.style.willChange = 'auto';
  }, []);

  return {
    cardRef,
    tiltProps: {
      ref: cardRef,
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }
  };
}
