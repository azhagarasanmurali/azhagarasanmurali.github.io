import React, { useEffect, useRef, useState } from "react";

interface AnimatedItemProps {
	children: React.ReactNode;
	delay?: number;
	className?: string;
	from?: "bottom" | "left" | "right" | "scale";
}

export const AnimatedItem: React.FC<AnimatedItemProps> = ({
	children,
	delay = 0,
	className = "",
	from = "bottom",
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{ threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
		);

		const el = ref.current;
		if (el) observer.observe(el);

		return () => observer.disconnect();
	}, []);

	const hiddenTransform =
		from === "left"
			? "-translate-x-10"
			: from === "right"
				? "translate-x-10"
				: from === "scale"
					? "scale-[0.94]"
					: "translate-y-10";
	const visibleState =
		"opacity-100 translate-x-0 translate-y-0 scale-100 blur-0";
	const hiddenState =
		from === "scale"
			? `opacity-0 ${hiddenTransform} blur-[10px]`
			: `opacity-0 ${hiddenTransform} scale-[0.98] blur-[10px]`;

	return (
		<div
			ref={ref}
			className={`transform-gpu transition-all ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform,filter] ${
				isVisible ? visibleState : hiddenState
			} ${className}`}
			style={{
				transitionDuration: isVisible ? "760ms" : "520ms",
				transitionDelay: isVisible ? `${delay}ms` : "0ms",
			}}
		>
			{children}
		</div>
	);
};
