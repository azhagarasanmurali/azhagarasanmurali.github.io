import React from "react";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
	project: {
		id: string;
		title: string;
		tagline: string;
		category: string[];
		type?: string;
		year: number;
		thumbnail: string;
		detailedDescription?: string;
	};
	onClick: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
	project,
	onClick,
}) => {
	return (
		<div
			onClick={() => onClick(project.id)}
			className="group cursor-pointer overflow-hidden rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-500 shadow-[0_0_26px_rgba(124,58,237,0.12)] hover:shadow-[0_0_52px_rgba(124,58,237,0.38),0_20px_60px_rgba(0,0,0,0.44)]"
		>
			{/* Image Container */}
			<div className="relative overflow-hidden aspect-square bg-slate-900">
				<img
					src={project.thumbnail}
					alt={project.title}
					loading="lazy"
					decoding="async"
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
				/>
				{/* Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
					<div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/35 bg-slate-950/45 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.18)] backdrop-blur-md">
						View Details <ExternalLink className="w-4 h-4" />
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="p-6 space-y-3">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<h3 className="text-xl font-bold text-white group-hover:text-accent-primary transition-colors duration-300">
							{project.title}
						</h3>
						<p className="text-gray-400 text-sm mt-1">
							{project.tagline}
						</p>
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-slate-700 pt-4">
					<div className="flex flex-wrap gap-2">
						{project.type && (
							<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
								{project.type}
							</span>
						)}
						{project.category.map((category) => (
							<span
								key={category}
								className="px-3 py-1 bg-accent-primary/10 text-accent-primary text-xs font-semibold rounded-full"
							>
								{category}
							</span>
						))}
						<span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs font-semibold rounded-full">
							{project.year}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
