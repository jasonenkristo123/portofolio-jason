import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useViewportActivity';

const SEAGULL_DIALOGUES = [
  'Squawk! Are there any french fries down there?',
  "From up here, that crab's volleyball spike looks incredibly powerful!",
  'The referee is ready! Watch that the ball does not land in a palm tree!',
  "Duck, please return the crab's ball if it lands in the water!",
  'Beach volleyball score: Team Crab 10, Coastal Wind 8!',
  'Airborne referee reporting: an exciting and fair match is underway!',
  'The clear sky is perfect for a leisurely flight over the beach ~',
  "Today's breeze is ideal for gliding!",
  'This impressive portfolio looks even better from above the clouds!'
];

const createShuffledDeck = (items: string[], lastItem?: string): string[] => {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  if (lastItem && deck[0] === lastItem && deck.length > 1) {
    [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
  }
  return deck;
};

const ALTITUDE_ZONES = [
  { min: 10, max: 24 },
  { min: 28, max: 36 },
  { min: 58, max: 68 }
];

interface FlyingSeagullProps {
  isActive?: boolean;
}

export const FlyingSeagull: React.FC<FlyingSeagullProps> = ({ isActive = true }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [altitudePercent, setAltitudePercent] = useState<number>(14);
  const [currentQuip, setCurrentQuip] = useState<string | null>(null);

  const x = useMotionValue(-160);
  const deckRef = useRef<string[]>(createShuffledDeck(SEAGULL_DIALOGUES));
  const lastQuipRef = useRef<string>('');

  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const flightLoop = (currentTime: number) => {
      const delta = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const currX = x.get();
      const flightSpeed = 72;
      const screenWidth = window.innerWidth;

      if (direction === 'ltr') {
        const nextX = currX + flightSpeed * delta;
        if (nextX > screenWidth + 160) {
          const nextDir = Math.random() > 0.5 ? 'rtl' : 'ltr';
          const randomZone = ALTITUDE_ZONES[Math.floor(Math.random() * ALTITUDE_ZONES.length)];
          const nextAlt = randomZone.min + Math.random() * (randomZone.max - randomZone.min);

          setDirection(nextDir);
          setAltitudePercent(nextAlt);
          x.set(nextDir === 'rtl' ? screenWidth + 160 : -160);
        } else {
          x.set(nextX);
        }
      } else {
        const nextX = currX - flightSpeed * delta;
        if (nextX < -160) {
          const nextDir = Math.random() > 0.5 ? 'ltr' : 'rtl';
          const randomZone = ALTITUDE_ZONES[Math.floor(Math.random() * ALTITUDE_ZONES.length)];
          const nextAlt = randomZone.min + Math.random() * (randomZone.max - randomZone.min);

          setDirection(nextDir);
          setAltitudePercent(nextAlt);
          x.set(nextDir === 'ltr' ? -160 : screenWidth + 160);
        } else {
          x.set(nextX);
        }
      }

      animId = requestAnimationFrame(flightLoop);
    };

    animId = requestAnimationFrame(flightLoop);
    return () => cancelAnimationFrame(animId);
  }, [direction, x, isActive, prefersReducedMotion]);

  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;

    const quipInterval = setInterval(() => {
      const currX = x.get();
      if (currX > 100 && currX < window.innerWidth - 140) {
        if (deckRef.current.length === 0) {
          deckRef.current = createShuffledDeck(SEAGULL_DIALOGUES, lastQuipRef.current);
        }

        const nextQuip = deckRef.current.pop() || SEAGULL_DIALOGUES[0];
        lastQuipRef.current = nextQuip;
        setCurrentQuip(nextQuip);

        setTimeout(() => {
          setCurrentQuip(null);
        }, 3000);
      }
    }, 8800);

    return () => clearInterval(quipInterval);
  }, [isActive, prefersReducedMotion, x]);

  return (
    <motion.div
      style={{
        x,
        top: `${altitudePercent}%`,
        position: 'absolute',
        pointerEvents: 'none'
      }}
      className="z-20 select-none will-change-transform"
    >
      <div className={`relative ${direction === 'rtl' ? '-scale-x-100' : 'scale-x-100'}`}>
        <div className={`relative ${!isActive ? 'anim-paused' : 'anim-seagull-glide'}`}>
          <svg
            width="58"
            height="42"
            viewBox="0 0 58 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 24 L2 28 L6 22 Z"
              fill="#CBD5E1"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />

            <path
              d="M8 24 C14 20, 28 20, 38 22 C44 24, 46 22, 48 18 C52 18, 54 22, 48 26 C40 30, 24 30, 12 28 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />

            <path
              d="M48 20 L56 22 L48 24 Z"
              fill="#FACC15"
              stroke="#EA580C"
              strokeWidth="1"
            />
            <circle cx="53" cy="22.5" r="1" fill="#EA580C" />

            <circle cx="44" cy="20" r="1.8" fill="#0F172A" />
            <circle cx="44.5" cy="19.5" r="0.6" fill="#FFFFFF" />

            {/* Wing flapping via GPU CSS scaleY transform instead of 60fps SVG path d morphing */}
            <g className={!isActive ? 'anim-paused' : 'anim-seagull-wing'}>
              <path
                d="M22 22 C26 6, 36 2, 44 4 C36 12, 30 18, 22 22 Z"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
              <path d="M38 6 L44 4 L42 10 Z" fill="#475569" />
            </g>
          </svg>

          {isActive && !prefersReducedMotion && currentQuip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-[#0284c7] text-[11px] font-bold shadow-md border border-[#38bdf8] whitespace-nowrap flex items-center gap-1 ${
                direction === 'rtl' ? '-scale-x-100' : 'scale-x-100'
              }`}
            >
              <span>{currentQuip}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
