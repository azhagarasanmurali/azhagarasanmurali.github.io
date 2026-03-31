import React from "react";
import { AnimatedItem } from "./AnimatedItem";

interface FooterProps {
	year: number;
	name: string;
}

export const Footer: React.FC<FooterProps> = ({ year, name }) => {
	return (
		<footer className="bg-slate-950 border-t border-slate-800 py-[clamp(1.5rem,2vw,2rem)] px-4 sm:px-6 lg:px-8">
			<AnimatedItem
				className="max-w-6xl mx-auto text-center text-gray-400"
				from="scale"
			>
				<p>
					&copy; {year} {name}. All rights reserved.
				</p>
				<p className="mt-2 text-sm">Crafted with passion and code</p>
			</AnimatedItem>
		</footer>
	);
};
