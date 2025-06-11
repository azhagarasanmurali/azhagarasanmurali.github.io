import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/" className='theme-button'>Home</Link></li>
      <li><Link to="/artworks" className='theme-button'>Artworks</Link></li>
      <li><Link to="/3d-models" className='theme-button'>3D Models</Link></li>
      <li><Link to="/games" className='theme-button'>Games</Link></li>
      <li><Link to="/works" className='theme-button'>Works</Link></li>
      <li><Link to="/bio" className='theme-button'>Bio</Link></li>
      <li><Link to="/contact" className='theme-button'>Contact</Link></li>
    </ul>
  </nav>
);

export default Navbar;
