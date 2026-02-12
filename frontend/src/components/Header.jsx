import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [volunteerName, setVolunteerName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch the volunteer's name (assuming an API endpoint is available)
      const fetchVolunteerName = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/volunteer/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const data = await response.json();
          setVolunteerName(data.name || 'Volunteer'); // Default name if no name is available
        } catch (error) {
          console.error('Failed to fetch volunteer name:', error);
        }
      };

      fetchVolunteerName();
    }
  }, [isLoggedIn]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">
          <Link to="/">ReliefLink</Link>
        </h1>

        {/* Welcome Message */}
        {isLoggedIn && (
          <div className="hidden md:block text-gray-700 font-semibold text-lg">
            Welcome, {volunteerName}!
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-300">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition duration-300">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition duration-300">
            Contact
          </Link>
          {isLoggedIn && location.pathname !== '/volunteer' && (
            <Link
              to="/volunteer"
              className="text-white bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Dashboard
            </Link>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 px-5 py-2 rounded-full hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 border border-blue-600 px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-green-600 px-5 py-2 rounded-full hover:bg-green-700 transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-700 focus:outline-none" onClick={toggleMobileMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center py-4 space-y-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-300" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition duration-300"
              onClick={toggleMobileMenu}
            >
              Contact
            </Link>
            {isLoggedIn && location.pathname !== '/dashboard' && (
              <Link
                to="/dashboard"
                className="text-white bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                onClick={toggleMobileMenu}
              >
                Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="text-white bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-600 border border-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-green-600 px-6 py-2 rounded-full hover:bg-green-700 transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
