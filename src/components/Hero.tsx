import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface HeroProps {
	data: {
		heading: string;
		subheading: string;
		ctaText: string;
		backgroundVideo?: string;
		heroImage?: string;
		design?: {
			verticalAlign?: string;
			spacing?: string;
			textScale?: string;
			contentWidth?: string;
			mood?: string;
			ctaTone?: string;
			showScrollCue?: boolean;
		};
	};
	onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ data, onCtaClick }) => {
	const [isVisible, setIsVisible] = useState(false);
	const design = data.design ?? {};
	const spacing = design.spacing ?? "comfortable";
	const textScale = design.textScale ?? "regular";
	const contentWidth = design.contentWidth ?? "standard";
	const mood = design.mood ?? "balanced";
	const ctaTone = design.ctaTone ?? "balanced";
	const shouldShowScrollCue = design.showScrollCue ?? true;
	const verticalAlign = design.verticalAlign ?? "center";

	const contentWidthClass =
		contentWidth === "narrow"
			? "max-w-2xl"
			: contentWidth === "wide"
				? "max-w-5xl"
				: "max-w-3xl";
	const headingClass =
		textScale === "compact"
			? "text-4xl sm:text-5xl lg:text-6xl"
			: textScale === "large"
				? "text-5xl sm:text-7xl lg:text-8xl"
				: "text-4xl sm:text-6xl lg:text-7xl";
	const subheadingClass =
		textScale === "compact"
			? "text-base sm:text-lg lg:text-xl"
			: textScale === "large"
				? "text-xl sm:text-2xl lg:text-3xl"
				: "text-lg sm:text-xl lg:text-2xl";
	const spacingClass =
		spacing === "compact"
			? "space-y-4"
			: spacing === "airy"
				? "space-y-8"
				: "space-y-6";
	const overlayClass =
		mood === "calm"
			? "absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/90"
			: mood === "dramatic"
				? "absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/70 to-slate-950"
				: "absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/78 to-slate-950/95";
	const ambientClass =
		mood === "calm"
			? "opacity-10"
			: mood === "dramatic"
				? "opacity-30"
				: "opacity-20";
	const ctaClass =
		ctaTone === "soft"
			? "mt-8 inline-block rounded-lg bg-slate-800 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-slate-700"
			: ctaTone === "strong"
				? "mt-8 inline-block rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-primary/50"
				: "mt-8 inline-block rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/40";
	const verticalAlignClass =
		verticalAlign === "top" ? "items-start pt-24" : "items-center";

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<section className="relative flex h-screen w-full justify-center overflow-hidden bg-slate-950">
			{/* Background Video or Image */}
			{data.backgroundVideo && (
				<video
					autoPlay
					muted
					loop
					className="absolute inset-0 h-full w-full object-cover opacity-30"
				>
					<source src={data.backgroundVideo} type="video/mp4" />
				</video>
			)}

			{data.heroImage && !data.backgroundVideo && (
				<img
					src={data.heroImage}
					alt="Hero"
					className="absolute inset-0 h-full w-full object-cover opacity-20"
				/>
			)}

			{/* Gradient Overlay */}
			<div className={overlayClass} />

			{/* Content */}
			<div
				className={`relative z-10 flex w-full px-4 text-center sm:px-6 lg:px-8 ${verticalAlignClass}`}
			>
				<div
					className={`${contentWidthClass} mx-auto ${spacingClass} transform transition-all duration-1000 ${
						isVisible
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-10"
					}`}
				>
					<h1
						className={`${headingClass} font-bold leading-tight text-white`}
					>
						{data.heading}
					</h1>

					<p
						className={`${subheadingClass} mx-auto font-light text-gray-300`}
					>
						{data.subheading}
					</p>

					<button onClick={onCtaClick} className={ctaClass}>
						{data.ctaText}
					</button>
				</div>

				{/* Scroll Indicator */}
				{shouldShowScrollCue && (
					<div
						className={`absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce ${
							isVisible ? "opacity-100" : "opacity-0"
						}`}
					>
						<ChevronDown className="h-6 w-6 text-accent-secondary" />
					</div>
				)}
			</div>

			{/* Ambient Light Effects */}
			<div
				className={`absolute right-20 top-20 h-96 w-96 rounded-full bg-accent-primary/20 blur-3xl animate-blob ${ambientClass}`}
			/>
			<div
				className={`absolute bottom-20 left-20 h-96 w-96 rounded-full bg-accent-secondary/20 blur-3xl animate-blob animation-delay-2000 ${ambientClass}`}
			/>
		</section>
	);
};
