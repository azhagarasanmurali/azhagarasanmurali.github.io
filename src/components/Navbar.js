import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/artworks">Artworks</Link></li>
      <li><Link to="/3d-models">3D Models</Link></li>
      <li><Link to="/games">Games</Link></li>
      <li><Link to="/works">Works</Link></li>
      <li><Link to="/bio">Bio</Link></li>
      <li><Link to="/contact">Contact</Link></li>
    </ul>
  </nav>
);

export default Navbar;
