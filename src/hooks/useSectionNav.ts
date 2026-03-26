import { useCallback, useEffect, useRef, useState } from "react";

export const useSectionNav = (
	sectionIds: readonly string[],
	enabled = true,
) => {
	const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? "");
	const mainRef = useRef<HTMLElement | null>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (!sectionIds.includes(activeSectionId) && sectionIds[0]) {
			setActiveSectionId(sectionIds[0]);
		}
	}, [activeSectionId, sectionIds]);

	const navigateToSection = useCallback(
		(id: string) => {
			const section = document.getElementById(id);
			if (!section) return;

			const main = document.querySelector("main");
			if (!main) return;

			// Calculate the position considering the navigation height (64px)
			const navHeight = 64;
			const sectionTop = section.offsetTop - navHeight;

			main.scrollTo({
				top: sectionTop,
				behavior: "smooth",
			});

			setActiveSectionId(id);
		},
		[],
	);

	useEffect(() => {
		if (!enabled) return;

		const main = document.querySelector("main");
		if (!main) return;

		mainRef.current = main as HTMLElement;

		// Create intersection observer to track which section is in view
		const observerOptions = {
			root: main,
			rootMargin: "-50% 0px -50% 0px",
			threshold: 0,
		};

		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			const visibleEntry = entries.find((entry) => entry.isIntersecting);
			if (visibleEntry) {
				setActiveSectionId(visibleEntry.target.id);
			}
		};

		observerRef.current = new IntersectionObserver(
			handleIntersection,
			observerOptions,
		);

		// Observe all sections
		sectionIds.forEach((id) => {
			const section = document.getElementById(id);
			if (section && observerRef.current) {
				observerRef.current.observe(section);
			}
		});

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [sectionIds, enabled]);

	return {
		activeSectionId,
		navigateToSection,
	};
};
