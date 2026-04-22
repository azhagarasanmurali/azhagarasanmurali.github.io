import React from "react";
import { AnimatedItem } from "./AnimatedItem";
import { useInView } from "../hooks/useInView";

interface AboutProps {
	data: {
		title: string;
		description: string;
		skills: string[];
		profileImage?: string;
		design?: {
			layout?: string;
			spacing?: string;
			surface?: string;
			skillsStyle?: string;
			verticalAlign?: string;
			contentWidth?: string;
		};
	};
}

export const About: React.FC<AboutProps> = ({ data }) => {
	const [ref, isInView] = useInView();
	const design = data.design ?? {};
	const layout = design.layout ?? "split";
	const spacing = design.spacing ?? "comfortable";
	const surface = design.surface ?? "muted";
	const skillsStyle = design.skillsStyle ?? "card";
	const verticalAlign = design.verticalAlign ?? "center";
	const contentWidth = design.contentWidth ?? "wide";

	const sectionSurfaceClass =
		surface === "plain"
			? "bg-slate-950"
			: surface === "elevated"
				? "bg-slate-800/70"
				: "bg-slate-900";
	const spacingClass =
		spacing === "compact"
			? "py-[clamp(2rem,3vw,2.5rem)]"
			: spacing === "airy"
				? "py-[clamp(3rem,5vw,4.5rem)]"
				: "py-[clamp(2.5rem,4vw,3.5rem)]";
	const widthClass = contentWidth === "standard" ? "max-w-5xl" : "max-w-6xl";
	const isStackedLayout = layout === "stacked";
	const layoutClass = isStackedLayout
		? "grid grid-cols-1 gap-10"
		: "grid gap-10 md:grid-cols-2 xl:grid-cols-12 xl:items-start";
	const verticalAlignClass =
		verticalAlign === "center" ? "section-vh-center" : "";
	const textColumnClass = isStackedLayout ? "" : "xl:col-span-7";
	const imageColumnClass = isStackedLayout
		? ""
		: "md:max-w-md xl:col-span-5 xl:w-full xl:justify-self-end";
	const skillsColumnClass = isStackedLayout ? "" : "xl:col-span-12";
	const skillItemClass =
		skillsStyle === "minimal"
			? "rounded border border-slate-700 px-4 py-2 text-gray-300"
			: skillsStyle === "pill"
				? "rounded-full border border-accent-primary/35 bg-accent-primary/10 px-4 py-2 text-sm text-cyan-100"
				: "rounded-lg border border-accent-primary/30 bg-slate-800 px-4 py-3 text-gray-200 transition-colors duration-300";
	const imageGlowClass =
		surface === "plain"
			? "opacity-15"
			: surface === "elevated"
				? "opacity-40"
				: "opacity-30";

	return (
		<section
			ref={ref}
			className={`${spacingClass} ${sectionSurfaceClass} relative overflow-hidden px-4 sm:px-6 lg:px-8`}
		>
			<div className={`${widthClass} ${verticalAlignClass} mx-auto`}>
				<div className={`w-full ${layoutClass}`}>
					{/* Left Side - Text */}
					<div
						className={`${textColumnClass} space-y-8 transform-gpu transition-all duration-1000 will-change-[opacity,transform,filter] ${
							isInView
								? "opacity-100 translate-x-0 scale-100 blur-0"
								: "opacity-0 -translate-x-12 scale-[0.98] blur-[10px]"
						}`}
					>
						<h2 className="text-[clamp(1.8rem,5vw,3rem)] font-bold text-white mb-[clamp(1rem,1.5vw,1.5rem)]">
							{data.title}
						</h2>

						<p className="max-w-3xl text-[clamp(0.95rem,1.2vw,1.2rem)] leading-relaxed text-gray-300">
							{data.description}
						</p>
					</div>

					{/* Right Side - Image */}
					<div
						className={`${imageColumnClass} transform-gpu transition-all duration-1000 will-change-[opacity,transform,filter] ${
							isInView
								? "opacity-100 translate-x-0 scale-100 blur-0"
								: "opacity-0 translate-x-12 scale-[0.98] blur-[10px]"
						}`}
					>
						{data.profileImage && (
							<div className="relative">
								<div
									className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary blur-2xl ${imageGlowClass}`}
								/>
								<img
									src={data.profileImage}
									alt="Profile"
									loading="lazy"
									decoding="async"
									className="relative rounded-2xl w-full h-auto shadow-2xl hover:shadow-accent-primary/20 transition-shadow duration-300"
								/>
							</div>
						)}
					</div>

					<div
						className={`${skillsColumnClass} transform-gpu transition-all duration-1000 will-change-[opacity,transform,filter] ${
							isInView
								? "opacity-100 translate-y-0 scale-100 blur-0"
								: "opacity-0 translate-y-8 scale-[0.98] blur-[10px]"
						}`}
					>
						<h3 className="mb-[clamp(0.8rem,1vw,1.2rem)] text-[clamp(1rem,1.5vw,1.3rem)] font-semibold text-white">
							Skills & Expertise
						</h3>
						<div className="grid grid-cols-1 gap-[clamp(0.6rem,0.8vw,1rem)] sm:grid-cols-2 xl:grid-cols-4">
							{data.skills.map((skill, index) => (
								<AnimatedItem
									key={skill}
									delay={index * 55}
									from={index % 2 === 0 ? "left" : "right"}
								>
									<div className={skillItemClass}>
										{skill}
									</div>
								</AnimatedItem>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
