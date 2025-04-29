import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png'; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/bulk-upload', label: 'Add Clubs' },
    // { path: '/about', label: 'About' },
    // { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-indigo-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={Logo}
                alt="ClubHub Logo"
                className="h-10 w-auto"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
              />
              <span className="text-xl font-bold hidden sm:block">ClubHub</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-700 text-white'
                      : 'text-white hover:bg-indigo-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none p-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-800 animate-slide-in">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-700 text-white'
                      : 'text-white hover:bg-indigo-700'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}