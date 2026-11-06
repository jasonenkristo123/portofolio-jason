import React, { lazy, Suspense, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import type { Project, ProjectCategory } from '../../types/portfolio';
import { projectsData } from '../../data/portfolioData';
import { FlagshipSlideCard } from './FlagshipProjectParallax';
import { FilteredProjectDock } from './FilteredProjectDock';
import { useInViewport } from '../../hooks/useViewportActivity';

const ProjectCaseStudyModal = lazy(() =>
  import('./ProjectCaseStudyModal').then((m) => ({
    default: m.ProjectCaseStudyModal
  }))
);

interface ProjectShowcaseProps {
  onOpenProject?: (project: Project) => void;
}

function computeSlideMask(p: number): number {
  const s0 = p < 0.37 ? 1 : 0;
  const s1 = p > 0.2 && p < 0.62 ? 2 : 0;
  const s2 = p > 0.45 && p < 0.87 ? 4 : 0;
  const s3 = p > 0.7 ? 8 : 0;
  return s0 | s1 | s2 | s3;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onOpenProject }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [localActiveProject, setLocalActiveProject] = useState<Project | null>(null);
  const [visibleSlideMask, setVisibleSlideMask] = useState<number>(1);
  const maskRef = useRef<number>(1);

  const isSectionInView = useInViewport(containerRef, '150px');

  const handleSelect = onOpenProject || setLocalActiveProject;
  const activeProject = onOpenProject ? null : localActiveProject;

  const flagshipProjects = projectsData.filter((p) => p.featured);

  // Direct scroll progress (no double-spring fighting Lenis / native touch scroll!)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextMask = computeSlideMask(latest);
    if (nextMask !== maskRef.current) {
      maskRef.current = nextMask;
      setVisibleSlideMask(nextMask);
    }
  });

  // Gradual overlapping curtain wipe ranges
  const ySlide2 = useTransform(scrollYProgress, [0.22, 0.36], ['100%', '0%'], { clamp: true });
  const ySlide3 = useTransform(scrollYProgress, [0.47, 0.61], ['100%', '0%'], { clamp: true });
  const ySlide4 = useTransform(scrollYProgress, [0.72, 0.86], ['100%', '0%'], { clamp: true });

  const pBar0 = useTransform(scrollYProgress, [0, 0.25], [0, 1], { clamp: true });
  const pBar1 = useTransform(scrollYProgress, [0.25, 0.5], [0, 1], { clamp: true });
  const pBar2 = useTransform(scrollYProgress, [0.5, 0.75], [0, 1], { clamp: true });
  const pBar3 = useTransform(scrollYProgress, [0.75, 1.0], [0, 1], { clamp: true });
  const progressBars = [pBar0, pBar1, pBar2, pBar3];

  const isSlide0Visible = (visibleSlideMask & 1) !== 0;
  const isSlide1Visible = (visibleSlideMask & 2) !== 0;
  const isSlide2Visible = (visibleSlideMask & 4) !== 0;
  const isSlide3Visible = (visibleSlideMask & 8) !== 0;

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative h-[480vh] sm:h-[520vh] bg-[#fff9d4] select-none"
    >
      {/* pinned viewport stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ contain: 'layout paint' }}>
        {/* progress indicators */}
        <div className="absolute top-[76px] sm:top-24 right-4 sm:right-12 z-50 flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-[#fffdf5] border-2 border-[#0f172a] shadow-[2.5px_2.5px_0px_#0f172a] sm:shadow-[4px_4px_0px_#0f172a]">
          {progressBars.map((scaleVal, idx) => (
            <div
              key={idx}
              className="h-2 sm:h-2.5 rounded-full bg-[#faeed1] border border-[#0f172a] overflow-hidden w-5 sm:w-10"
            >
              <motion.div
                className="h-full origin-left bg-[#0284c7] will-change-transform"
                style={{ scaleX: scaleVal }}
              />
            </div>
          ))}
        </div>

        {/* flagship slide presentation — only active & painted when within visible scroll window */}
        {flagshipProjects[0] && (
          <FlagshipSlideCard
            project={flagshipProjects[0]}
            index={0}
            yMotion="0%"
            depthLevel={1}
            isVisible={isSlide0Visible}
            isActive={isSectionInView && isSlide0Visible}
            onSelectProject={handleSelect}
          />
        )}

        {flagshipProjects[1] && (
          <FlagshipSlideCard
            project={flagshipProjects[1]}
            index={1}
            yMotion={ySlide2}
            depthLevel={2}
            isVisible={isSlide1Visible}
            isActive={isSectionInView && isSlide1Visible}
            onSelectProject={handleSelect}
          />
        )}

        {flagshipProjects[2] && (
          <FlagshipSlideCard
            project={flagshipProjects[2]}
            index={2}
            yMotion={ySlide3}
            depthLevel={3}
            isVisible={isSlide2Visible}
            isActive={isSectionInView && isSlide2Visible}
            onSelectProject={handleSelect}
          />
        )}

        {/* project index overview */}
        <motion.div
          style={{
            y: ySlide4,
            zIndex: 40,
            visibility: isSlide3Visible ? 'visible' : 'hidden',
            contain: 'layout paint'
          }}
          className="absolute inset-0 w-full h-full bg-[#02587a] shadow-[0_-8px_24px_rgba(15,23,42,0.35)] will-change-transform"
        >
          <FilteredProjectDock
            projects={projectsData}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProject={handleSelect}
            isActive={isSectionInView && isSlide3Visible}
          />
        </motion.div>
      </div>

      {/* local fallback case study modal */}
      {!onOpenProject && activeProject && (
        <Suspense fallback={null}>
          <ProjectCaseStudyModal
            project={activeProject}
            isOpen={!!activeProject}
            onClose={() => setLocalActiveProject(null)}
          />
        </Suspense>
      )}
    </section>
  );
};
