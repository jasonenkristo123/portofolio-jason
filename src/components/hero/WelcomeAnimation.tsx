import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrandLogo } from '../common/BrandLogo';
import { usePrefersReducedMotion } from '../../hooks/useViewportActivity';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

const BUBBLE_COUNT = 8;

export const WelcomeAnimation = ({ onComplete }: WelcomeAnimationProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<'sweep' | 'submerged' | 'dive' | 'done'>(() =>
    prefersReducedMotion ? 'done' : 'sweep'
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      const id = setTimeout(onComplete, 0);
      return () => clearTimeout(id);
    }

    const t1 = setTimeout(() => {
      setPhase('submerged');
    }, 850);

    const t2 = setTimeout(() => {
      setPhase('dive');
    }, 1800);

    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, prefersReducedMotion]);

  if (phase === 'done') return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'dive' ? 0 : 1 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none bg-[#071b2f]"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-gradient-to-t from-[#02587a] via-[#0284c7] to-[#0ea5e9] will-change-transform"
      >
        <div className="absolute -top-24 inset-x-0 h-24">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0 60 C320 120, 640 0, 960 60 C1200 100, 1360 40, 1440 60 L1440 120 L0 120 Z"
              fill="#0ea5e9"
            />
          </svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.0, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-gradient-to-b from-[#02587a] via-[#0284c7] to-[#0ea5e9] will-change-transform"
      >
        <div className="absolute -top-28 inset-x-0 h-28">
          <svg
            viewBox="0 0 1440 140"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0 50 C280 110, 560 10, 840 70 C1120 120, 1320 20, 1440 50 L1440 140 L0 140 Z"
              fill="#02587a"
            />
            <path
              d="M0 50 C280 110, 560 10, 840 70 C1120 120, 1320 20, 1440 50"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent" />

        {Array.from({ length: BUBBLE_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: '100vh',
              x: `${(i * 12.5 + 6) % 96}vw`,
              opacity: 0.25,
              scale: 0.7 + (i % 4) * 0.2
            }}
            animate={{
              y: '-15vh',
              opacity: [0.2, 0.75, 0]
            }}
            transition={{
              duration: 1.8 + (i % 3) * 0.35,
              delay: 0.25 + i * 0.1,
              ease: 'easeOut'
            }}
            className="absolute w-4 h-4 rounded-full bg-white/35 border border-white/75 will-change-transform"
          />
        ))}
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{
            opacity: phase === 'submerged' ? 1 : 0,
            scale: phase === 'submerged' ? 1 : phase === 'dive' ? 1.08 : 0.9,
            y: phase === 'submerged' ? 0 : phase === 'dive' ? -20 : 16
          }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col items-center will-change-transform"
        >
          <div className="mb-5 anim-gentle-bob">
            <BrandLogo size="xl" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-widest uppercase">
            Jason Enkristo
          </h1>
          <p className="mt-3 text-sm sm:text-base font-semibold tracking-widest text-[#fff9d4] uppercase">
            Diving into the Portfolio
          </p>

          <div className="mt-6 w-48 h-1 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === 'submerged' || phase === 'dive' ? 1 : 0 }}
              transition={{ duration: 0.95, ease: 'easeInOut' }}
              className="h-full w-full origin-left bg-gradient-to-r from-[#fff9d4] to-white rounded-full will-change-transform"
            />
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/30 text-xs text-white/95 font-medium transition-colors cursor-pointer"
      >
        Skip
      </button>
    </motion.div>
  );
};
