/**
 * Journal Entry Model
 * Defines the schema for journal entries in MongoDB
 * 
 * Fields:
 * - content: String (required) - The journal entry text
 * - date: Date (default: now) - The date of the journal entry
 * - tags: Array of Strings (optional) - Tags for categorizing entries
 */

const mongoose = require('mongoose');

// Define the journal entry schema
const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Index for efficient queries
journalEntrySchema.index({ userId: 1, date: -1 });

// Create and export the JournalEntry model
const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

module.exports = JournalEntry;

