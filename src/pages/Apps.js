import React from "react";
import Card from "../components/Card";
import UnicodeToTamil from "../assets/images/unicode-to-tamil.png";

const Apps = () => (
	<div>
		<h1>Apps</h1>
		<p>Professional works and projects.</p>
		<Card>
			<h2>Unicode To Tamil</h2>
			<img
				src={UnicodeToTamil}
				alt="unicode-to-tamil.png"
				style={{ width: "100%" }}
			/>
			<a
				href="https://play.google.com/store/apps/details?id=com.mrgreenstudio.unicodetotamil"
				style={{ justifycontent: "center" }}
				target="_blank"
				rel="noopener noreferrer"
			>
				Get from Play Store
			</a>
		</Card>
	</div>
);

export default Apps;
