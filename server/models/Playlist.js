const mongoose = require('mongoose');

/**
 * Playlist Schema
 * Stores user-created playlists and their details
 */
const playlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '🎵',
  },
  songs: {
    type: [{
      title: { type: String, required: true },
      artist: { type: String, default: '' },
      url: { type: String, default: '' },
      platform: { type: String, enum: ['spotify', 'youtube', 'apple-music', 'soundcloud', 'other'], default: 'spotify' },
    }],
    default: [],
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'stressed', 'calm', 'excited', 'anxious', 'grateful', 'crying', 'other'],
    default: 'other',
  },
  genre: {
    type: [String],
    default: [],
  },
  platform: {
    type: String,
    enum: ['spotify', 'youtube', 'apple-music', 'soundcloud', 'mixed'],
    default: 'mixed',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

// Index for efficient queries
playlistSchema.index({ userId: 1, createdAt: -1 });
playlistSchema.index({ mood: 1 });
playlistSchema.index({ genre: 1 });

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;

