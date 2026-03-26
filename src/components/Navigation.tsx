import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavigationProps {
	personalName: string;
	sections: { id: string; label: string }[];
	activeSectionId: string;
	onNavigate: (id: string) => void;
	resumeUrl?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
	personalName,
	sections,
	activeSectionId,
	onNavigate,
	resumeUrl,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleNavigate = (id: string) => {
		onNavigate(id);
		setIsOpen(false);
	};

	return (
		<nav
			className={`fixed top-0 w-full z-40 border-b border-white/10 transition-all duration-300 ${
				isScrolled
					? "bg-black/70 backdrop-blur-2xl shadow-[0_12px_40px_rgba(2,6,23,0.45)]"
					: "bg-black/30 backdrop-blur-xl"
			}`}
		>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<button
						onClick={() => handleNavigate("hero")}
						className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300"
					>
						{personalName}
					</button>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center gap-8">
						{sections
							.filter((section) => section.id !== "hero")
							.map((section) => (
								<button
									key={section.id}
									onClick={() => handleNavigate(section.id)}
									className={`transition-colors duration-300 ${
										activeSectionId === section.id
											? "text-accent-primary"
											: "text-gray-300 hover:text-accent-primary"
									}`}
								>
									{section.label}
								</button>
							))}
						{resumeUrl && (
							<a
								href={resumeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="px-6 py-2 bg-accent-primary hover:bg-accent-primary/80 text-white font-semibold rounded-lg transition-colors duration-300"
							>
								Resume
							</a>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="md:hidden text-white hover:text-accent-primary transition-colors duration-300"
					>
						{isOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className="md:hidden mb-3 rounded-2xl border border-white/10 bg-black/45 p-3 pb-4 backdrop-blur-2xl space-y-2">
						{sections
							.filter((section) => section.id !== "hero")
							.map((section) => (
								<button
									key={section.id}
									onClick={() => handleNavigate(section.id)}
									className={`block w-full rounded px-4 py-2 text-left transition-colors duration-300 ${
										activeSectionId === section.id
											? "bg-slate-800 text-accent-primary"
											: "text-gray-300 hover:bg-slate-800 hover:text-accent-primary"
									}`}
								>
									{section.label}
								</button>
							))}
						{resumeUrl && (
							<a
								href={resumeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="block w-full text-left px-4 py-2 bg-accent-primary hover:bg-accent-primary/80 text-white font-semibold rounded transition-colors duration-300"
							>
								Resume
							</a>
						)}
					</div>
				)}
			</div>
		</nav>
	);
};
