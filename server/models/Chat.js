const mongoose = require('mongoose');

/**
 * Chat Message Schema
 * Stores individual chat messages for conversation history
 */
const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true, // Index for faster queries
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
  },
  response: {
    type: String,
    required: [true, 'Response content is required'],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true, // Index for sorting by date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries by userId and timestamp
chatMessageSchema.index({ userId: 1, timestamp: -1 });

const Chat = mongoose.model('Chat', chatMessageSchema);

module.exports = Chat;

