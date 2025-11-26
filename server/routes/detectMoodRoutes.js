/**
 * Detect Mood Routes
 * Handles API endpoints for real-time mood detection
 * 
 * Routes:
 * - POST /api/detect-mood - Save a detected mood from real-time detection
 */

const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

/**
 * POST /api/detect-mood
 * Save a detected mood from real-time emotion detection
 */
router.post('/', async (req, res) => {
  try {
    const { mood, emotion, confidence, userId, timestamp } = req.body;

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

    // Create new mood entry with detection metadata
    const newMoodEntry = new Mood({
      moodType: mood,
      emotion: emotion || '',
      confidence: confidence || 0,
      userId: userId,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      note: `Auto-detected: ${emotion || mood} (confidence: ${confidence ? (confidence * 100).toFixed(1) : 0}%)`,
      detectionMethod: 'auto',
    });

    // Save to MongoDB database
    const savedMood = await newMoodEntry.save();

    res.status(201).json({
      success: true,
      data: savedMood,
      message: 'Detected mood saved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

