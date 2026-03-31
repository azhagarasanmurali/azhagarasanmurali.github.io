import React from "react";
import { ExternalLink } from "lucide-react";
import { AnimatedItem } from "./AnimatedItem";
import { useInView } from "../hooks/useInView";

interface ContactProps {
	contact: {
		title: string;
		description: string;
		email: string;
		availability: string;
		design?: {
			verticalAlign?: string;
		};
	};
	social?: {
		title: string;
		description: string;
		links: {
			platform: string;
			url: string;
			icon: string;
		}[];
	};
	resumeUrl?: string;
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

export const Contact: React.FC<ContactProps> = ({
	contact,
	social,
	resumeUrl,
}) => {
	const [ref, isInView] = useInView();

	return (
		<section
			ref={ref}
			className="relative flex items-center justify-center section-vh bg-slate-900 px-4 py-[clamp(1.5rem,2.5vw,2rem)] sm:px-6 lg:px-8"
		>
			<div className="max-w-4xl w-full">
				<div
					className={`text-center w-full transform-gpu transition-all duration-1000 will-change-[opacity,transform,filter] ${
						isInView
							? "opacity-100 translate-y-0 scale-100 blur-0"
							: "opacity-0 translate-y-10 scale-[0.98] blur-[10px]"
					}`}
				>
					<h2 className="text-[clamp(1.8rem,5vw,3rem)] font-bold text-white mb-[clamp(0.8rem,1.2vw,1.2rem)]">
						{contact.title}
					</h2>
					<p className="text-[clamp(0.95rem,1.2vw,1.15rem)] text-gray-400 mb-[clamp(1rem,1.5vw,1.5rem)]">
						{contact.description}
					</p>

					<div className="flex flex-col gap-[clamp(0.8rem,1vw,1rem)] sm:flex-row sm:justify-center">
						<AnimatedItem delay={80} from="left">
							<a
								href={`mailto:${contact.email}`}
								className="px-[clamp(1rem,1.5vw,1.4rem)] py-[clamp(0.6rem,0.9vw,0.8rem)] bg-gradient-to-r from-accent-primary to-accent-secondary text-[clamp(0.9rem,0.95vw,1rem)] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-primary/50"
							>
								Get In Touch
							</a>
						</AnimatedItem>
						{resumeUrl && (
							<AnimatedItem delay={140} from="right">
								<a
									href={resumeUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="px-[clamp(1rem,1.5vw,1.4rem)] py-[clamp(0.6rem,0.9vw,0.8rem)] bg-slate-800 hover:bg-slate-700 text-[clamp(0.9rem,0.95vw,1rem)] text-white font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-[clamp(0.4rem,0.6vw,0.6rem)]"
								>
									Download Resume
									<ExternalLink className="w-[clamp(0.8rem,1vw,1.1rem)] h-[clamp(0.8rem,1vw,1.1rem)]" />
								</a>
							</AnimatedItem>
						)}
					</div>

					<AnimatedItem delay={180} from="scale">
						<p className="text-[clamp(0.85rem,1vw,1rem)] text-gray-500 mt-[clamp(0.8rem,1.2vw,1.2rem)]">
							{contact.availability}
						</p>
					</AnimatedItem>

					{social && social.links.length > 0 && (
						<div className="mt-[clamp(1.5rem,2vw,2rem)] border-t border-white/10 pt-[clamp(1.2rem,1.8vw,1.8rem)]">
							<h3 className="mb-[clamp(0.6rem,1vw,1rem)] text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold text-white">
								{social.title}
							</h3>
							<p className="mx-auto mb-[clamp(1rem,1.5vw,1.5rem)] max-w-2xl text-[clamp(0.9rem,1vw,1.05rem)] text-gray-400">
								{social.description}
							</p>
							<div className="flex flex-wrap justify-center gap-[clamp(0.8rem,1.2vw,1rem)]">
								{social.links.map((link, index) => (
									<AnimatedItem
										key={link.platform}
										delay={220 + index * 60}
										from={
											index % 2 === 0 ? "left" : "right"
										}
									>
										<a
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											className="group flex items-center gap-[clamp(0.6rem,0.8vw,0.8rem)] rounded-lg bg-slate-800 px-[clamp(1rem,1.2vw,1.3rem)] py-[clamp(0.5rem,0.8vw,0.9rem)] transition-all duration-300 hover:bg-slate-700"
										>
											<span className="flex h-[clamp(1.8rem,2.2vw,2.4rem)] w-[clamp(1.8rem,2.2vw,2.4rem)] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[clamp(0.85rem,1vw,1.1rem)] text-gray-400 transition-colors duration-300 group-hover:border-cyan-300/40 group-hover:bg-cyan-400/10 group-hover:text-accent-primary">
												{getIconComponent(link.icon)}
											</span>
											<span className="font-semibold text-[clamp(0.85rem,1vw,1.1rem)] text-white">
												{link.platform}
											</span>
										</a>
									</AnimatedItem>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Background Elements */}
			<div className="absolute left-0 top-0 h-[clamp(14rem,22vw,32rem)] w-[clamp(14rem,22vw,32rem)] rounded-full bg-accent-secondary/10 blur-3xl opacity-20" />
			<div className="absolute bottom-0 right-0 h-[clamp(14rem,22vw,32rem)] w-[clamp(14rem,22vw,32rem)] rounded-full bg-accent-primary/10 blur-3xl opacity-20" />
		</section>
	);
};
