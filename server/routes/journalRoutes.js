/**
 * Journal Routes
 * Handles API endpoints for journaling functionality
 * 
 * Routes:
 * - GET /api/journal - Get all journal entries (for a user)
 * - POST /api/journal - Create a new journal entry
 * - GET /api/journal/:id - Get a specific journal entry
 * - PUT /api/journal/:id - Update a journal entry
 * - DELETE /api/journal/:id - Delete a journal entry
 */

const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');

/**
 * GET /api/journal
 * Retrieve journal entries for a specific user from MongoDB
 * Returns entries sorted by most recent first
 * Query params: userId (required)
 */
router.get('/', async (req, res) => {
  try {
    // Get userId from query params, body, or headers
    const userId = req.query.userId || req.body.userId || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Fetch journal entries for this specific user only, sorted by newest first
    const entries = await JournalEntry.find({ userId: userId }).sort({ date: -1 });
    
    res.json({
      success: true,
      data: entries,
      count: entries.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/journal
 * Create a new journal entry in MongoDB
 * Body params: content (required), date (optional), tags (optional), userId (required)
 */
router.post('/', async (req, res) => {
  try {
    const { content, date, tags, userId } = req.body;

    // Basic validation
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Journal content is required'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Create new journal entry with JournalEntry model
    const newEntry = new JournalEntry({
      userId: userId,
      content: content.trim(),
      date: date ? new Date(date) : new Date(),
      tags: tags || [],
    });

    // Save to MongoDB database
    const savedEntry = await newEntry.save();

    res.status(201).json({
      success: true,
      data: savedEntry,
      message: 'Journal entry created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/journal/:id
 * Get a specific journal entry by ID from MongoDB
 * Query params: userId (required) - ensures user can only access their own entries
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || req.body.userId || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    // Find journal entry by MongoDB _id and userId (to ensure user can only access their own entries)
    const entry = await JournalEntry.findOne({ _id: id, userId: userId });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/journal/:id
 * Update a journal entry in MongoDB
 * Body params: userId (required) - ensures user can only update their own entries
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, date, tags, userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Journal content is required'
      });
    }

    // Prepare update object with provided fields
    const updateData = {
      content: content.trim(),
    };
    if (date) updateData.date = new Date(date);
    if (tags) updateData.tags = tags;

    // Find and update journal entry in MongoDB (only if it belongs to the user)
    const updatedEntry = await JournalEntry.findOneAndUpdate(
      { _id: id, userId: userId },
      updateData,
      { new: true, runValidators: true } // Return updated document and run validators
    );

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      data: updatedEntry,
      message: 'Journal entry updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/journal
 * Delete all journal entries for a user from MongoDB
 * Query params: userId (required)
 * This route must come BEFORE DELETE /:id to ensure correct routing
 */
router.delete('/', async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId || req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Delete all journal entries for this user
    const result = await JournalEntry.deleteMany({ userId: userId });

    res.json({
      success: true,
      message: `Successfully cleared ${result.deletedCount} journal entries`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/journal/:id
 * Delete a journal entry from MongoDB
 * Query params: userId (required) - ensures user can only delete their own entries
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || req.body.userId || req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Find and delete journal entry from MongoDB (only if it belongs to the user)
    const deletedEntry = await JournalEntry.findOneAndDelete({ _id: id, userId: userId });

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

