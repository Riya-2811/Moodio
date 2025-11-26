import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';

/**
 * Cute Assistant Component
 * A cheerful animated character that greets users and reacts to their mood
 */
const CuteAssistant = () => {
  const { user, preferences } = useAuth();
  const { lastMood } = useMood();
  const [showGreeting, setShowGreeting] = useState(false);
  const [moodExpression, setMoodExpression] = useState('default');
  const [interactiveAction, setInteractiveAction] = useState(null);
  const [actionCount, setActionCount] = useState(0);
  const [particles, setParticles] = useState([]);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Determine mood-based expression
  useEffect(() => {
    if (lastMood) {
      const mood = lastMood.mood?.toLowerCase();
      if (mood === 'happy' || mood === 'excited') {
        setMoodExpression('happy');
      } else if (mood === 'calm' || mood === 'grateful') {
        setMoodExpression('calm');
      } else if (mood === 'sad' || mood === 'stressed' || mood === 'anxious') {
        setMoodExpression('supportive');
      } else if (mood === 'angry') {
        setMoodExpression('worried');
      } else {
        setMoodExpression('default');
      }
    }
  }, [lastMood]);

  /**
   * Get greeting text based on user preferences
   */
  const getGreetingText = (name) => {
    const tone = preferences?.assistantSettings?.greetingTone || 'cheerful';
    const greetings = {
      cheerful: `Hi ${name}! 👋`,
      warm: `Hello ${name}, it's great to see you! 🌟`,
      calm: `Welcome back, ${name} 💚`,
      enthusiastic: `Hey ${name}! Ready to track your mood? 🎉`,
      gentle: `Hello ${name}. How can I help you today? 🌸`,
    };
    return greetings[tone] || greetings.cheerful;
  };

  // Show greeting when user logs in
  useEffect(() => {
    if (user) {
      setShowGreeting(true);
      const timer = setTimeout(() => {
        setShowGreeting(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  /**
   * Handle click on Moody character
   * Single click: Random animation
   * Double click: Special heart radiation effect
   */
  const handleMoodyClick = (e) => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    // Double click detection (within 300ms)
    if (timeSinceLastClick < 300 && timeSinceLastClick > 0) {
      // Double click - special heart radiation effect
      setInteractiveAction('celebrate');
      setActionCount(prev => prev + 2); // Count double click as 2 interactions
      
      // Create radiating hearts in a circle pattern
      const heartCount = 12;
      const newParticles = Array.from({ length: heartCount }, (_, i) => {
        const angle = (i / heartCount) * 2 * Math.PI;
        const distance = 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        return {
          id: Date.now() + i,
          emoji: ['💚', '💙', '💛', '🧡', '💜', '❤️'][i % 6],
          delay: i * 30,
          x,
          y,
        };
      });
      setParticles(newParticles);
      
      // Clear action after animation completes
      setTimeout(() => {
        setInteractiveAction(null);
      }, 1500);
      
      // Remove particles after animation
      setTimeout(() => {
        setParticles([]);
      }, 1200);
      
      setLastClickTime(0); // Reset to prevent triple-click detection
    } else {
      // Single click - random animation
      const actions = ['wave', 'jump', 'dance', 'spin', 'wiggle', 'bounce-high'];
      const randomIndex = Math.floor(Math.random() * actions.length);
      const selectedAction = actions[randomIndex];
      
      setInteractiveAction(selectedAction);
      setActionCount(prev => prev + 1);
      
      // Create particle effects (fewer for single click)
      const newParticles = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        emoji: ['✨', '⭐', '💫'][i],
        delay: i * 50,
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
      }));
      setParticles(newParticles);
      
      // Clear action after animation completes
      setTimeout(() => {
        setInteractiveAction(null);
      }, 1200);
      
      // Remove particles after animation
      setTimeout(() => {
        setParticles([]);
      }, 1000);
      
      setLastClickTime(currentTime);
    }
  };

  // Animation classes based on mood and interactive action
  const getAnimationClass = () => {
    // If user clicked, use interactive action
    if (interactiveAction) {
      return `animate-${interactiveAction}`;
    }
    
    // Otherwise use mood-based animation
    switch (moodExpression) {
      case 'happy':
        return 'animate-bounce-light';
      case 'calm':
        return 'animate-wave-gentle';
      case 'supportive':
        return 'animate-hug';
      case 'worried':
        return 'animate-worry';
      default:
        return 'animate-float';
    }
  };

  // Expression styling for SVG
  const getExpressionStyle = () => {
    switch (moodExpression) {
      case 'happy':
        return { transform: 'scale(1.1)', filter: 'brightness(1.1)' };
      case 'supportive':
        return { transform: 'scale(1.05)' };
      case 'worried':
        return { transform: 'scale(0.95)', opacity: 0.9 };
      default:
        return {};
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-[60] opacity-80 hover:opacity-100 transition-opacity duration-300">
      {/* Speech Bubble */}
      {showGreeting && (
        <div className="absolute bottom-full left-0 mb-2 animate-fade-in animate-fade-out pointer-events-auto z-[61]">
          <div className="bg-white dark:bg-dark-surface rounded-softer p-3 sm:p-4 shadow-lg border-2 border-calm-purple dark:border-accent-blue max-w-[180px] sm:max-w-[220px]">
            <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 font-semibold text-center">
              {getGreetingText(user.name)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
              You're doing amazing! How's your heart today? 💚
            </p>
            {/* Speech bubble tail */}
            <div className="absolute top-full left-6 sm:left-8 transform -translate-y-full">
              <div className="w-0 h-0 border-l-6 border-r-6 border-b-6 sm:border-l-8 sm:border-r-8 sm:border-b-8 border-transparent border-b-white dark:border-b-dark-surface"></div>
              <div className="absolute top-0 left-0 w-0 h-0 border-l-6 border-r-6 border-b-6 sm:border-l-8 sm:border-r-8 sm:border-b-8 border-transparent border-b-calm-purple dark:border-b-accent-blue transform translate-y-[1px]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Character Container - Clickable */}
      <div 
        className={`relative ${getAnimationClass()} cursor-pointer transition-transform hover:scale-105 active:scale-95`} 
        style={getExpressionStyle()}
        onClick={handleMoodyClick}
        title="Click me! 🎮"
      >
        {/* Particle Effects */}
        {particles.map((particle, index) => {
          const isRadiate = particles.length > 5; // Double-click creates more particles
          
          if (isRadiate) {
            // For radiating hearts - use a simple animation class
            return (
              <React.Fragment key={particle.id}>
                <style>{`
                  @keyframes radiate-heart-${particle.id} {
                    0% {
                      opacity: 1;
                      transform: translate(0px, 0px) scale(0.8) rotate(0deg);
                    }
                    50% {
                      opacity: 1;
                      transform: translate(${particle.x}px, ${particle.y}px) scale(1.3) rotate(90deg);
                    }
                    100% {
                      opacity: 0;
                      transform: translate(${particle.x * 1.5}px, ${particle.y * 1.5}px) scale(1.5) rotate(180deg);
                    }
                  }
                `}</style>
                <div
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    animation: `radiate-heart-${particle.id} 1.2s ease-out ${particle.delay}ms forwards`,
                  }}
                >
                  <span className="text-xl sm:text-2xl">{particle.emoji}</span>
                </div>
              </React.Fragment>
            );
          }
          
          // For single click particles
          return (
            <div
              key={particle.id}
              className="absolute top-1/2 left-1/2 pointer-events-none animate-particles"
              style={{
                animationDelay: `${particle.delay}ms`,
                transform: `translate(${particle.x}px, ${particle.y}px)`,
              }}
            >
              <span className="text-xl sm:text-2xl">{particle.emoji}</span>
            </div>
          );
        })}
        
        {/* Character SVG */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 pointer-events-auto">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Body (blob shape) */}
            <ellipse
              cx="60"
              cy="75"
              rx="35"
              ry="30"
              fill={moodExpression === 'supportive' ? '#FF8CC8' : moodExpression === 'worried' ? '#FFB3E6' : '#FFB3D9'}
              className="transition-all duration-300"
            />
            
            {/* Face circle */}
            <circle
              cx="60"
              cy="50"
              r="30"
              fill="#FFE6F2"
              className="transition-all duration-300"
            />
            
            {/* Eyes */}
            {moodExpression === 'worried' ? (
              <>
                {/* Worried eyes (slightly up) */}
                <path
                  d="M 48 42 Q 50 38 52 42"
                  stroke="#333"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 68 42 Q 70 38 72 42"
                  stroke="#333"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <circle cx="50" cy="45" r="4" fill="#333" />
                <circle cx="70" cy="45" r="4" fill="#333" />
              </>
            )}
            
            {/* Mouth based on expression */}
            {moodExpression === 'happy' || moodExpression === 'default' ? (
              <path
                d="M 45 55 Q 60 65 75 55"
                stroke="#333"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            ) : moodExpression === 'calm' ? (
              <path
                d="M 50 55 Q 60 60 70 55"
                stroke="#333"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            ) : moodExpression === 'supportive' ? (
              <path
                d="M 48 58 Q 60 63 72 58"
                stroke="#333"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            ) : (
              // Worried mouth (slightly down)
              <path
                d="M 45 58 Q 60 53 75 58"
                stroke="#333"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            )}
            
            {/* Cheeks (blush) - brighter for happy */}
            <ellipse
              cx="40"
              cy="55"
              rx="6"
              ry="4"
              fill={moodExpression === 'happy' ? '#FF8CC8' : '#FFB3D9'}
              opacity={moodExpression === 'happy' ? '0.6' : '0.4'}
              className="transition-all duration-300"
            />
            <ellipse
              cx="80"
              cy="55"
              rx="6"
              ry="4"
              fill={moodExpression === 'happy' ? '#FF8CC8' : '#FFB3D9'}
              opacity={moodExpression === 'happy' ? '0.6' : '0.4'}
              className="transition-all duration-300"
            />
            
            {/* Supportive hug effect - heart particles */}
            {moodExpression === 'supportive' && (
              <>
                <text
                  x="30"
                  y="35"
                  fontSize="16"
                  fill="#FF8CC8"
                  className="animate-heart-float"
                >
                  💙
                </text>
                <text
                  x="85"
                  y="40"
                  fontSize="14"
                  fill="#FF8CC8"
                  className="animate-heart-float-delayed"
                >
                  💙
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Floating name tag - more visible and clickable */}
        <div 
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-calm-purple/90 dark:bg-accent-blue/90 text-white text-xs sm:text-sm md:text-base px-3 py-1.5 rounded-softer whitespace-nowrap pointer-events-auto opacity-90 hover:opacity-100 transition-opacity shadow-md border border-white/20 dark:border-gray-700/30 cursor-pointer"
          onClick={handleMoodyClick}
          title="Click to interact! 🎮"
        >
          <span className="font-bold tracking-wide">Moody</span> <span className="text-soft-green">💚</span>
          {actionCount > 0 && (
            <span className="ml-1 text-xs opacity-75">({actionCount})</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CuteAssistant;

