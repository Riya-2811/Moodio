import React, { useState, useEffect } from 'react';
import RealTimeMoodDetector from './RealTimeMoodDetector';
import SmartSuggestions from './SmartSuggestions';
import { useToast } from '../utils/Toast';

/**
 * Webcam Modal Component
 * Auto-shows on homepage to request webcam permission for mood detection
 */
const WebcamModal = ({ onClose, forceShow = false, onMoodDetected }) => {
  const [showModal, setShowModal] = useState(forceShow);
  const [startDetection, setStartDetection] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [initializationError, setInitializationError] = useState(null);
  const { showToast, ToastContainer } = useToast();

  // Auto-show modal on mount (first visit) - appears 1 second after landing
  useEffect(() => {
    if (forceShow) {
      setShowModal(true);
      return;
    }

    const popupShown = localStorage.getItem('moodioPopupShown');
    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1000); // Show 1 second after landing
      
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  /**
   * Handle starting detection
   */
  const handleStartDetection = () => {
    setStartDetection(true);
    setInitializationError(null);
  };

  /**
   * Handle closing the modal
   */
  const handleClose = () => {
    setShowModal(false);
    setStartDetection(false);
    setDetectedMood(null);
    setInitializationError(null);
    // Mark popup as shown so it doesn't auto-appear again (only if it was auto-shown)
    if (!forceShow) {
      localStorage.setItem('moodioPopupShown', 'true');
    }
    if (onClose) {
      onClose();
    }
  };

  // Don't render if modal shouldn't show
  if (!showModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={!startDetection ? handleClose : undefined}
      >
        {/* Modal Content - Centered */}
        <div
          className="bg-white dark:bg-dark-surface rounded-softer shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          {!startDetection && (
            <div className="sticky top-0 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-softer">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Real-Time Mood Detection 📸
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6">
            {!startDetection ? (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Would you like to detect your mood in real-time?
                  <br />
                  <span className="text-sm text-gray-500">
                    We'll analyze your expression for 3 seconds using your webcam.
                  </span>
                </p>

                {/* Info Section */}
                <div className="mb-6 p-4 bg-sky-blue dark:bg-dark-bg rounded-soft text-left max-w-lg mx-auto">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    How it works:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Allow camera access when prompted</li>
                    <li>AI analyzes your expression for 3 seconds</li>
                    <li>Your dominant mood is determined automatically</li>
                    <li>Result is saved to your mood history</li>
                    <li>We'll suggest music or exercises based on your mood</li>
                  </ul>
                </div>

                {/* Action Buttons - Centered */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleStartDetection}
                    className="px-6 py-4 rounded-softer bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    🎥 Start Detection
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 py-4 rounded-softer bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {initializationError ? (
                  <div className="p-6 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                      Unable to Start Camera
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {initializationError}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => {
                          setInitializationError(null);
                          setStartDetection(false);
                        }}
                        className="px-6 py-3 rounded-softer bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-300"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-softer bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300"
                      >
                        Refresh Page
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center">
                    <RealTimeMoodDetector
                      isModal={true}
                      onClose={handleClose}
                      onMoodDetected={(mood) => {
                        setDetectedMood(mood);
                        showToast(`Your mood has been detected as ${mood.mood} 😊`, 'success', 3000);
                        // Call parent callback if provided
                        if (onMoodDetected) {
                          onMoodDetected(mood);
                        }
                      }}
                      onError={(error) => {
                        console.error('Mood detection initialization error:', error);
                        setInitializationError('Unable to start camera. Please refresh the page and try again.');
                      }}
                    />
                    {detectedMood && (
                      <SmartSuggestions
                        detectedMood={detectedMood}
                        onClose={() => setDetectedMood(null)}
                      />
                    )}
                    <ToastContainer />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WebcamModal;
