import React from "react";
import { ExternalLink } from "lucide-react";
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
			className="relative flex items-center justify-center min-h-[calc(100vh-64px)] bg-slate-900 px-4 py-10 sm:px-6 lg:px-8"
		>
			<div
			className="max-w-4xl w-full"
		>
				<div
					className={`text-center w-full transform transition-all duration-1000 ${
						isInView
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-10"
					}`}
				>
					<h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
						{contact.title}
					</h2>
					<p className="text-lg text-gray-400 mb-8">
						{contact.description}
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href={`mailto:${contact.email}`}
							className="px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent-primary/50 transition-all duration-300 hover:scale-105"
						>
							Get In Touch
						</a>
						{resumeUrl && (
							<a
								href={resumeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
							>
								Download Resume
								<ExternalLink className="w-4 h-4" />
							</a>
						)}
					</div>

					<p className="text-gray-500 mt-6">{contact.availability}</p>

					{social && social.links.length > 0 && (
						<div className="mt-10 border-t border-white/10 pt-8">
							<h3 className="mb-3 text-2xl font-bold text-white">
								{social.title}
							</h3>
							<p className="mx-auto mb-6 max-w-2xl text-gray-400">
								{social.description}
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								{social.links.map((link) => (
									<a
										key={link.platform}
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="group flex items-center gap-3 rounded-lg bg-slate-800 px-5 py-3 transition-all duration-300 hover:bg-slate-700"
									>
										<span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-colors duration-300 group-hover:border-cyan-300/40 group-hover:bg-cyan-400/10 group-hover:text-accent-primary">
											{getIconComponent(link.icon)}
										</span>
										<span className="font-semibold text-white">
											{link.platform}
										</span>
									</a>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Background Elements */}
			<div className="absolute top-0 left-0 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl opacity-20" />
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl opacity-20" />
		</section>
	);
};
