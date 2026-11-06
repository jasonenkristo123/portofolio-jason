import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, Wrench, HardHat, Check, Cpu, Terminal } from 'lucide-react';

interface RebuildConstructionOverlayProps {
  isRebuilding: boolean;
  progress: number;
}

const COMIC_SOUNDS = [
  { icon: <Hammer className="w-5 h-5 text-[#f59e0b]" />, label: 'CLANK!' },
  { icon: <Wrench className="w-5 h-5 text-[#0284c7]" />, label: 'FIXING!' },
  { icon: <Cpu className="w-5 h-5 text-[#059669]" />, label: 'STRUCTURING!' },
  { icon: <Terminal className="w-5 h-5 text-[#8c6239]" />, label: 'RESTORE!' },
  { icon: <Check className="w-5 h-5 text-[#059669]" />, label: 'PERFECT!' }
];

export const RebuildConstructionOverlay: React.FC<RebuildConstructionOverlayProps> = ({
  isRebuilding,
  progress
}) => {
  const [comicTextIndex, setComicTextIndex] = useState(0);

  useEffect(() => {
    if (!isRebuilding) return;

    const interval = setInterval(() => {
      setComicTextIndex((prev) => (prev + 1) % COMIC_SOUNDS.length);
    }, 450);

    return () => clearInterval(interval);
  }, [isRebuilding]);

  if (!isRebuilding || typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-auto select-none bg-[#fff9d4]/96"
    >
      {/* Simplified GPU-friendly SVG Clouds without heavy drop-shadow-2xl filters */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 600 450" fill="none" className="w-[88vw] sm:w-[70vw] max-w-4xl h-[65vh]">
          <circle cx="300" cy="225" r="145" fill="#ffffff" />
          <circle cx="190" cy="190" r="115" fill="#fffdf5" />
          <circle cx="410" cy="190" r="120" fill="#ffffff" />
          <circle cx="210" cy="290" r="110" fill="#fef7dc" />
          <circle cx="390" cy="290" r="115" fill="#f8ecc2" />
          <circle cx="300" cy="130" r="105" fill="#ffffff" />
        </svg>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-6 max-w-lg mx-4 sm:mx-6 scale-90 sm:scale-100">
        <div className="relative w-60 h-28 sm:w-72 sm:h-36 flex items-center justify-center scale-90 sm:scale-100">
          {/* Hammer */}
          <motion.div
            animate={{
              rotate: [-45, 25, -45],
              y: [-8, 12, -8]
            }}
            transition={{
              repeat: Infinity,
              duration: 0.36,
              ease: 'easeInOut'
            }}
            className="absolute left-0 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#f59e0b] text-white shadow-lg border-4 border-white will-change-transform"
          >
            <Hammer className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>

          {/* Hard Hat */}
          <motion.div
            animate={{
              scale: [1, 1.14, 1],
              rotate: [-6, 6, -6]
            }}
            transition={{
              repeat: Infinity,
              duration: 0.5,
              ease: 'easeInOut'
            }}
            className="p-4 sm:p-6 rounded-[28px] sm:rounded-[32px] bg-[#0f172a] text-[#f59e0b] shadow-lg border-4 border-white will-change-transform"
          >
            <HardHat className="w-10 h-10 sm:w-14 sm:h-14" />
          </motion.div>

          {/* Wrench */}
          <motion.div
            animate={{
              rotate: [38, -28, 38],
              y: [8, -10, 8]
            }}
            transition={{
              repeat: Infinity,
              duration: 0.4,
              ease: 'easeInOut'
            }}
            className="absolute right-0 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#0284c7] text-white shadow-lg border-4 border-white will-change-transform"
          >
            <Wrench className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>
        </div>

        {/* Comic Sound Effect */}
        <div className="space-y-1.5 sm:space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={comicTextIndex}
              initial={{ scale: 0.7, rotate: -4 }}
              animate={{ scale: 1.05, rotate: 2 }}
              exit={{ scale: 0.7, rotate: 4 }}
              transition={{ duration: 0.14 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-2xl bg-[#0f172a] text-[#f59e0b] text-sm sm:text-lg font-black font-mono shadow-lg border-2 border-white tracking-wider"
            >
              {COMIC_SOUNDS[comicTextIndex].icon}
              <span>*{COMIC_SOUNDS[comicTextIndex].label}*</span>
            </motion.div>
          </AnimatePresence>

          <h3 className="text-lg sm:text-3xl font-black text-[#0f172a] tracking-tight px-2">
            Rebuilding the Beach...
          </h3>
        </div>

        {/* Progress Bar using GPU scaleX instead of layout width */}
        <div className="w-full max-w-xs sm:max-w-sm space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
          <div className="w-full h-3.5 sm:h-4 rounded-full bg-white border-2 border-[#dfcca8] p-0.5 overflow-hidden shadow-md">
            <div
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#f59e0b] via-[#0284c7] to-[#38bdf8] transition-transform duration-100 ease-out will-change-transform"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#8c6239] px-1">
            <span>RECONSTRUCTION PROGRESS</span>
            <span className="text-sm sm:text-base font-black text-[#0f172a]">{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body
  );
};
