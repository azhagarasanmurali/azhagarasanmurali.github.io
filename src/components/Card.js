import React, { useRef } from "react";
import "../styles/card.css";

const Card = ({ title, image, link, children }) => {
	const cardRef = useRef();
	const animationRef = useRef(null);

	const handleMouseMove = (e) => {
		if (animationRef.current) return;

		const card = cardRef.current;
		const rect = card.getBoundingClientRect();

		// Ensure cursor is within bounds
		if (
			e.clientX < rect.left ||
			e.clientX > rect.right ||
			e.clientY < rect.top ||
			e.clientY > rect.bottom
		) {
			resetTransform();
			return;
		}

		animationRef.current = requestAnimationFrame(() => {
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const centerX = rect.width / 2;
			const centerY = rect.height / 2;

			const rotateX = ((y - centerY) / centerY) * -10;
			const rotateY = ((x - centerX) / centerX) * 10;

			card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
			animationRef.current = null;
		});
	};

	const resetTransform = () => {
		cancelAnimationFrame(animationRef.current);
		animationRef.current = null;
		cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
	};

	return (
		<a
			className="card-wrapper"
			onMouseMove={handleMouseMove}
			onMouseLeave={resetTransform}
			href={link}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div className="card" ref={cardRef}>
				<h2>{title}</h2>
				<img src={image} alt={title} style={{ width: "100%" }} />
				{children}
			</div>
		</a>
	);
};

export default Card;
