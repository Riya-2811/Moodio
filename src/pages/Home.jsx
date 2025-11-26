import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WebcamModal from '../components/WebcamModal';
import ThoughtOfTheDay from '../components/ThoughtOfTheDay';
import FloatingCameraButton from '../components/FloatingCameraButton';
import CuteAssistant from '../components/CuteAssistant';
import Logo from '../components/Logo';
import { useToast } from '../utils/Toast';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';
import { 
  showDailyNotification, 
  showMoodTrackingReminder, 
  startConsecutiveNotifications
} from '../utils/NotificationService';

/**
 * Home Page Component
 * Main landing page with hero section and feature highlights
 */
const Home = () => {
  const { showToast, ToastContainer } = useToast();
  const { user, preferences } = useAuth();
  const { lastMood } = useMood();
  const [showMoodModal, setShowMoodModal] = useState(false);
  const navigate = useNavigate();

  // Show personalized daily notification on mount (respects user preferences)
  useEffect(() => {
    // Only show if user is logged in and has enabled reminders
    if (!user) return;
    
    const timer = setTimeout(() => {
      // Show personalized daily notification based on last mood
      const message = showDailyNotification(showToast, preferences, lastMood);
      // showDailyNotification already calls showToast internally
    }, 120000); // Wait 2 minutes after page load

    return () => clearTimeout(timer);
  }, [showToast, user, preferences, lastMood]);

  // Show mood tracking reminder if user hasn't tracked mood today
  useEffect(() => {
    if (!user) return;
    
    // Check if user has tracked mood today
    const today = new Date();
    const todayStr = today.toDateString();
    const lastMoodDate = lastMood?.timestamp ? new Date(lastMood.timestamp).toDateString() : null;
    const hasTrackedToday = lastMoodDate === todayStr;
    
    // Show reminder after 2 minutes (after daily notification)
    const reminderTimer = setTimeout(() => {
      showMoodTrackingReminder(showToast, preferences, lastMood, hasTrackedToday);
    }, 120000); // Wait 2 minutes after page load

    return () => clearTimeout(reminderTimer);
  }, [showToast, user, preferences, lastMood]);

  // Start consecutive notifications system (rotates through all enabled types every 2 minutes)
  useEffect(() => {
    // Only start if user is logged in
    if (!user) return;
    
    // Start the unified consecutive notification system
    // This will rotate through all enabled notification types every 2 minutes
    const cleanup = startConsecutiveNotifications(showToast, preferences, lastMood);
    
    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [showToast, user, preferences, lastMood]);

  /**
   * Handle floating button click to open mood detection modal
   */
  const handleFloatingButtonClick = () => {
    setShowMoodModal(true);
  };

  return (
    <div id="home" className="min-h-screen">
      {/* Webcam Modal - Auto-shows on first visit (1 second after landing) */}
      <WebcamModal onClose={() => setShowMoodModal(false)} />
      
      {/* Manual Mood Detection Modal (triggered by floating button) */}
      {showMoodModal && (
        <WebcamModal 
          onClose={() => setShowMoodModal(false)} 
          forceShow={true}
        />
      )}

      {/* Floating Camera Button - Always visible for manual mood detection */}
      <FloatingCameraButton onClick={handleFloatingButtonClick} />

      {/* Cute Assistant Character */}
      <CuteAssistant />

      {/* Toast Container */}
      <ToastContainer />

      {/* Welcome Back Banner */}
      {user && lastMood && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div className="bg-white dark:bg-dark-surface rounded-softer p-5 shadow-md border-2 border-calm-purple/30 dark:border-accent-blue/40 text-center">
            <p className="text-gray-800 dark:text-gray-100 text-base md:text-lg">
              Welcome back, <strong className="text-calm-purple dark:text-accent-blue">{user.name}</strong>! 👋{' '}
              {(() => {
                const mood = lastMood.mood?.toLowerCase();
                const moodEmoji = mood === 'happy' || mood === 'calm' || mood === 'excited' ? '😊' : 
                                 mood === 'sad' || mood === 'angry' || mood === 'anxious' || mood === 'stressed' || mood === 'crying' ? '💙' : '😌';
                
                if (mood === 'happy' || mood === 'calm' || mood === 'excited' || mood === 'grateful') {
                  return (
                    <>Last time you felt <strong className="capitalize text-calm-purple dark:text-accent-blue">{mood}</strong> {moodEmoji} — hope today's just as wonderful!</>
                  );
                } else if (mood === 'sad' || mood === 'crying') {
                  return (
                    <>Last time you felt <strong className="capitalize text-calm-purple dark:text-accent-blue">{mood}</strong> {moodEmoji} — we hope you're feeling better today. You're not alone 💚</>
                  );
                } else if (mood === 'angry' || mood === 'stressed' || mood === 'anxious') {
                  return (
                    <>Last time you felt <strong className="capitalize text-calm-purple dark:text-accent-blue">{mood}</strong> {moodEmoji} — hoping today brings you more peace and calm 🌿</>
                  );
                } else {
                  return (
                    <>Last time you felt <strong className="capitalize text-calm-purple dark:text-accent-blue">{mood}</strong> {moodEmoji} — wishing you a wonderful day ahead!</>
                  );
                }
              })()}
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-calm-gradient dark:bg-dark-gradient transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800 dark:text-gray-100 transition-colors">
              Welcome to Moodio
              <span className="block mt-2 text-4xl"></span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your Mood's Best Friend In your Pocket
            </p>
            <p className="text-lg md:text-xl mb-12 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Your all-in-one mental wellness companion: Track moods with real-time detection, journal freely, discover personalized music that matches your emotions, and chat with an empathetic AI Twin — start your wellness journey today! 💚
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#features"
                className="px-8 py-4 rounded-softer bg-calm-purple text-white font-semibold hover:bg-warm-pink dark:bg-accent-blue dark:hover:bg-accent-blue/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Features
              </a>
              <a
                href="#about"
                className="px-8 py-4 rounded-softer bg-white dark:bg-dark-surface text-gray-800 dark:text-gray-200 font-semibold hover:bg-light-gray dark:hover:bg-dark-bg transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-700"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Decorative wave or pattern can go here */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white dark:bg-dark-surface"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-dark-surface transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
            What Makes Moodio Special
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: Mood Tracking */}
            <Link
              to="/mood"
              className="bg-sky-blue dark:bg-dark-surface p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                Mood Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Log your daily emotions and track patterns over time to better understand your mental health.
              </p>
            </Link>

            {/* Feature 2: Journaling */}
            <Link
              to="/journal"
              className="bg-soft-green dark:bg-dark-surface p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block"
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                Journaling
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Express your thoughts and feelings in a safe, private space with our journaling feature.
              </p>
            </Link>

            {/* Feature 3: Music Recommendations */}
            <Link
              to="/music"
              className="bg-calm-purple dark:bg-dark-surface p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block"
            >
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                Music & More
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get personalized music recommendations and motivational content based on your mood.
              </p>
            </Link>

            {/* Feature 4: AI Twin */}
            <Link
              to="/chat"
              className="bg-warm-pink dark:bg-dark-surface p-6 rounded-softer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block"
            >
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                AI Twin
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chat with your AI Twin for personalized emotional support and mental wellness guidance whenever you need someone to talk to.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Thought of the Day - Now below the Features Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ThoughtOfTheDay />
      </div>

      {/* About Section Preview */}
      <section id="about" className="py-20 bg-sky-blue dark:bg-dark-bg transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-soft-green/50 via-sky-blue/40 to-soft-green/50 dark:from-dark-surface dark:via-dark-bg/70 dark:to-dark-surface rounded-softer p-8 shadow-lg border-2 border-soft-green/30 dark:border-gray-600/50 text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              About Moodio
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
              Moodio was created with the belief that mental wellness should be accessible, simple, and supportive. 
              We understand that everyone's mental health journey is unique, and we're here to provide tools 
              that help you understand and improve your emotional well-being.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
              Our platform combines mood tracking, journaling, music therapy, and AI support to create a 
              comprehensive mental wellness experience. Whether you're looking to track patterns, express 
              yourself, or just need someone to talk to, Moodio is here for you.
            </p>
            
            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic max-w-3xl mx-auto">
                <strong className="text-gray-700 dark:text-gray-300 not-italic">Important Disclaimer:</strong> Moodio is a general wellness platform and is not a substitute for professional medical or psychiatric care. 
                All advice, suggestions, and content provided through Moodio are generalized and intended for informational purposes only. 
                We do not claim to provide professional mental health services, diagnosis, or treatment. 
                This platform is a general attempt to support those in need through self-help tools and resources. 
                If you are experiencing a mental health crisis or need professional help, please consult with a licensed mental health professional, 
                contact your local emergency services, or reach out to a crisis helpline. Moodio is not responsible for any decisions made based on 
                the information or tools provided on this platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

