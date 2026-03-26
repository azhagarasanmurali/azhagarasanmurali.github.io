import React, { useEffect, useMemo, useState } from "react";

interface LoadingScreenProps {
	messages: string[];
	progress: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
	messages,
	progress,
}) => {
	const fallbackMessages = useMemo(
		() => ["Loading portfolio experience..."],
		[],
	);
	const pool = messages.length ? messages : fallbackMessages;
	const [messageIndex, setMessageIndex] = useState(0);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setMessageIndex((prev) => (prev + 1) % pool.length);
		}, 1200);
		return () => window.clearInterval(interval);
	}, [pool]);

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.2),transparent_35%)]" />
			<div className="relative w-full max-w-xl px-6 text-center">
				<div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
					<div className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
					Loading
				</div>
				<h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
					Azhagarasan Murali
				</h2>
				<p className="mb-8 min-h-7 text-base text-slate-200 sm:text-lg">
					{pool[messageIndex]}
				</p>

				<div className="mx-auto w-full max-w-md rounded-full border border-white/10 bg-white/5 p-1.5">
					<div className="h-2.5 rounded-full bg-slate-900/50">
						<div
							className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 transition-[width] duration-300"
							style={{
								width: `${Math.max(6, Math.min(100, progress))}%`,
							}}
						/>
					</div>
				</div>
				<div className="mt-3 text-sm text-slate-400">
					{Math.round(Math.max(0, Math.min(100, progress)))}%
				</div>
			</div>
		</div>
	);
};
