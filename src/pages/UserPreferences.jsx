import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * User Preferences Page Component
 * Collects user-specific inputs for personalized music recommendations
 * Appears immediately after signup
 */
const UserPreferences = () => {
  const navigate = useNavigate();
  const { user, updatePreferences } = useAuth();
  
  // Form state
  const [musicGenres, setMusicGenres] = useState([]);
  const [otherGenre, setOtherGenre] = useState('');
  const [listeningTimes, setListeningTimes] = useState([]);
  const [moods, setMoods] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [intensity, setIntensity] = useState('medium');
  const [moodBasedRecommendations, setMoodBasedRecommendations] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Available options
  const genreOptions = ['Pop', 'Lo-fi', 'Bollywood', 'Indie', 'Classical', 'Rock', 'R&B', 'Hip-Hop', 'EDM', 'Instrumental'];
  const listeningTimeOptions = ['Studying', 'Relaxing', 'Traveling', 'Gym/Workout', 'Before Sleep', 'When Sad', 'When Happy', 'Randomly'];
  const moodOptions = ['Calm', 'Focused', 'Happy', 'Energetic', 'Nostalgic', 'Motivated', 'Romantic', 'Sad', 'Uplift Me'];
  const languageOptions = ['English', 'Hindi', 'Punjabi', 'Korean', 'Tamil', 'Telugu', 'Instrumental only'];

  /**
   * Toggle selection for multi-select fields
   */
  const toggleSelection = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Prepare preferences data
      const preferencesData = {
        preferences: {
          musicGenres: otherGenre && !musicGenres.includes('Other') 
            ? [...musicGenres, 'Other'] 
            : musicGenres,
          otherGenre: otherGenre || undefined,
          listeningTimes,
          moods,
          languages,
          intensity,
          moodBasedRecommendations,
          additionalInfo: additionalInfo.trim() || undefined,
        }
      };

      // Save preferences
      const result = await updatePreferences(preferencesData);

      if (result.success) {
        // Redirect to dashboard
        navigate('/');
      } else {
        setError(result.error || 'Failed to save preferences. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error saving preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle skip - redirect to dashboard
   */
  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue via-calm-purple to-soft-green dark:bg-dark-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            Tell us about your vibe ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This helps Moodio personalize your music and mood suggestions.
          </p>
        </div>

        {/* Preferences Form */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-6 sm:p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Music Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What type of music do you enjoy?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {genreOptions.map((genre) => (
                  <label
                    key={genre}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-soft hover:bg-gray-50 dark:hover:bg-dark-surface-elevated transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={musicGenres.includes(genre)}
                      onChange={() => toggleSelection(musicGenres, setMusicGenres, genre)}
                      className="w-4 h-4 text-calm-purple dark:text-accent-blue focus:ring-calm-purple dark:focus:ring-accent-blue rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{genre}</span>
                  </label>
                ))}
                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-soft hover:bg-gray-50 dark:hover:bg-dark-surface-elevated transition-colors">
                  <input
                    type="checkbox"
                    checked={musicGenres.includes('Other')}
                    onChange={() => toggleSelection(musicGenres, setMusicGenres, 'Other')}
                    className="w-4 h-4 text-calm-purple dark:text-accent-blue focus:ring-calm-purple dark:focus:ring-accent-blue rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Other</span>
                </label>
              </div>
              {musicGenres.includes('Other') && (
                <input
                  type="text"
                  value={otherGenre}
                  onChange={(e) => setOtherGenre(e.target.value)}
                  placeholder="Specify other genre..."
                  className="mt-3 w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent transition-all duration-300"
                  maxLength={50}
                />
              )}
            </div>

            {/* Listening Times */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                When do you usually listen to music?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {listeningTimeOptions.map((time) => (
                  <label
                    key={time}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-soft hover:bg-gray-50 dark:hover:bg-dark-surface-elevated transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={listeningTimes.includes(time)}
                      onChange={() => toggleSelection(listeningTimes, setListeningTimes, time)}
                      className="w-4 h-4 text-calm-purple dark:text-accent-blue focus:ring-calm-purple dark:focus:ring-accent-blue rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{time}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Moods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Which moods do you want Moodio to focus on?
              </label>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => toggleSelection(moods, setMoods, mood)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      moods.includes(mood)
                        ? 'bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-dark-surface-elevated text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Preferred languages
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {languageOptions.map((language) => (
                  <label
                    key={language}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-soft hover:bg-gray-50 dark:hover:bg-dark-surface-elevated transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={languages.includes(language)}
                      onChange={() => toggleSelection(languages, setLanguages, language)}
                      className="w-4 h-4 text-calm-purple dark:text-accent-blue focus:ring-calm-purple dark:focus:ring-accent-blue rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{language}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Intensity Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How energetic do you like your music?
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={intensity === 'low' ? 0 : intensity === 'medium' ? 1 : 2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setIntensity(val === 0 ? 'low' : val === 1 ? 'medium' : 'high');
                  }}
                  className="w-full h-2 bg-gray-200 dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-calm-purple dark:accent-accent-blue"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm font-medium text-calm-purple dark:text-accent-blue">
                    {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mood-Based Recommendations Toggle */}
            <div>
              <label className="flex items-center justify-between cursor-pointer p-4 rounded-soft bg-gray-50 dark:bg-dark-surface-elevated hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Do you want Moodio to recommend music based on your daily mood?
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={moodBasedRecommendations}
                    onChange={(e) => setMoodBasedRecommendations(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-14 h-7 rounded-full transition-colors duration-300 ${
                      moodBasedRecommendations
                        ? 'bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600'
                        : 'bg-gray-300 dark:bg-dark-border'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${
                        moodBasedRecommendations ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              </label>
            </div>

            {/* Additional Info */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Anything else we should know about your taste?
              </label>
              <textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setAdditionalInfo(e.target.value);
                  }
                }}
                rows={4}
                maxLength={200}
                placeholder="Share any additional preferences or details..."
                className="w-full px-4 py-3 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent transition-all duration-300 resize-none"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500 text-right">
                {additionalInfo.length}/200
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-soft bg-warm-pink dark:bg-dark-surface text-gray-800 dark:text-gray-100 text-sm text-center">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 px-6 py-4 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  isLoading
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 hover:from-warm-pink hover:to-calm-purple'
                }`}
              >
                {isLoading ? 'Saving...' : 'Save & Continue'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={isLoading}
                className="px-6 py-4 rounded-softer font-semibold text-gray-700 dark:text-gray-300 hover:text-calm-purple dark:hover:text-accent-blue transition-colors duration-300"
              >
                Skip for Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;

