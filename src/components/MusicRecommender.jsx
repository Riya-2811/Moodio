import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMood } from '../context/MoodContext';
import { useAuth } from '../context/AuthContext';
import { getAvailableGenres, getAvailableLanguages, getPopularArtists } from '../data/musicRecommendations';
import { getSpotifySearchUrl, getSpotifySearchQuery } from '../utils/spotifyMoodMapping';
import { getSpotifyMoodPlaylists } from '../data/spotifyMoodPlaylists';
import api from '../utils/api';
import { useToast } from '../utils/Toast';
import { startConsecutiveNotifications } from '../utils/NotificationService';

/**
 * Music Recommender Component
 * Shows personalized music recommendations based on user's latest mood
 * Includes custom playlist creation and management
 * Supports multiple genres (Hollywood, Bollywood, Punjabi, etc.) and languages
 */
const MusicRecommender = () => {
  const { lastMood, currentMood } = useMood();
  const { user, preferences } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const [latestMood, setLatestMood] = useState('happy');
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddSongsModal, setShowAddSongsModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  // Initialize selectedPlatform from user preferences
  const [selectedPlatform, setSelectedPlatform] = useState(
    preferences?.musicPreferences?.preferredPlatform || 'spotify'
  );
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [musicRecommendations, setMusicRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const [hasPreferences, setHasPreferences] = useState(false);
  // Initialize filters with 'all' to show all recommendations by default
  // User can filter later if they want
  const [filters, setFilters] = useState({
    genre: 'all',
    language: 'all',
    artist: 'all',
  });
  // Initialize newPlaylist with user preferences
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    description: '',
    thumbnail: '🎵',
    mood: 'other',
    genre: preferences?.musicPreferences?.favoriteGenres || [],
    platform: preferences?.musicPreferences?.preferredPlatform === 'any' 
      ? 'mixed' 
      : preferences?.musicPreferences?.preferredPlatform || 'mixed',
  });

  // Get mood label helper function
  const getMoodLabel = (mood) => {
    const moodLabels = {
      happy: 'Happy',
      sad: 'Sad',
      angry: 'Angry',
      stressed: 'Stressed',
      calm: 'Calm',
      excited: 'Excited',
      anxious: 'Anxious',
      grateful: 'Grateful',
      neutral: 'Neutral',
      tired: 'Tired',
      lonely: 'Lonely',
      overwhelmed: 'Overwhelmed',
      crying: 'Crying',
      other: 'Other',
    };
    return moodLabels[mood] || 'Happy';
  };

  // Get mood from context or localStorage
  useEffect(() => {
    const mood = currentMood?.mood || lastMood?.mood;
    if (mood) {
      setLatestMood(mood);
    } else {
      // New user - no mood detected yet
      setLatestMood(null);
    }
  }, [currentMood, lastMood]);

  // Update selectedPlatform when preferences change
  useEffect(() => {
    if (preferences?.musicPreferences?.preferredPlatform) {
      setSelectedPlatform(preferences.musicPreferences.preferredPlatform);
    }
  }, [preferences?.musicPreferences?.preferredPlatform]);

  // Update filters when preferences change
  useEffect(() => {
    if (preferences?.musicPreferences?.favoriteGenres?.length > 0) {
      setFilters(prev => ({
        ...prev,
        genre: preferences.musicPreferences.favoriteGenres[0] || 'all',
      }));
    }
  }, [preferences?.musicPreferences?.favoriteGenres]);

  // Update newPlaylist defaults when preferences change
  useEffect(() => {
    if (preferences?.musicPreferences) {
      setNewPlaylist(prev => ({
        ...prev,
        genre: preferences.musicPreferences.favoriteGenres || prev.genre,
        platform: preferences.musicPreferences.preferredPlatform === 'any' 
          ? 'mixed' 
          : preferences.musicPreferences.preferredPlatform || prev.platform,
      }));
    }
  }, [preferences?.musicPreferences?.favoriteGenres, preferences?.musicPreferences?.preferredPlatform]);

  // Fetch user's custom playlists
  useEffect(() => {
    if (user) {
      fetchUserPlaylists();
    }
  }, [user]);

  /**
   * Fetch music recommendations from backend API
   */
  const fetchMusicRecommendations = useCallback(async () => {
    if (!user) {
      setMusicRecommendations([]);
      setHasPreferences(false);
      setLoadingRecommendations(false);
      return;
    }

    setLoadingRecommendations(true);
    setRecommendationsError(null);

    try {
      const userId = user.id || user.userId || user.email;
      // Use latestMood if available, otherwise use 'happy' as default, or empty string to let backend decide
      const moodParam = latestMood || 'happy';
      console.log('[MusicRecommender] Fetching recommendations for userId:', userId, 'mood:', moodParam);
      const response = await api.get(`/music/recommend?userId=${userId}&mood=${moodParam}`);
      console.log('[MusicRecommender] API response status:', response.status, 'data:', response.data);

      if (response.data && response.data.success) {
        const recommendations = response.data.data.recommendations || [];
        console.log('[MusicRecommender] Received recommendations:', recommendations.length);
        console.log('[MusicRecommender] Sample recommendations:', recommendations.slice(0, 3));
        setMusicRecommendations(recommendations);
        setHasPreferences(response.data.data.hasPreferences || false);
        
        if (!response.data.data.hasPreferences) {
          // If no preferences but we have recommendations, don't show error
          if (recommendations.length > 0) {
            setRecommendationsError(null);
          } else {
            setRecommendationsError('preferences_missing');
          }
        } else if (recommendations.length === 0) {
          setRecommendationsError('no_matches');
        } else {
          setRecommendationsError(null);
        }
      } else {
        console.error('[MusicRecommender] API response not successful:', response.data);
        setMusicRecommendations([]);
        setHasPreferences(false);
        setRecommendationsError('api_error');
      }
    } catch (error) {
      console.error('Error fetching music recommendations:', error);
      console.error('Error details:', error.response?.data || error.message);
      setMusicRecommendations([]);
      setHasPreferences(false);
      setRecommendationsError('api_error');
    } finally {
      setLoadingRecommendations(false);
    }
  }, [user, latestMood]);

  // Fetch music recommendations from API
  useEffect(() => {
    if (user) {
      // Always fetch recommendations when user is logged in, even if no mood is detected yet
      // The backend will provide general recommendations if no mood is specified
      fetchMusicRecommendations();
    } else {
      setMusicRecommendations([]);
      setHasPreferences(false);
      setRecommendationsError(null);
    }
  }, [user, latestMood, preferences, fetchMusicRecommendations]);

  // Start consecutive notifications system (every 2 minutes)
  useEffect(() => {
    if (!user) return;
    const cleanup = startConsecutiveNotifications(showToast, preferences, lastMood);
    return cleanup;
  }, [showToast, user, preferences, lastMood]);

  /**
   * Fetch user's custom playlists from backend
   */
  const fetchUserPlaylists = async () => {
    if (!user) return;
    
    setLoadingPlaylists(true);
    try {
      const userId = user.id || user.userId || user.email;
      const response = await api.get(`/playlists?userId=${userId}`);
      
      if (response.data.success) {
        setUserPlaylists(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  /**
   * Handle creating a new playlist
   */
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Create playlist button clicked');
    console.log('User:', user);
    console.log('New playlist data:', newPlaylist);
    
    if (!user) {
      showToast('Please log in to create playlists', 'error');
      return;
    }

    if (!newPlaylist.title || !newPlaylist.title.trim()) {
      showToast('Please enter a playlist title', 'error');
      return;
    }

    try {
      const userId = user.id || user.userId || user.email;
      console.log('Creating playlist with userId:', userId);
      
      const playlistData = {
        userId,
        title: newPlaylist.title.trim(),
        description: newPlaylist.description?.trim() || '',
        thumbnail: newPlaylist.thumbnail || '🎵',
        mood: newPlaylist.mood || 'other',
        genre: Array.isArray(newPlaylist.genre) ? newPlaylist.genre : [],
        platform: newPlaylist.platform || 'mixed',
        songs: [],
      };
      
      console.log('Sending playlist data:', playlistData);
      
      const response = await api.post('/playlists', playlistData);
      
      console.log('Playlist creation response:', response.data);

      if (response.data && response.data.success) {
        showToast('Playlist created successfully!', 'success');
        setShowCreateForm(false);
        setNewPlaylist({
          title: '',
          description: '',
          thumbnail: '🎵',
          mood: 'other',
          genre: [],
          platform: 'mixed',
        });
        fetchUserPlaylists(); // Refresh playlist list
      } else {
        throw new Error(response.data?.error || 'Failed to create playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create playlist. Please check if the backend server is running.';
      showToast(errorMessage, 'error');
    }
  };

  /**
   * Handle deleting a playlist
   */
  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      const userId = user.id || user.userId || user.email;
      const response = await api.delete(`/playlists/${playlistId}?userId=${userId}`);

      if (response.data.success) {
        showToast('Playlist deleted successfully', 'success');
        fetchUserPlaylists(); // Refresh playlist list
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      showToast('Failed to delete playlist. Please try again.', 'error');
    }
  };

  /**
   * Open add songs modal for a playlist
   */
  const handleOpenAddSongs = (playlist, platform) => {
    setSelectedPlaylist(playlist);
    setSelectedPlatform(platform);
    setShowAddSongsModal(true);
    setSongSearchQuery('');
    setSearchResults([]);
    setSelectedSongs([]);
  };

  /**
   * Close add songs modal
   */
  const handleCloseAddSongs = () => {
    setShowAddSongsModal(false);
    setSelectedPlaylist(null);
    setSongSearchQuery('');
    setSearchResults([]);
    setSelectedSongs([]);
  };

  /**
   * Search for songs (simulated - in real app, would use Spotify/YouTube API)
   */
  const handleSearchSongs = async () => {
    if (!songSearchQuery.trim()) {
      showToast('Please enter a song name or artist', 'error');
      return;
    }

    setLoadingSongs(true);
    try {
      // Simulated search results - In production, replace with actual Spotify/YouTube API calls
      const mockResults = [
        {
          id: `song-${Date.now()}-1`,
          title: songSearchQuery,
          artist: 'Artist Name',
          url: selectedPlatform === 'spotify' 
            ? `https://open.spotify.com/search/${encodeURIComponent(songSearchQuery)}`
            : `https://www.youtube.com/results?search_query=${encodeURIComponent(songSearchQuery)}`,
          platform: selectedPlatform,
          thumbnail: '🎵',
        },
        {
          id: `song-${Date.now()}-2`,
          title: `${songSearchQuery} (Acoustic)`,
          artist: 'Artist Name',
          url: selectedPlatform === 'spotify' 
            ? `https://open.spotify.com/search/${encodeURIComponent(songSearchQuery + ' acoustic')}`
            : `https://www.youtube.com/results?search_query=${encodeURIComponent(songSearchQuery + ' acoustic')}`,
          platform: selectedPlatform,
          thumbnail: '🎵',
        },
        {
          id: `song-${Date.now()}-3`,
          title: `${songSearchQuery} (Remix)`,
          artist: 'Artist Name',
          url: selectedPlatform === 'spotify' 
            ? `https://open.spotify.com/search/${encodeURIComponent(songSearchQuery + ' remix')}`
            : `https://www.youtube.com/results?search_query=${encodeURIComponent(songSearchQuery + ' remix')}`,
          platform: selectedPlatform,
          thumbnail: '🎵',
        },
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching songs:', error);
      showToast('Failed to search songs. Please try again.', 'error');
    } finally {
      setLoadingSongs(false);
    }
  };

  /**
   * Toggle song selection
   */
  const handleToggleSong = (song) => {
    const isSelected = selectedSongs.some(s => s.id === song.id);
    if (isSelected) {
      setSelectedSongs(selectedSongs.filter(s => s.id !== song.id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  /**
   * Add selected songs to playlist
   */
  const handleAddSongsToPlaylist = async () => {
    console.log('handleAddSongsToPlaylist called');
    console.log('Selected playlist:', selectedPlaylist);
    console.log('Selected songs:', selectedSongs);
    
    if (!selectedPlaylist || selectedSongs.length === 0) {
      showToast('Please select at least one song', 'error');
      return;
    }

    if (!user) {
      showToast('Please log in to add songs', 'error');
      return;
    }

    try {
      const userId = user.id || user.userId || user.email;
      console.log('User ID:', userId);
      console.log('Playlist ID:', selectedPlaylist._id);
      
      const songsToAdd = selectedSongs.map(song => ({
        title: song.title,
        artist: song.artist || '',
        url: song.url,
        platform: song.platform,
      }));

      console.log('Songs to add:', songsToAdd);

      const response = await api.post(`/playlists/${selectedPlaylist._id}/songs`, {
        userId,
        songs: songsToAdd,
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.success) {
        showToast(`${selectedSongs.length} song(s) added successfully!`, 'success');
        handleCloseAddSongs();
        fetchUserPlaylists(); // Refresh playlist list
      } else {
        throw new Error(response.data?.error || 'Failed to add songs');
      }
    } catch (error) {
      console.error('Error adding songs to playlist:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add songs. Please check if the backend server is running.';
      showToast(errorMessage, 'error');
    }
  };

  /**
   * Remove song from playlist
   */
  const handleRemoveSong = async (playlistId, songIndex) => {
    try {
      const userId = user.id || user.userId || user.email;
      const response = await api.delete(`/playlists/${playlistId}/songs/${songIndex}?userId=${userId}`);

      if (response.data.success) {
        showToast('Song removed successfully', 'success');
        fetchUserPlaylists(); // Refresh playlist list
      }
    } catch (error) {
      console.error('Error removing song:', error);
      showToast('Failed to remove song. Please try again.', 'error');
    }
  };

  // Check if mood is dangerously negative
  const isNegativeMood = latestMood && ['sad', 'angry', 'stressed', 'anxious', 'crying'].includes(latestMood.toLowerCase());
  
  // Get preferred platform from user preferences
  const preferredPlatform = preferences?.musicPreferences?.preferredPlatform || 'spotify';
  
  // Get available filter options
  const availableGenres = getAvailableGenres();
  const availableLanguages = getAvailableLanguages();
  
  // Get artists filtered by selected language
  const popularArtists = getPopularArtists(filters.language);
  
  // Get Spotify mood playlists based on current mood
  const spotifyMoodPlaylists = React.useMemo(() => {
    if (!latestMood) return [];
    return getSpotifyMoodPlaylists(latestMood);
  }, [latestMood]);

  // Apply local filters to recommendations from API
  const filteredRecommendations = React.useMemo(() => {
    // Combine Spotify mood playlists with API recommendations
    // Spotify playlists go first (they're mood-specific and highly relevant)
    let filtered = [...spotifyMoodPlaylists, ...musicRecommendations];
    console.log('[MusicRecommender] Total recommendations (Spotify + API):', filtered.length, 'Filters:', filters);
    
    // Filter by genre
    if (filters.genre && filters.genre !== 'all') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(rec => {
        const recGenre = rec.genre?.toLowerCase();
        const filterGenre = filters.genre.toLowerCase();
        return recGenre === filterGenre;
      });
      console.log('[MusicRecommender] After genre filter:', filtered.length, '(was', beforeCount + ')');
      }
      
    // Filter by language
    if (filters.language && filters.language !== 'all') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(rec => {
        const recLanguage = rec.language?.toLowerCase();
        const filterLanguage = filters.language.toLowerCase();
        return recLanguage === filterLanguage;
      });
      console.log('[MusicRecommender] After language filter:', filtered.length, '(was', beforeCount + ')');
    }
    
    // Filter by artist
    if (filters.artist && filters.artist !== 'all') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(rec => {
        const recArtist = rec.artist?.toLowerCase();
        const filterArtist = filters.artist.toLowerCase();
        return recArtist === filterArtist;
      });
      console.log('[MusicRecommender] After artist filter:', filtered.length, '(was', beforeCount + ')');
    }
    
    console.log('[MusicRecommender] Final filtered count:', filtered.length);
    return filtered;
  }, [musicRecommendations, spotifyMoodPlaylists, filters]);
  
  // Reset artist filter when language changes
  useEffect(() => {
    if (filters.language === 'all' || filters.language === '') {
      // Keep current artist selection if language is 'all'
      return;
    }
    
    // Check if current artist is available for new language
    const availableArtistsForLanguage = getPopularArtists(filters.language);
    const currentArtistAvailable = availableArtistsForLanguage.some(
      artist => artist.toLowerCase() === filters.artist?.toLowerCase()
    );
    
    // If current artist is not available for the selected language, reset to 'all'
    if (!currentArtistAvailable && filters.artist !== 'all') {
      setFilters(prev => ({ ...prev, artist: 'all' }));
    }
  }, [filters.language]);

  return (
    <div className="min-h-screen bg-calm-purple dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Music Recommendations 🎵
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Personalized music suggestions based on your mood
          </p>
          <div className="inline-block px-6 py-3 bg-white dark:bg-dark-surface rounded-softer shadow-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current Mood: </span>
            {latestMood ? (
              <span className="text-lg font-semibold text-calm-purple dark:text-accent-blue">
                {getMoodLabel(latestMood)}
              </span>
            ) : (
              <Link
                to="/mood"
                className="text-lg font-semibold text-calm-purple dark:text-accent-blue hover:text-warm-pink dark:hover:text-purple-400 underline transition-colors"
              >
                Detect
              </Link>
            )}
          </div>
        </div>

        {/* Spotify Playlist Recommendation - Based on Current Mood */}
        {latestMood && (
          <div className="mb-8 bg-gradient-to-r from-soft-green/20 via-calm-purple/20 to-warm-pink/20 dark:from-green-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-softer p-6 border-2 border-calm-purple/30 dark:border-accent-blue/40">
            <div className="text-center">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Your Mood-Based Spotify Playlist
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Discover music on Spotify that matches your current mood: <span className="font-semibold text-calm-purple dark:text-accent-blue capitalize">{getMoodLabel(latestMood)}</span>
              </p>
              <a
                href={getSpotifySearchUrl(latestMood)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-softer bg-gradient-to-r from-soft-green to-calm-purple dark:from-accent-blue dark:to-purple-600 text-white font-bold text-lg hover:from-calm-purple hover:to-warm-pink dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>🎧</span>
                <span>Open on Spotify</span>
                <span>→</span>
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                Search: "{getSpotifySearchQuery(latestMood)}"
              </p>
            </div>
          </div>
        )}

        {/* Create Playlist Button */}
        {user && (
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-8 py-4 rounded-softer bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 dark:from-purple-500 dark:via-pink-600 dark:to-rose-600 text-white font-bold text-lg hover:from-purple-700 hover:via-pink-600 hover:to-rose-600 dark:hover:from-purple-600 dark:hover:via-pink-700 dark:hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-white/20 hover:border-white/40"
            >
              {showCreateForm ? '✖ Cancel' : '+ Create Your Own Playlist'}
            </button>
          </div>
        )}

        {/* Create Playlist Form */}
        {showCreateForm && user && (
          <div className="mb-8 bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Create New Playlist</h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Playlist Title *
                </label>
                <input
                  type="text"
                  value={newPlaylist.title}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, title: e.target.value })}
                  placeholder="My Amazing Playlist"
                  className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                  placeholder="What's this playlist for?"
                  rows="3"
                  className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thumbnail Emoji
                  </label>
                  <input
                    type="text"
                    value={newPlaylist.thumbnail}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, thumbnail: e.target.value })}
                    placeholder="🎵"
                    maxLength="2"
                    className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all text-center text-2xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mood
                  </label>
                  <select
                    value={newPlaylist.mood}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, mood: e.target.value })}
                    className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
                  >
                    <option value="other">Other</option>
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="angry">Angry</option>
                    <option value="stressed">Stressed</option>
                    <option value="calm">Calm</option>
                    <option value="excited">Excited</option>
                    <option value="anxious">Anxious</option>
                    <option value="grateful">Grateful</option>
                    <option value="neutral">Neutral</option>
                    <option value="tired">Tired</option>
                    <option value="lonely">Lonely</option>
                    <option value="overwhelmed">Overwhelmed</option>
                    <option value="crying">Crying</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform
                  </label>
                  <select
                    value={newPlaylist.platform}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, platform: e.target.value })}
                    className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
                  >
                    <option value="mixed">Mixed</option>
                    <option value="spotify">Spotify</option>
                    <option value="youtube">YouTube</option>
                    <option value="apple-music">Apple Music</option>
                    <option value="soundcloud">SoundCloud</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-soft bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-purple-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newPlaylist.title.trim()}
                >
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User's Custom Playlists Section */}
        {user && userPlaylists.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
              Your Custom Playlists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {userPlaylists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
                >
                  <button
                    onClick={() => handleDeletePlaylist(playlist._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold"
                    title="Delete playlist"
                  >
                    ✕
                  </button>
                  <div className="text-5xl mb-4 text-center">{playlist.thumbnail || '🎵'}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 text-center">
                    {playlist.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                    {playlist.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
                    Mood: {getMoodLabel(playlist.mood)} • {playlist.songs?.length || 0} songs
                  </p>
                  
                  {/* Songs List */}
                  {playlist.songs && playlist.songs.length > 0 && (
                    <div className="mb-4 max-h-40 overflow-y-auto space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
                        Songs ({playlist.songs.length})
                      </h4>
                      {playlist.songs.map((song, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-soft bg-light-gray dark:bg-dark-bg border border-gray-200 dark:border-gray-700 hover:border-calm-purple dark:hover:border-accent-blue transition-all"
                        >
                          <div className="flex-1 min-w-0 mr-2">
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
                              {song.title || 'Untitled Song'}
                            </p>
                            {song.artist && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {song.artist}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {song.url ? (
                              <a
                                href={song.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-2 py-1 rounded-soft text-xs font-semibold text-white hover:opacity-80 transition-all ${
                                  song.platform === 'spotify'
                                    ? 'bg-soft-green dark:bg-green-500'
                                    : song.platform === 'youtube'
                                    ? 'bg-red-500 dark:bg-red-600'
                                    : 'bg-calm-purple dark:bg-accent-blue'
                                }`}
                                title={`Play on ${song.platform === 'spotify' ? 'Spotify' : song.platform === 'youtube' ? 'YouTube' : song.platform || 'Music Platform'}`}
                              >
                                ▶️
                              </a>
                            ) : (
                              <span
                                className={`px-2 py-1 rounded-soft text-xs font-semibold text-white opacity-50 cursor-not-allowed ${
                                  song.platform === 'spotify'
                                    ? 'bg-soft-green dark:bg-green-500'
                                    : song.platform === 'youtube'
                                    ? 'bg-red-500 dark:bg-red-600'
                                    : 'bg-calm-purple dark:bg-accent-blue'
                                }`}
                                title="No URL available"
                              >
                                ▶️
                              </span>
                            )}
                            <button
                              onClick={() => handleRemoveSong(playlist._id, index)}
                              className="px-2 py-1 rounded-soft text-xs font-semibold bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 transition-all"
                              title="Remove song"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenAddSongs(playlist, 'spotify')}
                      className="flex-1 px-4 py-2 rounded-soft bg-soft-green dark:bg-accent-blue text-white font-semibold text-center hover:bg-calm-purple dark:hover:bg-accent-blue/80 transition-all duration-300 text-sm"
                    >
                      + Add from Spotify
                    </button>
                    <button
                      onClick={() => handleOpenAddSongs(playlist, 'youtube')}
                      className="flex-1 px-4 py-2 rounded-soft bg-red-500 dark:bg-red-600 text-white font-semibold text-center hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-300 text-sm"
                    >
                      + Add from YouTube
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Negative Mood Warning */}
        {isNegativeMood && (
          <div className="mb-8 bg-gradient-to-r from-warm-pink to-calm-purple dark:bg-dark-surface rounded-softer p-6 shadow-lg text-center border-4 border-white dark:border-white/30">
            <div className="text-4xl mb-3">💙</div>
            <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">
              We've added some exercises to help you relax 
            </h3>
            <p className="text-sm text-white dark:text-gray-300 opacity-90 mb-4">
              Take a moment to breathe and practice some calming exercises
            </p>
            <Link
              to="/exercises"
              className="inline-block px-6 py-3 rounded-softer bg-white dark:bg-dark-bg text-calm-purple dark:text-accent-blue font-semibold hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-300 shadow-md hover:shadow-lg"
            >
              🧘 View Exercises
            </Link>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-8 bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
            Filter by Genre, Language & Artist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genre
              </label>
              <select
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
              >
                {availableGenres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
              >
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Artist Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Artist
              </label>
              <select
                value={filters.artist}
                onChange={(e) => setFilters({ ...filters, artist: e.target.value })}
                className="w-full px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
              >
                <option value="all">All Artists</option>
                {popularArtists.map(artist => (
                  <option key={artist} value={artist}>
                    {artist}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(filters.genre !== 'all' || filters.language !== 'all' || filters.artist !== 'all') && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setFilters({ genre: 'all', language: 'all', artist: 'all' })}
                className="px-6 py-2 rounded-soft bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-300 text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Recommended Playlists Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
            Recommended For You
          </h2>
          <div className="bg-white dark:bg-dark-surface rounded-softer p-4 shadow-lg">
            {loadingRecommendations ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Loading personalized recommendations...
                </p>
              </div>
            ) : recommendationsError === 'preferences_missing' ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🎵</div>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-2 font-semibold">
                  Set your preferences for better recommendations
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Tell us about your music taste to get personalized recommendations that match your vibe!
                </p>
                <Link
                  to="/preferences"
                  className="inline-block px-6 py-3 rounded-softer bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 text-white font-semibold hover:from-warm-pink hover:to-calm-purple transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  → Go to Preferences
                </Link>
              </div>
            ) : recommendationsError === 'no_matches' ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🎶</div>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-2 font-semibold">
                  No songs match your taste yet
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adding more genres or adjusting your preferences to discover new music!
                </p>
                <Link
                  to="/preferences"
                  className="inline-block px-6 py-3 rounded-softer bg-gradient-to-r from-calm-purple to-warm-pink dark:from-accent-blue dark:to-purple-600 text-white font-semibold hover:from-warm-pink hover:to-calm-purple transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Update Preferences
                </Link>
              </div>
            ) : filteredRecommendations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No recommendations match your current filters. Try adjusting your filters.
                </p>
                <button
                  onClick={() => setFilters({ genre: 'all', language: 'all', artist: 'all' })}
                  className="px-6 py-2 rounded-soft bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-purple-600 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredRecommendations.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center justify-between p-4 rounded-soft bg-light-gray dark:bg-dark-bg border border-gray-200 dark:border-gray-700 hover:border-calm-purple dark:hover:border-accent-blue hover:bg-white dark:hover:bg-dark-surface transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-3xl flex-shrink-0">{playlist.thumbnail}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {playlist.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {playlist.description}
                      </p>
                      {(playlist.genre || playlist.language || playlist.artist) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {playlist.genre && (
                            <span className="px-2 py-1 text-xs rounded-full bg-calm-purple/20 dark:bg-accent-blue/20 text-calm-purple dark:text-accent-blue">
                              {playlist.genre.charAt(0).toUpperCase() + playlist.genre.slice(1)}
                            </span>
                          )}
                          {playlist.language && (
                            <span className="px-2 py-1 text-xs rounded-full bg-warm-pink/20 dark:bg-purple-600/20 text-warm-pink dark:text-purple-400">
                              {playlist.language.charAt(0).toUpperCase() + playlist.language.slice(1)}
                            </span>
                          )}
                          {playlist.artist && (
                            <span className="px-2 py-1 text-xs rounded-full bg-soft-green/20 dark:bg-green-500/20 text-soft-green dark:text-green-400">
                              {playlist.artist}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    {(preferredPlatform === 'spotify' || preferredPlatform === 'any' || playlist.type === 'spotify') && (
                      <a
                        href={playlist.embedUrl || `https://open.spotify.com/search/${encodeURIComponent(playlist.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-soft bg-soft-green dark:bg-accent-blue text-white font-semibold text-sm hover:bg-calm-purple dark:hover:bg-accent-blue/80 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        ▶️ Spotify
                      </a>
                    )}
                    {(preferredPlatform === 'youtube' || preferredPlatform === 'any') && (
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(playlist.title + ' playlist')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-soft bg-red-500 dark:bg-red-600 text-white font-semibold text-sm hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        ▶️ YouTube
                      </a>
                    )}
                    {preferredPlatform === 'apple-music' && (
                      <a
                        href={`https://music.apple.com/search?term=${encodeURIComponent(playlist.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-soft bg-pink-500 text-white font-semibold text-sm hover:bg-pink-600 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        ▶️ Apple Music
                      </a>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>

        {/* Exercise Recommendations for Negative Moods */}
        {isNegativeMood && (
          <div className="mt-8 bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
              🧘 Breathing & Stretching Exercises
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              Take a breather with these gentle exercises:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/exercises"
                className="px-6 py-3 rounded-softer bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
              >
                🌿 View Breathing Exercises
              </Link>
              <Link
                to="/exercises"
                className="px-6 py-3 rounded-softer bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold hover:from-teal-500 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
              >
                💆 Take a Breather
              </Link>
            </div>
          </div>
        )}

        {/* Info Message */}
        <div className="mt-8 bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">
            💡 <strong>Tip:</strong> Track your mood daily to get personalized music recommendations that match how you're feeling! {user && 'You can also create your own playlists above.'}
          </p>
        </div>

        {/* Add Songs Modal */}
        {showAddSongsModal && selectedPlaylist && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Add Songs to "{selectedPlaylist.title}"
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Search and add songs from {selectedPlatform === 'spotify' ? 'Spotify' : 'YouTube'}
                  </p>
                </div>
                <button
                  onClick={handleCloseAddSongs}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Search Section */}
              <div className="mb-6">
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={songSearchQuery}
                    onChange={(e) => setSongSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSongs()}
                    placeholder={`Search for songs on ${selectedPlatform === 'spotify' ? 'Spotify' : 'YouTube'}...`}
                    className="flex-1 px-4 py-3 rounded-soft bg-light-gray dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-calm-purple dark:focus:border-accent-blue transition-all"
                  />
                  <button
                    onClick={handleSearchSongs}
                    disabled={loadingSongs || !songSearchQuery.trim()}
                    className={`px-6 py-3 rounded-soft font-semibold text-white transition-all duration-300 ${
                      loadingSongs || !songSearchQuery.trim()
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-calm-purple dark:bg-accent-blue hover:bg-warm-pink dark:hover:bg-purple-600'
                    }`}
                  >
                    {loadingSongs ? 'Searching...' : '🔍 Search'}
                  </button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Search Results ({searchResults.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((song) => {
                      const isSelected = selectedSongs.some(s => s.id === song.id);
                      return (
                        <div
                          key={song.id}
                          onClick={() => handleToggleSong(song)}
                          className={`p-4 rounded-soft border-2 cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? 'bg-calm-purple/20 dark:bg-accent-blue/20 border-calm-purple dark:border-accent-blue'
                              : 'bg-light-gray dark:bg-dark-bg border-gray-200 dark:border-gray-700 hover:border-calm-purple dark:hover:border-accent-blue'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{song.thumbnail}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                                {song.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {song.artist}
                              </p>
                            </div>
                            <div className={`text-xl ${isSelected ? 'text-calm-purple dark:text-accent-blue' : 'text-gray-400'}`}>
                              {isSelected ? '✓' : '○'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected Songs Preview */}
              {selectedSongs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Selected Songs ({selectedSongs.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedSongs.map((song, index) => (
                      <div
                        key={song.id}
                        className="p-3 rounded-soft bg-calm-purple/10 dark:bg-accent-blue/10 border border-calm-purple/20 dark:border-accent-blue/20 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-lg">{song.thumbnail}</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {song.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {song.artist}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSong(song);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCloseAddSongs}
                  className="flex-1 px-6 py-3 rounded-soft bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSongsToPlaylist}
                  disabled={selectedSongs.length === 0}
                  className={`flex-1 px-6 py-3 rounded-soft font-semibold text-white transition-all duration-300 ${
                    selectedSongs.length === 0
                      ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-calm-purple dark:bg-accent-blue hover:bg-warm-pink dark:hover:bg-purple-600'
                  }`}
                >
                  Add {selectedSongs.length > 0 ? `${selectedSongs.length} ` : ''}Song{selectedSongs.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default MusicRecommender;
