const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * Helper function to get user ID from request
 * In a real app, this would come from JWT or session
 */
const getUserId = (req) => {
  // Try to get userId from body, query, or headers
  return req.body.userId || req.query.userId || req.headers['x-user-id'] || req.body.email;
};

/**
 * GET /api/user/preferences
 * Fetch preferences for the logged-in user
 */
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Find or create user
    let user = await User.findOne({ userId });

    if (!user) {
      // Create new user with defaults - only set email if it's provided and not empty
      const userData = {
        userId,
        name: req.query.name || 'User',
      };
      // Only add email if it's provided and not empty (to avoid unique constraint issues)
      if (req.query.email && req.query.email.trim()) {
        userData.email = req.query.email.trim().toLowerCase();
      }
      user = new User(userData);
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        personalInfo: user.personalInfo || {},
        musicPreferences: user.musicPreferences || {},
        wellnessPreferences: user.wellnessPreferences || {},
        notificationPreferences: user.notificationPreferences || {},
        appSettings: user.appSettings || {},
        assistantSettings: user.assistantSettings || {},
        journalPreferences: user.journalPreferences || {},
        preferences: user.preferences || {},
      },
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Helper function to clean and validate music preferences
 */
const cleanMusicPreferences = (musicPreferences) => {
  if (!musicPreferences) return null;
  
  // Valid enum values from User model schema (must match exactly)
  const validGenres = ['pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop', 'country', 'folk', 'indie', 'r&b', 'reggae', 'metal', 'blues', 'bollywood', 'lo-fi', 'instrumental', 'other'];
  const cleaned = { ...musicPreferences };
  
  // Filter favoriteGenres to only valid enum values
  if (cleaned.favoriteGenres && Array.isArray(cleaned.favoriteGenres)) {
    cleaned.favoriteGenres = cleaned.favoriteGenres
      .filter(genre => genre && typeof genre === 'string')
      .map(genre => {
        const trimmed = genre.trim();
        
        // Map common variations to valid enum values (case-insensitive)
        const genreMap = {
          'lo fi': 'lo-fi',
          'lofi': 'lo-fi',
          'lo-fi': 'lo-fi',
          'lo_fi': 'lo-fi',
          'r&b': 'r&b',
          'r and b': 'r&b',
          'rnb': 'r&b',
          'r&b': 'r&b',
          'hip hop': 'hip-hop',
          'hiphop': 'hip-hop',
          'hip-hop': 'hip-hop',
          'bollywood': 'bollywood',
          'bolly': 'bollywood',
        };
        
        const lower = trimmed.toLowerCase();
        
        // Check if mapped version exists
        if (genreMap[lower]) {
          return genreMap[lower];
        }
        
        // Otherwise, convert to lowercase (preserving special chars)
        return lower;
      })
      .filter(genre => validGenres.includes(genre));
    
    // Remove duplicates
    cleaned.favoriteGenres = [...new Set(cleaned.favoriteGenres)];
  }
  
  return cleaned;
};

/**
 * Helper function to update user preferences (shared between POST and PUT)
 */
const updateUserPreferences = async (req, res) => {
  try {
    const userId = getUserId(req);
    const {
      email,
      name,
      personalInfo,
      musicPreferences,
      wellnessPreferences,
      notificationPreferences,
      appSettings,
      assistantSettings,
      journalPreferences,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Find or create user
    let user = await User.findOne({ userId });

    if (!user) {
      // Create new user - only set email if it's provided and not empty
      const userData = {
        userId,
        name: name || 'User',
      };
      // Only add email if it's provided and not empty (to avoid unique constraint issues)
      if (email && email.trim()) {
        userData.email = email.trim().toLowerCase();
      }
      user = new User(userData);
    } else {
      // Update basic info if provided
      if (email && email.trim()) {
        user.email = email.trim().toLowerCase();
      }
      if (name && name.trim()) {
        user.name = name.trim();
      }
    }

    // Update preferences - merge with existing preferences
    if (personalInfo) {
      // Clean personalInfo - remove empty/undefined values
      const cleanedPersonalInfo = {};
      if (personalInfo.age && personalInfo.age > 0) {
        cleanedPersonalInfo.age = personalInfo.age;
      }
      if (personalInfo.gender && personalInfo.gender.trim()) {
        cleanedPersonalInfo.gender = personalInfo.gender;
      }
      if (personalInfo.country && personalInfo.country.trim()) {
        cleanedPersonalInfo.country = personalInfo.country;
      }
      
      // Only update if there's something to update
      if (Object.keys(cleanedPersonalInfo).length > 0) {
        user.personalInfo = { ...user.personalInfo, ...cleanedPersonalInfo };
      }
    }
    if (musicPreferences) {
      const cleanedMusicPreferences = cleanMusicPreferences(musicPreferences);
      if (cleanedMusicPreferences) {
        user.musicPreferences = { ...user.musicPreferences, ...cleanedMusicPreferences };
      }
    }
    if (wellnessPreferences) {
      user.wellnessPreferences = { ...user.wellnessPreferences, ...wellnessPreferences };
    }
    if (notificationPreferences) {
      user.notificationPreferences = { ...user.notificationPreferences, ...notificationPreferences };
    }
    if (appSettings) {
      user.appSettings = { ...user.appSettings, ...appSettings };
    }
    if (assistantSettings) {
      user.assistantSettings = { ...user.assistantSettings, ...assistantSettings };
    }
    if (journalPreferences) {
      user.journalPreferences = { ...user.journalPreferences, ...journalPreferences };
    }
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    // Save user with validation error handling
    try {
      await user.save();
    } catch (saveError) {
      console.error('Validation error saving user preferences:', saveError);
      
      // Handle validation errors specifically
      if (saveError.name === 'ValidationError' && saveError.errors) {
        const errorDetails = Object.keys(saveError.errors).map(key => {
          return `${key}: ${saveError.errors[key].message}`;
        }).join(', ');
        
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errorDetails,
          message: 'Some preferences contain invalid values. Please check your genre selections and try again. Note: Server may need to be restarted to load updated schema.',
        });
      }
      
      // Re-throw if it's not a validation error
      throw saveError;
    }

    res.status(200).json({
      success: true,
      data: {
        personalInfo: user.personalInfo || {},
        musicPreferences: user.musicPreferences || {},
        wellnessPreferences: user.wellnessPreferences || {},
        notificationPreferences: user.notificationPreferences || {},
        appSettings: user.appSettings || {},
        assistantSettings: user.assistantSettings || {},
        preferences: user.preferences || {},
      },
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    
    // Provide more helpful error messages
    if (error.message && error.message.includes('enum')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid enum values',
        message: 'Some values are not valid. The server may need to be restarted to load the updated schema. Please restart the server and try again.',
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred',
      message: 'Failed to save preferences. Please try again.',
    });
  }
};

/**
 * POST /api/user/preferences
 * Update preferences for the logged-in user
 */
router.post('/', updateUserPreferences);

/**
 * PUT /api/user/preferences
 * Update preferences for the logged-in user (same as POST)
 */
router.put('/', updateUserPreferences);

/**
 * PUT /api/user/preferences/:userId
 * Update preferences for the logged-in user (alternative route with userId in path)
 */
router.put('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      email,
      name,
      personalInfo,
      musicPreferences,
      wellnessPreferences,
      notificationPreferences,
      appSettings,
      assistantSettings,
      journalPreferences,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Find or create user
    let user = await User.findOne({ userId });

    if (!user) {
      // Create new user - only set email if it's provided and not empty
      const userData = {
        userId,
        name: name || 'User',
      };
      // Only add email if it's provided and not empty (to avoid unique constraint issues)
      if (email && email.trim()) {
        userData.email = email.trim().toLowerCase();
      }
      user = new User(userData);
    } else {
      // Update basic info if provided
      if (email && email.trim()) {
        user.email = email.trim().toLowerCase();
      }
      if (name && name.trim()) {
        user.name = name.trim();
      }
    }

    // Update preferences
    if (personalInfo) {
      // Clean personalInfo - remove empty/undefined values
      const cleanedPersonalInfo = {};
      if (personalInfo.age && personalInfo.age > 0) {
        cleanedPersonalInfo.age = personalInfo.age;
      }
      if (personalInfo.gender && personalInfo.gender.trim()) {
        cleanedPersonalInfo.gender = personalInfo.gender;
      }
      if (personalInfo.country && personalInfo.country.trim()) {
        cleanedPersonalInfo.country = personalInfo.country;
      }
      
      // Only update if there's something to update
      if (Object.keys(cleanedPersonalInfo).length > 0) {
        user.personalInfo = { ...user.personalInfo, ...cleanedPersonalInfo };
      }
    }
    if (musicPreferences) {
      const cleanedMusicPreferences = cleanMusicPreferences(musicPreferences);
      if (cleanedMusicPreferences) {
        user.musicPreferences = { ...user.musicPreferences, ...cleanedMusicPreferences };
      }
    }
    if (wellnessPreferences) {
      user.wellnessPreferences = { ...user.wellnessPreferences, ...wellnessPreferences };
    }
    if (notificationPreferences) {
      user.notificationPreferences = { ...user.notificationPreferences, ...notificationPreferences };
    }
    if (appSettings) {
      user.appSettings = { ...user.appSettings, ...appSettings };
    }
    if (assistantSettings) {
      user.assistantSettings = { ...user.assistantSettings, ...assistantSettings };
    }
    if (journalPreferences) {
      user.journalPreferences = { ...user.journalPreferences, ...journalPreferences };
    }
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    // Save user with validation error handling
    try {
      await user.save();
    } catch (saveError) {
      console.error('Validation error saving user preferences:', saveError);
      
      // Handle validation errors specifically
      if (saveError.name === 'ValidationError' && saveError.errors) {
        const errorDetails = Object.keys(saveError.errors).map(key => {
          return `${key}: ${saveError.errors[key].message}`;
        }).join(', ');
        
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errorDetails,
          message: 'Some of your preferences contain invalid values. Please check and try again.',
        });
      }
      
      // Re-throw if it's not a validation error
      throw saveError;
    }

    res.status(200).json({
      success: true,
      data: {
        personalInfo: user.personalInfo || {},
        musicPreferences: user.musicPreferences || {},
        wellnessPreferences: user.wellnessPreferences || {},
        notificationPreferences: user.notificationPreferences || {},
        appSettings: user.appSettings || {},
        assistantSettings: user.assistantSettings || {},
        journalPreferences: user.journalPreferences || {},
        preferences: user.preferences || {},
      },
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred',
      message: 'Failed to save preferences. Please try again.',
    });
  }
});

module.exports = router;
