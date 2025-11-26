import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

/**
 * Navbar Component
 * Displays the main navigation bar with theme toggle and navigation links
 */
const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-surface shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center h-full py-1">
            <Logo size="small" showText={true} linkTo="/" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/mood"
              className={({ isActive }) =>
                `px-3 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
            >
              Mood
            </NavLink>
            <NavLink
              to="/music"
              className={({ isActive }) =>
                `px-3 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
            >
              Music
            </NavLink>
            <NavLink
              to="/journal"
              className={({ isActive }) =>
                `px-3 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
            >
              Journal
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `px-3 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
            >
              Chat
            </NavLink>
            <NavLink
              to="/therapist"
              className={({ isActive }) =>
                `px-3 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
            >
              Therapist
            </NavLink>
            
            {/* User Menu or Login Link */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-soft bg-sky-blue dark:bg-dark-surface text-gray-800 dark:text-gray-200 hover:bg-calm-purple dark:hover:bg-dark-bg transition-all duration-300"
                >
                  <span className="text-sm font-semibold">Hi, {user.name} 👋</span>
                  <span className="text-xs">▼</span>
                </button>
                
                {/* User Dropdown Menu - Enhanced with Pop-Out Effect */}
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-3 w-56 bg-gradient-to-br from-white via-sky-blue/90 to-calm-purple/70 dark:from-dark-surface-elevated dark:via-dark-surface-elevated dark:to-dark-surface rounded-softer py-3 z-50 overflow-hidden shadow-xl animate-fade-in"
                  >
                    
                    {/* User Info Section with Gradient */}
                    <div className="relative px-5 py-4 bg-gradient-to-r from-calm-purple/25 via-warm-pink/25 to-soft-green/25 dark:from-accent-blue/25 dark:via-purple-600/25 dark:to-green-500/25 border-b-2 border-calm-purple/40 dark:border-accent-blue/50 rounded-t-softer">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 flex items-center justify-center text-white font-bold text-lg"
                          style={{
                            boxShadow: `
                              0 4px 15px rgba(179, 155, 200, 0.5),
                              0 0 20px rgba(179, 155, 200, 0.3),
                              inset 0 1px 0 rgba(255, 255, 255, 0.2)
                            `
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="relative py-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="relative flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-calm-purple/30 hover:to-warm-pink/30 dark:hover:from-accent-blue/30 dark:hover:to-purple-600/30 transition-all duration-200 group rounded-soft mx-2 hover:shadow-lg hover:shadow-calm-purple/30 dark:hover:shadow-accent-blue/30"
                        style={{
                          boxShadow: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(179, 155, 200, 0.3), 0 0 15px rgba(179, 155, 200, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">👤</span>
                        <span className="group-hover:text-calm-purple dark:group-hover:text-accent-blue transition-colors font-semibold">Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="relative flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-warm-pink/30 hover:to-red-400/30 dark:hover:from-red-600/30 dark:hover:to-red-700/30 transition-all duration-200 group rounded-soft mx-2 hover:shadow-lg hover:shadow-red-400/30 dark:hover:shadow-red-600/30"
                        style={{
                          boxShadow: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(248, 187, 208, 0.3), 0 0 15px rgba(248, 187, 208, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">🚪</span>
                        <span className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors font-semibold">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-soft bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300"
              >
                Login
              </Link>
            )}
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-soft bg-sky-blue dark:bg-dark-surface text-gray-800 dark:text-gray-200 hover:bg-calm-purple dark:hover:bg-dark-bg transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
              onClick={toggleMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/mood"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
              onClick={toggleMenu}
            >
              Mood
            </NavLink>
            <NavLink
              to="/music"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
              onClick={toggleMenu}
            >
              Music
            </NavLink>
            <NavLink
              to="/journal"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
              onClick={toggleMenu}
            >
              Journal
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
              onClick={toggleMenu}
            >
              Chat
            </NavLink>
            <NavLink
              to="/therapist"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-soft transition-all duration-300 ${
                  isActive
                    ? 'bg-calm-purple dark:bg-accent-blue text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue hover:bg-calm-purple/10 dark:hover:bg-accent-blue/10'
                }`
              }
              onClick={toggleMenu}
            >
              Therapist
            </NavLink>
            {user ? (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  Hi, {user.name} 👋
                </p>
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className="block w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue transition-colors mb-1"
                >
                  👤 Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue transition-colors px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-2"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
            <button
              onClick={() => {
                toggleDarkMode();
                toggleMenu();
              }}
              className="w-full text-left px-4 py-2 rounded-soft bg-sky-blue dark:bg-dark-surface text-gray-800 dark:text-gray-200 hover:bg-calm-purple dark:hover:bg-dark-bg transition-all duration-300"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

