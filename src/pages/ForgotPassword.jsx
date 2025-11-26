import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../utils/Toast';

/**
 * Forgot Password / Account Recovery Page
 * Allows users to reset their password by verifying their email
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [step, setStep] = useState(1); // 1: Enter email, 2: Reset password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userFound, setUserFound] = useState(null);

  /**
   * Step 1: Verify email exists
   */
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('moodio_users') || '[]');
      const user = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setError('No account found with this email address. Please check your email or sign up for a new account.');
        setIsLoading(false);
        return;
      }

      // Email found - proceed to password reset step
      setUserFound(user);
      setStep(2);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking email:', error);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  /**
   * Step 2: Reset password
   */
  const handlePasswordReset = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Update password in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('moodio_users') || '[]');
      const userIndex = existingUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      if (userIndex === -1) {
        setError('User not found. Please start over.');
        setIsLoading(false);
        return;
      }

      // Update password
      existingUsers[userIndex].password = newPassword;
      localStorage.setItem('moodio_users', JSON.stringify(existingUsers));

      // Show success message
      showToast('Password reset successfully! You can now sign in with your new password.', 'success', 5000);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('An error occurred while resetting your password. Please try again.');
      setIsLoading(false);
    }
  };

  /**
   * Go back to email step
   */
  const handleBack = () => {
    setStep(1);
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setUserFound(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue via-calm-purple to-soft-green dark:bg-dark-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            {step === 1 ? '🔒 Account Recovery' : '🔑 Reset Password'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 1 
              ? 'Enter your email to recover your account'
              : `Reset password for ${userFound?.email || email}`
            }
          </p>
        </div>

        {/* Step 1: Email Verification */}
        {step === 1 && (
          <div className="bg-white dark:bg-dark-surface rounded-softer p-8 shadow-lg">
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="recovery-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="recovery-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 rounded-softer border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent transition-all duration-300"
                  placeholder="your@email.com"
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-soft bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className={`w-full px-6 py-4 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  isLoading || !email.trim()
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 hover:from-warm-pink hover:to-calm-purple'
                }`}
              >
                {isLoading ? 'Verifying...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Password Reset */}
        {step === 2 && (
          <div className="bg-white dark:bg-dark-surface rounded-softer p-8 shadow-lg">
            <form onSubmit={handlePasswordReset} className="space-y-6">
              {/* New Password Input */}
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 pr-12 rounded-softer border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent transition-all duration-300"
                    placeholder="Enter new password (min. 6 characters)"
                    minLength={6}
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

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 pr-12 rounded-softer border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent transition-all duration-300"
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-calm-purple dark:hover:text-accent-blue focus:outline-none transition-colors duration-200"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
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
                <div className="p-4 rounded-soft bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 rounded-softer font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className={`flex-1 px-6 py-4 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                    isLoading || !newPassword || !confirmPassword
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 hover:from-warm-pink hover:to-calm-purple'
                  }`}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-softer text-sm font-semibold text-white bg-calm-purple/80 dark:bg-accent-blue/80 hover:bg-calm-purple dark:hover:bg-accent-blue transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;

