import React, { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LogoutModal from './LogoutModal';

import SearchBar from '../pages/SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0  left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white tracking-tight hover:text-blue-100 transition-colors">
              youTube
            </h1>
          </div>
          <SearchBar />
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive
                    ? "text-white border-b-2 border-white"
                    : "text-blue-100 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive
                    ? "text-white border-b-2 border-white"
                    : "text-blue-100 hover:text-white"
                }`
              }
            >
              Register
            </NavLink>
            
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-lg font-medium text-blue-100 hover:text-white transition-colors"
            >
              Logout
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-blue-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-white bg-blue-700"
                      : "text-blue-100 hover:text-white hover:bg-blue-600"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-white bg-blue-700"
                      : "text-blue-100 hover:text-white hover:bg-blue-600"
                  }`
                }
              >
                Register
              </NavLink>
              <NavLink
                to="/subscribers"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-white bg-blue-700"
                      : "text-blue-100 hover:text-white hover:bg-blue-600"
                  }`
                }
              >
                Subscribers
              </NavLink>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
