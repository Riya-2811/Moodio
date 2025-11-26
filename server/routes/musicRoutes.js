/**
 * Music Recommendation Routes
 * Handles API endpoints for personalized music recommendations based on user preferences
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getAllSongs, getSongsByMood } = require('../data/musicRecommendations');

/**
 * Helper function to normalize genre names
 * Maps user preference genres to song metadata genres
 */
const normalizeGenre = (genre) => {
  const genreMap = {
    'pop': 'hollywood',
    'lo-fi': 'lo-fi',
    'bollywood': 'bollywood',
    'indie': 'indie',
    'classical': 'classical',
    'rock': 'hollywood',
    'r&b': 'hollywood',
    'hip-hop': 'hip-hop',
    'edm': 'edm',
    'instrumental': 'instrumental',
    'other': null, // Will be handled separately
  };
  return genreMap[genre?.toLowerCase()] || genre?.toLowerCase();
};

/**
 * Helper function to normalize language names
 * Maps user preference languages to song metadata languages
 */
const normalizeLanguage = (language) => {
  const languageMap = {
    'english': 'english',
    'hindi': 'hindi',
    'punjabi': 'punjabi',
    'korean': 'korean',
    'tamil': 'tamil',
    'telugu': 'telugu',
    'instrumental only': 'instrumental',
  };
  return languageMap[language?.toLowerCase()] || language?.toLowerCase();
};

/**
 * Helper function to normalize mood names
 * Maps user preference moods to song metadata moods
 */
const normalizeMood = (mood) => {
  const moodMap = {
    'calm': 'calm',
    'focused': 'focused',
    'happy': 'happy',
    'energetic': 'energetic',
    'nostalgic': 'nostalgic',
    'motivated': 'motivated',
    'romantic': 'romantic',
    'sad': 'sad',
    'uplift me': 'happy',
  };
  return moodMap[mood?.toLowerCase()] || mood?.toLowerCase();
};

/**
 * Helper function to check if energy level matches
 */
const matchesEnergyLevel = (songEnergy, preferredIntensity) => {
  if (!songEnergy || !preferredIntensity) return true; // If not specified, allow all
  
  const energyMap = {
    'low': ['low'],
    'medium': ['low', 'medium'],
    'high': ['low', 'medium', 'high'],
  };
  
  const allowedEnergies = energyMap[preferredIntensity.toLowerCase()] || ['low', 'medium', 'high'];
  return allowedEnergies.includes(songEnergy.toLowerCase());
};

/**
 * Helper function to calculate match score for sorting
 */
const calculateMatchScore = (song, musicGenres, languages, moods, intensity) => {
  let score = 0;
  
  // Genre match
  if (musicGenres.length > 0) {
    const genreMatch = musicGenres.some(genre => {
      const normalized = normalizeGenre(genre);
      return normalized && song.genre?.toLowerCase() === normalized;
    });
    if (genreMatch) score += 3;
  }
  
  // Language match
  if (languages.length > 0) {
    const languageMatch = languages.some(lang => {
      const normalized = normalizeLanguage(lang);
      return normalized && song.language?.toLowerCase() === normalized;
    });
    if (languageMatch) score += 2;
  }
  
  // Mood match
  if (moods.length > 0) {
    const moodMatch = moods.some(mood => {
      const normalized = normalizeMood(mood);
      return normalized && song.mood?.toLowerCase() === normalized;
    });
    if (moodMatch) score += 2;
  }
  
  // Energy match
  if (matchesEnergyLevel(song.energy, intensity)) {
    score += 1;
  }
  
  return score;
};

/**
 * Main filtering function: filterSongsByPreferences
 * Filters songs based on user preferences
 * 
 * @param {Object} userPreferences - User's saved preferences
 * @param {Array} allSongs - All available songs
 * @returns {Array} Filtered songs matching user preferences
 */
const filterSongsByPreferences = (userPreferences, allSongs) => {
  if (!userPreferences || !allSongs || allSongs.length === 0) {
    console.log('[Filter] No preferences or songs available');
    return [];
  }

  const prefs = userPreferences.preferences || {};
  const musicGenres = prefs.musicGenres || [];
  const languages = prefs.languages || [];
  const moods = prefs.moods || [];
  const intensity = prefs.intensity || 'medium';
  const otherGenre = prefs.otherGenre || '';

  console.log(`[Filter] Preferences - Genres: ${musicGenres.length}, Languages: ${languages.length}, Moods: ${moods.length}, Intensity: ${intensity}`);

  // If no preferences set, return empty (user should set preferences first)
  if (musicGenres.length === 0 && languages.length === 0 && moods.length === 0) {
    console.log('[Filter] No preferences set, returning empty');
    return [];
  }

  let filteredSongs = [...allSongs];

  // Filter by genre
  if (musicGenres.length > 0) {
    const normalizedGenres = musicGenres
      .map(g => normalizeGenre(g))
      .filter(g => g !== null);
    
    // Handle "Other" genre with custom text input
    const hasOtherGenre = musicGenres.includes('Other') && otherGenre;
    
    // Check if user selected "Only Bollywood"
    const onlyBollywood = musicGenres.length === 1 && musicGenres[0] === 'Bollywood';
    
    filteredSongs = filteredSongs.filter(song => {
      const songGenre = song.genre?.toLowerCase();
      
      // If only Bollywood selected, exclude everything else
      if (onlyBollywood) {
        return songGenre === 'bollywood';
      }
      
      // Check if song matches any selected genre
      const matchesGenre = normalizedGenres.some(genre => 
        songGenre === genre?.toLowerCase()
      );
      
      // Check "Other" genre match (if user specified custom genre)
      const matchesOther = hasOtherGenre && songGenre && 
        song.title?.toLowerCase().includes(otherGenre.toLowerCase());
      
      return matchesGenre || matchesOther;
    });
  }

  // Filter by language
  if (languages.length > 0) {
    const normalizedLanguages = languages.map(l => normalizeLanguage(l));
    
    filteredSongs = filteredSongs.filter(song => {
      const songLanguage = song.language?.toLowerCase();
      
      // If "Instrumental only" is selected, only show instrumental songs
      if (languages.includes('Instrumental only')) {
        return songLanguage === 'instrumental';
      }
      
      // Check if song matches any selected language
      return normalizedLanguages.some(lang => 
        songLanguage === lang?.toLowerCase()
      );
    });
  }

  // Filter by energy level (intensity)
  filteredSongs = filteredSongs.filter(song => 
    matchesEnergyLevel(song.energy, intensity)
  );

  // Filter by mood tags
  if (moods.length > 0) {
    const normalizedMoods = moods.map(m => normalizeMood(m));
    
    filteredSongs = filteredSongs.filter(song => {
      const songMood = song.mood?.toLowerCase();
      
      // Check if song matches any selected mood
      return normalizedMoods.some(mood => 
        songMood === mood?.toLowerCase()
      );
    });
  }

  // If no songs match, try fallback within user preferences
  if (filteredSongs.length === 0) {
    // Fallback: Return songs that match at least one preference category (more lenient)
    filteredSongs = allSongs.filter(song => {
      let matchCount = 0;
      
      // Check genre match
      if (musicGenres.length > 0) {
        const genreMatch = musicGenres.some(genre => {
          const normalized = normalizeGenre(genre);
          return normalized && song.genre?.toLowerCase() === normalized;
        });
        if (genreMatch) matchCount++;
      } else {
        matchCount++; // No genre preference means no constraint
      }
      
      // Check language match
      if (languages.length > 0) {
        const languageMatch = languages.some(lang => {
          const normalized = normalizeLanguage(lang);
          return normalized && song.language?.toLowerCase() === normalized;
        });
        if (languageMatch) matchCount++;
      } else {
        matchCount++; // No language preference means no constraint
      }
      
      // Check mood match
      if (moods.length > 0) {
        const moodMatch = moods.some(mood => {
          const normalized = normalizeMood(mood);
          return normalized && song.mood?.toLowerCase() === normalized;
        });
        if (moodMatch) matchCount++;
      } else {
        matchCount++; // No mood preference means no constraint
      }
      
      // Check energy level match (more lenient - allow if close)
      const energyMatch = matchesEnergyLevel(song.energy, intensity);
      if (energyMatch) matchCount++;
      
      // Return if matches at least one category (more lenient than all)
      // But prioritize songs that match more categories
      return matchCount >= 1;
    });
    
    // Sort by match count (better matches first)
    filteredSongs = filteredSongs.sort((a, b) => {
      const aMatches = calculateMatchScore(a, musicGenres, languages, moods, intensity);
      const bMatches = calculateMatchScore(b, musicGenres, languages, moods, intensity);
      return bMatches - aMatches;
    });
  }

  // Remove duplicates by ID
  const seenIds = new Set();
  filteredSongs = filteredSongs.filter(song => {
    if (seenIds.has(song.id)) {
      return false;
    }
    seenIds.add(song.id);
    return true;
  });

  return filteredSongs;
};

/**
 * GET /api/music/test
 * Test endpoint to verify music routes are working
 */
router.get('/test', (req, res) => {
  const allSongs = getAllSongs();
  const testMoodSongs = getSongsByMood('happy');
  res.status(200).json({
    success: true,
    message: 'Music routes are working!',
    totalSongs: allSongs.length,
    happyMoodSongs: testMoodSongs.length,
    sampleSongs: testMoodSongs.slice(0, 3),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/music/recommend
 * Get personalized music recommendations based on user preferences and current mood
 */
router.get('/recommend', async (req, res) => {
  try {
    const { userId, mood } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    // Fetch user from database
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get user preferences
    const userPreferences = {
      preferences: user.preferences || {},
    };

    // Check if user has preferences set
    const hasPreferences = userPreferences.preferences && (
      (userPreferences.preferences.musicGenres && userPreferences.preferences.musicGenres.length > 0) ||
      (userPreferences.preferences.languages && userPreferences.preferences.languages.length > 0) ||
      (userPreferences.preferences.moods && userPreferences.preferences.moods.length > 0)
    );

    // If no preferences, return mood-based recommendations (fallback behavior)
    if (!hasPreferences) {
      // Get mood-based recommendations as fallback
      let fallbackRecommendations = [];
      if (mood) {
        fallbackRecommendations = getSongsByMood(mood) || [];
        console.log(`[Music Recommend] Found ${fallbackRecommendations.length} songs for mood: ${mood}`);
        
        // If no songs for this mood, try related moods or return all
        if (fallbackRecommendations.length === 0) {
          console.log(`[Music Recommend] No songs for mood ${mood}, trying fallback moods`);
          // Try similar moods - all 12 moods mapped
          const moodMap = {
            'happy': ['happy', 'excited', 'grateful'],
            'sad': ['sad', 'lonely'],
            'angry': ['angry'],
            'stressed': ['stressed', 'overwhelmed', 'anxious', 'calm'],
            'calm': ['calm', 'neutral'],
            'excited': ['excited', 'happy'],
            'anxious': ['anxious', 'stressed', 'overwhelmed', 'calm'],
            'grateful': ['grateful', 'happy'],
            'neutral': ['neutral', 'calm'],
            'tired': ['tired', 'calm'],
            'lonely': ['lonely', 'sad'],
            'overwhelmed': ['overwhelmed', 'stressed', 'anxious', 'calm'],
          };
          
          const relatedMoods = moodMap[mood.toLowerCase()] || [mood, 'happy', 'calm'];
          for (const relatedMood of relatedMoods) {
            const relatedSongs = getSongsByMood(relatedMood) || [];
            if (relatedSongs.length > 0) {
              fallbackRecommendations = relatedSongs;
              console.log(`[Music Recommend] Found ${relatedSongs.length} songs for related mood: ${relatedMood}`);
              break;
            }
          }
        }
        
        // If still no songs, return all songs
        if (fallbackRecommendations.length === 0) {
          console.log(`[Music Recommend] No songs found for mood or related moods, returning all songs`);
          const allSongs = getAllSongs();
          fallbackRecommendations = allSongs.length > 50 ? allSongs.slice(0, 50) : allSongs;
        }
        
        // Limit to 50 songs
        if (fallbackRecommendations.length > 50) {
          fallbackRecommendations = fallbackRecommendations.slice(0, 50);
        }
      } else {
        // No mood either, return all songs (limited to 50)
        const allSongs = getAllSongs();
        fallbackRecommendations = allSongs.length > 50 ? allSongs.slice(0, 50) : allSongs;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          recommendations: fallbackRecommendations,
          hasPreferences: false,
          message: 'Showing general recommendations. Set your preferences for personalized suggestions!',
        },
      });
    }

    // Get all songs
    const allSongs = getAllSongs();
    console.log(`[Music Recommend] Total songs available: ${allSongs.length}`);
    console.log(`[Music Recommend] Mood requested: ${mood}`);
    console.log(`[Music Recommend] Available moods in database:`, Object.keys(require('../data/musicRecommendations').musicRecommendations));
    console.log(`[Music Recommend] User preferences:`, JSON.stringify(userPreferences.preferences, null, 2));

    // Filter songs by user preferences
    let filteredSongs = filterSongsByPreferences(userPreferences, allSongs);
    console.log(`[Music Recommend] Songs after preference filtering: ${filteredSongs.length}`);

    // If mood is provided and user wants mood-based recommendations, prioritize by mood
    if (mood && userPreferences.preferences.moodBasedRecommendations !== false) {
      const moodLower = mood.toLowerCase();
      const moodSongs = getSongsByMood(moodLower);
      const moodSongIds = new Set(moodSongs.map(s => s.id));
      
      console.log(`[Music Recommend] Found ${moodSongs.length} songs specifically for mood: ${moodLower}`);
      
      // Filter preference-matched songs to only include mood-specific songs
      const moodMatched = filteredSongs.filter(song => moodSongIds.has(song.id));
      
      // If we have mood-specific songs that match preferences, use only those
      if (moodMatched.length > 0) {
        filteredSongs = moodMatched;
        console.log(`[Music Recommend] Using ${moodMatched.length} mood-specific songs that match preferences`);
      } else {
        // If no preference match but mood songs exist, use mood songs as fallback
        if (moodSongs.length > 0) {
          filteredSongs = moodSongs.slice(0, 50); // Limit to 50
          console.log(`[Music Recommend] No preference matches for mood, using ${filteredSongs.length} mood-specific songs`);
        } else {
          console.log(`[Music Recommend] No songs found for mood ${moodLower}, keeping preference-matched songs`);
        }
      }
    }

    // If still no matches after all filtering, return empty with message
    if (filteredSongs.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          recommendations: [],
          hasPreferences: true,
          message: 'No songs match your current preferences. Try adding more genres or adjusting your preferences.',
        },
      });
    }

    // Limit results to 50 recommendations to show variety
    const recommendations = filteredSongs.slice(0, 50);

    res.status(200).json({
      success: true,
      data: {
        recommendations,
        hasPreferences: true,
        message: `Found ${recommendations.length} recommendation(s) matching your preferences`,
      },
    });
  } catch (error) {
    console.error('Error fetching music recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

