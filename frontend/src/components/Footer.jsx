import React from 'react';
import { Github, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Brand Section */}
          <div className="flex items-center space-x-2">
            <Youtube size={20} className="text-red-500" />
            <h2 className="text-lg font-bold">MiniTube</h2>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/dvansari65"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 p-1.5 rounded-full hover:bg-blue-800 transition-colors"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.instagram.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 p-1.5 rounded-full hover:bg-blue-800 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 p-1.5 rounded-full hover:bg-blue-800 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-blue-100">
            &copy; {new Date().getFullYear()} MiniTube. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
