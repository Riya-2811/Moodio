import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Negative Mood Support Modal
 * Shown when user detects sad, angry, stressed, or anxious mood
 */
const NegativeMoodSupportModal = ({ mood, onClose, onStartBreathing, onPlayMusic, sideBySide = false }) => {
  const navigate = useNavigate();

  const isNegativeMood = ['sad', 'angry', 'stressed', 'anxious', 'tired', 'lonely', 'overwhelmed'].includes(mood?.toLowerCase());

  if (!isNegativeMood) return null;

  const handleStartBreathing = () => {
    if (onClose) onClose();
    if (onStartBreathing) {
      onStartBreathing();
    }
    setTimeout(() => {
      navigate('/exercises');
    }, 150);
  };

  const handlePlayMusic = () => {
    // Navigate directly to music page first
    navigate('/music');
    // Then close the modal after a brief delay
    setTimeout(() => {
      if (onClose) onClose();
    }, 100);
  };

  const handleReadThought = () => {
    navigate('/');
    setTimeout(() => {
      if (onClose) onClose();
    }, 100);
  };

  const handleClose = () => {
    // Navigate to music page when user dismisses the modal
    navigate('/music');
    setTimeout(() => {
      if (onClose) onClose();
    }, 100);
  };

  return (
    <div className={`fixed inset-0 ${sideBySide ? 'bg-transparent z-40' : 'bg-black bg-opacity-50 z-50'} flex items-center ${sideBySide ? 'justify-end' : 'justify-center'} p-2 sm:p-4 pointer-events-none overflow-y-auto`}>
      <div className={`bg-white dark:bg-dark-surface rounded-softer shadow-xl ${sideBySide ? 'max-w-xl w-full' : 'max-w-2xl w-full'} max-h-[90vh] sm:max-h-[85vh] overflow-y-auto my-auto pointer-events-auto relative`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface-elevated transition-all duration-300 shadow-lg hover:shadow-xl"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">💛</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
              Hey, it looks like you're not feeling your best 💛
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
              Take a moment for yourself — here are calming exercises and music that can help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={handleStartBreathing}
              className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-4 sm:p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🫁</div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Start a 2-min Breathing Exercise</h3>
              <p className="text-xs sm:text-sm opacity-90">Quick breathing exercise to help you calm down</p>
            </button>

            <button
              onClick={handlePlayMusic}
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 sm:p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎵</div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Play Calming Music</h3>
              <p className="text-xs sm:text-sm opacity-90">Soothing tracks designed to help you relax</p>
            </button>

            <button
              onClick={handleReadThought}
              className="bg-gradient-to-br from-pink-500 to-orange-500 text-white p-4 sm:p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">💭</div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Read Encouraging Thought of the Day</h3>
              <p className="text-xs sm:text-sm opacity-90">A daily quote to inspire and comfort you</p>
            </button>
          </div>

          <div className="text-center flex flex-col sm:flex-row gap-2 sm:gap-0 justify-center items-center">
            <button
              onClick={() => navigate('/exercises')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-softer bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300 sm:mr-4 text-sm sm:text-base"
            >
              Go to Exercises Page
            </button>
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-softer bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-300 text-sm sm:text-base"
            >
              I'm okay, thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegativeMoodSupportModal;

