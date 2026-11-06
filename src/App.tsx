import { lazy, Suspense, useState } from 'react';
import type { Project } from './types/portfolio';
import { useLenisSmoothScroll } from './hooks/useLenisSmoothScroll';
import { NavigationBar } from './components/navigation/NavigationBar';
import { HeroSection } from './components/hero/HeroSection';
import { WelcomeAnimation } from './components/hero/WelcomeAnimation';
import { EditorialProfile } from './components/profile/EditorialProfile';
import { ProjectShowcase } from './components/projects/ProjectShowcase';
import { TechGrid } from './components/tech/TechGrid';
import { GithubActivitySection } from './components/activity/GithubActivitySection';
import { JourneyTimeline } from './components/journey/JourneyTimeline';
import { ContactSection } from './components/contact/ContactSection';

const ProjectCaseStudyModal = lazy(() =>
  import('./components/projects/ProjectCaseStudyModal').then((m) => ({
    default: m.ProjectCaseStudyModal
  }))
);

export function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  useLenisSmoothScroll();

  return (
    <div className="min-h-screen bg-[#fff9d4] text-[#0f172a] selection:bg-[#0284c7] selection:text-white">
      {showWelcome && (
        <WelcomeAnimation onComplete={() => setShowWelcome(false)} />
      )}

      <NavigationBar />

      <main className="relative">
        <HeroSection isPaused={showWelcome} />
        <EditorialProfile />
        <ProjectShowcase onOpenProject={setActiveModalProject} />
        <TechGrid onOpenProject={setActiveModalProject} />
        <GithubActivitySection />
        <JourneyTimeline />
        <ContactSection />
      </main>

      {activeModalProject && (
        <Suspense fallback={null}>
          <ProjectCaseStudyModal
            project={activeModalProject}
            isOpen={!!activeModalProject}
            onClose={() => setActiveModalProject(null)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
