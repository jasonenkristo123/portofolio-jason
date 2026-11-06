import React, { lazy, Suspense, useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { ProfileDuneBackground } from './ProfileDuneBackground';
import { ProfilePhotoCard } from './ProfilePhotoCard';
import { ArchitectureStage } from './ArchitectureStage';
import { FloodActionButton } from './FloodActionButton';
import { useInViewport, usePrefersReducedMotion } from '../../hooks/useViewportActivity';

const FloodWaveOverlay = lazy(() =>
  import('./FloodWaveOverlay').then((m) => ({ default: m.FloodWaveOverlay }))
);
const RebuildConstructionOverlay = lazy(() =>
  import('./RebuildConstructionOverlay').then((m) => ({ default: m.RebuildConstructionOverlay }))
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04
    }
  }
};

// GPU-only opacity + translateY reveal (removed animated CSS blur() & 3D rotations that caused severe scroll jank)
const cardRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const headerRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const EditorialProfile: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInViewport(sectionRef, '100px');
  const prefersReducedMotion = usePrefersReducedMotion();

  const [floodState, setFloodState] = useState<'pristine' | 'flooding' | 'flooded' | 'rebuilding'>('pristine');
  const [rebuildProgress, setRebuildProgress] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const scrollParallaxLeft = useTransform(scrollYProgress, [0, 1], [18, -16]);
  const scrollParallaxRight = useTransform(scrollYProgress, [0, 1], [28, -22]);

  const handleTriggerFlood = () => {
    if (floodState !== 'pristine') return;
    setFloodState('flooding');
    setTimeout(() => {
      setFloodState('flooded');
    }, 1000);
  };

  const handleTriggerRebuild = () => {
    if (floodState !== 'flooded') return;
    setRebuildProgress(0);
    setFloodState('rebuilding');
  };

  useEffect(() => {
    if (floodState !== 'rebuilding') return;

    let currentVal = 0;

    const stepMs = 100;
    const totalDurationMs = 2000;
    const stepIncrement = 100 / (totalDurationMs / stepMs);

    const interval = setInterval(() => {
      currentVal += stepIncrement;
      if (currentVal >= 100) {
        clearInterval(interval);
        setRebuildProgress(100);
        setTimeout(() => {
          setFloodState('pristine');
          setRebuildProgress(0);
        }, 280);
      } else {
        setRebuildProgress(Math.floor(currentVal));
      }
    }, stepMs);

    return () => clearInterval(interval);
  }, [floodState]);

  const isFlooded = floodState === 'flooded' || floodState === 'flooding';

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative pt-24 pb-32 sm:pt-28 sm:pb-44 bg-[#fff9d4] overflow-hidden select-none"
      style={{ contain: 'layout paint' }}
    >
      {floodState === 'rebuilding' && (
        <Suspense fallback={null}>
          <RebuildConstructionOverlay
            isRebuilding
            progress={rebuildProgress}
          />
        </Suspense>
      )}

      {floodState === 'flooding' && (
        <Suspense fallback={null}>
          <FloodWaveOverlay isFlooding />
        </Suspense>
      )}

      <ProfileDuneBackground isFlooded={isFlooded} isActive={isInView} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8"
      >
        {/* Editorial Section Header & Flood Action Controls */}
        <motion.div
          variants={headerRevealVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-[#e2d3b3]"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#8c6239] block mb-2">
              Profile &amp; Expertise
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight leading-[1.08]">
              Full-Stack &amp; Mobile Developer
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <FloodActionButton
              floodState={floodState}
              rebuildProgress={rebuildProgress}
              onTriggerFlood={handleTriggerFlood}
              onTriggerRebuild={handleTriggerRebuild}
            />

            <p className="max-w-xs text-xs text-[#475569] leading-relaxed">
              Experienced in full-scale web applications, mobile development, database architecture, and Linux infrastructure management.
            </p>
          </div>
        </motion.div>

        {/* Interactive Stage Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <motion.div
            variants={cardRevealVariants}
            style={prefersReducedMotion ? undefined : { y: scrollParallaxLeft }}
            className="lg:col-span-5 relative z-10 will-change-transform"
          >
            <ProfilePhotoCard isFlooded={isFlooded} />
          </motion.div>

          <motion.div
            variants={cardRevealVariants}
            style={prefersReducedMotion ? undefined : { y: scrollParallaxRight }}
            className="lg:col-span-7 relative z-10 will-change-transform"
          >
            <ArchitectureStage isFlooded={isFlooded} />
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 pointer-events-none z-20 overflow-hidden">
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,80 Q380,25 760,75 T1440,50 L1440,180 L0,180 Z"
            fill={isFlooded ? '#dfcca8' : '#ebdcae'}
            opacity="0.95"
          />
          <path
            d="M0,105 Q420,60 820,100 T1440,85 L1440,180 L0,180 Z"
            fill={isFlooded ? '#c4ad82' : '#dfcca8'}
          />
        </svg>
      </div>
    </section>
  );
};
