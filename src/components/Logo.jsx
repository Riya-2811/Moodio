import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Moodio Logo Component
 * Displays a pink smiley face with blue and green hearts
 * Based on the description: pink circular face with dark eyes/smile, blue heart top-left, green heart right
 */
const Logo = ({ 
  size = 'medium', 
  showText = true, 
  linkTo = '/',
  className = '' 
}) => {
      const sizeClasses = {
        small: 'w-8 h-8', // Adjusted to fit navbar height (h-16 = 64px, logo should be ~32-36px)
        medium: 'w-16 h-16',
        large: 'w-24 h-24',
        xl: 'w-40 h-40',
      };

      const textSizeClasses = {
        small: 'text-base', // Adjusted to fit better in navbar
        medium: 'text-xl',
        large: 'text-2xl',
        xl: 'text-5xl',
      };

      const heartSizeClasses = {
        small: 'w-3 h-3', // Adjusted proportionally
        medium: 'w-6 h-6',
        large: 'w-8 h-8',
        xl: 'w-12 h-12',
      };

  const logoContent = (
    <div className={`relative inline-flex items-center gap-2 ${className} flex-shrink-0`}>
      {/* Logo Container */}
      <div className={`relative flex-shrink-0 ${sizeClasses[size] || sizeClasses.medium}`}>
        {/* Blue Heart (Top Left) */}
        <div 
          className={`absolute -top-2 -left-2 ${heartSizeClasses[size] || heartSizeClasses.medium} text-sky-400 dark:text-blue-400`}
          style={{ zIndex: 10 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
          </svg>
        </div>
        
        {/* Main Pink Face Circle */}
        <div className="w-full h-full bg-pink-200 dark:bg-pink-300 rounded-full flex items-center justify-center relative overflow-visible shadow-md border-2 border-pink-300 dark:border-pink-400">
          {/* Eyes */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <div className="w-2 h-2 bg-gray-800 dark:bg-gray-900 rounded-full" />
            <div className="w-2 h-2 bg-gray-800 dark:bg-gray-900 rounded-full" />
          </div>
          
          {/* Smile */}
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
            <svg width="20" height="10" viewBox="0 0 20 10" className="w-5 h-2.5">
              <path
                d="M 3 5 Q 5 8, 10 8 Q 15 8, 17 5"
                stroke="rgb(17, 24, 39)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        
        {/* Pink Body/Base (semi-circle below face) */}
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 w-5/6 h-3/4 bg-pink-300 dark:bg-pink-400 rounded-full z-0"></div>
        
        {/* Green Heart (Right Side) */}
        <div 
          className={`absolute top-1/2 -right-2 ${heartSizeClasses[size] || heartSizeClasses.medium} text-green-400 dark:text-green-500`}
          style={{ zIndex: 10 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
          </svg>
        </div>
      </div>
      
      {/* Text */}
      {showText && (
        <span className={`font-bold text-gray-800 dark:text-accent-blue ${textSizeClasses[size] || textSizeClasses.medium}`}>
          Moodio
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;

