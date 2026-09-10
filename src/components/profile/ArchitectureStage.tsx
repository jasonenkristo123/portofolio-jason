import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code2 } from 'lucide-react';

interface ArchitectureStageProps {
  isFlooded: boolean;
}

export const ArchitectureStage: React.FC<ArchitectureStageProps> = ({ isFlooded }) => {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      id: 'web',
      icon: <Code2 className="w-5 h-5 text-[#0284c7]" />,
      title: 'Full-Stack Web Development',
      subtitle: 'Laravel Monolith & Modern React Ecosystem',
      desc: 'Building end-to-end web applications with Laravel or Node.js backends and modern front ends powered by React, Next.js, and TypeScript. Experienced in relational data modeling, SQL query optimization, REST API integration, and responsive reactive interfaces.',
      tags: ['Laravel', 'Inertia.js', 'React', 'Next.js', 'TypeScript', 'PostgreSQL', 'MySQL', 'Tailwind CSS']
    },

    {
      id: 'linux',
      icon: <Terminal className="w-5 h-5 text-[#8c6239]" />,
      title: 'Linux & DevOps Workflows',
      subtitle: 'NixOS Daily Driver & Server Management',
      desc: 'Using CachyOS as a daily development environment with declarative Flakes configuration. Experienced in Linux server administration across Debian and Arch, Docker containerization, and collaborative Git workflows.',
      tags: ['Arch Linux', 'Debian Server', 'Docker', 'Git Branching', 'Bash CLI']
    }
  ];

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  return (
    <motion.div
      animate={
        isFlooded
          ? {
            rotate: isMobile ? 3 : 15,
            x: isMobile ? 0 : 28,
            y: isMobile ? 16 : 50,
            scale: 0.98,
            transition: { type: 'spring', stiffness: 150, damping: 16 }
          }
          : {
            rotate: 0,
            x: 0,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 260, damping: 18 }
          }
      }
      className="w-full flex flex-col gap-6"
    >
      {/* Selector Tabs */}
      <div className="grid grid-cols-2 gap-2.5 p-1.5 rounded-2xl bg-[#fffdf5] border border-[#e8dbc0] shadow-sm">
        {pillars.map((pillar, idx) => (
          <motion.button
            key={pillar.id}
            type="button"
            onClick={() => setActivePillar(idx)}
            animate={
              isFlooded
                ? {
                  rotate: idx === 0 ? -18 : 20,
                  y: idx === 0 ? 14 : -16,
                  x: idx === 0 ? -8 : 8
                }
                : { rotate: 0, y: 0, x: 0 }
            }
            className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition-all cursor-pointer ${activePillar === idx
              ? 'bg-[#0284c7] text-white shadow-md'
              : 'hover:bg-[#fff9d4] text-[#475569] hover:text-[#0f172a]'
              }`}
          >
            <span
              className={`text-xs font-mono font-bold block ${activePillar === idx ? 'text-white' : 'text-[#8c6239]'
                }`}
            >
              0{idx + 1}
            </span>
            <span className="text-xs font-bold leading-tight mt-0.5">
              {pillar.id.toUpperCase()}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Active Pillar */}
      <div className="relative min-h-[305px] sm:min-h-[315px] rounded-[32px] bg-[#fffdf5] border border-[#e8dbc0] shadow-xl shadow-[#8c6239]/6 overflow-hidden">
        <motion.div
          key={activePillar}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="p-7 sm:p-9 h-full flex flex-col justify-between space-y-5"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-[#fff9d4] border border-[#e2d3b3] shadow-sm shrink-0">
                  {pillars[activePillar].icon}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-[#8c6239]">
                    0{activePillar + 1} // {pillars[activePillar].subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-0.5">
                    {pillars[activePillar].title}
                  </h3>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[#475569] leading-relaxed">
              {pillars[activePillar].desc}
            </p>
          </div>

          <div className="pt-4 border-t border-[#e8dbc0]">
            <span className="text-xs font-mono font-bold text-[#8c6239] block mb-2.5">
              TECH STACK:
            </span>
            <div className="flex flex-wrap gap-2">
              {pillars[activePillar].tags.map((t) => (
                <span
                  key={t}
                  className="px-3.5 py-1.5 rounded-xl bg-[#fff9d4] text-xs font-mono font-semibold text-[#0f172a] border border-[#e2d3b3] shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <motion.div
          animate={
            isFlooded
              ? { rotate: -24, x: -38, y: 70, scale: 0.94 }
              : { rotate: 0, x: 0, y: 0, scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 160, damping: 15 }}
          className="p-4 rounded-2xl bg-[#fffdf5] border border-[#e8dbc0] shadow-sm"
        >
          <span className="text-xs font-bold text-[#0f172a] block">
            Clean Architecture
          </span>
          <p className="text-[11px] text-[#64748b] mt-1 leading-relaxed">
            Well-organized code with clear dependency boundaries and strong modularity.
          </p>
        </motion.div>

        <motion.div
          animate={
            isFlooded
              ? { rotate: 32, x: 18, y: 80, scale: 0.93 }
              : { rotate: 0, x: 0, y: 0, scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 160, damping: 15 }}
          className="p-4 rounded-2xl bg-[#fffdf5] border border-[#e8dbc0] shadow-sm"
        >
          <span className="text-xs font-bold text-[#0f172a] block">
            Type-Safe Contract
          </span>
          <p className="text-[11px] text-[#64748b] mt-1 leading-relaxed">
            End-to-end type safety from database schemas to client interactions.
          </p>
        </motion.div>

        <motion.div
          animate={
            isFlooded
              ? { rotate: -18, x: 48, y: -20, scale: 0.95 }
              : { rotate: 0, x: 0, y: 0, scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 160, damping: 15 }}
          className="p-4 rounded-2xl bg-[#fffdf5] border border-[#e8dbc0] shadow-sm"
        >
          <span className="text-xs font-bold text-[#0f172a] block">
            Linux Workflows
          </span>
          <p className="text-[11px] text-[#64748b] mt-1 leading-relaxed">
            Declarative NixOS configuration, Docker containerization, and efficient terminal workflows.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
