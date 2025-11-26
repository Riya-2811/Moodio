import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MoodProvider } from './context/MoodContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// Critical components - loaded immediately (above the fold)
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Chatbot from './components/Chatbot';

// Performance Optimization: Lazy load non-critical components (code splitting)
const MoodTracker = lazy(() => import('./components/MoodTracker'));
const Journal = lazy(() => import('./pages/Journal'));
const MusicRecommender = lazy(() => import('./components/MusicRecommender'));
const Exercises = lazy(() => import('./pages/Exercises'));
const Profile = lazy(() => import('./pages/Profile'));
const Contact = lazy(() => import('./pages/Contact'));
const Therapist = lazy(() => import('./pages/Therapist'));
const UserPreferences = lazy(() => import('./pages/UserPreferences'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-sky-blue dark:bg-dark-bg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-calm-purple dark:border-accent-blue mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

/**
 * Main App Content Component
 * Handles conditional rendering of Navbar and Footer based on current route
 */
function AppContent() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply dark class to root element for Tailwind dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Hide navbar and footer on login, signup, forgot-password, and preferences pages
  const hideNavbarFooter = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password' || location.pathname === '/preferences';

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen flex flex-col bg-sky-blue dark:bg-dark-bg transition-all duration-300">
        {/* Navigation Bar - Hidden on login and signup pages */}
        {!hideNavbarFooter && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}

        {/* Main Content with Routes */}
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            
            {/* Protected Routes */}
              <Route
                path="/preferences"
                element={
                  <ProtectedRoute>
                    <UserPreferences />
                  </ProtectedRoute>
                }
              />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mood"
              element={
                <ProtectedRoute>
                  <MoodTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/music"
              element={
                <ProtectedRoute>
                  <MusicRecommender />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises"
              element={
                <ProtectedRoute>
                  <Exercises />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/therapist"
              element={
                <ProtectedRoute>
                  <Therapist />
                </ProtectedRoute>
              }
            />
          </Routes>
          </Suspense>
        </main>

        {/* Footer - Hidden on login and signup pages */}
        {!hideNavbarFooter && <Footer />}
      </div>
    </div>
  );
}

/**
 * Main App Component
 * Wraps AppContent with Router and Context Providers
 */
function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <Router>
          <AppContent />
        </Router>
      </MoodProvider>
    </AuthProvider>
  );
}

export default App;
