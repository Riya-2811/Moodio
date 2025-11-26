import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

/**
 * Footer Component
 * Displays footer information with links and copyright
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Quick Links - First Section */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-calm-purple dark:hover:text-accent-blue transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-calm-purple dark:bg-accent-blue opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-600 dark:text-gray-400 hover:text-calm-purple dark:hover:text-accent-blue transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-calm-purple dark:bg-accent-blue opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></span>
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-600 dark:text-gray-400 hover:text-calm-purple dark:hover:text-accent-blue transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-calm-purple dark:bg-accent-blue opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></span>
                  About
                </a>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-600 dark:text-gray-400 hover:text-calm-purple dark:hover:text-accent-blue transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-calm-purple dark:bg-accent-blue opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section - Center Section */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100 uppercase tracking-wide">
              Get in Touch
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <Link
              to="/contact"
              className="inline-block px-4 py-2 rounded-soft bg-sky-blue dark:bg-dark-bg text-gray-800 dark:text-gray-200 hover:bg-calm-purple dark:hover:bg-accent-blue transition-all duration-300 text-sm font-medium"
            >
              Contact Us
            </Link>
          </div>

          {/* Social Media Section - Last Section */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100 uppercase tracking-wide">
              Follow Us
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
              Connect with us on social media for updates, tips, and community support.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61583965275978"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1877F2] dark:bg-[#1877F2] hover:bg-[#0d5fcc] dark:hover:bg-[#0d5fcc] flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="https://www.instagram.com/moodio_25/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 dark:from-purple-600 dark:via-pink-600 dark:to-orange-500 hover:opacity-90 flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Moodio. Built with ❤️ for mental wellness.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

