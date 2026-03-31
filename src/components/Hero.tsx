import React from "react";
import { ChevronDown } from "lucide-react";
import { useInView } from "../hooks/useInView";

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
	const [ref, isInView] = useInView({
		threshold: 0.2,
		rootMargin: "0px 0px -12% 0px",
	});
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
			? "max-w-3xl"
			: contentWidth === "wide"
				? "max-w-6xl"
				: "max-w-5xl";
	const headingClass =
		textScale === "compact"
			? "text-[clamp(1.6rem,4.4vw,4.5rem)]"
			: textScale === "large"
				? "text-[clamp(2rem,6vw,6.8rem)]"
				: "text-[clamp(1.75rem,5.25vw,5.8rem)]";
	const subheadingClass =
		textScale === "compact"
			? "text-[clamp(0.95rem,1.35vw,1.4rem)]"
			: textScale === "large"
				? "text-[clamp(1.1rem,1.85vw,2rem)]"
				: "text-[clamp(1rem,1.55vw,1.7rem)]";
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
			? "mt-8 inline-block rounded-lg bg-slate-800 px-[clamp(1.2rem,1.9vw,2.4rem)] py-[clamp(0.8rem,1vw,1.15rem)] text-[clamp(0.95rem,1vw,1.2rem)] font-semibold text-white transition-all duration-300 hover:bg-slate-700"
			: ctaTone === "strong"
				? "mt-8 inline-block rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary px-[clamp(1.2rem,1.9vw,2.4rem)] py-[clamp(0.8rem,1vw,1.15rem)] text-[clamp(0.95rem,1vw,1.2rem)] font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-primary/50"
				: "mt-8 inline-block rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary px-[clamp(1.2rem,1.9vw,2.4rem)] py-[clamp(0.8rem,1vw,1.15rem)] text-[clamp(0.95rem,1vw,1.2rem)] font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/40";
	const verticalAlignClass =
		verticalAlign === "top" ? "items-start pt-24" : "items-center";

	return (
		<section
			ref={ref}
			className="relative flex w-full justify-center overflow-hidden bg-slate-950 section-vh"
		>
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
					className={`${contentWidthClass} mx-auto ${spacingClass} transform-gpu transition-all duration-1000 will-change-[opacity,transform,filter] ${
						isInView
							? "opacity-100 translate-y-0 scale-100 blur-0"
							: "opacity-0 translate-y-12 scale-[0.98] blur-[10px]"
					}`}
				>
					<h1
						className={`${headingClass} whitespace-nowrap font-bold leading-none text-white`}
					>
						{data.heading}
					</h1>

					<p
						className={`${subheadingClass} mx-auto max-w-4xl font-light text-gray-300`}
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
						className={`absolute bottom-5 left-1/2 -translate-x-1/2 transform transition-all duration-700 animate-bounce sm:bottom-7 ${
							isInView
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-6"
						}`}
					>
						<ChevronDown className="h-6 w-6 text-accent-secondary" />
					</div>
				)}
			</div>

			{/* Ambient Light Effects */}
			<div
				className={`absolute right-[clamp(1rem,5vw,5rem)] top-[clamp(1rem,5vw,5rem)] h-[clamp(16rem,24vw,34rem)] w-[clamp(16rem,24vw,34rem)] rounded-full bg-accent-primary/20 blur-3xl animate-blob ${ambientClass}`}
			/>
			<div
				className={`absolute bottom-[clamp(1rem,5vw,5rem)] left-[clamp(1rem,5vw,5rem)] h-[clamp(16rem,24vw,34rem)] w-[clamp(16rem,24vw,34rem)] rounded-full bg-accent-secondary/20 blur-3xl animate-blob animation-delay-2000 ${ambientClass}`}
			/>
		</section>
	);
};
