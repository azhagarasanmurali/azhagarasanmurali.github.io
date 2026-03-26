import React from "react";

export const AppSkeleton: React.FC = () => {
	return (
		<div className="min-h-screen bg-dark-950">
			<div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
				<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<div className="h-7 w-44 animate-pulse rounded bg-white/10" />
					<div className="hidden gap-3 md:flex">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="h-9 w-20 animate-pulse rounded-full bg-white/10"
							/>
						))}
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8">
					<div className="h-12 w-2/3 animate-pulse rounded bg-white/10" />
					<div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-white/10" />
					<div className="mt-8 h-44 animate-pulse rounded-2xl bg-white/10" />
				</div>

				<div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8">
					<div className="h-10 w-56 animate-pulse rounded bg-white/10" />
					<div className="mt-4 h-5 w-4/5 animate-pulse rounded bg-white/10" />
					<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="h-56 animate-pulse rounded-2xl bg-white/10"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
