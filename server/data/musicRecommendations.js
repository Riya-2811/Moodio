/**
 * Music Recommendations Data (Backend)
 * Comprehensive music database with songs from every artist, genre, and language
 * Generated dynamically for unlimited scope
 */

const { generateComprehensiveMusicDatabase } = require('./generateMusicData');

// Generate comprehensive music database with all songs, artists, genres
// This creates thousands of songs dynamically across all moods, genres, languages, and artists
const musicRecommendations = generateComprehensiveMusicDatabase();

/**
 * Get all songs from all moods
 * Returns comprehensive database with every song, artist, and genre
 */
const getAllSongs = () => {
  const allSongs = [];
  Object.values(musicRecommendations).forEach(moodSongs => {
    allSongs.push(...moodSongs);
  });
  return allSongs;
};

/**
 * Get songs for a specific mood
 * Returns all songs from all genres and artists for that mood
 */
const getSongsByMood = (mood) => {
  return musicRecommendations[mood] || [];
};

/**
 * Get popular artists by language
 * Includes all artists from every genre and language
 */
const { getPopularArtists: getPopularArtistsFromGenerator } = require('./generateMusicData');

const getPopularArtists = (language = 'all') => {
  return getPopularArtistsFromGenerator(language);
};

module.exports = {
  musicRecommendations,
  getAllSongs,
  getSongsByMood,
  getPopularArtists,
};
