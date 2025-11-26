import React, { useState, useEffect } from 'react';
import { useToast } from '../utils/Toast';
import { submitContactForm } from '../api/contact';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';
import { startConsecutiveNotifications } from '../utils/NotificationService';

/**
 * Contact Page Component
 * Provides multiple contact options: message, call, and mail
 */
const Contact = () => {
  const { showToast, ToastContainer } = useToast();
  const { user, preferences } = useAuth();
  const { lastMood } = useMood();

  // Start consecutive notifications system (every 2 minutes)
  useEffect(() => {
    if (!user) return;
    const cleanup = startConsecutiveNotifications(showToast, preferences, lastMood);
    return cleanup;
  }, [showToast, user, preferences, lastMood]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Submit contact form via API
      const result = await submitContactForm(formData);

      if (result.success) {
        // Success - show success message and reset form
        showToast(
          result.message || 'Thank you for your message! We\'ll get back to you soon. 💚',
          'success',
          5000
        );
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Error - show error message
        const errorMessage = result.error || 'Failed to send message. Please try again.';
        setSubmitError(errorMessage);
        showToast(errorMessage, 'error', 5000);
      }
    } catch (error) {
      // Unexpected error
      const errorMessage = 'An unexpected error occurred. Please try again later.';
      setSubmitError(errorMessage);
      showToast(errorMessage, 'error', 5000);
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle call action - Coming soon
   */
  const handleCall = () => {
    showToast('Phone support coming soon! 📞', 'info', 3000);
  };

  /**
   * Copy email to clipboard as fallback
   */
  const copyEmailToClipboard = async () => {
    const email = 'contact.moodio@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard! 📋', 'success', 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
      showToast('Email: contact.moodio@gmail.com', 'info', 3000);
    }
  };


  return (
    <div className="min-h-screen bg-sky-blue dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Get in Touch 📬
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We'd love to hear from you! Choose your preferred way to reach us.
          </p>
        </div>

        {/* Contact Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Message Form Card */}
          <div className="bg-white dark:bg-dark-surface rounded-softer p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Send us a Message
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fill out the form below and we'll get back to you
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent resize-none"
                  placeholder="Tell us what's on your mind..."
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

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  isSubmitting
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 hover:from-warm-pink hover:to-calm-purple'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span>Sending...</span>
                  </span>
                ) : (
                  '📤 Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Quick Contact Options */}
          <div className="space-y-6">
            {/* Call Option - Coming Soon */}
            <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg opacity-75 cursor-not-allowed" onClick={handleCall}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-soft-green to-calm-purple flex items-center justify-center text-3xl">
                  📞
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    Call Us
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Speak directly with our support team
                  </p>
                  <p className="text-calm-purple dark:text-accent-blue font-medium">
                    Phone support coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* Email Option */}
            <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=contact.moodio@gmail.com&su=Contact%20from%20Moodio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 no-underline text-inherit cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-blue to-calm-purple flex items-center justify-center text-3xl">
                  📧
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    Email Us
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Send us an email anytime
                  </p>
                  <p className="text-calm-purple dark:text-accent-blue font-medium hover:underline">
                    contact.moodio@gmail.com
                  </p>
                </div>
              </a>
              <div className="mt-2 text-right">
                <button
                  onClick={copyEmailToClipboard}
                  className="text-xs text-gray-500 hover:text-calm-purple dark:hover:text-accent-blue underline"
                  title="Copy email address to clipboard"
                >
                  or copy email address
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            💡 <strong>Tip:</strong> We typically respond within 24 hours.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Your privacy is important to us. All messages are kept confidential.
          </p>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Contact;

