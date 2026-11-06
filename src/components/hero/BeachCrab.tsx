import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useViewportActivity';

export interface BeachCrabHandle {
  triggerStun: (knockbackDirection: 'left' | 'right') => void;
  getCrabRect: () => DOMRect | null;
  isStunned: () => boolean;
}

interface BeachCrabProps {
  isActive?: boolean;
}

const CRAB_DIALOGUES = [
  '*Clack, clack go the claws*',
  'My claw spike is unmatched on the beach volleyball court!',
  'Do not distract me, duck—I am warming up my serve!',
  'Seagull, please referee the match fairly from up there!',
  'Claw smash! Team Crab owns the court today!',
  'Duck, if the ball lands in the water, please send it back!',
  'Sideways is the finest way to play beach volleyball!',
  "The court is ready for today's beach tournament!",
  'Watch out for these powerful claws!',
  'The sand is especially warm and soft today ~',
  "Jason's code is clean, resilient, and built to last!"
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

export const BeachCrab = forwardRef<BeachCrabHandle, BeachCrabProps>(
  ({ isActive = true }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const screenInitialWidth = typeof window !== 'undefined' ? window.innerWidth + 80 : 1500;
    const x = useMotionValue(screenInitialWidth);
    const [currentQuip, setCurrentQuip] = useState<string | null>(null);
    const [isStunned, setIsStunned] = useState<boolean>(false);
    const [knockbackDir, setKnockbackDir] = useState<number>(0);
    const crabRef = useRef<HTMLDivElement | null>(null);
    const isStunnedRef = useRef<boolean>(false);

    const deckRef = useRef<string[]>(createShuffledDeck(CRAB_DIALOGUES));
    const lastQuipRef = useRef<string>('');

    useImperativeHandle(ref, () => ({
      triggerStun: (knockbackDirection: 'left' | 'right') => {
        if (isStunnedRef.current) return;
        isStunnedRef.current = true;
        setIsStunned(true);
        setKnockbackDir(knockbackDirection === 'left' ? -25 : 25);
        setCurrentQuip('OUCH! *Dizzy pinch!* >_<');

        setTimeout(() => {
          setKnockbackDir(0);
        }, 900);

        setTimeout(() => {
          isStunnedRef.current = false;
          setIsStunned(false);
          setCurrentQuip(null);
        }, 2800);
      },
      getCrabRect: () => {
        return crabRef.current ? crabRef.current.getBoundingClientRect() : null;
      },
      isStunned: () => isStunnedRef.current
    }));

    useEffect(() => {
      if (!isActive || prefersReducedMotion) return;

      let animId: number;
      let lastTime = performance.now();

      const scuttleLoop = (currentTime: number) => {
        const delta = Math.min(0.05, (currentTime - lastTime) / 1000);
        lastTime = currentTime;

        if (!isStunnedRef.current) {
          const currX = x.get();
          const crabSpeed = 34;
          let nextX = currX - crabSpeed * delta;
          const screenWidth = window.innerWidth;

          if (nextX < -120) {
            nextX = screenWidth + 120;
          }

          x.set(nextX);
        }

        animId = requestAnimationFrame(scuttleLoop);
      };

      animId = requestAnimationFrame(scuttleLoop);
      return () => cancelAnimationFrame(animId);
    }, [x, isActive, prefersReducedMotion]);

    useEffect(() => {
      if (!isActive || prefersReducedMotion) {
        if (!isStunnedRef.current) setCurrentQuip(null);
        return;
      }

      const quipInterval = setInterval(() => {
        if (!isStunnedRef.current) {
          const currX = x.get();
          if (currX > 100 && currX < window.innerWidth - 140) {
            if (deckRef.current.length === 0) {
              deckRef.current = createShuffledDeck(CRAB_DIALOGUES, lastQuipRef.current);
            }

            const nextQuip = deckRef.current.pop() || CRAB_DIALOGUES[0];
            lastQuipRef.current = nextQuip;
            setCurrentQuip(nextQuip);

            setTimeout(() => {
              if (!isStunnedRef.current) setCurrentQuip(null);
            }, 3000);
          }
        }
      }, 9200);

      return () => clearInterval(quipInterval);
    }, [isActive, prefersReducedMotion, x]);

    return (
      <motion.div
        ref={crabRef}
        style={{
          x,
          position: 'absolute',
          pointerEvents: 'none'
        }}
        className="z-20 select-none bottom-28 sm:bottom-36 md:bottom-[185px] scale-[0.75] sm:scale-[0.85] md:scale-100 origin-bottom will-change-transform"
      >
        <div
          style={{
            transform: knockbackDir ? `translateX(${knockbackDir}px)` : undefined,
            transition: 'transform 0.6s ease-out'
          }}
        >
          <div className={`relative ${!isActive ? 'anim-paused' : 'anim-crab-scuttle'}`}>
            {isStunned && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-8 pointer-events-none z-30 flex items-center justify-around">
                <span className="text-sm select-none animate-bounce">⭐</span>
                <span className="text-xs select-none animate-spin">✨</span>
                <span className="text-sm select-none animate-bounce">💫</span>
              </div>
            )}

            <svg
              width="62"
              height="46"
              viewBox="0 0 62 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="31" cy="41" rx="22" ry="3.5" fill="rgba(212, 178, 125, 0.55)" />

              <path d="M16 24 C10 24, 6 28, 4 34" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M18 26 C12 28, 8 32, 7 38" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M22 28 C18 32, 14 36, 12 40" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />

              <path d="M46 24 C52 24, 56 28, 58 34" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M44 26 C50 28, 54 32, 55 38" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M40 28 C44 32, 48 36, 50 40" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />

              <path d="M20 20 C14 16, 10 12, 10 8" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
              <g className={!isActive ? 'anim-paused' : 'anim-crab-claw-l'}>
                <path d="M10 8 C6 4, 4 6, 4 10 C6 14, 10 14, 12 10 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.2" />
                <path d="M8 6 C5 2, 2 5, 4 9" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              <path d="M42 20 C48 16, 52 12, 52 8" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
              <g className={!isActive ? 'anim-paused' : 'anim-crab-claw-r'}>
                <path d="M52 8 C56 4, 58 6, 58 10 C56 14, 52 14, 50 10 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.2" />
                <path d="M54 6 C57 2, 60 5, 58 9" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              <ellipse cx="31" cy="24" rx="17" ry="12" fill="#F97316" stroke="#EA580C" strokeWidth="2" />
              <path d="M20 18 Q31 14 42 18" stroke="#FED7AA" strokeWidth="1.8" strokeLinecap="round" />

              <line x1="26" y1="14" x2="26" y2="8" stroke="#EA580C" strokeWidth="2" />
              <line x1="36" y1="14" x2="36" y2="8" stroke="#EA580C" strokeWidth="2" />

              {isStunned ? (
                <>
                  <circle cx="26" cy="7" r="3.5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1" />
                  <path d="M24 5 L28 9 M28 5 L24 9" stroke="#7C2D12" strokeWidth="1.8" strokeLinecap="round" />

                  <circle cx="36" cy="7" r="3.5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1" />
                  <path d="M34 5 L38 9 M38 5 L34 9" stroke="#7C2D12" strokeWidth="1.8" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="26" cy="7" r="3.5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1" />
                  <circle cx="26" cy="7" r="1.8" fill="#0F172A" />
                  <circle cx="27" cy="6" r="0.6" fill="#FFFFFF" />

                  <circle cx="36" cy="7" r="3.5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1" />
                  <circle cx="36" cy="7" r="1.8" fill="#0F172A" />
                  <circle cx="37" cy="6" r="0.6" fill="#FFFFFF" />
                </>
              )}

              {isStunned ? (
                <path d="M27 27 Q29 25 31 27 T35 27" stroke="#7C2D12" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M28 26 Q31 29 34 26" stroke="#7C2D12" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>

            {currentQuip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-[#c2410c] text-[11px] font-bold shadow-md border border-[#f97316] whitespace-nowrap flex items-center gap-1"
              >
                <span>{currentQuip}</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

BeachCrab.displayName = 'BeachCrab';
