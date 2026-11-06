import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Menu, X } from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { scrollToTopSmooth } from '../../hooks/useLenisSmoothScroll';
import { useClipboard } from '../../hooks/useClipboard';
import { profileData } from '../../data/portfolioData';
import { BrandLogo } from '../common/BrandLogo';

const NAV_ITEMS = [
  { label: 'Profile', id: 'about' },
  { label: 'Case Studies', id: 'projects' },
  { label: 'Tech Stack', id: 'stack' },
  { label: 'Activity', id: 'activity' },
  { label: 'Milestone', id: 'journey' },
  { label: 'Contact', id: 'contact' }
] as const;

export const NavigationBar: React.FC = () => {
  const { isScrolled, scrollToSection } = useScrollPosition();
  const { copied, copy } = useClipboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const activeSectionRef = useRef<string>('about');

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const isManualClickRef = useRef<boolean>(false);
  const manualClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionOffsetsRef = useRef<{ id: string; top: number }[]>([]);
  const docHeightRef = useRef<number>(0);

  const updatePill = (sectionId: string) => {
    const el = tabRefs.current[sectionId];
    if (el) {
      setPillStyle({
        left: el.offsetLeft,
        width: el.offsetWidth
      });
    }
  };

  useEffect(() => {
    updatePill(activeSection);
  }, [activeSection]);

  useEffect(() => {
    const handleResize = () => updatePill(activeSectionRef.current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const measureSections = () => {
      const offsets: { id: string; top: number }[] = [];
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          offsets.push({
            id: item.id,
            top: el.getBoundingClientRect().top + window.scrollY
          });
        }
      }
      sectionOffsetsRef.current = offsets;
      docHeightRef.current = document.documentElement.scrollHeight;
    };

    measureSections();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedMeasure = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measureSections, 150);
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(debouncedMeasure) : null;
    if (resizeObserver) {
      resizeObserver.observe(document.body);
    }
    window.addEventListener('resize', debouncedMeasure);

    let ticking = false;
    const evaluateActiveSection = () => {
      ticking = false;
      if (isManualClickRef.current) return;

      const scrollY = window.scrollY;
      const scrollPosition = scrollY + 240;
      const isAtBottom =
        docHeightRef.current > 0 &&
        window.innerHeight + scrollY >= docHeightRef.current - 80;

      let nextActive = activeSectionRef.current;

      if (isAtBottom) {
        nextActive = 'contact';
      } else {
        const offsets = sectionOffsetsRef.current;
        for (let i = offsets.length - 1; i >= 0; i--) {
          if (scrollPosition >= offsets[i].top) {
            nextActive = offsets[i].id;
            break;
          }
        }
      }

      if (nextActive !== activeSectionRef.current) {
        activeSectionRef.current = nextActive;
        setActiveSection(nextActive);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(evaluateActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    evaluateActiveSection();

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', debouncedMeasure);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (id: string) => {
    isManualClickRef.current = true;
    activeSectionRef.current = id;
    setActiveSection(id);
    updatePill(id);
    scrollToSection(id);
    setMobileMenuOpen(false);

    if (manualClickTimerRef.current) clearTimeout(manualClickTimerRef.current);
    manualClickTimerRef.current = setTimeout(() => {
      isManualClickRef.current = false;
    }, 850);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        isScrolled
          ? 'bg-[#02587a]/95 backdrop-blur-md border-b border-[#38bdf8]/35 py-3 shadow-[0_8px_32px_rgba(2,88,122,0.35)]'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <button
          type="button"
          onClick={scrollToTopSmooth}
          className="flex items-center gap-2 text-left group cursor-pointer"
        >
          <BrandLogo size="md" withText />
        </button>

        <nav
          className={`hidden md:flex items-center relative bg-white/15 hover:bg-white/20 border border-white/30 p-1.5 rounded-full shadow-[0_4px_20px_rgba(2,132,199,0.18)] transition-colors ${
            isScrolled ? '' : 'backdrop-blur-md'
          }`}
        >
          {pillStyle.width > 0 && (
            <div
              className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-white/25 border border-white/40 shadow-inner pointer-events-none transition-[transform,width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={{
                transform: `translate3d(${pillStyle.left}px, 0, 0)`,
                width: `${pillStyle.width}px`
              }}
            >
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#fff9d4] shadow-[0_0_6px_#fff9d4]" />
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[item.id] = el;
                }}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer group select-none"
              >
                <span className={`block wave-text-half ${isActive ? 'is-active' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => copy(profileData.contact.email)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 hover:border-[#fff9d4] text-xs font-mono text-white shadow-md transition-all cursor-pointer group active:scale-95 ${
              isScrolled ? '' : 'backdrop-blur-md'
            }`}
            title="Copy email address"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#fff9d4]" />
                <span className="text-[#fff9d4] font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#fff9d4] group-hover:rotate-6 transition-transform" />
                <span className="text-white font-medium">{profileData.contact.email}</span>
              </>
            )}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => copy(profileData.contact.email)}
            className="p-2.5 rounded-xl bg-white/15 border border-white/30 text-white active:scale-95 transition-transform shadow-sm"
            aria-label="Copy email address"
          >
            {copied ? <Check className="w-4 h-4 text-[#fff9d4]" /> : <Copy className="w-4 h-4 text-[#fff9d4]" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/15 border border-white/30 text-white active:scale-95 transition-transform shadow-sm"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden bg-[#02587a]/98 border-b border-[#38bdf8]/35 px-6 py-4 mt-2 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="w-full text-left py-2.5 px-3.5 rounded-xl text-sm font-semibold text-white hover:text-[#fff9d4] hover:bg-white/15 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
