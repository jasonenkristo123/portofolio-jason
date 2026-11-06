import React, { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import {
  GraduationCap,
  Layers,
  Rocket,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { experienceData } from '../../data/portfolioData';
import type { ExperienceItem } from '../../types/portfolio';
import { JourneyOceanCanvas } from './JourneyOceanCanvas';
import { useInViewport } from '../../hooks/useViewportActivity';

const categoryConfig: Record<
  string,
  {
    icon: React.FC<{ className?: string }>;
    nodeBg: string;
    nodeText: string;
    tagBg: string;
    tagText: string;
    tagBorder: string;
  }
> = {
  education: {
    icon: GraduationCap,
    nodeBg: 'bg-[#fde047]',
    nodeText: 'text-[#0f172a]',
    tagBg: 'bg-[#fde047]',
    tagText: 'text-[#0f172a]',
    tagBorder: 'border-[#0f172a]'
  },
  bootcamp: {
    icon: Layers,
    nodeBg: 'bg-[#38bdf8]',
    nodeText: 'text-[#0f172a]',
    tagBg: 'bg-[#e0f2fe]',
    tagText: 'text-[#0284c7]',
    tagBorder: 'border-[#0f172a]'
  },
  project: {
    icon: Rocket,
    nodeBg: 'bg-[#4ade80]',
    nodeText: 'text-[#0f172a]',
    tagBg: 'bg-[#dcfce7]',
    tagText: 'text-[#15803d]',
    tagBorder: 'border-[#0f172a]'
  },
  security: {
    icon: ShieldCheck,
    nodeBg: 'bg-[#fb7185]',
    nodeText: 'text-[#0f172a]',
    tagBg: 'bg-[#fee2e2]',
    tagText: 'text-[#dc2626]',
    tagBorder: 'border-[#0f172a]'
  }
};

export const JourneyTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInViewport(containerRef, '150px');

  // Direct scroll progress tracker (Lenis already provides scroll smoothing)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 80%']
  });

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative z-20 -mt-1 w-full select-none py-28 overflow-hidden text-[#0f172a]"
      style={{ contain: 'layout paint' }}
    >
      {/* animated ocean waves, bubbles, and fish */}
      <JourneyOceanCanvas isActive={isInView} />

      {/* lifebuoy */}
      <div
        className={`absolute top-24 right-8 sm:right-24 z-10 pointer-events-none opacity-95 anim-gentle-bob ${
          isInView ? '' : 'anim-paused'
        }`}
      >
        <svg width="56" height="56" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="27" cy="27" r="22" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="27" cy="27" r="11" fill="#0284c7" stroke="#0f172a" strokeWidth="2.5" />
          <path d="M27 5 L27 16" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
          <path d="M27 38 L27 49" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
          <path d="M5 27 L16 27" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
          <path d="M38 27 L49 27" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-12 space-y-8 sm:space-y-12">
        {/* header dock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-4 sm:p-8 rounded-2xl sm:rounded-[32px] bg-[#fffdf5] border-2 sm:border-3 border-[#0f172a] shadow-[4px_4px_0px_#0f172a] sm:shadow-[6px_6px_0px_#0f172a] space-y-2.5 sm:space-y-3"
        >
          <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-[#fde047] text-[#0f172a] text-xs font-mono font-black border-2 border-[#0f172a] shadow-[2px_2px_0px_#0f172a] sm:shadow-[3px_3px_0px_#0f172a] w-fit">
            <Compass className="w-3.5 h-3.5" />
            <span>MILESTONE</span>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight leading-[1.08]">
              Milestone
            </h2>
            <p className="text-xs sm:text-base font-medium text-[#475569] max-w-2xl leading-relaxed">
              Currently pursuing a Bachelor's degree in Computer Science, actively growing within the <span className="text-slate-900 font-semibold">Basic Computing Community (BCC)</span>, and serving on the <span className="text-slate-900 font-semibold">Information & Technology (PIT)</span> committee responsible for engineering the official freshman orientation platform for FILKOM UB.
            </p>
          </div>
        </motion.div>

        {/* timeline track */}
        <div className="relative pl-11 sm:pl-20 space-y-7 sm:space-y-12">
          {/* background track */}
          <div className="absolute top-5 sm:top-6 bottom-5 sm:bottom-6 left-4 sm:left-7 -translate-x-1/2 w-2.5 sm:w-3.5 bg-black/30 rounded-full overflow-hidden border-2 border-white/50 z-0">
            {/* vertical progress */}
            <motion.div
              style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
              className="w-full h-full bg-gradient-to-b from-[#fde047] via-[#38bdf8] via-[#4ade80] to-[#fb7185] rounded-full will-change-transform"
            />
          </div>

          {experienceData.map((item: ExperienceItem, idx: number) => {
            const config = categoryConfig[item.category || 'education'] || categoryConfig.education;
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20, y: 16 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="relative group"
              >
                {/* timeline node icon */}
                <div
                  className={`absolute left-[-28px] sm:left-[-52px] -translate-x-1/2 top-4 sm:top-6 w-9 h-9 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl border-2 border-[#0f172a] ${config.nodeBg} ${config.nodeText} flex items-center justify-center shadow-[2px_2px_0px_#0f172a] sm:shadow-[3px_3px_0px_#0f172a] group-hover:scale-110 transition-transform z-10`}
                >
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>

                {/* milestone card */}
                <div className="p-4 sm:p-8 rounded-2xl sm:rounded-[32px] bg-[#fffdf5] border-2 sm:border-3 border-[#0f172a] shadow-[4px_4px_0px_#0f172a] sm:shadow-[6px_6px_0px_#0f172a] hover:shadow-[3px_3px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 space-y-3 sm:space-y-4 cursor-default">
                  {/* card top badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b-2 border-[#0f172a]/10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] sm:text-xs font-mono font-black uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl border-2 ${config.tagBg} ${config.tagBorder} ${config.tagText} shadow-[1.5px_1.5px_0px_#0f172a] sm:shadow-[2px_2px_0px_#0f172a]`}
                      >
                        {item.badge || item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-[#fff9d4] border-2 border-[#0f172a] text-[10px] sm:text-xs font-mono font-black text-[#0f172a] shadow-[1.5px_1.5px_0px_#0f172a] sm:shadow-[2px_2px_0px_#0f172a]">
                      <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  {/* role and organization */}
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-[#0f172a] tracking-tight group-hover:text-[#0284c7] transition-colors">
                      {item.role}
                    </h3>
                    <div className="text-xs sm:text-sm font-mono font-bold text-[#0284c7] mt-0.5 sm:mt-1">
                      {item.organization}
                    </div>
                  </div>

                  {/* narrative description */}
                  <p className="text-xs sm:text-base font-medium text-[#334155] leading-relaxed">
                    {item.description}
                  </p>

                  {/* key highlights */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#fff9d4]/80 border border-[#0f172a]/20 sm:border-2 sm:border-[#0f172a]/15 space-y-1.5 sm:space-y-2">
                      <div className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider text-[#475569]">
                        Key Highlights &amp; Areas of Expertise
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                        {item.highlights.map((hl, hIdx) => (
                          <div
                            key={hIdx}
                            className="flex items-start gap-1.5 sm:gap-2 text-xs font-bold text-[#1e293b] leading-tight"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16a34a] shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* skills and tech tags */}
                  <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    {item.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-[#fff9d4] hover:bg-[#fde047] text-[#0f172a] border border-[#0f172a] transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
