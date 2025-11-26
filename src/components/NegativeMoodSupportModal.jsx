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
    <div className={`fixed inset-0 ${sideBySide ? 'bg-transparent z-40' : 'bg-black bg-opacity-50 z-50'} flex items-center ${sideBySide ? 'justify-end' : 'justify-center'} p-4 pointer-events-none`}>
      <div className={`bg-white dark:bg-dark-surface rounded-softer shadow-xl ${sideBySide ? 'max-w-xl w-full' : 'max-w-2xl w-full'} p-8 pointer-events-auto`}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">💛</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Hey, it looks like you're not feeling your best 💛
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Take a moment for yourself — here are calming exercises and music that can help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleStartBreathing}
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🫁</div>
            <h3 className="font-semibold mb-2">Start a 2-min Breathing Exercise</h3>
            <p className="text-sm opacity-90">Quick breathing exercise to help you calm down</p>
          </button>

          <button
            onClick={handlePlayMusic}
            className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🎵</div>
            <h3 className="font-semibold mb-2">Play Calming Music</h3>
            <p className="text-sm opacity-90">Soothing tracks designed to help you relax</p>
          </button>

          <button
            onClick={handleReadThought}
            className="bg-gradient-to-br from-pink-500 to-orange-500 text-white p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">💭</div>
            <h3 className="font-semibold mb-2">Read Encouraging Thought of the Day</h3>
            <p className="text-sm opacity-90">A daily quote to inspire and comfort you</p>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/exercises')}
            className="px-6 py-3 rounded-softer bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300 mr-4"
          >
            Go to Exercises Page
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-3 rounded-softer bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-300"
          >
            I'm okay, thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default NegativeMoodSupportModal;

