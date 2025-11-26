import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaTrash } from 'react-icons/fa';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';
import { useToast } from '../utils/Toast';
import ConfirmationModal from '../components/ConfirmationModal';
import PasswordVerificationModal from '../components/PasswordVerificationModal';
import { startConsecutiveNotifications } from '../utils/NotificationService';

/**
 * Journal Component
 * Simple journaling page for users to write daily thoughts and view past entries
 * Previous Entries section is private by default - user can toggle visibility
 */
const Journal = () => {
  const { user, preferences, updatePreferences } = useAuth();
  const { lastMood } = useMood();
  const { showToast, ToastContainer } = useToast();
  // State for journal entry text
  const [entry, setEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  // Privacy: Previous entries are hidden by default
  const [showPreviousEntries, setShowPreviousEntries] = useState(false);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  // Ref to track if user just toggled (to prevent useEffect from resetting state)
  const justToggledRef = useRef(false);

  /**
   * Fetch journal entries from API (only for current user)
   */
  const fetchJournalEntries = async () => {
    if (!user) {
      setJournalEntries([]);
      return;
    }

    setIsLoading(true);
    try {
      // Get user ID from auth context
      const userId = user.id || user.userId || user.email;
      const response = await api.get(`/journal?userId=${userId}`);
      if (response.data.success) {
        // Transform API data to match component format
        const entries = response.data.data.map((item) => ({
          _id: item._id,
          content: item.content,
          date: item.date,
          createdAt: item.createdAt,
        }));
        setJournalEntries(entries);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      // Set empty array if API fails - component will still work
      setJournalEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch journal entries when component mounts or when user changes
  useEffect(() => {
    fetchJournalEntries();
  }, [user]);

  // Load privacy preference for journal entries visibility (only on initial load or external changes)
  useEffect(() => {
    // Don't update from preferences if user just toggled (to prevent flickering/disappearing)
    if (justToggledRef.current) {
      return; // Don't reset state if user just toggled
    }

    // Only update from preferences on initial load or if preference value exists and differs
    if (preferences && preferences.journalPreferences) {
      const privacySetting = preferences.journalPreferences.showPreviousEntries;
      // Only update if it's explicitly set as a boolean
      if (typeof privacySetting === 'boolean') {
        // Use functional update to avoid stale closure issues
        setShowPreviousEntries(prev => {
          // Only update if the preference value differs from current state
          return privacySetting !== prev ? privacySetting : prev;
        });
      }
    } else if (!preferences) {
      // Only set to hidden on initial mount if no preferences loaded yet
      setShowPreviousEntries(false);
    }
  }, [preferences]);

  // Start consecutive notifications system (every 2 minutes)
  useEffect(() => {
    if (!user) return;
    const cleanup = startConsecutiveNotifications(showToast, preferences, lastMood);
    return cleanup;
  }, [showToast, user, preferences, lastMood]);

  /**
   * Show confirmation modal for clearing journal entries
   */
  const handleClearAllEntries = () => {
    if (!user) {
      showToast('Please log in to clear journal entries', 'error');
      return;
    }

    setShowDeleteConfirm(true);
  };

  /**
   * Confirm and clear all journal entries
   */
  const handleConfirmClearEntries = async () => {
    setIsDeleting(true);
    try {
      const userId = user.id || user.userId || user.email;
      const response = await api.delete(`/journal?userId=${userId}`);

      if (response.data && response.data.success) {
        setJournalEntries([]);
        showToast(
          `Successfully cleared ${response.data.deletedCount || 0} journal entries`,
          'success',
          3000
        );
      } else {
        throw new Error(response.data?.error || 'Failed to clear journal entries');
      }
    } catch (error) {
      console.error('Error clearing journal entries:', error);
      showToast(
        error.response?.data?.error || error.message || 'Failed to clear journal entries. Please try again.',
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Toggle visibility of previous entries and save preference
   * Password verification required for both hiding and showing entries
   */
  const handleTogglePrivacy = async () => {
    // Always require password verification for both hiding and showing
    setShowPasswordVerify(true);
  };

  /**
   * Perform the actual privacy toggle after password verification
   */
  const performTogglePrivacy = async () => {
    const newVisibility = !showPreviousEntries;
    if (!user) {
      showToast('Please log in to save your privacy preference', 'error');
      return;
    }

    // Set flag to prevent useEffect from resetting state immediately after toggle
    justToggledRef.current = true;
    
    // Update local state immediately (optimistic update)
    setShowPreviousEntries(newVisibility);
    setIsSavingPrivacy(true);
    
    try {
      const userId = user.id || user.userId || user.email;
      const privacyData = {
        journalPreferences: {
          showPreviousEntries: newVisibility,
        },
      };

      // Update preferences in context (this will also save to backend)
      const result = await updatePreferences(privacyData);
      
      if (result.success) {
        showToast(
          newVisibility 
            ? 'Previous entries are now visible' 
            : 'Previous entries are now hidden and private',
          'success',
          2000
        );
      } else {
        throw new Error(result.error || 'Failed to save preference');
      }
    } catch (error) {
      console.error('Error saving privacy preference:', error);
      // Revert on error
      justToggledRef.current = false;
      setShowPreviousEntries(!newVisibility);
      showToast(
        error.response?.data?.error || error.message || 'Failed to save privacy preference. Please try again.',
        'error'
      );
    } finally {
      setIsSavingPrivacy(false);
      // Keep flag true for longer to prevent useEffect from resetting during preference update
      // Reset after preferences have been fully updated in context
      setTimeout(() => {
        justToggledRef.current = false;
      }, 2000);
    }
  };

  /**
   * Handle password verification success
   */
  const handlePasswordVerified = () => {
    // Password verified - now toggle the entries visibility
    performTogglePrivacy();
  };

  /**
   * Handle journal entry submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!entry.trim()) {
      setMessage('Please write something before saving.');
      return;
    }

    if (!user) {
      setMessage('Please log in to save journal entries.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Get user ID from auth context
      const userId = user.id || user.userId || user.email;
      
      // POST request to backend API using axios
      const response = await api.post('/journal', {
        content: entry,
        date: new Date().toISOString(),
        userId: userId,
      });

      if (response.data.success) {
        setEntry('');
        setMessage('Journal entry saved successfully! 💚');
        // Refresh journal entries after successful submission
        fetchJournalEntries();
      } else {
        setMessage('Failed to save entry. Please try again.');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setMessage('Failed to save entry. Please check if the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-green dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Your Journal 📝
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Express your thoughts and feelings. This is your safe space to reflect.
          </p>
        </div>

        {/* Journal Entry Form */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
            Write Your Entry
          </h2>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="How are you feeling today? What's on your mind? Write freely..."
              className="w-full h-48 p-4 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all duration-300 resize-none"
              disabled={isSubmitting}
            />
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={!entry.trim() || isSubmitting}
                className={`px-8 py-4 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  entry.trim() && !isSubmitting
                    ? 'bg-soft-green dark:bg-accent-blue hover:bg-calm-purple dark:hover:bg-accent-blue/80'
                    : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </form>

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

        {/* Previous Entries - Private by default */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Previous Entries
          </h2>
              {!showPreviousEntries && (
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <FaLock className="text-xs" />
                  <span>Private</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Delete All Button */}
              {showPreviousEntries && journalEntries.length > 0 && (
                <button
                  onClick={handleClearAllEntries}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-soft text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                  title="Delete all journal entries"
                >
                  <FaTrash className="text-base" />
                  <span>{isDeleting ? 'Deleting...' : 'Clear All'}</span>
                </button>
              )}
              {/* Show/Hide Toggle Button */}
              <button
                onClick={handleTogglePrivacy}
                disabled={isSavingPrivacy}
                className="flex items-center gap-2 px-4 py-2 rounded-soft text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                title={showPreviousEntries ? 'Hide previous entries' : 'Show previous entries'}
              >
                {showPreviousEntries ? (
                  <>
                    <FaEyeSlash className="text-base" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <FaEye className="text-base" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {!showPreviousEntries ? (
            <div className="text-center py-12">
              <FaLock className="mx-auto text-4xl text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                Previous entries are hidden for privacy
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Click "Show" above to view your journal entries
              </p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Loading journal entries...</p>
            </div>
          ) : journalEntries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-500 text-center py-8">
              No entries yet. Start writing your first journal entry above! 💚
            </p>
          ) : (
            <div className="space-y-4">
              {journalEntries.map((journalEntry) => (
                <div
                  key={journalEntry._id}
                  className="bg-sky-blue dark:bg-dark-bg p-6 rounded-soft shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {new Date(journalEntry.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(journalEntry.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {journalEntry.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast Container */}
        <ToastContainer />

        {/* Confirmation Modal for Clearing Journal Entries */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmClearEntries}
          title="Delete All Journal Entries"
          message="Are you sure you want to delete all your journal entries? This action cannot be undone and you will lose all your journal entries permanently."
          confirmText={isDeleting ? "Deleting..." : "Delete All"}
          cancelText="Cancel"
          variant="danger"
        />

        {/* Password Verification Modal for Hiding/Showing Entries */}
        <PasswordVerificationModal
          isOpen={showPasswordVerify}
          onClose={() => setShowPasswordVerify(false)}
          onVerify={handlePasswordVerified}
          title="Verify Your Password"
          message={showPreviousEntries 
            ? "Please enter your account password (the one you set during signup) to hide your previous journal entries. This adds an extra layer of security to protect your private thoughts."
            : "Please enter your account password (the one you set during signup) to show your previous journal entries. This ensures only you can access your private thoughts."}
        />
      </div>
    </div>
  );
};

export default Journal;

