/**
 * Spotify Mood Mapping Utility
 * Maps mood types to Spotify search queries for music recommendations
 */

/**
 * Get Spotify search query for a given mood
 * @param {string} mood - The mood type (e.g., 'happy', 'sad', 'neutral')
 * @returns {string} - Spotify search query string
 */
export const getSpotifySearchQuery = (mood) => {
  const moodToSpotifyMap = {
    'happy': 'happy mood playlist',
    'sad': 'sad songs playlist',
    'angry': 'angry rock playlist',
    'stressed': 'stress relief playlist',
    'calm': 'calming instrumental playlist',
    'excited': 'energetic pop playlist',
    'anxious': 'anxiety relief playlist',
    'grateful': 'positive vibes playlist',
    'neutral': 'chill vibes playlist',
    'tired': 'soft acoustic playlist',
    'lonely': 'lonely songs playlist',
    'overwhelmed': 'soothing ambient playlist',
  };

  return moodToSpotifyMap[mood?.toLowerCase()] || 'chill vibes playlist';
};

/**
 * Get Spotify search URL for a given mood
 * @param {string} mood - The mood type
 * @returns {string} - Full Spotify search URL
 */
export const getSpotifySearchUrl = (mood) => {
  const query = getSpotifySearchQuery(mood);
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
};

/**
 * Get all mood-to-Spotify mappings
 * @returns {Object} - Object mapping mood IDs to Spotify search queries
 */
export const getAllMoodMappings = () => {
  return {
    'happy': 'happy mood playlist',
    'sad': 'sad songs playlist',
    'angry': 'angry rock playlist',
    'stressed': 'stress relief playlist',
    'calm': 'calming instrumental playlist',
    'excited': 'energetic pop playlist',
    'anxious': 'anxiety relief playlist',
    'grateful': 'positive vibes playlist',
    'neutral': 'chill vibes playlist',
    'tired': 'soft acoustic playlist',
    'lonely': 'lonely songs playlist',
    'overwhelmed': 'soothing ambient playlist',
  };
};

