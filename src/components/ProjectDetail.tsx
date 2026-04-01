import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";

const getWrappedIndex = (nextIndex: number, total: number) => {
	if (!total) return 0;
	return (nextIndex + total) % total;
};

interface VideoItem {
	type: "youtube" | "asset";
	url: string;
	title?: string;
}

interface Project {
	id: string;
	title: string;
	tagline: string;
	category: string[];
	year: number;
	description?: string;
	detailedDescription?: string;
	thumbnail: string;
	images: string[];
	videos?: VideoItem[];
	role?: string[];
	team?: number;
	duration?: string;
	technologies?: string[];
	challenge?: string;
	solution?: string;
	results?: string;
	links?: {
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
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(
		null,
	);
	const [isGalleryHovered, setIsGalleryHovered] = useState(false);
	const [isGalleryInView, setIsGalleryInView] = useState(false);
	const [galleryElement, setGalleryElement] = useState<HTMLDivElement | null>(
		null,
	);
	const [touchStartX, setTouchStartX] = useState<number | null>(null);
	const [touchStartY, setTouchStartY] = useState<number | null>(null);
	const [isAssetsLoading, setIsAssetsLoading] = useState(true);
	const hasMultipleVideos = videos.length > 1;
	const hasMultipleImages = project.images.length > 1;
	const activeVideo = videos[currentVideoIndex];
	const activeImage = project.images[currentImageIndex];
	const activeLightboxImage =
		lightboxImageIndex !== null
			? (project.images[lightboxImageIndex] ?? null)
			: null;

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

	const selectImage = useCallback(
		(nextIndex: number) => {
			setCurrentImageIndex(
				getWrappedIndex(nextIndex, project.images.length),
			);
		},
		[project.images.length],
	);

	const goToPreviousImage = useCallback(() => {
		selectImage(currentImageIndex - 1);
	}, [currentImageIndex, selectImage]);

	const goToNextImage = useCallback(() => {
		selectImage(currentImageIndex + 1);
	}, [currentImageIndex, selectImage]);

	const openImageLightbox = useCallback(
		(index: number) => {
			const wrappedIndex = getWrappedIndex(index, project.images.length);
			setCurrentImageIndex(wrappedIndex);
			setLightboxImageIndex(wrappedIndex);
		},
		[project.images.length],
	);

	const closeImageLightbox = useCallback(() => {
		setLightboxImageIndex(null);
	}, []);

	const handleGalleryTouchStart = useCallback(
		(event: React.TouchEvent<HTMLDivElement>) => {
			const touch = event.changedTouches[0];
			if (!touch) return;
			setTouchStartX(touch.clientX);
			setTouchStartY(touch.clientY);
		},
		[],
	);

	const handleGalleryTouchEnd = useCallback(
		(event: React.TouchEvent<HTMLDivElement>) => {
			if (touchStartX === null || touchStartY === null) return;

			const touch = event.changedTouches[0];
			if (!touch) return;

			const deltaX = touch.clientX - touchStartX;
			const deltaY = touch.clientY - touchStartY;
			const absDeltaX = Math.abs(deltaX);
			const absDeltaY = Math.abs(deltaY);

			if (hasMultipleImages && absDeltaX > 45 && absDeltaX > absDeltaY) {
				if (deltaX > 0) {
					goToPreviousImage();
				} else {
					goToNextImage();
				}
			}

			setTouchStartX(null);
			setTouchStartY(null);
		},
		[
			hasMultipleImages,
			goToNextImage,
			goToPreviousImage,
			touchStartX,
			touchStartY,
		],
	);

	const goToPreviousLightboxImage = useCallback(() => {
		if (lightboxImageIndex === null) return;
		const nextIndex = getWrappedIndex(
			lightboxImageIndex - 1,
			project.images.length,
		);
		setCurrentImageIndex(nextIndex);
		setLightboxImageIndex(nextIndex);
	}, [lightboxImageIndex, project.images.length]);

	const goToNextLightboxImage = useCallback(() => {
		if (lightboxImageIndex === null) return;
		const nextIndex = getWrappedIndex(
			lightboxImageIndex + 1,
			project.images.length,
		);
		setCurrentImageIndex(nextIndex);
		setLightboxImageIndex(nextIndex);
	}, [lightboxImageIndex, project.images.length]);

	const metadataItems = useMemo(() => {
		const items: Array<{ label: string; value: React.ReactNode }> = [];

		if (project.role?.length) {
			items.push({
				label: project.role.length > 1 ? "Roles" : "Role",
				value: (
					<div className="flex flex-wrap gap-2">
						{project.role.map((role) => (
							<span
								key={role}
								className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-white"
							>
								{role}
							</span>
						))}
					</div>
				),
			});
		}

		if (typeof project.team === "number") {
			items.push({
				label: "Team Size",
				value: (
					<span className="text-white font-semibold">
						{project.team === 1 ? "Solo" : `${project.team} people`}
					</span>
				),
			});
		}

		if (project.duration?.trim()) {
			items.push({
				label: "Duration",
				value: (
					<span className="text-white font-semibold">
						{project.duration}
					</span>
				),
			});
		}

		if (project.category.length) {
			items.push({
				label: project.category.length > 1 ? "Categories" : "Category",
				value: (
					<div className="flex flex-wrap gap-2">
						{project.category.map((category) => (
							<span
								key={category}
								className="rounded-full border border-cyan-900 bg-cyan-950 px-3 py-1 text-xs font-semibold text-cyan-100"
							>
								{category}
							</span>
						))}
					</div>
				),
			});
		}

		return items;
	}, [project.category, project.duration, project.role, project.team]);

	const linkItems = useMemo(() => {
		return [
			project.links?.website
				? {
						label: "Visit Website",
						href: project.links.website,
						className:
							"flex items-center gap-2 rounded-2xl bg-accent-primary px-6 py-3 font-semibold text-white transition-colors duration-300 hover:brightness-110",
					}
				: null,
			project.links?.github
				? {
						label: "Git",
						href: project.links.github,
						className:
							"flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-slate-800",
					}
				: null,
			project.links?.steam
				? {
						label: "Steam",
						href: project.links.steam,
						className:
							"flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-slate-800",
					}
				: null,
			project.links?.itch
				? {
						label: "itch.io",
						href: project.links.itch,
						className:
							"flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-slate-800",
					}
				: null,
		].filter((item): item is NonNullable<typeof item> => Boolean(item));
	}, [project.links]);

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
		setCurrentImageIndex(0);
		setLightboxImageIndex(null);
		setIsGalleryHovered(false);
	}, [project.id]);

	useEffect(() => {
		if (!galleryElement) {
			setIsGalleryInView(false);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsGalleryInView(
					entry.isIntersecting && entry.intersectionRatio >= 0.35,
				);
			},
			{
				threshold: [0.2, 0.35, 0.5],
				rootMargin: "0px 0px -10% 0px",
			},
		);

		observer.observe(galleryElement);

		return () => observer.disconnect();
	}, [galleryElement, project.id]);

	useEffect(() => {
		if (
			!hasMultipleImages ||
			!isGalleryInView ||
			isGalleryHovered ||
			lightboxImageIndex !== null
		) {
			return;
		}

		const intervalId = window.setInterval(() => {
			setCurrentImageIndex((previousIndex) =>
				getWrappedIndex(previousIndex + 1, project.images.length),
			);
		}, 3200);

		return () => window.clearInterval(intervalId);
	}, [
		hasMultipleImages,
		isGalleryInView,
		isGalleryHovered,
		lightboxImageIndex,
		project.images.length,
	]);

	useEffect(() => {
		if (lightboxImageIndex === null) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeImageLightbox();
				return;
			}

			if (event.key === "ArrowLeft") {
				goToPreviousLightboxImage();
				return;
			}

			if (event.key === "ArrowRight") {
				goToNextLightboxImage();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		closeImageLightbox,
		goToNextLightboxImage,
		goToPreviousLightboxImage,
		lightboxImageIndex,
	]);

	useEffect(() => {
		let isCancelled = false;

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

		const run = async () => {
			setIsAssetsLoading(true);
			const tasks: Array<Promise<void>> = [];

			project.images.forEach((image) => {
				tasks.push(preloadImage(image));
			});

			videos.forEach((video) => {
				if (video.type === "asset") {
					tasks.push(preloadVideo(video.src));
				}
			});

			await Promise.all(tasks);
			if (!isCancelled) {
				setIsAssetsLoading(false);
			}
		};

		void run();

		return () => {
			isCancelled = true;
		};
	}, [project.id, project.images, videos]);

	return (
		<div
			data-modal-scroll-root
			className="fixed inset-0 z-50 overflow-hidden bg-black backdrop-blur-[100px]"
		>
			<div className="absolute inset-0 bg-black backdrop-blur-[100px]" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(8,145,178,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.08),transparent_28%)]" />
			<div className="absolute inset-0 bg-gradient-to-b from-black via-black to-slate-950" />
			{/* Close Button */}
			<button
				onClick={onClose}
				className="fixed right-6 top-6 z-50 rounded-2xl border border-slate-700 bg-black p-3 shadow-lg shadow-black/40 transition-colors duration-300 hover:bg-slate-900 sm:right-8 sm:top-8"
				aria-label="Close project detail"
			>
				<X className="h-6 w-6 text-white" />
			</button>

			<div className="relative h-full overflow-y-auto overscroll-contain">
				<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
					{isAssetsLoading ? (
						<div className="space-y-8 animate-pulse">
							<div className="rounded-[2rem] border border-slate-800 bg-black p-8 shadow-[0_30px_80px_rgba(15,23,42,0.55)] sm:p-10">
								<div className="h-12 w-2/3 rounded bg-white/10" />
								<div className="mt-4 h-6 w-5/6 rounded bg-white/10" />
								<div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
									{Array.from({ length: 4 }).map(
										(_, index) => (
											<div
												key={index}
												className="h-24 rounded-2xl bg-white/10"
											/>
										),
									)}
								</div>
							</div>
							<div className="rounded-[2rem] border border-slate-800 bg-black p-3 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
								<div className="h-[clamp(18rem,42vh,48rem)] rounded-[1.4rem] bg-white/10" />
							</div>
							<div className="grid gap-8 md:grid-cols-2">
								<div className="h-56 rounded-[2rem] bg-white/10" />
								<div className="h-56 rounded-[2rem] bg-white/10" />
							</div>
						</div>
					) : (
						<>
							{/* Header */}
							<div className="mb-12 rounded-[2rem] border border-slate-800 bg-black p-8 shadow-[0_30px_80px_rgba(15,23,42,0.55)] sm:p-10">
								<h1 className="text-5xl font-bold text-white mb-4">
									{project.title}
								</h1>
								{project.detailedDescription?.trim() && (
									<p className="mb-6 max-w-4xl text-xl text-slate-200">
										{project.detailedDescription}
									</p>
								)}

								{metadataItems.length > 0 && (
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
										{metadataItems.map((item) => (
											<div
												key={item.label}
												className="rounded-2xl border border-slate-700 bg-black p-4"
											>
												<div className="text-gray-400 text-sm">
													{item.label}
												</div>
												<div className="mt-2">
													{item.value}
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Image Gallery */}
							{project.images.length > 0 && (
								<div className="mb-12" ref={setGalleryElement}>
									<div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-black p-3 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
										<div className="mb-4 flex items-center justify-between gap-3 px-2 pt-2">
											<div>
												<h2 className="text-2xl font-bold text-white">
													Screenshots
												</h2>
												<p className="text-sm text-slate-400">
													{currentImageIndex + 1} /{" "}
													{project.images.length}
												</p>
											</div>
										</div>

										{activeImage && (
											<div
												className="relative overflow-hidden rounded-[1.4rem] bg-black p-3"
												onMouseEnter={() =>
													setIsGalleryHovered(true)
												}
												onMouseLeave={() =>
													setIsGalleryHovered(false)
												}
												onTouchStart={
													handleGalleryTouchStart
												}
												onTouchEnd={
													handleGalleryTouchEnd
												}
											>
												<button
													type="button"
													onClick={() =>
														openImageLightbox(
															currentImageIndex,
														)
													}
													className="group flex h-[clamp(24rem,68vh,58rem)] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-black"
												>
													<img
														src={activeImage}
														alt={`${project.title} screenshot ${currentImageIndex + 1}`}
														className="max-h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
													/>
												</button>
												{hasMultipleImages && (
													<>
														<button
															type="button"
															onClick={
																goToPreviousImage
															}
															aria-label="Previous screenshot"
															className={`absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-900 p-3 text-white transition-all hover:bg-slate-800 ${
																isGalleryHovered
																	? "opacity-100"
																	: "pointer-events-none opacity-0"
															}`}
														>
															<ChevronLeft className="h-5 w-5" />
														</button>
														<button
															type="button"
															onClick={
																goToNextImage
															}
															aria-label="Next screenshot"
															className={`absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-900 p-3 text-white transition-all hover:bg-slate-800 ${
																isGalleryHovered
																	? "opacity-100"
																	: "pointer-events-none opacity-0"
															}`}
														>
															<ChevronRight className="h-5 w-5" />
														</button>
													</>
												)}
											</div>
										)}

										{hasMultipleImages && (
											<div className="mt-4 flex items-center justify-center gap-2">
												{project.images.map(
													(image, index) => (
														<button
															key={`${project.id}-image-dot-${image}`}
															type="button"
															onClick={() =>
																selectImage(
																	index,
																)
															}
															aria-label={`Show screenshot ${index + 1}`}
															className={`h-2.5 rounded-full transition-all ${
																currentImageIndex ===
																index
																	? "w-8 bg-white"
																	: "w-2.5 bg-white/50 hover:bg-white/55"
															}`}
														/>
													),
												)}
											</div>
										)}
									</div>
								</div>
							)}

							{/* Video Section */}
							{videos.length > 0 && (
								<div className="mb-12 rounded-[2rem] border border-slate-800 bg-black p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)] sm:p-8">
									<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
										<h2 className="text-3xl font-bold text-white">
											Video Showcase
										</h2>
										{activeVideo && (
											<span className="rounded-full border border-slate-700 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
												{activeVideo.title}
											</span>
										)}
									</div>
									<div className="relative">
										<div className="aspect-video overflow-hidden rounded-xl border border-slate-800 bg-black">
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
													Your browser does not
													support the video tag.
												</video>
											)}
										</div>

										{hasMultipleVideos && (
											<>
												<button
													type="button"
													onClick={goToPreviousVideo}
													className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
												>
													←
												</button>
												<button
													type="button"
													onClick={goToNextVideo}
													className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
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
														setCurrentVideoIndex(
															index,
														)
													}
													aria-label={`Show video ${index + 1}`}
													className={`h-2.5 rounded-full transition-all ${
														currentVideoIndex ===
														index
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
							{(project.challenge?.trim() ||
								project.solution?.trim()) && (
								<div className="mb-12 grid gap-8 md:grid-cols-2">
									{project.challenge?.trim() && (
										<div className="rounded-[2rem] border border-cyan-900 bg-black p-8 shadow-[0_20px_60px_rgba(8,145,178,0.18)]">
											<h3 className="text-2xl font-bold text-white mb-4">
												The Challenge
											</h3>
											<p className="text-gray-300 leading-relaxed">
												{project.challenge}
											</p>
										</div>
									)}

									{project.solution?.trim() && (
										<div className="rounded-[2rem] border border-blue-900 bg-black p-8 shadow-[0_20px_60px_rgba(37,99,235,0.16)]">
											<h3 className="text-2xl font-bold text-white mb-4">
												Our Solution
											</h3>
											<p className="text-gray-300 leading-relaxed">
												{project.solution}
											</p>
										</div>
									)}
								</div>
							)}

							{/* Results */}
							{project.results?.trim() && (
								<div className="mb-12 rounded-[2rem] border border-cyan-900 bg-black p-8 shadow-[0_20px_70px_rgba(34,211,238,0.16)]">
									<h3 className="text-2xl font-bold text-white mb-4">
										Results & Impact
									</h3>
									<p className="text-gray-300 leading-relaxed text-lg">
										{project.results}
									</p>
								</div>
							)}

							{/* Technologies */}
							{project.technologies?.length ? (
								<div className="mb-12 rounded-[2rem] border border-slate-800 bg-black p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
									<h3 className="text-2xl font-bold text-white mb-6">
										Technologies Used
									</h3>
									<div className="flex flex-wrap gap-3">
										{project.technologies.map(
											(tech, index) => (
												<span
													key={index}
													className="rounded-2xl border border-cyan-900 bg-black px-4 py-2 text-gray-200"
												>
													{tech}
												</span>
											),
										)}
									</div>
								</div>
							) : null}

							{/* Links */}
							{linkItems.length > 0 && (
								<div className="flex flex-wrap gap-4 pb-8">
									{linkItems.map((link) => (
										<a
											key={link.label}
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className={link.className}
										>
											{link.label}{" "}
											<ExternalLink className="w-4 h-4" />
										</a>
									))}
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{activeLightboxImage && (
				<div
					className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[20px]"
					onClick={closeImageLightbox}
				>
					<div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[20px]" />
					{hasMultipleImages && (
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								goToPreviousLightboxImage();
							}}
							className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/85 p-3 text-white backdrop-blur-xl transition-colors hover:bg-slate-800"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>
					)}
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation();
							closeImageLightbox();
						}}
						className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-slate-950/85 p-3 text-white backdrop-blur-xl transition-colors hover:bg-slate-800"
						aria-label="Close image"
					>
						<X className="h-5 w-5" />
					</button>
					{hasMultipleImages && (
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								goToNextLightboxImage();
							}}
							className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/85 p-3 text-white backdrop-blur-xl transition-colors hover:bg-slate-800"
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5" />
						</button>
					)}
					<div
						className="relative z-10 flex max-w-[92vw] flex-col items-center gap-3"
						onClick={(event) => event.stopPropagation()}
					>
						<img
							src={activeLightboxImage}
							alt={`${project.title} screenshot ${(lightboxImageIndex ?? 0) + 1}`}
							className="max-h-[84vh] max-w-[92vw] rounded-xl border border-white/15 object-contain shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
						/>
						<p className="text-center text-sm text-slate-200">
							{project.title} screenshot{" "}
							{(lightboxImageIndex ?? 0) + 1}
							<span className="ml-2 text-slate-400">
								{(lightboxImageIndex ?? 0) + 1} /{" "}
								{project.images.length}
							</span>
						</p>
					</div>
				</div>
			)}
		</div>
	);
};
