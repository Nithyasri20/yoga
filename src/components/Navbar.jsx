import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          YogaFlow
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={toggleMenu}>
              About Us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user-login" className="nav-links" onClick={toggleMenu}>
              User Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/trainer-login" className="nav-links" onClick={toggleMenu}>
              Trainer Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin-login" className="nav-links" onClick={toggleMenu}>
              Admin Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;