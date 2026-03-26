import React, { useEffect, useRef, useState } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import { useInView } from "../hooks/useInView";
import { AnimatedItem } from "./AnimatedItem";

interface TimelineEntry {
	id: string;
	type: string;
	title: string;
	organization: string;
	location: string;
	period: string;
	description: string;
	highlights: string[];
}

interface TimelineProps {
	title: string;
	description: string;
	entries: TimelineEntry[];
	design?: {
		spacing?: "compact" | "comfortable" | "airy";
		surface?: "plain" | "muted" | "elevated";
		lineStyle?: "subtle" | "balanced" | "strong";
		cardTone?: "soft" | "balanced" | "strong";
		verticalAlign?: "top" | "center";
	};
}

export const Timeline: React.FC<TimelineProps> = ({
	title,
	description,
	entries,
	design,
}) => {
	const formatTypeLabel = (value: string) =>
		value
			.replace(/[-_]+/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase());
	const primaryTypeKey = (entries[0]?.type ?? "").toLowerCase();
	const spacing = design?.spacing ?? "comfortable";
	const surface = design?.surface ?? "muted";
	const lineStyle = design?.lineStyle ?? "balanced";
	const cardTone = design?.cardTone ?? "balanced";
	const verticalAlign = design?.verticalAlign ?? "top";

	const sectionSpacingClass =
		spacing === "compact"
			? "pt-14 pb-20"
			: spacing === "airy"
				? "pt-28 pb-40"
				: "pt-20 pb-32";
	const sectionSurfaceClass =
		surface === "plain"
			? "bg-slate-950"
			: surface === "elevated"
				? "bg-slate-800/70"
				: "bg-slate-900/60";
	const railClass =
		lineStyle === "subtle"
			? "border-cyan-400/20"
			: lineStyle === "strong"
				? "border-cyan-300/50"
				: "border-cyan-400/30";
	const verticalAlignClass =
		verticalAlign === "center"
			? "min-h-[calc(100vh-4rem)] flex items-center"
			: "";

	const [ref, isInView] = useInView();
	const [orbPosition, setOrbPosition] = useState(0);
	const trackRef = useRef<HTMLDivElement>(null);
	const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
	const [snappedIndex, setSnappedIndex] = useState(-1);
	const [isActivelyScrolling, setIsActivelyScrolling] = useState(false);
	const scrollStopTimerRef = useRef<number | null>(null);

	const getClosestIconIndex = (orbPct?: number): number => {
		const track = trackRef.current;
		if (!track) return -1;
		const trackTop = track.getBoundingClientRect().top;
		const section = ref.current;
		let effectivePct = orbPct;
		if (effectivePct === undefined && section) {
			const rect = section.getBoundingClientRect();
			const totalScrollable = rect.height - window.innerHeight;
			if (totalScrollable > 0) {
				effectivePct = Math.max(
					0,
					Math.min(100, (-rect.top / totalScrollable) * 100),
				);
			}
		}
		const orbPx = ((effectivePct ?? 0) / 100) * track.offsetHeight;
		let closest = -1;
		let closestDist = Number.POSITIVE_INFINITY;
		iconRefs.current.forEach((el, index) => {
			if (!el) return;
			const r = el.getBoundingClientRect();
			const center = r.top - trackTop + el.offsetHeight / 2;
			const d = Math.abs(center - orbPx);
			if (d < closestDist) {
				closestDist = d;
				closest = index;
			}
		});
		return closest;
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsActivelyScrolling(true);
			if (scrollStopTimerRef.current) {
				window.clearTimeout(scrollStopTimerRef.current);
			}

			const sectionAtStop = ref.current;
			let liveProgress = orbPosition;
			if (sectionAtStop) {
				const rect = sectionAtStop.getBoundingClientRect();
				const totalScrollable = rect.height - window.innerHeight;
				if (totalScrollable > 0) {
					liveProgress = Math.max(
						0,
						Math.min(100, (-rect.top / totalScrollable) * 100),
					);
				}
			}

			scrollStopTimerRef.current = window.setTimeout(() => {
				setIsActivelyScrolling(false);
				setSnappedIndex(getClosestIconIndex(liveProgress));
			}, 140);

			const section = ref.current;
			if (!section) return;
			const rect = section.getBoundingClientRect();
			const vh = window.innerHeight;
			const totalScrollable = rect.height - vh;
			if (totalScrollable <= 0) {
				setOrbPosition(50);
				return;
			}
			const scrolled = -rect.top;
			const progress = Math.max(
				0,
				Math.min(100, (scrolled / totalScrollable) * 100),
			);
			setOrbPosition(progress);

			// While scrolling, keep orb aligned to the most relevant entry
			const track = trackRef.current;
			if (track) {
				const trackHeight = track.offsetHeight;
				const orbPx = (progress / 100) * trackHeight;
				let closestIdx = -1;
				let closestDist = Number.POSITIVE_INFINITY;
				const trackTop = track.getBoundingClientRect().top;
				iconRefs.current.forEach((el, i) => {
					if (!el) return;
					const r = el.getBoundingClientRect();
					const elCenter = r.top - trackTop + el.offsetHeight / 2;
					const dist = Math.abs(orbPx - elCenter);
					if (dist < closestDist) {
						closestDist = dist;
						closestIdx = i;
					}
				});
				setSnappedIndex(closestIdx);
				if (closestIdx >= 0 && iconRefs.current[closestIdx]) {
					const el = iconRefs.current[closestIdx];
					const r = el!.getBoundingClientRect();
					const center = r.top - trackTop + el!.offsetHeight / 2;
					const pct = Math.max(
						0,
						Math.min(100, (center / trackHeight) * 100),
					);
					setOrbPosition(pct);
				}
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (scrollStopTimerRef.current) {
				window.clearTimeout(scrollStopTimerRef.current);
			}
		};
	}, [ref]);

	return (
		<section
			ref={ref}
			className={`relative overflow-hidden px-4 sm:px-6 lg:px-8 ${sectionSpacingClass} ${sectionSurfaceClass}`}
		>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_32%)]" />
			<div className={`relative mx-auto max-w-6xl ${verticalAlignClass}`}>
				<div className="w-full">
					<div
						className={`mb-16 transform transition-all duration-1000 ${
							isInView
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-10"
						}`}
					>
						<h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
							{title}
						</h2>
						<p className="max-w-3xl text-lg text-slate-300">
							{description}
						</p>
					</div>

					<div
						ref={trackRef}
						className={`relative ml-4 border-l pl-8 sm:ml-6 sm:pl-10 ${railClass}`}
					>
						{/* Scroll-tracking glowing orb */}
						<div
							className={`pointer-events-none absolute left-[-0.45rem] h-[0.9rem] w-[0.9rem] rounded-full bg-cyan-400 glow-orb-cyan transition-[top,opacity] duration-200 ${isActivelyScrolling ? "opacity-100" : "opacity-0"}`}
							style={{ top: `${orbPosition}%` }}
						/>

						{entries.map((entry, index) => {
							const entryTypeKey = entry.type.toLowerCase();
							const isPrimaryType =
								entryTypeKey === primaryTypeKey;
							const badgeClassName = isPrimaryType
								? "border-cyan-300/20 bg-cyan-400/10 text-cyan-200"
								: "border-amber-300/30 bg-amber-400/10 text-amber-100";
							const primaryCardToneClass =
								cardTone === "soft"
									? "rounded-3xl border border-white/10 bg-slate-950/55 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8"
									: cardTone === "strong"
										? "rounded-3xl border border-cyan-200/20 bg-slate-950/80 p-6 shadow-[0_35px_90px_rgba(15,23,42,0.55),0_0_36px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8"
										: "rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45),0_0_30px_rgba(34,211,238,0.07)] backdrop-blur-xl sm:p-8";
							const secondaryCardToneClass =
								cardTone === "soft"
									? "rounded-[2rem] border border-amber-200/15 bg-[linear-gradient(135deg,rgba(120,53,15,0.14),rgba(15,23,42,0.75))] p-6 shadow-[0_15px_45px_rgba(120,53,15,0.2)] backdrop-blur-xl sm:p-8"
									: cardTone === "strong"
										? "rounded-[2rem] border border-amber-200/28 bg-[linear-gradient(135deg,rgba(120,53,15,0.24),rgba(15,23,42,0.88))] p-6 shadow-[0_35px_90px_rgba(120,53,15,0.35),0_0_35px_rgba(251,191,36,0.12)] backdrop-blur-xl sm:p-8"
										: "rounded-[2rem] border border-amber-200/20 bg-[linear-gradient(135deg,rgba(120,53,15,0.18),rgba(15,23,42,0.82))] p-6 shadow-[0_25px_70px_rgba(120,53,15,0.28),0_0_28px_rgba(251,191,36,0.08)] backdrop-blur-xl sm:p-8";
							const cardClassName = isPrimaryType
								? primaryCardToneClass
								: secondaryCardToneClass;
							const organizationClassName = isPrimaryType
								? "mt-2 text-base font-medium text-cyan-100"
								: "mt-2 text-base font-medium text-amber-100";
							const highlightClassName = isPrimaryType
								? "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
								: "rounded-full border border-amber-200/20 bg-amber-50/10 px-4 py-2 text-sm text-amber-50";

							return (
								<AnimatedItem
									key={entry.id}
									delay={index * 80}
									className="relative mb-10"
								>
									<div
										ref={(el) => {
											iconRefs.current[index] = el;
										}}
										className={`absolute -left-[3.2rem] top-6 flex h-11 w-11 items-center justify-center rounded-2xl border bg-slate-950/90 backdrop-blur-xl sm:-left-[3.55rem] transition-shadow duration-300 ${
											isPrimaryType
												? snappedIndex === index
													? "border-cyan-300/70 text-cyan-200 shadow-[0_0_28px_6px_rgba(34,211,238,0.65),0_0_55px_rgba(34,211,238,0.35)]"
													: "border-cyan-300/30 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.18)]"
												: snappedIndex === index
													? "border-amber-200/70 text-amber-100 shadow-[0_0_28px_6px_rgba(251,191,36,0.65),0_0_55px_rgba(251,191,36,0.35)]"
													: "border-amber-200/30 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.18)]"
										}`}
									>
										{isPrimaryType ? (
											<Briefcase className="h-5 w-5" />
										) : (
											<GraduationCap className="h-5 w-5" />
										)}
									</div>

									<div className={cardClassName}>
										<div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
											<div>
												<span
													className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${badgeClassName}`}
												>
													{formatTypeLabel(
														entry.type,
													)}
												</span>
												<h3 className="text-2xl font-bold text-white">
													{entry.title}
												</h3>
												<p
													className={
														organizationClassName
													}
												>
													{entry.organization}
												</p>
											</div>

											<div className="text-sm text-slate-300 sm:text-right">
												<div className="font-semibold text-white">
													{entry.period}
												</div>
												<div className="mt-1 text-slate-400">
													{entry.location}
												</div>
											</div>
										</div>

										<p className="mb-5 leading-7 text-slate-300">
											{entry.description}
										</p>

										<div className="flex flex-wrap gap-3">
											{entry.highlights.map(
												(highlight) => (
													<span
														key={highlight}
														className={
															highlightClassName
														}
													>
														{highlight}
													</span>
												),
											)}
										</div>
									</div>
								</AnimatedItem>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};
