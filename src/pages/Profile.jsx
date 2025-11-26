import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';
import { useToast } from '../utils/Toast';
import api from '../utils/api';
import { startConsecutiveNotifications } from '../utils/NotificationService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * Profile Page Component
 * User profile and preferences management
 */
const Profile = () => {
  const navigate = useNavigate();
  const { user, preferences, updatePreferences, fetchPreferences } = useAuth();
  const { moodHistory, lastMood } = useMood();
  const { showToast, ToastContainer } = useToast();
  const [moodDataForCharts, setMoodDataForCharts] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    personalInfo: {
      age: '',
      gender: '',
      country: '',
    },
    musicPreferences: {
      favoriteGenres: [],
      preferredPlatform: 'spotify',
      preferenceType: 'both',
    },
    wellnessPreferences: {
      exerciseTypes: [],
      negativeMoodAlertSensitivity: 'medium',
      dailyGoal: 'Track mood daily and maintain wellness',
    },
    notificationPreferences: {
      thoughtOfTheDay: true,
      reminders: true,
      moodTrackingReminder: true,
      personalizedCareNotifications: true,
      moodDetectionReminders: true,
      wellbeingReminders: true,
      supportiveReminders: true,
    },
    appSettings: {
      language: 'en',
      appTone: 'friendly',
    },
    assistantSettings: {
      avatar: 'default',
      greetingTone: 'cheerful',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences when component mounts or preferences change
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const userId = user.id || user.userId || user.email;
        
        // Fetch latest preferences from backend
        const response = await api.get(`/user/preferences?userId=${userId}`);
        
        if (response.data && response.data.success) {
          const backendPrefs = response.data.data;
          
          // Get signup preferences (user.preferences)
          const signupPrefs = backendPrefs.preferences || {};
          
          // Helper function to normalize genre names (Pop -> pop, Bollywood -> bollywood)
          const normalizeGenre = (genre) => {
            if (!genre) return '';
            const genreMap = {
              'Pop': 'pop',
              'Lo-fi': 'lo-fi',
              'Bollywood': 'bollywood',
              'Indie': 'indie',
              'Classical': 'classical',
              'Rock': 'rock',
              'R&B': 'r&b',
              'Hip-Hop': 'hip-hop',
              'EDM': 'electronic',
              'Instrumental': 'instrumental',
            };
            return genreMap[genre] || genre.toLowerCase();
          };
          
          // Map signup preferences to profile format
          const mappedMusicGenres = signupPrefs.musicGenres 
            ? signupPrefs.musicGenres.map(g => normalizeGenre(g)).filter(g => g)
            : [];
          
          // Merge signup preferences with existing preferences
          const mergedMusicGenres = [
            ...new Set([
              ...mappedMusicGenres,
              ...(backendPrefs.musicPreferences?.favoriteGenres || [])
            ])
          ];
          
          setFormData({
            personalInfo: {
              age: backendPrefs.personalInfo?.age || '',
              gender: backendPrefs.personalInfo?.gender || '',
              country: backendPrefs.personalInfo?.country || '',
            },
            musicPreferences: {
              favoriteGenres: mergedMusicGenres.length > 0 ? mergedMusicGenres : (backendPrefs.musicPreferences?.favoriteGenres || []),
              preferredPlatform: backendPrefs.musicPreferences?.preferredPlatform || signupPrefs.preferredPlatform || 'spotify',
              preferenceType: backendPrefs.musicPreferences?.preferenceType || 'both',
            },
            wellnessPreferences: {
              exerciseTypes: backendPrefs.wellnessPreferences?.exerciseTypes || [],
              negativeMoodAlertSensitivity: backendPrefs.wellnessPreferences?.negativeMoodAlertSensitivity || signupPrefs.intensity || 'medium',
              dailyGoal: backendPrefs.wellnessPreferences?.dailyGoal || 'Track mood daily and maintain wellness',
            },
            notificationPreferences: {
              thoughtOfTheDay: backendPrefs.notificationPreferences?.thoughtOfTheDay !== false,
              reminders: backendPrefs.notificationPreferences?.reminders !== false,
              moodTrackingReminder: backendPrefs.notificationPreferences?.moodTrackingReminder !== false,
              personalizedCareNotifications: backendPrefs.notificationPreferences?.personalizedCareNotifications !== false,
              moodDetectionReminders: backendPrefs.notificationPreferences?.moodDetectionReminders !== false,
              wellbeingReminders: backendPrefs.notificationPreferences?.wellbeingReminders !== false,
              supportiveReminders: backendPrefs.notificationPreferences?.supportiveReminders !== false,
            },
            appSettings: {
              language: backendPrefs.appSettings?.language || 'en',
              appTone: backendPrefs.appSettings?.appTone || 'friendly',
            },
            assistantSettings: {
              avatar: backendPrefs.assistantSettings?.avatar || 'default',
              greetingTone: backendPrefs.assistantSettings?.greetingTone || 'cheerful',
            },
          });
        } else if (preferences) {
          // Fallback to context preferences if API call fails
          setFormData({
            personalInfo: {
              age: preferences.personalInfo?.age || '',
              gender: preferences.personalInfo?.gender || '',
              country: preferences.personalInfo?.country || '',
            },
            musicPreferences: {
              favoriteGenres: preferences.musicPreferences?.favoriteGenres || [],
              preferredPlatform: preferences.musicPreferences?.preferredPlatform || 'spotify',
              preferenceType: preferences.musicPreferences?.preferenceType || 'both',
            },
            wellnessPreferences: {
              exerciseTypes: preferences.wellnessPreferences?.exerciseTypes || [],
              negativeMoodAlertSensitivity: preferences.wellnessPreferences?.negativeMoodAlertSensitivity || 'medium',
              dailyGoal: preferences.wellnessPreferences?.dailyGoal || 'Track mood daily and maintain wellness',
            },
            notificationPreferences: {
              thoughtOfTheDay: preferences.notificationPreferences?.thoughtOfTheDay !== false,
              reminders: preferences.notificationPreferences?.reminders !== false,
              moodTrackingReminder: preferences.notificationPreferences?.moodTrackingReminder !== false,
              personalizedCareNotifications: preferences.notificationPreferences?.personalizedCareNotifications !== false,
              moodDetectionReminders: preferences.notificationPreferences?.moodDetectionReminders !== false,
              wellbeingReminders: preferences.notificationPreferences?.wellbeingReminders !== false,
              supportiveReminders: preferences.notificationPreferences?.supportiveReminders !== false,
            },
            appSettings: {
              language: preferences.appSettings?.language || 'en',
              appTone: preferences.appSettings?.appTone || 'friendly',
            },
            assistantSettings: {
              avatar: preferences.assistantSettings?.avatar || 'default',
              greetingTone: preferences.assistantSettings?.greetingTone || 'cheerful',
            },
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        // If API fails, still try to use context preferences
    if (preferences) {
      setFormData({
        personalInfo: {
          age: preferences.personalInfo?.age || '',
          gender: preferences.personalInfo?.gender || '',
          country: preferences.personalInfo?.country || '',
        },
        musicPreferences: {
          favoriteGenres: preferences.musicPreferences?.favoriteGenres || [],
          preferredPlatform: preferences.musicPreferences?.preferredPlatform || 'spotify',
          preferenceType: preferences.musicPreferences?.preferenceType || 'both',
        },
        wellnessPreferences: {
          exerciseTypes: preferences.wellnessPreferences?.exerciseTypes || [],
          negativeMoodAlertSensitivity: preferences.wellnessPreferences?.negativeMoodAlertSensitivity || 'medium',
          dailyGoal: preferences.wellnessPreferences?.dailyGoal || 'Track mood daily and maintain wellness',
        },
        notificationPreferences: {
          thoughtOfTheDay: preferences.notificationPreferences?.thoughtOfTheDay !== false,
          reminders: preferences.notificationPreferences?.reminders !== false,
          moodTrackingReminder: preferences.notificationPreferences?.moodTrackingReminder !== false,
          personalizedCareNotifications: preferences.notificationPreferences?.personalizedCareNotifications !== false,
          moodDetectionReminders: preferences.notificationPreferences?.moodDetectionReminders !== false,
          wellbeingReminders: preferences.notificationPreferences?.wellbeingReminders !== false,
          supportiveReminders: preferences.notificationPreferences?.supportiveReminders !== false,
        },
        appSettings: {
          language: preferences.appSettings?.language || 'en',
          appTone: preferences.appSettings?.appTone || 'friendly',
        },
        assistantSettings: {
          avatar: preferences.assistantSettings?.avatar || 'default',
          greetingTone: preferences.assistantSettings?.greetingTone || 'cheerful',
        },
      });
    }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadPreferences();
    }
  }, [user, preferences]);

  // Start consecutive notifications system (every 2 minutes)
  useEffect(() => {
    if (!user) return;
    const cleanup = startConsecutiveNotifications(showToast, preferences, lastMood);
    return cleanup;
  }, [showToast, user, preferences, lastMood]);

  /**
   * Handle form input changes
   */
  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  /**
   * Handle checkbox changes
   */
  const handleCheckboxChange = (section, field, checked) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked,
      },
    }));
  };

  /**
   * Handle multi-select changes (genres, exercise types)
   */
  const handleMultiSelect = (section, field, value, checked) => {
    setFormData((prev) => {
      const currentArray = prev[section][field] || [];
      const newArray = checked
        ? [...currentArray, value]
        : currentArray.filter((item) => item !== value);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray,
        },
      };
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!user) {
        showToast('Please log in to save preferences', 'error', 3000);
        setIsSaving(false);
        return;
      }

      const userId = user.id || user.userId || user.email;
      
      // Prepare preferences data in the format expected by backend
      // Clean up empty values before sending
      const cleanedPersonalInfo = {
        ...formData.personalInfo,
        // Only include gender if it's not empty
        gender: formData.personalInfo.gender && formData.personalInfo.gender.trim() 
          ? formData.personalInfo.gender 
          : undefined,
        // Only include age if it's a valid number
        age: formData.personalInfo.age && formData.personalInfo.age > 0
          ? formData.personalInfo.age
          : undefined,
        // Only include country if it's not empty
        country: formData.personalInfo.country && formData.personalInfo.country.trim()
          ? formData.personalInfo.country
          : undefined,
      };

      // Filter out undefined values
      Object.keys(cleanedPersonalInfo).forEach(key => {
        if (cleanedPersonalInfo[key] === undefined || cleanedPersonalInfo[key] === '') {
          delete cleanedPersonalInfo[key];
        }
      });

      const preferencesData = {
        personalInfo: cleanedPersonalInfo,
        musicPreferences: {
          ...formData.musicPreferences,
          // Ensure favoriteGenres is an array and filter out invalid values
          favoriteGenres: (formData.musicPreferences.favoriteGenres || []).filter(g => g),
        },
        wellnessPreferences: {
          ...formData.wellnessPreferences,
          // Ensure exerciseTypes is an array
          exerciseTypes: (formData.wellnessPreferences.exerciseTypes || []).filter(e => e),
        },
        notificationPreferences: formData.notificationPreferences,
        appSettings: formData.appSettings,
        assistantSettings: formData.assistantSettings,
      };

      // Also update signup preferences format for music recommendations
      // Convert genre format: pop -> Pop, bollywood -> Bollywood
      const denormalizeGenre = (genre) => {
        if (!genre) return '';
        const genreMap = {
          'pop': 'Pop',
          'lo-fi': 'Lo-fi',
          'bollywood': 'Bollywood',
          'indie': 'Indie',
          'classical': 'Classical',
          'rock': 'Rock',
          'r&b': 'R&B',
          'hip-hop': 'Hip-Hop',
          'electronic': 'EDM',
          'instrumental': 'Instrumental',
        };
        return genreMap[genre] || genre.charAt(0).toUpperCase() + genre.slice(1);
      };

      const preferencesMusicGenres = formData.musicPreferences.favoriteGenres
        .map(g => denormalizeGenre(g))
        .filter(g => g);

      // Update signup preferences format (for music recommendations)
      preferencesData.preferences = {
        musicGenres: preferencesMusicGenres,
        languages: [], // Will be populated from profile if needed
        moods: [], // Will be populated from profile if needed
        intensity: formData.wellnessPreferences.negativeMoodAlertSensitivity || 'medium',
        moodBasedRecommendations: true,
      };

      // Save preferences using AuthContext updatePreferences (which handles both API call and state update)
      const result = await updatePreferences(preferencesData);
      
      if (result.success) {
        showToast('Preferences saved successfully! 😊', 'success', 3000);
        
        // Refresh preferences from backend to ensure all components get updated data
        if (fetchPreferences) {
          await fetchPreferences(userId);
        }
      } else {
        showToast(result.error || 'Failed to save preferences', 'error', 3000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToast('Failed to save preferences. Please try again.', 'error', 3000);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Export mood data as CSV
   */
  const exportToCSV = () => {
    const historyData = moodHistory.length > 0 ? moodHistory : moodDataForCharts;
    if (!historyData || historyData.length === 0) {
      showToast('No mood data to export', 'info', 2000);
      return;
    }

    // Create CSV content
    const headers = ['Date', 'Mood', 'Emotion', 'Confidence', 'Detection Method'];
    const rows = historyData.map((entry) => [
      new Date(entry.timestamp || entry.date).toLocaleDateString(),
      entry.mood || entry.moodType,
      entry.emotion || 'N/A',
      entry.confidence ? (entry.confidence * 100).toFixed(1) + '%' : 'N/A',
      entry.detectionMethod || 'manual',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moodio-mood-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    showToast('Mood data exported successfully! 📊', 'success', 2000);
  };

  /**
   * Fetch mood history from API for charts
   */
  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (!user) return;
      
      try {
        const userId = user.id || user.userId || user.email;
        if (!userId) {
          console.warn('No userId available for fetching mood history');
          return;
        }
        
        const response = await api.get(`/moods?userId=${userId}`);
        if (response.data.success) {
          setMoodDataForCharts(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching mood history:', error);
        // Don't show error to user, just log it
      }
    };
    fetchMoodHistory();
  }, [user]);

  /**
   * Prepare mood trends chart data
   */
  const prepareMoodChartData = () => {
    const historyData = moodHistory.length > 0 ? moodHistory : moodDataForCharts;
    if (!historyData || historyData.length === 0) {
      return null;
    }

    // Get last 30 days of mood data
    const last30Days = historyData
      .slice(0, 30)
      .reverse()
      .map((entry) => ({
        date: new Date(entry.timestamp || entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry.mood || entry.moodType,
      }));

    const labels = last30Days.map((entry) => entry.date);
    const moodCounts = {};
    last30Days.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    return {
      labels,
      moodCounts,
    };
  };

  const chartData = prepareMoodChartData();

  // Mood distribution chart data
  const moodDistributionData = chartData
    ? {
        labels: Object.keys(chartData.moodCounts),
        datasets: [
          {
            data: Object.values(chartData.moodCounts),
            backgroundColor: [
              '#FFB3D9',
              '#C8E6C9',
              '#B39BC8',
              '#F8BBD0',
              '#E3F2FD',
              '#FFD699',
              '#FFCCCB',
              '#DDA0DD',
            ],
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      }
    : null;

  // Mood trends line chart data
  const moodTrendsData = chartData
    ? {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Mood Entries',
            data: chartData.labels.map(() => 1), // Simple count per day
            borderColor: '#B39BC8',
            backgroundColor: 'rgba(179, 155, 200, 0.1)',
            tension: 0.4,
          },
        ],
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sky-blue dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-blue dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Profile & Preferences 👤
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Customize your Moodio experience
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.personalInfo.age}
                  onChange={(e) => handleChange('personalInfo', 'age', parseInt(e.target.value) || '')}
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => handleChange('personalInfo', 'gender', e.target.value)}
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.personalInfo.country}
                onChange={(e) => handleChange('personalInfo', 'country', e.target.value)}
                placeholder="Enter your country"
                className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Music Preferences Section */}
          <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              🎵 Music Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favorite Genres (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['pop', 'lo-fi', 'bollywood', 'indie', 'classical', 'rock', 'r&b', 'hip-hop', 'electronic', 'instrumental', 'country', 'folk', 'jazz', 'reggae', 'metal', 'blues'].map((genre) => (
                    <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.musicPreferences.favoriteGenres.includes(genre)}
                        onChange={(e) => handleMultiSelect('musicPreferences', 'favoriteGenres', genre, e.target.checked)}
                        className="rounded border-gray-300 text-calm-purple focus:ring-calm-purple"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{genre === 'r&b' ? 'R&B' : genre === 'lo-fi' ? 'Lo-fi' : genre.charAt(0).toUpperCase() + genre.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Platform
                  </label>
                  <select
                    value={formData.musicPreferences.preferredPlatform}
                    onChange={(e) => handleChange('musicPreferences', 'preferredPlatform', e.target.value)}
                    className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                  >
                    <option value="spotify">Spotify</option>
                    <option value="youtube">YouTube</option>
                    <option value="apple-music">Apple Music</option>
                    <option value="soundcloud">SoundCloud</option>
                    <option value="any">Any Platform</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Music Type
                  </label>
                  <select
                    value={formData.musicPreferences.preferenceType}
                    onChange={(e) => handleChange('musicPreferences', 'preferenceType', e.target.value)}
                    className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                  >
                    <option value="with-lyrics">With Lyrics</option>
                    <option value="instrumental">Instrumental</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Wellness Preferences Section */}
          <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              🧘 Wellness Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Exercise Types (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['breathing', 'meditation', 'yoga', 'stretching', 'cardio', 'strength', 'walking', 'other'].map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wellnessPreferences.exerciseTypes.includes(type)}
                        onChange={(e) => handleMultiSelect('wellnessPreferences', 'exerciseTypes', type, e.target.checked)}
                        className="rounded border-gray-300 text-calm-purple focus:ring-calm-purple"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Negative Mood Alert Sensitivity
                  </label>
                  <select
                    value={formData.wellnessPreferences.negativeMoodAlertSensitivity}
                    onChange={(e) => handleChange('wellnessPreferences', 'negativeMoodAlertSensitivity', e.target.value)}
                    className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Goal
                </label>
                <textarea
                  value={formData.wellnessPreferences.dailyGoal}
                  onChange={(e) => handleChange('wellnessPreferences', 'dailyGoal', e.target.value)}
                  rows="3"
                  placeholder="What's your daily wellness goal?"
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences Section */}
          <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              🔔 Notification Preferences
            </h2>
            <div className="space-y-3">
              {[
                { key: 'thoughtOfTheDay', label: 'Thought of the Day', description: 'Daily inspirational thoughts and quotes' },
                { key: 'reminders', label: 'Daily Reminders', description: 'General daily wellness reminders' },
                { key: 'moodTrackingReminder', label: 'Mood Tracking Reminders', description: 'Reminders to track your mood regularly' },
                { key: 'personalizedCareNotifications', label: 'Personalized Care Notifications', description: 'Sweet, caring messages every 2 minutes' },
                { key: 'moodDetectionReminders', label: 'Mood Detection Reminders', description: 'Reminders to use mood detection feature' },
                { key: 'wellbeingReminders', label: 'Well-being Reminders', description: 'Reminders for self-care and wellness activities' },
                { key: 'supportiveReminders', label: 'Supportive Reminders', description: 'Encouraging and supportive messages throughout the day' },
              ].map((item) => (
                <div key={item.key} className="flex items-start space-x-3 p-3 rounded-soft hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences[item.key]}
                    onChange={(e) => handleCheckboxChange('notificationPreferences', item.key, e.target.checked)}
                    className="rounded border-gray-300 text-calm-purple focus:ring-calm-purple w-5 h-5 mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium block">{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">{item.description}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language and App Tone Section */}
          <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              🌐 Language & App Tone
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={formData.appSettings.language}
                  onChange={(e) => handleChange('appSettings', 'language', e.target.value)}
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  App Tone
                </label>
                <select
                  value={formData.appSettings.appTone}
                  onChange={(e) => handleChange('appSettings', 'appTone', e.target.value)}
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="supportive">Supportive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assistant Customization Section */}
          <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              🤖 Assistant Customization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar Style
                </label>
                <select
                  value={formData.assistantSettings.avatar}
                  onChange={(e) => handleChange('assistantSettings', 'avatar', e.target.value)}
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                >
                  <option value="default">Default (Moody)</option>
                  <option value="cute">Cute</option>
                  <option value="professional">Professional</option>
                  <option value="energetic">Energetic</option>
                  <option value="calm">Calm</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Greeting Tone
                </label>
                <select
                  value={formData.assistantSettings.greetingTone}
                  onChange={(e) => handleChange('assistantSettings', 'greetingTone', e.target.value)}
                  className="w-full px-4 py-2 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100"
                >
                  <option value="cheerful">Cheerful</option>
                  <option value="warm">Warm</option>
                  <option value="calm">Calm</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="gentle">Gentle</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mood Trends Charts */}
          {chartData && (
            <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                📊 Mood Trends
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                    Mood Distribution
                  </h3>
                  {moodDistributionData && (
                    <Doughnut
                      data={moodDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                      }}
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                    Recent Activity
                  </h3>
                  {moodTrendsData && (
                    <Line
                      data={moodTrendsData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1,
                            },
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="px-6 py-3 rounded-softer bg-soft-green dark:bg-accent-blue text-white font-semibold hover:bg-calm-purple dark:hover:bg-accent-blue/80 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  📥 Export Mood Data as CSV
                </button>
              </div>
            </div>
          )}

          {/* Persistent Negative Mood Detection - Therapist Suggestion */}
          {moodDataForCharts.length > 0 && (() => {
            // Define mood categories
            const negativeMoods = ['sad', 'angry', 'stressed', 'anxious', 'crying'];
            
            // Check for persistent negative moods
            const recentMoods = moodDataForCharts.slice(0, 10); // Last 10 entries
            const recentNegativeCount = recentMoods.filter(m => 
              negativeMoods.includes(m.moodType || m.mood)
            ).length;
            const recentNegativePercent = (recentNegativeCount / recentMoods.length) * 100;
            
            // Check overall negative percentage
            const allMoods = moodDataForCharts;
            const totalNegativeCount = allMoods.filter(m => 
              negativeMoods.includes(m.moodType || m.mood)
            ).length;
            const overallNegativePercent = (totalNegativeCount / allMoods.length) * 100;
            
            // Check if last 5 entries are all negative
            const last5AllNegative = moodDataForCharts.slice(0, 5).every(m => 
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

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-8 py-4 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                isSaving
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 hover:from-warm-pink hover:to-calm-purple'
              }`}
            >
              {isSaving ? 'Saving...' : '💾 Save Preferences'}
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Profile;

