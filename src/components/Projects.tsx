import React from "react";
import { ProjectCard } from "./ProjectCard";
import { AnimatedItem } from "./AnimatedItem";
import { useInView } from "../hooks/useInView";

interface VideoItem {
	type: "youtube" | "asset";
	url: string;
	title?: string;
}

interface Project {
	id: string;
	title: string;
	tagline: string;
	type?: string;
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

interface ProjectsProps {
	title: string;
	description: string;
	projects: Project[];
	onProjectSelect: (projectId: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
	title,
	description,
	projects,
	onProjectSelect,
}) => {
	const [ref, isInView] = useInView();
	const formatTypeLabel = (value?: string) => {
		if (!value || !value.trim()) return "Other";
		return value
			.replace(/[-_]+/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	const projectGroups = projects.reduce<
		Array<{
			key: string;
			title: string;
			description: string;
			projects: Project[];
		}>
	>((acc, project) => {
		const key = (project.type ?? "other").toLowerCase();
		const existing = acc.find((group) => group.key === key);
		if (existing) {
			existing.projects.push(project);
			return acc;
		}

		const typeTitle = formatTypeLabel(project.type);
		acc.push({
			key,
			title: `${typeTitle} Projects`,
			description: `${typeTitle} work and case studies.`,
			projects: [project],
		});
		return acc;
	}, []);

	return (
		<section
			ref={ref}
			className="relative overflow-x-clip bg-slate-950 px-4 py-[clamp(2rem,4vw,3rem)] sm:px-6 lg:px-8"
		>
			<div className="max-w-6xl mx-auto">
				{/* Section Header */}
				<div
					className={`mb-16 transform transition-all duration-1000 ${
						isInView
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-10"
					}`}
				>
					<h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
						{title}
					</h2>
					<p className="text-lg text-gray-400">{description}</p>
				</div>

				<div className="space-y-[clamp(2rem,3vw,3.5rem)]">
					{projectGroups.map((group, groupIndex) => (
						<AnimatedItem key={group.key} delay={groupIndex * 120}>
							<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
								<div>
									<h3 className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold text-white">
										{group.title}
									</h3>
									<p className="mt-2 max-w-2xl text-[clamp(0.8rem,0.95vw,0.95rem)] text-slate-400">
										{group.description}
									</p>
								</div>
								<span className="inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
									{group.projects.length} Project
									{group.projects.length > 1 ? "s" : ""}
								</span>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{group.projects.map((project, index) => (
									<AnimatedItem
										key={project.id}
										delay={index * 90}
									>
										<ProjectCard
											project={project}
											onClick={onProjectSelect}
										/>
									</AnimatedItem>
								))}
							</div>
						</AnimatedItem>
					))}
				</div>
			</div>

			{/* Background Elements */}
			<div className="absolute top-1/2 right-[clamp(-18rem,-10vw,-8rem)] h-[clamp(14rem,22vw,32rem)] w-[clamp(14rem,22vw,32rem)] rounded-full bg-accent-primary/10 blur-3xl opacity-20" />
		</section>
	);
};
