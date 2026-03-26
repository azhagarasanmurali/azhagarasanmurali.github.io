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
		const computeActiveSection = () => {
			const currentMain = mainRef.current;
			if (!currentMain) return;

			const viewportCenter = currentMain.scrollTop + currentMain.clientHeight / 2;
			let nextActive = sectionIds[0] ?? "";
			let smallestDistance = Number.POSITIVE_INFINITY;

			sectionIds.forEach((id) => {
				const section = document.getElementById(id);
				if (!section) return;

				const sectionCenter = section.offsetTop + section.offsetHeight / 2;
				const distance = Math.abs(sectionCenter - viewportCenter);
				if (distance < smallestDistance) {
					smallestDistance = distance;
					nextActive = id;
				}
			});

			setActiveSectionId(nextActive);
		};

		let rafId: number | null = null;
		const handleMainScroll = () => {
			if (rafId !== null) return;
			rafId = window.requestAnimationFrame(() => {
				rafId = null;
				computeActiveSection();
			});
		};

		main.addEventListener("scroll", handleMainScroll, { passive: true });
		computeActiveSection();

		return () => {
			main.removeEventListener("scroll", handleMainScroll);
			if (rafId !== null) {
				window.cancelAnimationFrame(rafId);
			}
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
