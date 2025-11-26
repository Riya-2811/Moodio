import React, { useState } from 'react';

/**
 * Floating Camera Button Component
 * Floating action button in bottom-right corner for manual mood detection
 */
const FloatingCameraButton = ({ onClick, tooltip = 'Detect Mood with Webcam 🎥' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-accent-blue dark:to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 active:scale-95 group"
      aria-label={tooltip}
      title={tooltip}
    >
      {/* Camera Icon */}
      <div className="text-3xl">📸</div>

      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm rounded-softer whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {tooltip}
        {/* Tooltip Arrow */}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 dark:border-t-gray-700"></div>
      </div>

      {/* Pulse Animation Ring - only show on desktop */}
      <div className="absolute inset-0 rounded-full bg-blue-500 dark:bg-accent-blue opacity-30 animate-ping hidden sm:block"></div>
    </button>
  );
};

export default FloatingCameraButton;

