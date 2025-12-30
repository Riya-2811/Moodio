import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import api from '../utils/api';
import WebcamModal from './WebcamModal';
import SmartSuggestions from './SmartSuggestions';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../utils/Toast';
import { useMood } from '../context/MoodContext';
import { useAuth } from '../context/AuthContext';
import { startConsecutiveNotifications } from '../utils/NotificationService';

/**
 * Mood Tracker Component
 * Allows users to log their daily mood with emoji buttons and view mood history
 */
const MoodTracker = () => {
  const navigate = useNavigate();
  const { saveMood, lastMood } = useMood();
  const { user, preferences } = useAuth();
  // State for selected mood
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [showDetectorModal, setShowDetectorModal] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [manualMood, setManualMood] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { showToast, ToastContainer } = useToast();

  // Available mood options with emojis and labels
  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-soft-green' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-sky-blue' },
    { id: 'angry', emoji: '😠', label: 'Angry', color: 'bg-warm-pink' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'bg-calm-purple' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-soft-green' },
    { id: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-warm-pink' },
    { id: 'anxious', emoji: '😟', label: 'Anxious', color: 'bg-calm-purple' },
    { id: 'grateful', emoji: '🙏', label: 'Grateful', color: 'bg-soft-green' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-light-gray' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-sky-blue' },
    { id: 'lonely', emoji: '😔', label: 'Lonely', color: 'bg-sky-blue' },
    { id: 'overwhelmed', emoji: '😵', label: 'Overwhelmed', color: 'bg-calm-purple' },
  ];

  /**
   * Helper function to get emoji for mood type
   */
  const getMoodEmoji = (moodType) => {
    const mood = moods.find((m) => m.id === moodType);
    return mood ? mood.emoji : '😊';
  };

  /**
   * Helper function to get label for mood type
   */
  const getMoodLabel = (moodType) => {
    const mood = moods.find((m) => m.id === moodType);
    return mood ? mood.label : 'Happy';
  };

  /**
   * Fetch mood history from API (only for current user)
   */
  const fetchMoodHistory = async () => {
    if (!user) {
      setMoodHistory([]);
      return;
    }

    setIsLoading(true);
    try {
      // Get user ID from auth context
      const userId = user.id || user.userId || user.email;
      const response = await api.get(`/moods?userId=${userId}`);
      if (response.data.success) {
        // Transform API data to match component format
        const history = response.data.data.map((entry) => ({
          _id: entry._id,
          mood: entry.moodType,
          emoji: getMoodEmoji(entry.moodType),
          label: getMoodLabel(entry.moodType),
          date: entry.timestamp,
        }));
        setMoodHistory(history);
      }
    } catch (error) {
      console.error('Error fetching mood history:', error);
      // Set empty array if API fails - component will still work
      setMoodHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch mood history when component mounts or when user changes
  useEffect(() => {
    fetchMoodHistory();
  }, [user]);

  // Start consecutive notifications system (every 2 minutes)
  useEffect(() => {
    if (!user) return;
    const cleanup = startConsecutiveNotifications(showToast, preferences, lastMood);
    return cleanup;
  }, [showToast, user, preferences, lastMood]);

  /**
   * Show confirmation modal for clearing mood history
   */
  const handleClearHistory = () => {
    if (!user) {
      showToast('Please log in to clear mood history', 'error');
      return;
    }

    setShowClearConfirm(true);
  };

  /**
   * Confirm and clear all mood history for the user
   */
  const handleConfirmClearHistory = async () => {
    setIsClearing(true);
    try {
      const userId = user.id || user.userId || user.email;
      if (!userId) {
        showToast('User ID not found. Please log in again.', 'error');
        setIsClearing(false);
        return;
      }

      console.log('[MoodTracker] Clearing mood history for userId:', userId);
      const response = await api.delete(`/moods?userId=${userId}`);
      console.log('[MoodTracker] Clear history response:', response.data);

      if (response.data && response.data.success) {
        const deletedCount = response.data.deletedCount || 0;
        showToast(
          `Successfully cleared ${deletedCount} mood ${deletedCount === 1 ? 'entry' : 'entries'}`,
          'success'
        );
        // Clear local state
        setMoodHistory([]);
        // Optionally refresh mood context by fetching again
        fetchMoodHistory();
      } else {
        console.error('[MoodTracker] Clear history failed:', response.data);
        showToast(
          response.data?.error || 'Failed to clear mood history. Please try again.',
          'error'
        );
      }
    } catch (error) {
      console.error('[MoodTracker] Error clearing mood history:', error);
      console.error('[MoodTracker] Error response:', error.response?.data);
      showToast(
        error.response?.data?.error || error.message || 'Failed to clear mood history. Please try again.',
        'error'
      );
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * Handle mood selection
   */
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setMessage('');
  };

  /**
   * Handle mood submission to backend
   */
  const handleSubmit = async () => {
    if (!selectedMood) {
      setMessage('Please select a mood first');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    if (!user) {
      setMessage('Please log in to log your mood');
      return;
    }

    try {
      // Get user ID from auth context
      const userId = user.id || user.userId || user.email;
      
      // POST request to backend API using axios
      const response = await api.post('/moods', {
        mood: selectedMood.id,
        notes: `Mood: ${selectedMood.label}`,
        date: new Date().toISOString(),
        userId: userId,
      });

      if (response.data.success) {
        setMessage('Mood logged successfully! 😊');
        
        // Create mood data object similar to camera detection
        const moodData = {
          mood: selectedMood.id,
          emotion: selectedMood.id, // Same as mood for manual selection
          confidence: 1.0, // Full confidence for manual selection
          totalFrames: 1,
        };

        // Save to MoodContext for app-wide access
        saveMood(moodData);

        // Show success toast
        showToast(`Your mood has been logged as ${selectedMood.label} 😊`, 'success', 3000);

        // Negative moods should show support modal first, then navigate to music
        const negativeMoods = ['sad', 'angry', 'stressed', 'anxious', 'tired', 'lonely', 'overwhelmed'];
        
        if (negativeMoods.includes(selectedMood.id)) {
          // Show support modal for negative moods
          setManualMood(moodData);
        } else {
          // Positive/neutral moods navigate directly to music page
          setTimeout(() => {
            navigate('/music');
          }, 1500);
        }

        setSelectedMood(null);
        // Refresh mood history after successful submission
        fetchMoodHistory();
      } else {
        setMessage('Failed to log mood. Please try again.');
      }
    } catch (error) {
      console.error('Error logging mood:', error);
      setMessage('Failed to log mood. Please check if the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-blue dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Track Your Mood 📊
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            How are you feeling today? Select a mood that best describes your current state.
          </p>
        </div>

        {/* Mood Selection Grid */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center">
            Select Your Mood
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`p-6 rounded-softer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  selectedMood?.id === mood.id
                    ? `${mood.color} dark:bg-dark-surface border-4 border-calm-purple dark:border-accent-blue shadow-xl scale-105`
                    : 'bg-light-gray dark:bg-dark-bg hover:bg-sky-blue dark:hover:bg-dark-surface border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-5xl mb-2">{mood.emoji}</div>
                <div className={`text-sm font-semibold ${
                  selectedMood?.id === mood.id
                    ? 'text-gray-800 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedMood || isSubmitting}
              className={`px-8 py-4 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                selectedMood && !isSubmitting
                  ? 'bg-calm-purple dark:bg-accent-blue hover:bg-warm-pink dark:hover:bg-accent-blue/80'
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              {isSubmitting ? 'Logging...' : 'Log My Mood'}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-4 rounded-soft text-center ${
              message.includes('successfully')
                ? 'bg-soft-green dark:bg-dark-surface text-gray-800 dark:text-gray-100'
                : 'bg-warm-pink dark:bg-dark-surface text-gray-800 dark:text-gray-100'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Detect Mood with Webcam Button - Same styling as home page */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-8 shadow-lg text-center">
          <div className="text-6xl mb-4">🎥</div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Detect Mood with Webcam
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Let AI analyze your expression to detect your mood automatically
          </p>
          <button
            onClick={() => setShowDetectorModal(true)}
            className="px-8 py-4 rounded-softer font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🎥 Detect Mood Now
          </button>
        </div>

        {/* Webcam Modal - Same as home page */}
        {showDetectorModal && (
          <WebcamModal 
                  onClose={() => {
                    setShowDetectorModal(false);
                    setDetectedMood(null);
                    fetchMoodHistory();
                  }}
                  onMoodDetected={(mood) => {
                    setDetectedMood(mood);
                    fetchMoodHistory();
                  }}
            forceShow={true}
          />
        )}

        {/* Smart Suggestions for Negative Moods */}
        {manualMood && (
          <SmartSuggestions
            detectedMood={manualMood}
            onClose={() => {
              setManualMood(null);
            }}
          />
        )}

        {/* Toast Container */}
        <ToastContainer />

        {/* Confirmation Modal for Clearing Mood History */}
        <ConfirmationModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={handleConfirmClearHistory}
          title="Clear Mood History"
          message="Are you sure you want to clear all your mood history? This action cannot be undone and you will lose all your mood tracking data permanently."
          confirmText={isClearing ? "Clearing..." : "Clear All"}
          cancelText="Cancel"
          variant="danger"
        />

        {/* Mood History Preview */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-8 shadow-lg relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Your Mood History 📈
          </h2>
            {moodHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                disabled={isClearing}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear all mood history"
                aria-label="Clear all mood history"
              >
                <FaTrash className="text-lg" />
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Loading mood history...</p>
            </div>
          ) : moodHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-500">
                No mood entries yet. Start tracking your mood above! 💚
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {moodHistory.slice(0, 10).map((entry) => (
                <div
                  key={entry._id}
                  className="bg-sky-blue dark:bg-dark-bg p-4 rounded-softer shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-3xl mb-2 text-center">{entry.emoji}</div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center mb-1">
                    {entry.label || getMoodLabel(entry.mood)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    {new Date(entry.date).toLocaleString('en-IN', { 
                      timeZone: 'Asia/Kolkata',
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-6">
            Your recent mood entries are shown above. Keep tracking to see your patterns over time! 💚
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;

