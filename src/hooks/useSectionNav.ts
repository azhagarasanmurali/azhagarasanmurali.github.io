import { useCallback, useEffect, useRef, useState } from "react";

export const useSectionNav = (
	sectionIds: readonly string[],
	enabled = true,
) => {
	const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? "");
	const mainRef = useRef<HTMLElement | null>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const wheelDeltaAccumulatorRef = useRef(0);
	const wheelResetTimerRef = useRef<number | null>(null);
	const snapUnlockTimerRef = useRef<number | null>(null);
	const isSnapLockedRef = useRef(false);

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

			const navHeight =
				document.querySelector("nav")?.getBoundingClientRect().height ?? 64;
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

		const wheelSnapThreshold = 65;
		const snapLockDurationMs = 520;
		const sectionEdgeThreshold = 48;

		mainRef.current = main as HTMLElement;
		const getNavHeight = () =>
			document.querySelector("nav")?.getBoundingClientRect().height ?? 64;

		const getSectionTop = (id: string) => {
			const section = document.getElementById(id);
			if (!section) return null;
			return section.offsetTop - getNavHeight();
		};

		const getSectionBounds = (id: string) => {
			const top = getSectionTop(id);
			const section = document.getElementById(id);
			if (top === null || !section) return null;
			return {
				top,
				bottom: top + section.offsetHeight,
			};
		};

		const getCurrentSectionIndex = () => {
			const viewportTop = main.scrollTop;
			let currentIndex = 0;

			sectionIds.forEach((id, index) => {
				const top = getSectionTop(id);
				if (top === null) return;
				if (viewportTop + 8 >= top) {
					currentIndex = index;
				}
			});

			return currentIndex;
		};

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

		const snapToAdjacentSection = (direction: 1 | -1) => {
			if (!sectionIds.length) return;

			const nearestIndex = getCurrentSectionIndex();

			const targetIndex = Math.max(
				0,
				Math.min(sectionIds.length - 1, nearestIndex + direction),
			);
			if (targetIndex === nearestIndex) return;

			const targetTop = getSectionTop(sectionIds[targetIndex]);
			if (targetTop === null) return;

			isSnapLockedRef.current = true;
			if (snapUnlockTimerRef.current !== null) {
				window.clearTimeout(snapUnlockTimerRef.current);
			}
			snapUnlockTimerRef.current = window.setTimeout(() => {
				isSnapLockedRef.current = false;
				snapUnlockTimerRef.current = null;
			}, snapLockDurationMs);

			main.scrollTo({ top: targetTop, behavior: "smooth" });
			setActiveSectionId(sectionIds[targetIndex]);
		};

		const handleGlobalWheel = (event: WheelEvent) => {
			if (event.defaultPrevented || event.ctrlKey) return;

			const target = event.target as HTMLElement | null;
			if (!target) return;
			const isEditableTarget =
				target.closest("input, textarea, select, [contenteditable='true']") !==
				null;
			if (isEditableTarget) return;

			event.preventDefault();

			if (isSnapLockedRef.current) return;

			const currentSectionIndex = getCurrentSectionIndex();
			const currentSectionId = sectionIds[currentSectionIndex];
			const currentSectionBounds = currentSectionId
				? getSectionBounds(currentSectionId)
				: null;
			const viewportTop = main.scrollTop;
			const viewportBottom = viewportTop + main.clientHeight;
			const isScrollingDown = event.deltaY > 0;

			if (currentSectionBounds) {
				const remainingBelow = currentSectionBounds.bottom - viewportBottom;
				const remainingAbove = viewportTop - currentSectionBounds.top;

				if (isScrollingDown && remainingBelow > sectionEdgeThreshold) {
					main.scrollBy({ top: event.deltaY, behavior: "auto" });
					return;
				}

				if (!isScrollingDown && remainingAbove > sectionEdgeThreshold) {
					main.scrollBy({ top: event.deltaY, behavior: "auto" });
					return;
				}
			}

			wheelDeltaAccumulatorRef.current += event.deltaY;
			if (wheelResetTimerRef.current !== null) {
				window.clearTimeout(wheelResetTimerRef.current);
			}
			wheelResetTimerRef.current = window.setTimeout(() => {
				wheelDeltaAccumulatorRef.current = 0;
				wheelResetTimerRef.current = null;
			}, 140);

			if (Math.abs(wheelDeltaAccumulatorRef.current) < wheelSnapThreshold) {
				return;
			}

			const direction: 1 | -1 =
				wheelDeltaAccumulatorRef.current > 0 ? 1 : -1;
			wheelDeltaAccumulatorRef.current = 0;
			snapToAdjacentSection(direction);
		};

		main.addEventListener("scroll", handleMainScroll, { passive: true });
		window.addEventListener("wheel", handleGlobalWheel, { passive: false });
		computeActiveSection();

		return () => {
			main.removeEventListener("scroll", handleMainScroll);
			window.removeEventListener("wheel", handleGlobalWheel);
			if (wheelResetTimerRef.current !== null) {
				window.clearTimeout(wheelResetTimerRef.current);
				wheelResetTimerRef.current = null;
			}
			if (snapUnlockTimerRef.current !== null) {
				window.clearTimeout(snapUnlockTimerRef.current);
				snapUnlockTimerRef.current = null;
			}
			isSnapLockedRef.current = false;
			wheelDeltaAccumulatorRef.current = 0;
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
