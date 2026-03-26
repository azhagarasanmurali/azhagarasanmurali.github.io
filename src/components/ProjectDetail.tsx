import React, { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";

interface VideoItem {
	type: "youtube" | "asset";
	url: string;
	title?: string;
}

interface Project {
	id: string;
	title: string;
	tagline: string;
	category: string;
	year: number;
	description: string;
	detailedDescription: string;
	thumbnail: string;
	images: string[];
	videos?: VideoItem[];
	role: string;
	team: number;
	duration: string;
	technologies: string[];
	challenge: string;
	solution: string;
	results: string;
	links: {
		website?: string;
		github?: string;
		steam?: string;
		itch?: string;
	};
}

interface ProjectDetailProps {
	project: Project;
	onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
	project,
	onClose,
}) => {
	const marqueeDurationSeconds = Math.max(24, project.images.length * 6);
	const loopedImages = [...project.images, ...project.images];
	const videos = useMemo(() => {
		if (!project.videos || !project.videos.length) return [];
		return project.videos.map((video, index) => ({
			id: `${project.id}-video-${index}`,
			type: video.type,
			src: video.url,
			title:
				video.title ??
				(video.type === "youtube" ? "YouTube Showcase" : "Video"),
		}));
	}, [project.videos, project.id]);
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const hasMultipleVideos = videos.length > 1;
	const activeVideo = videos[currentVideoIndex];

	const goToPreviousVideo = () => {
		if (!videos.length) return;
		setCurrentVideoIndex(
			(prev) => (prev - 1 + videos.length) % videos.length,
		);
	};

	const goToNextVideo = () => {
		if (!videos.length) return;
		setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
	};

	useEffect(() => {
		const originalOverflow = document.body.style.overflow;
		const originalOverscroll = document.body.style.overscrollBehavior;

		document.body.style.overflow = "hidden";
		document.body.style.overscrollBehavior = "none";

		return () => {
			document.body.style.overflow = originalOverflow;
			document.body.style.overscrollBehavior = originalOverscroll;
		};
	}, []);

	useEffect(() => {
		setCurrentVideoIndex(0);
	}, [project.id]);

	return (
		<div
			data-modal-scroll-root
			className="fixed inset-0 z-50 overflow-hidden bg-black/95 backdrop-blur-3xl"
		>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_28%)]" />
			<div className="absolute inset-0 bg-black/78 backdrop-blur-lg" />
			<div className="absolute inset-0 bg-gradient-to-b from-black/58 via-black/35 to-black/62" />
			{/* Close Button */}
			<button
				onClick={onClose}
				className="fixed right-6 top-6 z-50 rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-lg shadow-slate-950/40 backdrop-blur-xl transition-colors duration-300 hover:bg-slate-800 sm:right-8 sm:top-8"
			>
				<svg
					className="w-6 h-6 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<div className="relative h-full overflow-y-auto overscroll-contain">
				<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="mb-12 rounded-[2rem] border border-white/10 bg-slate-950/82 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl sm:p-10">
						<h1 className="text-5xl font-bold text-white mb-4">
							{project.title}
						</h1>
						<p className="mb-6 max-w-4xl text-xl text-slate-200">
							{project.detailedDescription}
						</p>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
								<div className="text-gray-400 text-sm">
									Role
								</div>
								<div className="text-white font-semibold">
									{project.role}
								</div>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
								<div className="text-gray-400 text-sm">
									Team Size
								</div>
								<div className="text-white font-semibold">
									{project.team} people
								</div>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
								<div className="text-gray-400 text-sm">
									Duration
								</div>
								<div className="text-white font-semibold">
									{project.duration}
								</div>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
								<div className="text-gray-400 text-sm">
									Category
								</div>
								<div className="text-white font-semibold">
									{project.category}
								</div>
							</div>
						</div>
					</div>

					{/* Image Gallery */}
					{project.images.length > 0 && (
						<div className="mb-12">
							<div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/78 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
								<div className="hobby-marquee-row relative overflow-hidden rounded-[1.4rem]">
									<div
										className="hobby-marquee-track flex w-max gap-4"
										style={{
											animationDuration: `${marqueeDurationSeconds}s`,
										}}
									>
										{loopedImages.map((image, index) => (
											<div
												key={`${project.id}-screenshot-${index}`}
												className="w-[82vw] max-w-[840px] shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:w-[70vw] lg:w-[60vw]"
											>
												<img
													src={image}
													alt={`${project.title} screenshot ${index + 1}`}
													className="h-64 w-full object-cover sm:h-[420px] lg:h-[560px]"
												/>
											</div>
										))}
									</div>
									<div className="pointer-events-none absolute inset-0 bg-black/24 backdrop-blur-[1px]" />
								</div>
							</div>
						</div>
					)}

					{/* Video Section */}
					{videos.length > 0 && (
						<div className="mb-12 rounded-[2rem] border border-white/10 bg-slate-950/78 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:p-8">
							<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<h2 className="text-3xl font-bold text-white">
									Video Showcase
								</h2>
								{activeVideo && (
									<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
										{activeVideo.title}
									</span>
								)}
							</div>
							<div className="relative">
								<div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/60">
									{activeVideo?.type === "youtube" ? (
										<iframe
											key={activeVideo.id}
											src={activeVideo.src}
											title={`${project.title} Video`}
											className="fade-in-soft h-full w-full"
											allowFullScreen
										/>
									) : (
										<video
											key={activeVideo?.id}
											controls
											className="fade-in-soft h-full w-full"
										>
											<source
												src={activeVideo?.src}
												type="video/mp4"
											/>
											Your browser does not support the
											video tag.
										</video>
									)}
								</div>

								{hasMultipleVideos && (
									<>
										<button
											type="button"
											onClick={goToPreviousVideo}
											className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-slate-900/80 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-slate-800"
										>
											←
										</button>
										<button
											type="button"
											onClick={goToNextVideo}
											className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-slate-900/80 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-slate-800"
										>
											→
										</button>
									</>
								)}
							</div>

							{hasMultipleVideos && (
								<div className="mt-4 flex items-center justify-center gap-2">
									{videos.map((video, index) => (
										<button
											key={video.id}
											type="button"
											onClick={() =>
												setCurrentVideoIndex(index)
											}
											aria-label={`Show video ${index + 1}`}
											className={`h-2.5 rounded-full transition-all ${
												currentVideoIndex === index
													? "w-8 bg-accent-secondary"
													: "w-2.5 bg-white/35 hover:bg-white/55"
											}`}
										/>
									))}
								</div>
							)}
						</div>
					)}

					{/* Case Study Sections */}
					<div className="mb-12 grid gap-8 md:grid-cols-2">
						<div className="rounded-[2rem] border border-cyan-300/15 bg-slate-950/82 p-8 shadow-[0_20px_60px_rgba(8,145,178,0.18)] backdrop-blur-2xl">
							<h3 className="text-2xl font-bold text-white mb-4">
								The Challenge
							</h3>
							<p className="text-gray-300 leading-relaxed">
								{project.challenge}
							</p>
						</div>

						<div className="rounded-[2rem] border border-blue-300/15 bg-slate-950/82 p-8 shadow-[0_20px_60px_rgba(37,99,235,0.16)] backdrop-blur-2xl">
							<h3 className="text-2xl font-bold text-white mb-4">
								Our Solution
							</h3>
							<p className="text-gray-300 leading-relaxed">
								{project.solution}
							</p>
						</div>
					</div>

					{/* Results */}
					<div className="mb-12 rounded-[2rem] border border-cyan-300/25 bg-gradient-to-r from-cyan-400/12 via-slate-950/88 to-blue-400/12 p-8 shadow-[0_20px_70px_rgba(34,211,238,0.16)] backdrop-blur-2xl">
						<h3 className="text-2xl font-bold text-white mb-4">
							Results & Impact
						</h3>
						<p className="text-gray-300 leading-relaxed text-lg">
							{project.results}
						</p>
					</div>

					{/* Technologies */}
					<div className="mb-12 rounded-[2rem] border border-white/10 bg-slate-950/78 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
						<h3 className="text-2xl font-bold text-white mb-6">
							Technologies Used
						</h3>
						<div className="flex flex-wrap gap-3">
							{project.technologies.map((tech, index) => (
								<span
									key={index}
									className="rounded-2xl border border-cyan-300/20 bg-white/5 px-4 py-2 text-gray-200"
								>
									{tech}
								</span>
							))}
						</div>
					</div>

					{/* Links */}
					<div className="flex flex-wrap gap-4 pb-8">
						{project.links.website && (
							<a
								href={project.links.website}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 rounded-2xl bg-accent-primary px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-accent-primary/80"
							>
								Visit Website{" "}
								<ExternalLink className="w-4 h-4" />
							</a>
						)}
						{project.links.github && (
							<a
								href={project.links.github}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-slate-800"
							>
								Git <ExternalLink className="w-4 h-4" />
							</a>
						)}
						{project.links.steam && (
							<a
								href={project.links.steam}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-slate-800"
							>
								Steam <ExternalLink className="w-4 h-4" />
							</a>
						)}
						{project.links.itch && (
							<a
								href={project.links.itch}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-slate-800"
							>
								itch.io <ExternalLink className="w-4 h-4" />
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
