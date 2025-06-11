import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Artworks from "./pages/Artworks";
import Models3D from "./pages/Models3D";
import Games from "./pages/Games";
import Apps from "./pages/Apps";
import Bio from "./pages/Bio";
import Contact from "./pages/Contact";

const App = () => (
	<Router>
		<div className="app-wrapper">
			<nav className="theme-nav">
				<Navbar />
			</nav>

			<main className="theme-container">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/artworks" element={<Artworks />} />
					<Route path="/3d-models" element={<Models3D />} />
					<Route path="/games" element={<Games />} />
					<Route path="/apps" element={<Apps />} />
					<Route path="/bio" element={<Bio />} />
					<Route path="/contact" element={<Contact />} />
				</Routes>
			</main>

			<footer className="theme-footer">
				<Footer />
			</footer>
		</div>
	</Router>
);

export default App;
