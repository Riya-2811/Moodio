import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NegativeMoodSupportModal from './NegativeMoodSupportModal';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Smart Suggestions Component
 * Shows personalized recommendations based on detected mood
 */
const SmartSuggestions = ({ detectedMood, onClose, sideBySide = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [showNegativeModal, setShowNegativeModal] = useState(false);

  // Positive moods that get music recommendations
  const positiveMoods = ['happy', 'calm', 'excited'];

  // Negative moods that get both music and exercises
  const negativeMoods = ['sad', 'angry', 'stressed', 'anxious', 'tired', 'lonely', 'overwhelmed'];

  const fetchMoodHistory = useCallback(async () => {
    if (!user) {
      setMoodHistory([]);
      return;
    }

    try {
      // Get user ID from auth context
      const userId = user.id || user.userId || user.email;
      const response = await api.get(`/moods?userId=${userId}`);
      if (response.data.success) {
        setMoodHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching mood history:', error);
      setMoodHistory([]);
    }
  }, [user]);

  // Fetch mood history when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchMoodHistory();
    }
  }, [user, fetchMoodHistory]);

  useEffect(() => {
    if (detectedMood) {
      // Show appropriate recommendations based on mood
      if (negativeMoods.includes(detectedMood.mood)) {
        setShowNegativeModal(true);
      }
      // Positive moods no longer show music recommendations modal
    }
  }, [detectedMood]);

  if (!detectedMood) return null;

  const isNegative = negativeMoods.includes(detectedMood.mood);

  return (
    <>
      {/* Negative Mood Support Modal */}
      {isNegative && showNegativeModal && (
        <NegativeMoodSupportModal
          mood={detectedMood.mood}
          onClose={() => {
            setShowNegativeModal(false);
            if (onClose) onClose(); // Call parent's onClose to clean up
          }}
          onStartBreathing={() => {
            if (onClose) onClose(); // Clean up when navigating
            navigate('/exercises');
          }}
          onPlayMusic={() => {
            // This callback is handled by the modal itself
          }}
          sideBySide={sideBySide}
        />
      )}


      {/* Dynamic Mood Trend Analysis */}
      {moodHistory.length > 0 && (() => {
        // Calculate mood statistics
        const moodCounts = {};
        const recentMoods = moodHistory.slice(0, 7); // Last 7 entries
        const allMoods = moodHistory;
        
        // Count each mood type
        allMoods.forEach(entry => {
          const mood = entry.moodType || entry.mood;
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        // Find most common mood
        const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
          moodCounts[a] > moodCounts[b] ? a : b, Object.keys(moodCounts)[0]
        );
        
        // Calculate percentages
        const totalEntries = allMoods.length;
        const positiveCount = allMoods.filter(m => 
          positiveMoods.includes(m.moodType || m.mood)
        ).length;
        const negativeCount = allMoods.filter(m => 
          negativeMoods.includes(m.moodType || m.mood)
        ).length;
        const neutralCount = totalEntries - positiveCount - negativeCount;
        
        const positivePercent = Math.round((positiveCount / totalEntries) * 100);
        const negativePercent = Math.round((negativeCount / totalEntries) * 100);
        const neutralPercent = Math.round((neutralCount / totalEntries) * 100);
        
        // Detect trend (comparing last 7 vs previous 7)
        let trendDirection = 'stable';
        let trendMessage = '';
        if (allMoods.length >= 14) {
          const recent7 = allMoods.slice(0, 7);
          const previous7 = allMoods.slice(7, 14);
          
          const recentPositive = recent7.filter(m => 
            positiveMoods.includes(m.moodType || m.mood)
          ).length;
          const previousPositive = previous7.filter(m => 
            positiveMoods.includes(m.moodType || m.mood)
          ).length;
          
          if (recentPositive > previousPositive) {
            trendDirection = 'improving';
            trendMessage = 'Your mood has been improving recently! 🌟';
          } else if (recentPositive < previousPositive) {
            trendDirection = 'declining';
            trendMessage = 'We notice some challenging moods. Remember, support is available. 💙';
          } else {
            trendDirection = 'stable';
            trendMessage = 'Your mood patterns have been relatively stable.';
          }
        }
        
        // Get mood emoji helper
        const getMoodEmoji = (mood) => {
          const emojiMap = {
            happy: '😊', sad: '😢', angry: '😠', stressed: '😰',
            anxious: '😟', calm: '😌', excited: '🎉', grateful: '🙏',
            crying: '😭', other: '😐'
          };
          return emojiMap[mood] || '😐';
        };
        
        // Get mood label helper
        const getMoodLabel = (mood) => {
          return mood.charAt(0).toUpperCase() + mood.slice(1);
        };
        
        // Generate personalized insight
        let insight = '';
        if (negativePercent > 50) {
          insight = 'You\'ve been experiencing some challenging moods lately. Remember, it\'s okay to reach out for support.';
        } else if (positivePercent > 60) {
          insight = 'Great to see you\'re experiencing mostly positive moods! Keep up the self-care.';
        } else if (trendDirection === 'improving') {
          insight = 'Your mood patterns are looking better! Keep doing what makes you feel good.';
        } else if (trendDirection === 'declining') {
          insight = 'We notice some challenging moods. Consider trying some exercises or music to help.';
        } else {
          insight = 'Your mood patterns show a good balance. Continue tracking to maintain awareness.';
        }
        
        // Get top 3 moods
        const sortedMoods = Object.entries(moodCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        
        return (
          <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">📈</div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Your Mood Trends
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Based on your recent mood entries, we're here to support you.
            </p>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Total Entries */}
              <div className="bg-light-gray dark:bg-dark-bg rounded-soft p-4">
                <div className="text-2xl font-bold text-calm-purple dark:text-accent-blue">
                  {totalEntries}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Entries
                </div>
              </div>
              
              {/* Most Common Mood */}
              <div className="bg-light-gray dark:bg-dark-bg rounded-soft p-4">
                <div className="text-2xl mb-1">
                  {getMoodEmoji(mostCommonMood)}
                </div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {getMoodLabel(mostCommonMood)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {moodCounts[mostCommonMood]} times ({Math.round((moodCounts[mostCommonMood] / totalEntries) * 100)}%)
                </div>
              </div>
              
              {/* Trend Indicator */}
              <div className="bg-light-gray dark:bg-dark-bg rounded-soft p-4">
                <div className="text-2xl mb-1">
                  {trendDirection === 'improving' ? '📈' : trendDirection === 'declining' ? '📉' : '➡️'}
                </div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">
                  {trendDirection}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {allMoods.length >= 14 ? 'Last 7 vs previous 7' : 'Need more data'}
                </div>
              </div>
            </div>
            
            {/* Mood Breakdown */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Mood Breakdown
              </h4>
              <div className="space-y-2">
                {/* Positive Moods */}
                {positivePercent > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Positive</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">{positivePercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-soft-green dark:bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${positivePercent}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Neutral Moods */}
                {neutralPercent > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Neutral</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">{neutralPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gray-400 dark:bg-gray-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${neutralPercent}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Negative Moods */}
                {negativePercent > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Challenging</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">{negativePercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-warm-pink dark:bg-accent-pink h-2 rounded-full transition-all duration-500"
                        style={{ width: `${negativePercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Top Moods */}
            {sortedMoods.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Most Frequent Moods
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sortedMoods.map(([mood, count], index) => (
                    <div 
                      key={mood}
                      className="flex items-center gap-2 bg-light-gray dark:bg-dark-bg rounded-soft px-3 py-2"
                    >
                      <span className="text-lg">{getMoodEmoji(mood)}</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {getMoodLabel(mood)}: {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Trend Message */}
            {trendMessage && (
              <div className="mb-4 p-3 rounded-soft bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {trendMessage}
                </p>
              </div>
            )}
            
            {/* Personalized Insight */}
            <div className="p-3 rounded-soft bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  {insight}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Persistent Negative Mood Detection - Therapist Suggestion */}
      {moodHistory.length > 0 && (() => {
        // Check for persistent negative moods
        const recentMoods = moodHistory.slice(0, 10); // Last 10 entries
        const recentNegativeCount = recentMoods.filter(m => 
          negativeMoods.includes(m.moodType || m.mood)
        ).length;
        const recentNegativePercent = (recentNegativeCount / recentMoods.length) * 100;
        
        // Check overall negative percentage
        const allMoods = moodHistory;
        const totalNegativeCount = allMoods.filter(m => 
          negativeMoods.includes(m.moodType || m.mood)
        ).length;
        const overallNegativePercent = (totalNegativeCount / allMoods.length) * 100;
        
        // Check if last 5 entries are all negative
        const last5AllNegative = moodHistory.slice(0, 5).every(m => 
          negativeMoods.includes(m.moodType || m.mood)
        );
        
        // Show therapist suggestion if:
        // 1. Last 5 entries are all negative, OR
        // 2. Last 10 entries are >70% negative, OR
        // 3. Overall negative percentage is >65% and user has at least 10 entries
        const shouldShowTherapistSuggestion = 
          last5AllNegative || 
          (recentMoods.length >= 7 && recentNegativePercent >= 70) ||
          (allMoods.length >= 10 && overallNegativePercent >= 65);
        
        if (shouldShowTherapistSuggestion) {
          return (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-softer p-6 shadow-lg mb-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">💙</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    We're Here to Support You
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    We've noticed you've been experiencing some challenging moods recently. 
                    Remember, it's completely okay to seek support, and reaching out for help 
                    is a sign of strength, not weakness.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                    Sometimes, talking with a professional therapist can provide valuable 
                    insights and support during difficult times. Our team can help connect 
                    you with licensed therapists who understand what you're going through.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate('/therapist')}
                      className="px-6 py-3 rounded-softer bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white font-semibold hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      💬 Explore Therapist Options
                    </button>
                    <button
                      onClick={() => navigate('/exercises')}
                      className="px-6 py-3 rounded-softer bg-white dark:bg-dark-surface text-purple-600 dark:text-purple-400 font-semibold border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
                    >
                      🧘 Try Calming Exercises
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
                    This is a gentle suggestion based on your mood patterns. You're in control, 
                    and we're here to support you in whatever way feels right for you.
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}
    </>
  );
};

export default SmartSuggestions;

