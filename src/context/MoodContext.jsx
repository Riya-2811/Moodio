import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Mood Context
 * Manages user's mood state and history
 */
const MoodContext = createContext(null);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

/**
 * Mood Provider Component
 * Wraps the app and provides mood state and methods
 */
export const MoodProvider = ({ children }) => {
  const [lastMood, setLastMood] = useState(null);
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  // Load last mood from localStorage on mount
  useEffect(() => {
    const storedMood = localStorage.getItem('moodio_lastMood');
    if (storedMood) {
      try {
        setLastMood(JSON.parse(storedMood));
      } catch (err) {
        console.error('Error parsing stored mood:', err);
        localStorage.removeItem('moodio_lastMood');
      }
    }

    const storedHistory = localStorage.getItem('moodio_moodHistory');
    if (storedHistory) {
      try {
        setMoodHistory(JSON.parse(storedHistory));
      } catch (err) {
        console.error('Error parsing mood history:', err);
        localStorage.removeItem('moodio_moodHistory');
      }
    }
  }, []);

  /**
   * Save detected mood
   */
  const saveMood = (moodData) => {
    const moodEntry = {
      ...moodData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    // Update last mood
    setLastMood(moodEntry);
    localStorage.setItem('moodio_lastMood', JSON.stringify(moodEntry));

    // Add to history
    const updatedHistory = [moodEntry, ...moodHistory].slice(0, 50); // Keep last 50
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodio_moodHistory', JSON.stringify(updatedHistory));

    // Set current mood
    setCurrentMood(moodEntry);
  };

  /**
   * Clear current mood (e.g., after starting new detection)
   */
  const clearCurrentMood = () => {
    setCurrentMood(null);
  };

  const value = {
    lastMood,
    currentMood,
    moodHistory,
    saveMood,
    clearCurrentMood,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export default MoodContext;

