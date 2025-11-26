import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getThoughtOfTheDay } from '../utils/NotificationService';

/**
 * Thought of the Day Component
 * Displays a unique inspirational quote that changes on every visit
 * Includes a refresh button to manually get a new thought
 * Respects user's notification preferences
 */
const ThoughtOfTheDay = () => {
  const { preferences } = useAuth();
  // Use a ref to track if we've loaded a thought for this visit
  const hasLoadedForThisVisit = useRef(false);
  const [thought, setThought] = useState(() => {
    // Get initial thought immediately
    hasLoadedForThisVisit.current = true;
    return getThoughtOfTheDay();
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load a new thought on every mount/visit (changes on every page load/refresh)
  useEffect(() => {
    // Only get a new thought if we haven't loaded one for this visit yet
    // This ensures it changes on every component mount (page load/refresh)
    if (!hasLoadedForThisVisit.current) {
      setThought(getThoughtOfTheDay());
      hasLoadedForThisVisit.current = true;
    }
    
    // Reset the flag when component unmounts (when user navigates away)
    return () => {
      hasLoadedForThisVisit.current = false;
    };
  }, []);

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Small delay for animation
    setTimeout(() => {
      const newThought = getThoughtOfTheDay(true); // Force new thought
      setThought(newThought);
      setIsRefreshing(false);
    }, 300);
  };

  // Check if user wants to see thought of the day
  const showThoughtOfTheDay = preferences?.notificationPreferences?.thoughtOfTheDay !== false;

  // If user has disabled thought of the day, don't render
  if (!showThoughtOfTheDay) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-warm-pink/40 via-calm-purple/30 to-warm-pink/40 dark:from-dark-surface dark:via-dark-bg/70 dark:to-dark-surface rounded-softer p-8 shadow-lg border-2 border-warm-pink/20 dark:border-gray-600/50 relative">
      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-gradient-to-br from-white/90 to-white/70 dark:from-dark-surface/90 dark:to-dark-surface/70 hover:from-white dark:hover:from-dark-surface hover:to-white dark:hover:to-dark-surface transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-warm-pink/30 dark:border-gray-600/40 hover:border-calm-purple/50 dark:hover:border-accent-blue/50 group"
        aria-label="Refresh thought"
        title="Get a new thought"
      >
        <span className={`text-lg ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300 text-calm-purple dark:text-accent-blue`}>
          ↻
        </span>
      </button>

      <div className="text-center">
        <div className="text-4xl mb-3">💭</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Thought of the Day
        </h3>
        <div className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
          <p className="text-lg text-gray-700 dark:text-gray-200 italic mb-2">
            "{thought.quote}"
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 opacity-90">
            — {thought.author}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThoughtOfTheDay;

