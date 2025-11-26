import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Password Verification Modal Component
 * Secure modal to verify user password before sensitive actions
 */
const PasswordVerificationModal = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  title = "Verify Your Password",
  message = "Please enter your password to confirm this action."
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /**
   * Verify password and call onVerify callback
   */
  const handleVerify = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Get user email from localStorage
      const storedUser = localStorage.getItem('moodio_user');
      if (!storedUser) {
        setError('User not found. Please log in again.');
        setIsVerifying(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      const userEmail = userData.email;

      if (!userEmail) {
        setError('Unable to verify. Please log in again.');
        setIsVerifying(false);
        return;
      }

      // Check password against stored users in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('moodio_users') || '[]');
      const user = existingUsers.find(u => u.email === userEmail && u.password === password);

      if (!user) {
        setError('Incorrect password. Please try again.');
        setIsVerifying(false);
        return;
      }

      // Password verified successfully
      setPassword('');
      setError('');
      setIsVerifying(false);
      onVerify();
      onClose();
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('An error occurred. Please try again.');
      setIsVerifying(false);
    }
  };

  /**
   * Handle backdrop click to close modal
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-dark-surface rounded-softer shadow-xl max-w-md w-full transform transition-all duration-300 scale-100 border-2 border-gray-200 dark:border-dark-border">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            🔒 {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="verify-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Password <span className="text-xs text-gray-500 dark:text-gray-400">(from signup)</span>
            </label>
            <div className="relative">
              <input
                id="verify-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error when user types
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isVerifying) {
                    handleVerify();
                  }
                }}
                className="w-full px-4 py-3 pr-12 rounded-softer border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent transition-all duration-300"
                placeholder="Enter your account password"
                autoFocus
                disabled={isVerifying}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-calm-purple dark:hover:text-accent-blue focus:outline-none transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.29 3.29L12 12m-3.59-3.59L3 3m9.59 9.59L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-soft bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleVerify}
              disabled={isVerifying || !password.trim()}
              className={`flex-1 px-6 py-3 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                isVerifying || !password.trim()
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 hover:from-warm-pink hover:to-calm-purple'
              }`}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
            <button
              onClick={onClose}
              disabled={isVerifying}
              className="px-6 py-3 rounded-softer font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordVerificationModal;

