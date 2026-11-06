import React, { useRef, useState } from 'react';
import { ArrowDown, Download, ExternalLink } from 'lucide-react';
import { OceanHeroCanvas } from './OceanHeroCanvas';
import type { OceanHeroHandle } from './OceanHeroCanvas';
import { HeroPhysicsStage } from './HeroPhysicsStage';
import type { HeroPhysicsStageHandle } from './HeroPhysicsStage';
import { SwimmingDuck } from './SwimmingDuck';
import type { DuckExpression } from './SwimmingDuck';
import { FlyingSeagull } from './FlyingSeagull';
import { BeachCrab } from './BeachCrab';
import type { BeachCrabHandle } from './BeachCrab';
import { BeachDecorations } from './BeachDecorations';
import { TactileButton } from '../ui/TactileButton';
import { profileData } from '../../data/portfolioData';
import { useInViewport } from '../../hooks/useViewportActivity';
import { scrollToSectionSmooth } from '../../hooks/useLenisSmoothScroll';

interface HeroSectionProps {
  isPaused?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isPaused = false }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const oceanRef = useRef<OceanHeroHandle | null>(null);
  const stageRef = useRef<HeroPhysicsStageHandle | null>(null);
  const crabRef = useRef<BeachCrabHandle | null>(null);
  const [duckExpression, setDuckExpression] = useState<DuckExpression>('normal');

  const isInView = useInViewport(sectionRef, '100px');
  const isHeroActive = isInView && !isPaused;

  const collisionCooldownRef = useRef<boolean>(false);

  const handleSplash = (clientX: number, clientY: number, intensity: number) => {
    oceanRef.current?.triggerSplash(clientX, clientY, intensity);
  };

  const handleRipple = (clientX: number, clientY: number, size?: number) => {
    oceanRef.current?.triggerRipple(clientX, clientY, size);
  };

  const checkDuckCrabCollision = (duckRect: DOMRect) => {
    if (collisionCooldownRef.current || !crabRef.current) return;
    const crabRect = crabRef.current.getCrabRect();
    if (!crabRect) return;

    const duckCenterX = duckRect.left + duckRect.width / 2;
    const duckCenterY = duckRect.top + duckRect.height / 2;
    const crabCenterX = crabRect.left + crabRect.width / 2;
    const crabCenterY = crabRect.top + crabRect.height / 2;

    const dx = Math.abs(duckCenterX - crabCenterX);
    const dy = Math.abs(duckCenterY - crabCenterY);

    if (dx < 60 && dy < 48) {
      collisionCooldownRef.current = true;
      crabRef.current.triggerStun(duckCenterX < crabCenterX ? 'right' : 'left');
      setDuckExpression('impact');

      setTimeout(() => {
        setDuckExpression('normal');
      }, 2000);

      setTimeout(() => {
        collisionCooldownRef.current = false;
      }, 3200);
    }
  };

  const handleDuckDrop = (clientX: number, clientY: number, velocity: number, duckRect?: DOMRect) => {
    if (duckRect) {
      checkDuckCrabCollision(duckRect);
    }

    if (stageRef.current) {
      stageRef.current.handleDuckDrop(clientX, clientY, velocity);
    } else {
      handleSplash(clientX, clientY, velocity);
    }
  };

  const handleDuckSwim = (duckX: number, duckY: number) => {
    if (stageRef.current) {
      stageRef.current.handleDuckSwim(duckX, duckY);
    } else {
      handleRipple(duckX, duckY, 45);
    }
  };

  const handleScrollToProjects = () => {
    scrollToSectionSmooth('projects', 0);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[700px] flex flex-col justify-between pt-16 pb-10 overflow-hidden select-none"
      style={{ contain: 'layout paint' }}
    >
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <OceanHeroCanvas ref={oceanRef} isActive={isHeroActive} />
      </div>

      <FlyingSeagull isActive={isHeroActive} />

      <SwimmingDuck
        expression={duckExpression}
        onDuckDrop={handleDuckDrop}
        onDuckSwim={handleDuckSwim}
        onDuckSplash={(x, y) => handleSplash(x, y, 1.3)}
        onDuckWaddle={checkDuckCrabCollision}
        isActive={isHeroActive}
      />

      <BeachCrab ref={crabRef} isActive={isHeroActive} />

      <BeachDecorations isActive={isHeroActive} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col items-center justify-center -translate-y-16 sm:-translate-y-24">
        <div className="w-full flex flex-col items-center text-center">
          <HeroPhysicsStage
            ref={stageRef}
            onSplash={handleSplash}
            onRipple={handleRipple}
            onDuckExpressionChange={setDuckExpression}
            isActive={isHeroActive}
          />

          <p className="mt-3 sm:mt-4 max-w-xl text-center text-xs sm:text-base text-[#f8fafc] font-medium leading-relaxed px-2 [text-shadow:0_2px_8px_rgba(2,88,122,0.5)]">
            Full-Stack Developer building scalable, accessible, and high-performance web platforms.
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 px-2">
            <TactileButton
              variant="primary"
              onClick={handleScrollToProjects}
              icon={<ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            >
              View Projects
            </TactileButton>

            <a
              href="/CV-JASONENKRISTO.pdf"
              download="CV-JASONENKRISTO.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#0d2844] hover:bg-[#123559] text-[#f8fafc] border border-[#224c75] hover:border-[#dfcca8]/60 font-medium text-xs sm:text-sm transition-all select-none cursor-pointer hover:-translate-y-0.5"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38bdf8]" />
              <span>Download CV</span>
            </a>

            <a
              href={profileData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#0d2844] hover:bg-[#123559] text-[#f8fafc] border border-[#224c75] hover:border-[#dfcca8]/60 font-medium text-xs sm:text-sm transition-all select-none cursor-pointer hover:-translate-y-0.5"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#dfcca8]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
