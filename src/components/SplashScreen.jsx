import React, { useState, useEffect } from 'react';
import Logo from './Logo';

/**
 * Splash Screen Component
 * Displays a beautiful splash screen with logo, name, and tagline
 * Automatically transitions to the next screen after a few seconds
 */
const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Complete after fade out animation (total 3 seconds)
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-blue via-calm-purple to-soft-green dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className={`mb-10 md:mb-12 transition-all duration-700 ${fadeOut ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="relative">
          <Logo size="xl" showText={false} linkTo={null} className="relative z-10" />
          {/* Extra spacing below logo to account for body/base extension */}
          <div className="h-4 md:h-6"></div>
        </div>
      </div>

      {/* App Name */}
      <h1
        className={`text-6xl md:text-7xl font-bold mb-4 text-gray-800 dark:text-gray-100 transition-all duration-700 delay-100 mt-2 ${
          fadeOut ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        Moodio
      </h1>

      {/* Tagline */}
      <p
        className={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium text-center px-4 max-w-2xl transition-all duration-700 delay-200 ${
          fadeOut ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        Your Mood's Best Friend In your Pocket
      </p>

      {/* Subtle animated dots */}
      <div className={`mt-8 flex gap-2 transition-opacity duration-700 delay-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-2 h-2 bg-calm-purple dark:bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-warm-pink dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-soft-green dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default SplashScreen;

