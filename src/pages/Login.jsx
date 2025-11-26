import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../components/SplashScreen';

/**
 * Login Page Component
 * Allows users to log in to their Moodio account
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('moodio_splashShown');
    return !splashShown;
  });

  /**
   * Handle splash screen completion
   */
  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('moodio_splashShown', 'true');
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue via-calm-purple to-soft-green dark:bg-dark-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your Moodio account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-softer border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-calm-purple dark:text-accent-blue hover:text-warm-pink dark:hover:text-purple-400 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-softer border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-calm-purple dark:hover:text-accent-blue focus:outline-none transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.29 3.29L12 12m-3.59-3.59L3 3m9.59 9.59L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-soft bg-warm-pink dark:bg-dark-surface text-gray-800 dark:text-gray-100 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-4 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                isLoading
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 hover:from-warm-pink hover:to-calm-purple'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Account Info */}
        <div className="bg-sky-blue dark:bg-dark-bg rounded-softer p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 New to Moodio? <Link to="/signup" className="font-semibold text-calm-purple dark:text-accent-blue hover:underline">Create an account</Link> to get started!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

