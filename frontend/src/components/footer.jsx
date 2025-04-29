import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png'; 

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-3">
            <img
              src={Logo} // Replace with your logo path
              alt="ClubHub Logo"
              className="h-8 w-auto"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/32')} // Fallback
            />
            <p className="text-sm">
              © {new Date().getFullYear()} ClubHub. All rights reserved.
            </p>
          </div>
          {/* Footer Links */}
          <div className="flex gap-6">
            <Link
              to="/about"
              className="text-sm hover:text-indigo-300 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm hover:text-indigo-300 transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              to="/privacy"
              className="text-sm hover:text-indigo-300 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}