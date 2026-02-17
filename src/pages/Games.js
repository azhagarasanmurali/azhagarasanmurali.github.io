import React from "react";
import Card from "../components/Card";
import Basketball from "../assets/images/basketball.png";

const cards = [
	{
		title: "Quick-Shot: Basketball",
		image: Basketball,
		link: "https://play.google.com/store/apps/details?id=com.mrgreenstudio.quickshot.basketball",
	},
];

const Games = () => (
	<div>
		<h1>Games</h1>
		<h3>List of developed games.</h3>
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

export default Games;
