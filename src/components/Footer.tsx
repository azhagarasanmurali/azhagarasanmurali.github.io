import React from "react";

interface FooterProps {
	year: number;
	name: string;
}

export const Footer: React.FC<FooterProps> = ({ year, name }) => {
	return (
		<footer className="bg-slate-950|slate-950 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto text-center text-gray-400">
				<p>
					&copy; {year} {name}. All rights reserved.
				</p>
				<p className="mt-2 text-sm">Crafted with passion and code</p>
			</div>
		</footer>
	);
};
