const mongoose = require('mongoose');

/**
 * User Model
 * Stores user profile and preferences
 */
const userSchema = new mongoose.Schema({
  // Authentication fields (from localStorage auth)
  email: {
    type: String,
    required: false, // Made optional since we might not have email initially
    unique: true,
    sparse: true, // Allows multiple null/undefined values
    trim: true,
    lowercase: true,
    default: '',
  },
  name: {
    type: String,
    required: false, // Made optional since we might not have name initially
    trim: true,
    default: 'User',
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  
  // Personal Information
  personalInfo: {
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      default: undefined,
    },
    country: {
      type: String,
      trim: true,
    },
  },

  // Music Preferences
  musicPreferences: {
    favoriteGenres: [{
      type: String,
      enum: ['pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop', 'country', 'folk', 'indie', 'r&b', 'reggae', 'metal', 'blues', 'bollywood', 'lo-fi', 'instrumental', 'other'],
    }],
    preferredPlatform: {
      type: String,
      enum: ['spotify', 'youtube', 'apple-music', 'soundcloud', 'any'],
      default: 'spotify',
    },
    preferenceType: {
      type: String,
      enum: ['with-lyrics', 'instrumental', 'both'],
      default: 'both',
    },
  },

  // Wellness Preferences
  wellnessPreferences: {
    exerciseTypes: [{
      type: String,
      enum: ['breathing', 'meditation', 'yoga', 'stretching', 'cardio', 'strength', 'walking', 'other'],
    }],
    negativeMoodAlertSensitivity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dailyGoal: {
      type: String,
      trim: true,
      default: 'Track mood daily and maintain wellness',
    },
  },

  // Notification Preferences
  notificationPreferences: {
    thoughtOfTheDay: {
      type: Boolean,
      default: true,
    },
    reminders: {
      type: Boolean,
      default: true,
    },
    moodTrackingReminder: {
      type: Boolean,
      default: true,
    },
    personalizedCareNotifications: {
      type: Boolean,
      default: true,
    },
    moodDetectionReminders: {
      type: Boolean,
      default: true,
    },
    wellbeingReminders: {
      type: Boolean,
      default: true,
    },
    supportiveReminders: {
      type: Boolean,
      default: true,
    },
  },

  // Journal Preferences
  journalPreferences: {
    showPreviousEntries: {
      type: Boolean,
      default: false, // Hidden/private by default
    },
  },

  // Language and App Tone
  appSettings: {
    language: {
      type: String,
      enum: ['en', 'es', 'fr', 'de', 'it'],
      default: 'en',
    },
    appTone: {
      type: String,
      enum: ['friendly', 'professional', 'casual', 'supportive'],
      default: 'friendly',
    },
  },

  // Assistant Customization
  assistantSettings: {
    avatar: {
      type: String,
      enum: ['default', 'cute', 'professional', 'energetic', 'calm'],
      default: 'default',
    },
    greetingTone: {
      type: String,
      enum: ['cheerful', 'warm', 'calm', 'enthusiastic', 'gentle'],
      default: 'cheerful',
    },
  },

  // User Preferences (from signup preferences page)
  preferences: {
    musicGenres: [{
      type: String,
    }],
    otherGenre: {
      type: String,
      trim: true,
    },
    listeningTimes: [{
      type: String,
    }],
    moods: [{
      type: String,
    }],
    languages: [{
      type: String,
    }],
    intensity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    moodBasedRecommendations: {
      type: Boolean,
      default: true,
    },
    additionalInfo: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
}, {
  timestamps: true,
  // Allow additional fields to be stored (for flexibility)
  strict: false,
  // Set validateBeforeSave to false to handle validation manually
  validateBeforeSave: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;

