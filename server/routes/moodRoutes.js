/**
 * Mood Routes
 * Handles API endpoints for mood tracking functionality
 * 
 * Routes:
 * - GET /api/moods - Get all mood entries (for a user)
 * - POST /api/moods - Create a new mood entry
 * - GET /api/moods/:id - Get a specific mood entry
 * - PUT /api/moods/:id - Update a mood entry
 * - DELETE /api/moods/:id - Delete a mood entry
 */

const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

/**
 * GET /api/moods
 * Retrieve mood entries for a specific user from MongoDB
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

    // Fetch mood entries for this specific user only, sorted by newest first
    const moods = await Mood.find({ userId: userId }).sort({ timestamp: -1 });
    
    res.json({
      success: true,
      data: moods,
      count: moods.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/moods
 * Create a new mood entry in MongoDB
 * Body params: mood (required), notes (optional), date (optional), userId (required)
 */
router.post('/', async (req, res) => {
  try {
    const { mood, notes, date, userId } = req.body;

    // Basic validation
    if (!mood) {
      return res.status(400).json({
        success: false,
        error: 'Mood is required'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Create new mood entry with Mood model
    const newMoodEntry = new Mood({
      moodType: mood,
      note: notes || '',
      timestamp: date ? new Date(date) : new Date(),
      userId: userId,
    });

    // Save to MongoDB database
    const savedMood = await newMoodEntry.save();

    res.status(201).json({
      success: true,
      data: savedMood,
      message: 'Mood entry created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/moods/:id
 * Get a specific mood entry by ID from MongoDB
 * Query params: userId (required) - ensures user can only access their own moods
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
    
    // Find mood entry by MongoDB _id and userId (to ensure user can only access their own moods)
    const moodEntry = await Mood.findOne({ _id: id, userId: userId });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      data: moodEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/moods/:id
 * Update a mood entry in MongoDB
 * Body params: userId (required) - ensures user can only update their own moods
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mood, notes, date, userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Prepare update object with only provided fields
    const updateData = {};
    if (mood) updateData.moodType = mood;
    if (notes !== undefined) updateData.note = notes;
    if (date) updateData.timestamp = new Date(date);

    // Find and update mood entry in MongoDB (only if it belongs to the user)
    const updatedMood = await Mood.findOneAndUpdate(
      { _id: id, userId: userId },
      updateData,
      { new: true, runValidators: true } // Return updated document and run validators
    );

    if (!updatedMood) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      data: updatedMood,
      message: 'Mood entry updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/moods - Clear all mood history for a user
 * Query params: userId (required) - ensures user can only clear their own mood history
 * NOTE: This route must be defined BEFORE the /:id route to avoid route matching conflicts
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

    // Delete all mood entries for this user
    const result = await Mood.deleteMany({ userId: userId });

    res.json({
      success: true,
      message: `Successfully cleared ${result.deletedCount} mood entries`,
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
 * DELETE /api/moods/:id
 * Delete a mood entry from MongoDB
 * Query params: userId (required) - ensures user can only delete their own moods
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

    // Find and delete mood entry from MongoDB (only if it belongs to the user)
    const deletedMood = await Mood.findOneAndDelete({ _id: id, userId: userId });

    if (!deletedMood) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

