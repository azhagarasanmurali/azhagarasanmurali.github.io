import React from "react";
import { ExternalLink } from "lucide-react";
import { AnimatedItem } from "./AnimatedItem";
import { useInView } from "../hooks/useInView";

interface SocialLink {
	platform: string;
	url: string;
	icon: string;
}

interface SocialProps {
	data: {
		title: string;
		description: string;
		design?: {
			verticalAlign?: string;
		};
		links: SocialLink[];
	};
}

const getIconComponent = (iconName: string) => {
	const icons: { [key: string]: React.ReactNode } = {
		github: (
			<img
				src="assets/images/social/github.svg"
				alt="GitHub"
				className="h-6 w-6"
			/>
		),
		linkedin: (
			<img
				src="assets/images/social/linkedin.svg"
				alt="LinkedIn"
				className="h-6 w-6"
			/>
		),
		twitter: (
			<img src="assets/images/social/x.svg" alt="X" className="h-6 w-6" />
		),
		gamepad: (
			<img
				src="assets/images/social/itchio.svg"
				alt="itch.io"
				className="h-6 w-6"
			/>
		),
		youtube: (
			<img
				src="assets/images/social/youtube.svg"
				alt="YouTube"
				className="h-6 w-6"
			/>
		),
	};
	return icons[iconName] || <ExternalLink className="w-6 h-6" />;
};

export const Social: React.FC<SocialProps> = ({ data }) => {
	const [ref, isInView] = useInView();
	const shouldCenter = (data.design?.verticalAlign ?? "center") === "center";

	return (
		<section
			ref={ref}
			className="relative h-full overflow-hidden bg-slate-900 px-4 py-10 sm:px-6 lg:px-8"
		>
			<div
				className={`mx-auto w-full max-w-4xl ${
					shouldCenter ? "flex h-full items-center" : ""
				}`}
			>
				<div
					className={`text-center transform-gpu transition-all duration-1000 will-change-[opacity,transform,filter] ${
						isInView
							? "opacity-100 translate-y-0 scale-100 blur-0"
							: "opacity-0 translate-y-10 scale-[0.98] blur-[10px]"
					}`}
				>
					<h2 className="mb-8 text-4xl font-bold text-white sm:text-5xl">
						{data.title}
					</h2>
					<p className="mx-auto mb-12 max-w-2xl text-lg text-gray-400">
						{data.description}
					</p>

					<div className="flex flex-wrap justify-center gap-6">
						{data.links.map((link, index) => (
							<AnimatedItem
								key={link.platform}
								delay={index * 70}
								from={index % 2 === 0 ? "left" : "right"}
							>
								<a
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex items-center gap-3 rounded-lg bg-slate-800 px-6 py-4 transition-all duration-300 hover:bg-slate-700 hover:shadow-lg hover:shadow-accent-primary/20"
								>
									<span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-colors duration-300 group-hover:border-cyan-300/40 group-hover:bg-cyan-400/10 group-hover:text-accent-primary">
										{getIconComponent(link.icon)}
									</span>
									<span className="font-semibold text-white">
										{link.platform}
									</span>
								</a>
							</AnimatedItem>
						))}
					</div>
				</div>
			</div>

			<div className="absolute bottom-0 right-0 h-[clamp(14rem,22vw,32rem)] w-[clamp(14rem,22vw,32rem)] rounded-full bg-accent-primary/10 opacity-20 blur-3xl" />
		</section>
	);
};
