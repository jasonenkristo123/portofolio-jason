import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface FloodWaveOverlayProps {
  isFlooding: boolean;
}

export const FloodWaveOverlay: React.FC<FloodWaveOverlayProps> = ({ isFlooding }) => {
  if (!isFlooding || typeof document === 'undefined') return null;

  const isMobile = window.innerWidth < 640;

  return createPortal(
    <div className="fixed inset-0 z-[95] pointer-events-none overflow-hidden select-none">
      <motion.div
        initial={{ x: '-130%' }}
        animate={{ x: '135%' }}
        transition={{ duration: isMobile ? 1.8 : 2.6, ease: [0.25, 0.9, 0.35, 1] }}
        className="absolute inset-y-0 w-[170%] sm:w-[135%] pointer-events-none flex items-center overflow-visible will-change-transform"
      >
        <div className="relative w-full h-full">
          <svg
            viewBox="0 0 1000 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="deepWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#013a52" stopOpacity="0.86" />
                <stop offset="60%" stopColor="#02587a" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#0284c7" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="crestCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.92" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.98" />
              </linearGradient>
            </defs>

            <path
              d="M0,0 L720,0 C820,120 740,240 840,360 C920,460 760,580 870,700 C940,780 820,860 860,900 L0,900 Z"
              fill="url(#deepWaveGrad)"
            />

            <path
              d="M0,0 L760,0 C860,130 780,260 880,380 C950,470 800,600 910,720 C970,790 860,860 900,900 L0,900 Z"
              fill="url(#crestCyanGrad)"
            />

            <path
              d="M740,0 C840,110 770,220 870,350 C940,440 790,560 900,680 C960,760 850,840 890,900 L930,900 C890,830 990,750 930,670 C830,550 970,430 890,330 C800,210 870,100 780,0 Z"
              fill="#ffffff"
            />

            <circle cx="875" cy="80" r="14" fill="#ffffff" opacity="0.95" />
            <circle cx="890" cy="180" r="20" fill="#ffffff" opacity="0.95" />
            <circle cx="910" cy="290" r="24" fill="#ffffff" opacity="0.98" />
            <circle cx="930" cy="400" r="26" fill="#ffffff" opacity="0.98" />
            <circle cx="940" cy="540" r="26" fill="#ffffff" opacity="0.98" />
            <circle cx="920" cy="670" r="22" fill="#ffffff" opacity="0.95" />
            <circle cx="935" cy="810" r="18" fill="#ffffff" opacity="0.9" />
          </svg>

          <div className="absolute right-0 inset-y-0 w-32 overflow-visible pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: (i * 85) % 850 }}
                animate={{
                  opacity: [0, 0.95, 0],
                  x: [0, 45 + ((i * 15) % 60)],
                  y: [(i * 85) % 850, ((i * 85) % 850) + (i % 2 === 0 ? -28 : 28)]
                }}
                transition={{
                  duration: 0.65,
                  repeat: Infinity,
                  delay: (i * 0.06) % 0.8
                }}
                className="absolute w-3 h-3 rounded-full bg-white will-change-transform"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
