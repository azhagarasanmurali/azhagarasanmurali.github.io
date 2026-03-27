import React from "react";
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
			? "py-14"
			: spacing === "airy"
				? "py-28"
				: "py-20";
	const widthClass = contentWidth === "standard" ? "max-w-5xl" : "max-w-6xl";
	const layoutClass =
		layout === "stacked"
			? "grid grid-cols-1 gap-10"
			: "grid items-center gap-12 md:grid-cols-2";
	const verticalAlignClass =
		verticalAlign === "center"
			? "min-h-[calc(100vh-4rem)] flex items-center"
			: "";
	const skillItemClass =
		skillsStyle === "minimal"
			? "rounded border border-slate-700 px-4 py-2 text-gray-300"
			: skillsStyle === "pill"
				? "rounded-full border border-accent-primary/35 bg-accent-primary/10 px-4 py-2 text-sm text-cyan-100"
				: "rounded-lg border border-accent-primary/30 bg-slate-800 px-4 py-3 text-gray-200 transition-colors duration-300 hover:border-accent-primary/60 hover:text-accent-primary";
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
						className={`space-y-8 transform transition-all duration-1000 ${
							isInView
								? "opacity-100 translate-x-0"
								: "opacity-0 -translate-x-10"
						}`}
					>
						<h2 className="text-4xl sm:text-5xl font-bold text-white">
							{data.title}
						</h2>

						<p className="text-lg text-gray-300 leading-relaxed">
							{data.description}
						</p>

						<div>
							<h3 className="text-xl font-semibold text-white mb-4">
								Skills & Expertise
							</h3>
							<div className="grid grid-cols-2 gap-3">
								{data.skills.map((skill, index) => (
									<div key={index} className={skillItemClass}>
										{skill}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right Side - Image */}
					<div
						className={`transform transition-all duration-1000 ${
							isInView
								? "opacity-100 translate-x-0"
								: "opacity-0 translate-x-10"
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
									className="relative rounded-2xl w-full h-auto shadow-2xl hover:shadow-accent-primary/20 transition-shadow duration-300"
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};
