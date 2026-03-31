import React from "react";
import { AnimatedItem } from "./AnimatedItem";
import { useInView } from "../hooks/useInView";

type DynamicSectionProps = {
	id: string;
	label: string;
	data: Record<string, unknown>;
};

const toTitle = (value: string) =>
	value.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeDesignClass = (value?: unknown) => {
	if (typeof value !== "string" || !value.trim()) return "";
	return value;
};

export const DynamicSection: React.FC<DynamicSectionProps> = ({
	id,
	label,
	data,
}) => {
	const [ref, isInView] = useInView();
	const title = (data.title as string | undefined) ?? toTitle(label || id);
	const description = data.description as string | undefined;
	const design = (data.design as Record<string, unknown> | undefined) ?? {};
	const containerClass =
		normalizeDesignClass(design.containerClass) ||
		"mx-auto w-full max-w-5xl";
	const sectionClass =
		normalizeDesignClass(design.sectionClass) ||
		"relative overflow-hidden bg-slate-900 px-4 py-20 sm:px-6 lg:px-8";
	const contentAlign =
		design.verticalAlign === "center" ? "section-vh-center" : "";

	const list =
		(data.entries as unknown[] | undefined) ??
		(data.items as unknown[] | undefined) ??
		(data.list as unknown[] | undefined) ??
		[];

	const groups = list.reduce<
		Array<{ key: string; title: string; values: Record<string, unknown>[] }>
	>((acc, raw) => {
		if (!raw || typeof raw !== "object") return acc;
		const item = raw as Record<string, unknown>;
		const key = String(item.type ?? "other").toLowerCase();
		const found = acc.find((g) => g.key === key);
		if (found) {
			found.values.push(item);
			return acc;
		}
		acc.push({
			key,
			title: toTitle(String(item.type ?? "other")),
			values: [item],
		});
		return acc;
	}, []);

	return (
		<section ref={ref} className={sectionClass}>
			<div className={`${containerClass} ${contentAlign}`}>
				<div className="w-full">
					<div
						className={`mb-[clamp(1.5rem,2vw,2rem)] transform-gpu transition-all duration-1000 will-change-[opacity,transform,filter] ${
							isInView
								? "opacity-100 translate-y-0 scale-100 blur-0"
								: "opacity-0 translate-y-10 scale-[0.98] blur-[10px]"
						}`}
					>
						<h2 className="mb-[clamp(0.8rem,1.2vw,1.2rem)] text-[clamp(1.8rem,5vw,3rem)] font-bold text-white">
							{title}
						</h2>
						{description && (
							<p className="max-w-3xl text-[clamp(0.95rem,1.2vw,1.15rem)] text-slate-300">
								{description}
							</p>
						)}
					</div>

					{groups.length > 0 ? (
						<div className="space-y-10">
							{groups.map((group, groupIndex) => (
								<AnimatedItem
									key={group.key}
									delay={groupIndex * 80}
								>
									<div className="mb-[clamp(0.8rem,1.2vw,1.2rem)] flex items-center justify-between">
										<h3 className="text-[clamp(1.2rem,2.2vw,1.7rem)] font-bold text-cyan-100">
											{group.title}
										</h3>
										<span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-[clamp(0.6rem,0.8vw,1rem)] py-[clamp(0.25rem,0.4vw,0.4rem)] text-[clamp(0.65rem,0.75vw,0.8rem)] font-semibold uppercase tracking-[0.2em] text-cyan-200">
											{group.values.length} Item
											{group.values.length > 1 ? "s" : ""}
										</span>
									</div>
									<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
										{group.values.map((item, index) =>
											(() => {
												const itemDescription =
													typeof item.description ===
													"string"
														? item.description
														: undefined;
												return (
													<AnimatedItem
														key={String(
															item.id ??
																`${group.key}-${index}`,
														)}
														delay={index * 60}
													>
														<div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-sm">
															<h4 className="mb-2 text-xl font-semibold text-white">
																{String(
																	item.title ??
																		"Untitled",
																)}
															</h4>
															{itemDescription && (
																<p className="leading-7 text-slate-300">
																	{
																		itemDescription
																	}
																</p>
															)}
														</div>
													</AnimatedItem>
												);
											})(),
										)}
									</div>
								</AnimatedItem>
							))}
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
};
