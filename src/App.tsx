import { useEffect, useMemo, useState } from "react";
import { useSectionNav } from "./hooks/useSectionNav";
import "./index.css";
import {
	Navigation,
	Hero,
	About,
	Projects,
	Hobbies,
	Timeline,
	DynamicSection,
	ProjectDetail,
	Contact,
	LoadingScreen,
	AppSkeleton,
} from "./components";
import { portfolioData } from "./config/portfolio";

type SectionConfig = {
	id: string;
	label: string;
	hidden?: boolean;
};

function App() {
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [showSkeleton, setShowSkeleton] = useState(false);
	const dataMap = portfolioData as unknown as Record<string, unknown>;
	const orderedSections = useMemo(() => {
		const sectionConfig =
			(dataMap.sections as SectionConfig[] | undefined)?.filter(
				(section) => !section.hidden,
			) ?? [];
		if (sectionConfig.length > 0) {
			return sectionConfig
				.map((section) => section.id)
				.filter((id) => id !== "social");
		}

		const reservedKeys = new Set([
			"personal",
			"loading",
			"sections",
			"design",
			"projectsSection",
		]);
		return Object.keys(portfolioData)
			.filter((key) => !reservedKeys.has(key))
			.filter((key) => key !== "social");
	}, []);

	const navSections = useMemo(() => {
		const configured =
			(dataMap.sections as SectionConfig[] | undefined)?.filter(
				(section) => !section.hidden,
			) ?? [];
		if (configured.length > 0) {
			return configured
				.filter((section) => section.id !== "social")
				.map((section) => ({
					id: section.id,
					label: section.label,
				}));
		}

		return orderedSections.map((id) => ({
			id,
			label: id
				.replace(/[-_]+/g, " ")
				.replace(/\b\w/g, (char) => char.toUpperCase()),
		}));
	}, [orderedSections]);

	const { activeSectionId, navigateToSection } = useSectionNav(
		orderedSections,
		selectedProject === null,
	);

	const loadingMessages = useMemo(
		() => portfolioData.loading?.messages ?? ["Loading portfolio..."],
		[],
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
		if (portfolioData.hero.heroImage)
			assets.add(portfolioData.hero.heroImage);
		if (portfolioData.hero.backgroundVideo)
			assets.add(portfolioData.hero.backgroundVideo);
		if (portfolioData.about.profileImage)
			assets.add(portfolioData.about.profileImage);
		portfolioData.projects.forEach((project) => {
			assets.add(project.thumbnail);
		});

		const hobbiesSection = portfolioData.hobbies as
			| {
					hobbyGallery?: {
						rows?: Array<{
							images?: Array<{ src: string }>;
						}>;
					};
					modelViewer?: {
						models?: Array<{ thumbnail?: string }>;
					};
			  }
			| undefined;

		hobbiesSection?.hobbyGallery?.rows?.forEach((row) => {
			row.images?.forEach((image) => {
				if (image.src) {
					assets.add(image.src);
				}
			});
		});

		hobbiesSection?.modelViewer?.models?.forEach((model) => {
			if (model.thumbnail) {
				assets.add(model.thumbnail);
			}
		});

		const assetList = Array.from(assets).filter(Boolean);
		const total = assetList.length;

		if (!total) {
			setLoadingProgress(100);
			const elapsed = Date.now() - loadStartAt;
			const waitForMinimum = Math.max(
				0,
				minimumLoadingDurationMs - elapsed,
			);
			window.setTimeout(() => {
				if (isCancelled) return;
				setIsLoading(false);
				setShowSkeleton(true);
				window.setTimeout(() => {
					if (!isCancelled) setShowSkeleton(false);
				}, 500);
			}, waitForMinimum + finishHoldMs);
			return;
		}

		const run = async () => {
			let loaded = 0;
			const bump = () => {
				loaded += 1;
				if (!isCancelled) {
					setLoadingProgress((loaded / total) * 100);
				}
			};

			for (const src of assetList) {
				const lower = src.toLowerCase();
				if (lower.endsWith(".mp4") || lower.endsWith(".webm")) {
					await preloadVideo(src);
				} else {
					await preloadImage(src);
				}
				bump();
			}

			if (!isCancelled) {
				setLoadingProgress(100);
				const elapsed = Date.now() - loadStartAt;
				const waitForMinimum = Math.max(
					0,
					minimumLoadingDurationMs - elapsed,
				);
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
			<LoadingScreen
				messages={loadingMessages}
				progress={loadingProgress}
			/>
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
								<Hero
									data={portfolioData.hero}
									onCtaClick={handleCtaClick}
								/>
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
								<About data={portfolioData.about} />
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
								<Projects
									title={
										projectsSectionMeta.title ??
										"Featured Projects"
									}
									description={
										projectsSectionMeta.description ??
										"Explore my latest game development projects and case studies"
									}
									projects={portfolioData.projects}
									onProjectSelect={setSelectedProject}
								/>
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
								<Hobbies data={portfolioData.hobbies} />
							</section>
						);
					}

					if (
						sectionId === "timeline" ||
						sectionId === "experience"
					) {
						const experience =
							(dataMap.experience as
								| {
										title: string;
										description: string;
										design?: {
											spacing?:
												| "compact"
												| "comfortable"
												| "airy";
											surface?:
												| "plain"
												| "muted"
												| "elevated";
											lineStyle?:
												| "subtle"
												| "balanced"
												| "strong";
											cardTone?:
												| "soft"
												| "balanced"
												| "strong";
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
											spacing?:
												| "compact"
												| "comfortable"
												| "airy";
											surface?:
												| "plain"
												| "muted"
												| "elevated";
											lineStyle?:
												| "subtle"
												| "balanced"
												| "strong";
											cardTone?:
												| "soft"
												| "balanced"
												| "strong";
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
								<Timeline
									title={experience.title}
									description={experience.description}
									entries={experience.entries}
									design={experience.design}
								/>
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
								<Contact
									contact={portfolioData.contact}
									social={portfolioData.social}
									resumeUrl={portfolioData.personal.resumeUrl}
								/>
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
								<DynamicSection
									id={sectionId}
									label={
										navSections.find(
											(section) =>
												section.id === sectionId,
										)?.label ?? sectionId
									}
									data={
										dynamicData as Record<string, unknown>
									}
								/>
							</section>
						);
					}

					return null;
				})}
			</main>

			{/* Project Detail Modal */}
			{selectedProjectData && (
				<ProjectDetail
					project={selectedProjectData}
					onClose={() => setSelectedProject(null)}
				/>
			)}
		</div>
	);
}

export default App;
