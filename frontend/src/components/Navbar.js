import React from 'react';
import { Link } from 'react-router-dom';
import '../design/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">JobLess</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/applications">Applications</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/statistics">Statistics</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;