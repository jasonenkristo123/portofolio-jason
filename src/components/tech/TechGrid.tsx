import React, { useRef, useState } from 'react';
import { Layers } from 'lucide-react';
import type { Project, TechItem, TechLayer } from '../../types/portfolio';
import { techStackData, projectsData } from '../../data/portfolioData';
import { PipelineFlowPresets, type FlowDomainId } from './PipelineFlowPresets';
import { PipelineNodeLayer } from './PipelineNodeLayer';
import { PipelineInspector } from './PipelineInspector';
import { TechBeachDecorations } from './TechBeachDecorations';
import { useInViewport } from '../../hooks/useViewportActivity';

// Partition static technologies once at module load
const CLIENT_TECH = techStackData.filter((t) => t.layer === 'client');
const BACKEND_TECH = techStackData.filter((t) => t.layer === 'backend');
const DATABASE_TECH = techStackData.filter((t) => t.layer === 'database');
const DEVOPS_TECH = techStackData.filter((t) => t.layer === 'devops');

interface TechGridProps {
  onOpenProject?: (project: Project) => void;
}

export const TechGrid: React.FC<TechGridProps> = ({ onOpenProject }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInViewport(sectionRef, '120px');

  const [activeDomain, setActiveDomain] = useState<FlowDomainId>('all');
  const [selectedLayer, setSelectedLayer] = useState<TechLayer>('client');
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);

  const handleSelectDomain = (domain: FlowDomainId) => {
    setActiveDomain(domain);
    setSelectedTech(null);

    // automatically shift inspection layer to the primary active layer for that domain
    if (domain === 'web' || domain === 'mobile') {
      setSelectedLayer('client');
    } else if (domain === 'backend') {
      setSelectedLayer('backend');
    } else if (domain === 'devops') {
      setSelectedLayer('devops');
    }
  };

  const handleSelectTech = (tech: TechItem) => {
    setSelectedTech(tech);
    setSelectedLayer(tech.layer);
  };

  const handleSelectLayer = (layer: TechLayer) => {
    setSelectedLayer(layer);
    setSelectedTech(null);
  };

  const handleSelectProject = (projectId: string) => {
    const targetProject = projectsData.find((p) => p.id === projectId);
    if (targetProject && onOpenProject) {
      onOpenProject(targetProject);
    }
  };

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative z-20 -mt-1 w-full bg-[#fff9d4] select-none"
      style={{ contain: 'layout paint' }}
    >
      {/* background decorations */}
      <TechBeachDecorations isActive={isInView} />

      {/* content wrapper */}
      <div className="relative z-10 pt-28 pb-24 max-w-7xl mx-auto px-6 sm:px-12">
        {/* header */}
        <div className="space-y-4 pb-8 border-b-2 border-[#0f172a]/15">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#fde047] text-[#0f172a] text-xs font-mono font-black border-2 border-[#0f172a] shadow-[3px_3px_0px_#0f172a] w-fit">
            <span>03 // TECH STACK</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight leading-[1.08]">
                Tech Stack & Tools
              </h2>
              <p className="text-sm sm:text-base font-medium text-[#475569] mt-2 max-w-2xl leading-relaxed">
                Technologies and tools I use to build modern web and mobile applications.
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#fffdf5] border-2 border-[#0f172a] shadow-[3px_3px_0px_#0f172a] shrink-0 self-start lg:self-auto">
              <Layers className="w-4 h-4 text-[#0284c7]" />
              <span className="text-xs font-mono font-bold text-[#0f172a]">
                {techStackData.length} Tools & Frameworks
              </span>
            </div>
          </div>
        </div>

        {/* category filter selector */}
        <div className="mt-8">
          <PipelineFlowPresets
            activeDomain={activeDomain}
            onSelectDomain={handleSelectDomain}
          />
        </div>

        {/* architecture layer cards */}
        <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs font-mono font-bold text-[#64748b] uppercase tracking-wider pb-1 sm:pb-0">
            <span>Architecture Categories &amp; Layers</span>
            <span className="text-[10px] sm:text-xs text-[#64748b]">
              <span className="sm:hidden">Tap a card or icon for details</span>
              <span className="hidden sm:inline">Select a card or icon to view details</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* client layer */}
            <PipelineNodeLayer
              layerId="client"
              stepNumber="01"
              title="Frontend & Web"
              subtitle="Client UI"
              roleDescription="Modern web interface and cross-platform mobile application development."
              techItems={CLIENT_TECH}
              activeDomain={activeDomain}
              selectedTech={selectedTech}
              onSelectTech={handleSelectTech}
              onSelectLayer={handleSelectLayer}
              isLayerSelected={selectedLayer === 'client'}
            />

            {/* backend layer */}
            <PipelineNodeLayer
              layerId="backend"
              stepNumber="02"
              title="Backend"
              subtitle="Server & API"
              roleDescription="Server development, REST APIs, and backend integration."
              techItems={BACKEND_TECH}
              activeDomain={activeDomain}
              selectedTech={selectedTech}
              onSelectTech={handleSelectTech}
              onSelectLayer={handleSelectLayer}
              isLayerSelected={selectedLayer === 'backend'}
            />

            {/* database layer */}
            <PipelineNodeLayer
              layerId="database"
              stepNumber="03"
              title="Database"
              subtitle="Data & Storage"
              roleDescription="Relational data management and real-time cloud databases."
              techItems={DATABASE_TECH}
              activeDomain={activeDomain}
              selectedTech={selectedTech}
              onSelectTech={handleSelectTech}
              onSelectLayer={handleSelectLayer}
              isLayerSelected={selectedLayer === 'database'}
            />

            {/* devops layer */}
            <PipelineNodeLayer
              layerId="devops"
              stepNumber="04"
              title="DevOps & Tools"
              subtitle="Environment"
              roleDescription="Linux environments, Docker containers, and application deployment."
              techItems={DEVOPS_TECH}
              activeDomain={activeDomain}
              selectedTech={selectedTech}
              onSelectTech={handleSelectTech}
              onSelectLayer={handleSelectLayer}
              isLayerSelected={selectedLayer === 'devops'}
            />
          </div>
        </div>

        {/* inspector deep dive panel */}
        <div className="mt-10">
          <PipelineInspector
            selectedTech={selectedTech}
            selectedLayer={selectedLayer}
            activeDomain={activeDomain}
            onClearTechSelection={() => setSelectedTech(null)}
            onSelectProject={handleSelectProject}
          />
        </div>
      </div>
    </section>
  );
};
