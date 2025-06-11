import React from "react";
import Card from "../components/Card";
import UnicodeToTamil from "../assets/images/unicode-to-tamil.png";

const cards = [
	{
		title: "Unicode To Tamil",
		image: UnicodeToTamil,
		link: "https://play.google.com/store/apps/details?id=com.mrgreenstudio.unicodetotamil",
	},
];

const Apps = () => (
	<div>
		<h1>Apps</h1>
		<h3>Professional works and projects.</h3>
		<div className="card-grid">
			{cards.map((card, i) => (
				<Card
					key={i}
					title={card.title}
					image={card.image}
					link={card.link}
				/>
			))}
		</div>
	</div>
);

export default Apps;
