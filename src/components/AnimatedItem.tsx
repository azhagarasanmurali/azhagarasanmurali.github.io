import React, { useEffect, useRef, useState } from "react";

interface AnimatedItemProps {
	children: React.ReactNode;
	delay?: number;
	className?: string;
	from?: "bottom" | "left" | "right";
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
			{ threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
		);

		const el = ref.current;
		if (el) observer.observe(el);

		return () => observer.disconnect();
	}, []);

	const hiddenTransform =
		from === "left"
			? "-translate-x-8"
			: from === "right"
				? "translate-x-8"
				: "translate-y-8";

	return (
		<div
			ref={ref}
			className={`transform transition-all ease-out ${
				isVisible
					? "opacity-100 translate-x-0 translate-y-0"
					: `opacity-0 ${hiddenTransform}`
			} ${className}`}
			style={{
				transitionDuration: "600ms",
				transitionDelay: `${delay}ms`,
			}}
		>
			{children}
		</div>
	);
};
