import React, { useState, useEffect } from 'react';
import { useToast } from '../utils/Toast';
import { submitTherapistRequest } from '../api/therapist';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';
import { startConsecutiveNotifications } from '../utils/NotificationService';

/**
 * Therapist Consultation Page
 * Encourages users to seek professional help and provides booking functionality
 */
const Therapist = () => {
  const { showToast, ToastContainer } = useToast();
  const { user, preferences } = useAuth();
  const { lastMood } = useMood();

  // Start consecutive notifications system (every 2 minutes)
  useEffect(() => {
    if (!user) return;
    const cleanup = startConsecutiveNotifications(showToast, preferences, lastMood);
    return cleanup;
  }, [showToast, user, preferences, lastMood]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingData, setBookingData] = useState({
    time: '',
    reason: '',
    preferredMethod: 'video', // video, phone, in-person, any
  });

  /**
   * Handle request form submission
   */
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.time) {
      showToast('Please select your preferred time availability', 'error');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Submit therapist request via API
      const requestData = {
        preferredMethod: bookingData.preferredMethod,
        timeAvailability: bookingData.time,
        reason: bookingData.reason || undefined,
        userEmail: user?.email || undefined,
        userName: user?.name || user?.personalInfo?.firstName || undefined,
      };

      const result = await submitTherapistRequest(requestData);

      if (result.success) {
        // Success - show success message and reset form
        showToast(
          result.message || 'Request submitted! We\'ll help you find suitable therapists and connect with you shortly.',
          'success',
          5000
        );
    
    // Reset form
    setShowBookingForm(false);
    setBookingData({
      time: '',
      reason: '',
      preferredMethod: 'video',
    });
      } else {
        // Error - show error message
        const errorMessage = result.error || 'Failed to submit request. Please try again.';
        setSubmitError(errorMessage);
        showToast(errorMessage, 'error', 5000);
      }
    } catch (error) {
      // Unexpected error
      const errorMessage = 'An unexpected error occurred. Please try again later.';
      setSubmitError(errorMessage);
      showToast(errorMessage, 'error', 5000);
      console.error('Therapist request submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue/60 via-calm-purple/40 to-soft-green/50 dark:from-dark-bg dark:via-dark-surface/90 dark:to-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="text-6xl mb-4">💚</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Find Professional Support
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 font-medium">
              Connect with licensed therapists online or via call
            </p>
          </div>

          {/* Encouraging Cards - Simplified */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-dark-surface rounded-softer p-5 shadow-lg border-2 border-calm-purple/20 dark:border-accent-blue/30">
              <div className="text-4xl mb-2">💙</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                It's Okay to Talk
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your mental health matters.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-surface rounded-softer p-5 shadow-lg border-2 border-calm-purple/20 dark:border-accent-blue/30">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                No Judgment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You're taking a brave step forward.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-surface rounded-softer p-5 shadow-lg border-2 border-calm-purple/20 dark:border-accent-blue/30">
              <div className="text-4xl mb-2">🌱</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Growth & Healing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional support for your journey.
              </p>
            </div>
          </div>

          {/* Main Message - Condensed */}
          <div className="bg-gradient-to-r from-warm-pink/20 via-calm-purple/20 to-soft-green/20 dark:from-purple-600/20 dark:via-accent-blue/20 dark:to-green-500/20 rounded-softer p-6 mb-8 border-2 border-calm-purple/30 dark:border-accent-blue/40">
            <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
              You're Not Alone 💚
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              We help you connect with licensed therapists and psychologists for online consultations, phone calls, or in-person sessions. Professional help is available, and it's okay to reach out.
            </p>
          </div>
        </div>

        {/* How We Help - Simplified */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            How We Help
          </h2>
          <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg border-2 border-calm-purple/20 dark:border-accent-blue/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Find Professionals
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Licensed therapists & psychologists
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-2">📞</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Online or Phone
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Video, call, or in-person
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-2">💼</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Verified
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Licensed professionals
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-2">🤝</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Private & Secure
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confidential consultations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Request Help - Simplified */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            Need Help Finding a Therapist?
          </h2>
          <div className="bg-gradient-to-r from-warm-pink/20 via-calm-purple/20 to-soft-green/20 dark:from-purple-600/20 dark:via-accent-blue/20 dark:to-green-500/20 rounded-softer p-6 border-2 border-calm-purple/30 dark:border-accent-blue/40">
            <p className="text-base text-gray-700 dark:text-gray-300 mb-6 text-center max-w-2xl mx-auto">
              Fill out the form below and we'll help you find a licensed therapist who matches your needs.
            </p>
            
            <div className="max-w-xl mx-auto">
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full px-8 py-4 rounded-softer bg-calm-purple dark:bg-accent-blue text-white font-bold text-lg hover:bg-warm-pink dark:hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🔍 Help Me Find a Therapist
              </button>
            </div>
          </div>
        </div>

        {/* Popular Therapy Platforms - Simplified */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            Popular Online Therapy Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'BetterHelp',
                description: 'Online therapy with licensed counselors',
                link: 'https://www.betterhelp.com',
                icon: '💬',
              },
              {
                name: 'Talkspace',
                description: 'Text, video & voice messaging',
                link: 'https://www.talkspace.com',
                icon: '📱',
              },
              {
                name: 'Psychology Today',
                description: 'Find therapists near you',
                link: 'https://www.psychologytoday.com',
                icon: '🌐',
              },
            ].map((platform, index) => (
              <a
                key={index}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-dark-surface rounded-softer p-5 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-calm-purple/20 dark:border-accent-blue/30 hover:border-calm-purple dark:hover:border-accent-blue transform hover:-translate-y-2 text-center"
              >
                <div className="text-4xl mb-2">{platform.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {platform.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {platform.description}
                </p>
                <span className="text-sm text-calm-purple dark:text-accent-blue font-semibold">
                  Visit →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Crisis Resources - Simplified */}
        <div className="mt-12 bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg border-2 border-calm-purple/20 dark:border-accent-blue/30">
          <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
            Need Immediate Support?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-soft p-4 text-center">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Crisis Text Line
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Text HOME to 741741 • 24/7
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-soft p-4 text-center">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Suicide Prevention Lifeline
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                988 • 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Request Help Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Request Help Finding a Therapist
                </h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="bg-calm-purple/10 dark:bg-accent-blue/10 rounded-soft p-3 mb-4">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    💡 We'll help you find licensed professionals based on your preferences.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Consultation Method
                  </label>
                  <select
                    value={bookingData.preferredMethod}
                    onChange={(e) => setBookingData({ ...bookingData, preferredMethod: e.target.value })}
                    className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
                    required
                  >
                    <option value="video">Video Call (Online)</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In-Person</option>
                    <option value="any">Any Method</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Time Availability
                  </label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
                    required
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 9 PM)</option>
                    <option value="any">Any Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What would you like help with? (Optional)
                  </label>
                  <textarea
                    value={bookingData.reason}
                    onChange={(e) => {
                      setBookingData({ ...bookingData, reason: e.target.value });
                      if (submitError) setSubmitError('');
                    }}
                    placeholder="E.g., Anxiety, depression, stress, relationship issues, trauma, general support..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
                  />
                </div>

                {/* Error Message Display */}
                {submitError && (
                  <div className="p-3 rounded-soft bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {submitError}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingForm(false);
                      setSubmitError('');
                      setBookingData({
                        time: '',
                        reason: '',
                        preferredMethod: 'video',
                      });
                    }}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-soft bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-3 rounded-soft text-white font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-calm-purple dark:bg-accent-blue hover:bg-warm-pink dark:hover:bg-purple-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Therapist;

