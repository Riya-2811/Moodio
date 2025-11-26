/**
 * Mood Model
 * Defines the schema for mood tracking entries in MongoDB
 * 
 * Fields:
 * - moodType: String (required) - The type of mood (happy, sad, angry, etc.)
 * - timestamp: Date (default: now) - When the mood was logged
 * - note: String (optional) - Additional notes about the mood
 */

const mongoose = require('mongoose');

// Define the mood schema
const moodSchema = new mongoose.Schema({
  moodType: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    trim: true,
    default: '',
  },
  userId: {
    type: String,
    trim: true,
    default: '',
  },
  emotion: {
    type: String,
    trim: true,
    default: '',
  },
  confidence: {
    type: Number,
    default: 0,
  },
  detectionMethod: {
    type: String,
    enum: ['manual', 'auto'],
    default: 'manual',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the Mood model
const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;

