import { lazy, Suspense, useEffect, useState } from "react";
import { useSectionNav } from "./hooks/useSectionNav";
import "./index.css";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { LoadingScreen } from "./components/LoadingScreen";
import { AppSkeleton } from "./components/AppSkeleton";
import { portfolioData } from "./config/portfolio";

const About = lazy(() =>
  import("./components/About").then((module) => ({
    default: module.About,
  })),
);
const Projects = lazy(() =>
  import("./components/Projects").then((module) => ({
    default: module.Projects,
  })),
);
const Hobbies = lazy(() =>
  import("./components/Hobbies").then((module) => ({
    default: module.Hobbies,
  })),
);
const Timeline = lazy(() =>
  import("./components/Timeline").then((module) => ({
    default: module.Timeline,
  })),
);
const DynamicSection = lazy(() =>
  import("./components/DynamicSection").then((module) => ({
    default: module.DynamicSection,
  })),
);
const ProjectDetail = lazy(() =>
  import("./components/ProjectDetail").then((module) => ({
    default: module.ProjectDetail,
  })),
);
const Contact = lazy(() =>
  import("./components/Contact").then((module) => ({
    default: module.Contact,
  })),
);

type SectionConfig = {
  id: string;
  label: string;
  hidden?: boolean;
};

// Section order and nav items come from static JSON, so compute them once.
const dataMap = portfolioData as unknown as Record<string, unknown>;
const configuredSections =
  (dataMap.sections as SectionConfig[] | undefined)?.filter(
    (section) => !section.hidden && section.id !== "social",
  ) ?? [];

const reservedKeys = new Set([
  "personal",
  "loading",
  "sections",
  "design",
  "projectsSection",
  "social",
]);

const orderedSections =
  configuredSections.length > 0
    ? configuredSections.map((section) => section.id)
    : Object.keys(portfolioData).filter((key) => !reservedKeys.has(key));

const navSections =
  configuredSections.length > 0
    ? configuredSections.map(({ id, label }) => ({ id, label }))
    : orderedSections.map((id) => ({
        id,
        label: id
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      }));

const loadingMessages = portfolioData.loading?.messages ?? [
  "Loading portfolio...",
];

function App() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const { activeSectionId, navigateToSection } = useSectionNav(
    orderedSections,
    selectedProject === null,
  );

  const sectionFallback = (
    <div className="section-vh w-full animate-pulse bg-slate-900/50" />
  );

  useEffect(() => {
    let isCancelled = false;
    const loadStartAt = Date.now();
    const minimumLoadingDurationMs = 1600;
    const finishHoldMs = 450;

    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    const preloadVideo = (src: string) =>
      new Promise<void>((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        const done = () => resolve();
        video.onloadedmetadata = done;
        video.onerror = done;
        video.src = src;
      });

    const assets = new Set<string>();
    if (portfolioData.hero.heroImage) assets.add(portfolioData.hero.heroImage);
    if (portfolioData.hero.backgroundVideo)
      assets.add(portfolioData.hero.backgroundVideo);
    if (portfolioData.about.profileImage)
      assets.add(portfolioData.about.profileImage);

    const assetList = Array.from(assets).filter(Boolean);
    const total = assetList.length;

    const run = async () => {
      let loaded = 0;
      const bump = () => {
        loaded += 1;
        if (!isCancelled) {
          setLoadingProgress((loaded / total) * 100);
        }
      };

      await Promise.all(
        assetList.map((src) => {
          const lower = src.toLowerCase();
          const task =
            lower.endsWith(".mp4") || lower.endsWith(".webm")
              ? preloadVideo(src)
              : preloadImage(src);

          return task.finally(bump);
        }),
      );

      if (!isCancelled) {
        setLoadingProgress(100);
        const elapsed = Date.now() - loadStartAt;
        const waitForMinimum = Math.max(0, minimumLoadingDurationMs - elapsed);
        window.setTimeout(() => {
          if (isCancelled) return;
          setIsLoading(false);
          setShowSkeleton(true);
          window.setTimeout(() => {
            if (!isCancelled) setShowSkeleton(false);
          }, 500);
        }, waitForMinimum + finishHoldMs);
      }
    };

    void run();

    return () => {
      isCancelled = true;
    };
  }, []);

  const selectedProjectData = selectedProject
    ? portfolioData.projects.find((p) => p.id === selectedProject)
    : null;

  const handleCtaClick = () => navigateToSection("projects");

  if (isLoading) {
    return (
      <LoadingScreen messages={loadingMessages} progress={loadingProgress} />
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-dark-950">
      {showSkeleton && <AppSkeleton />}
      {/* Navigation */}
      <Navigation
        personalName={portfolioData.personal.name}
        sections={navSections}
        activeSectionId={activeSectionId}
        onNavigate={navigateToSection}
        resumeUrl={portfolioData.personal.resumeUrl}
      />

      <main className="screen-main">
        {orderedSections.map((sectionId) => {
          const isActiveSection = activeSectionId === sectionId;
          const sectionClassName = `screen-section transition-opacity duration-500 ease-out ${
            isActiveSection ? "opacity-100" : "opacity-80"
          }`;

          if (sectionId === "hero") {
            return (
              <section
                key={sectionId}
                id={sectionId}
                className={sectionClassName}
              >
                <Hero data={portfolioData.hero} onCtaClick={handleCtaClick} />
              </section>
            );
          }

          if (sectionId === "about") {
            return (
              <section
                key={sectionId}
                id={sectionId}
                className={sectionClassName}
              >
                <Suspense fallback={sectionFallback}>
                  <About data={portfolioData.about} />
                </Suspense>
              </section>
            );
          }

          if (sectionId === "projects") {
            const projectsSectionMeta =
              (dataMap.projectsSection as
                | { title?: string; description?: string }
                | undefined) ?? {};
            return (
              <section
                key={sectionId}
                id={sectionId}
                className={sectionClassName}
              >
                <Suspense fallback={sectionFallback}>
                  <Projects
                    title={projectsSectionMeta.title ?? "Featured Projects"}
                    description={
                      projectsSectionMeta.description ??
                      "Explore my latest game development projects and case studies"
                    }
                    projects={portfolioData.projects}
                    onProjectSelect={setSelectedProject}
                  />
                </Suspense>
              </section>
            );
          }

          if (sectionId === "hobbies" && portfolioData.hobbies) {
            return (
              <section
                key={sectionId}
                id={sectionId}
                className={sectionClassName}
              >
                <Suspense fallback={sectionFallback}>
                  <Hobbies data={portfolioData.hobbies} />
                </Suspense>
              </section>
            );
          }

          if (sectionId === "timeline" || sectionId === "experience") {
            const experience =
              (dataMap.experience as
                | {
                    title: string;
                    description: string;
                    design?: {
                      spacing?: "compact" | "comfortable" | "airy";
                      surface?: "plain" | "muted" | "elevated";
                      lineStyle?: "subtle" | "balanced" | "strong";
                      cardTone?: "soft" | "balanced" | "strong";
                      verticalAlign?: "top" | "center";
                    };
                    entries: {
                      id: string;
                      type: string;
                      title: string;
                      organization: string;
                      location: string;
                      period: string;
                      description: string;
                      highlights: string[];
                    }[];
                  }
                | undefined) ??
              (dataMap.timeline as
                | {
                    title: string;
                    description: string;
                    design?: {
                      spacing?: "compact" | "comfortable" | "airy";
                      surface?: "plain" | "muted" | "elevated";
                      lineStyle?: "subtle" | "balanced" | "strong";
                      cardTone?: "soft" | "balanced" | "strong";
                      verticalAlign?: "top" | "center";
                    };
                    entries: {
                      id: string;
                      type: string;
                      title: string;
                      organization: string;
                      location: string;
                      period: string;
                      description: string;
                      highlights: string[];
                    }[];
                  }
                | undefined);
            if (!experience) {
              return null;
            }
            return (
              <section
                key={sectionId}
                id={sectionId}
                className={sectionClassName}
              >
                <Suspense fallback={sectionFallback}>
                  <Timeline
                    title={experience.title}
                    description={experience.description}
                    entries={experience.entries}
                    design={experience.design}
                  />
                </Suspense>
              </section>
            );
          }

          if (sectionId === "contact") {
            return (
              <section
                key={sectionId}
                id={sectionId}
                className={sectionClassName}
              >
                <Suspense fallback={sectionFallback}>
                  <Contact
                    contact={portfolioData.contact}
                    social={portfolioData.social}
                  />
                </Suspense>
              </section>
            );
          }

          const dynamicData = dataMap[sectionId];
          if (dynamicData && typeof dynamicData === "object") {
            return (
              <section
                key={sectionId}
                id={sectionId}
                className={sectionClassName}
              >
                <Suspense fallback={sectionFallback}>
                  <DynamicSection
                    id={sectionId}
                    label={
                      navSections.find((section) => section.id === sectionId)
                        ?.label ?? sectionId
                    }
                    data={dynamicData as Record<string, unknown>}
                  />
                </Suspense>
              </section>
            );
          }

          return null;
        })}
      </main>

      {/* Project Detail Modal */}
      {selectedProjectData && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          }
        >
          <ProjectDetail
            key={selectedProjectData.id}
            project={selectedProjectData}
            onClose={() => setSelectedProject(null)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
