/**
 * Recommendation Routes
 * Handles API endpoints for personalized recommendations based on mood
 */

const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

/**
 * GET /api/recommendations
 * Get personalized recommendations based on user's mood history
 */
router.get('/', async (req, res) => {
  try {
    const { userId, mood } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'UserId is required',
      });
    }

    // Fetch user's recent mood history
    const recentMoods = await Mood.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .exec();

    // Analyze mood trends
    const moodCounts = {};
    recentMoods.forEach((entry) => {
      moodCounts[entry.moodType] = (moodCounts[entry.moodType] || 0) + 1;
    });

    // Determine dominant mood from history
    let dominantMood = mood || 'calm';
    let maxCount = 0;
    Object.keys(moodCounts).forEach((moodType) => {
      if (moodCounts[moodType] > maxCount) {
        maxCount = moodCounts[moodType];
        dominantMood = moodType;
      }
    });

    // Generate recommendations based on mood
    const recommendations = generateRecommendations(dominantMood, recentMoods);

    res.status(200).json({
      success: true,
      data: {
        dominantMood,
        moodHistory: recentMoods,
        recommendations,
        trends: {
          totalEntries: recentMoods.length,
          moodDistribution: moodCounts,
        },
      },
      message: 'Recommendations retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Generate personalized recommendations based on mood
 */
const generateRecommendations = (mood, moodHistory) => {
  const recommendations = {
    music: [],
    exercises: [],
    tips: [],
  };

  // Positive moods
  if (['happy', 'calm', 'excited'].includes(mood)) {
    recommendations.music = [
      { id: 1, title: 'Dance Vibes', description: 'Upbeat tracks to keep your energy high' },
      { id: 2, title: 'Summer Energy', description: 'Feel-good hits perfect for a sunny day' },
    ];
    recommendations.tips = [
      'Maintain this positive energy!',
      'Consider journaling about what made you feel good today.',
    ];
  }

  // Negative moods
  if (['sad', 'angry', 'stressed', 'anxious'].includes(mood)) {
    recommendations.music = [
      { id: 1, title: 'Calm Down Mix', description: 'Slow, peaceful tracks to help you decompress' },
      { id: 2, title: 'Lo-Fi Chill', description: 'Relaxing beats to lower your stress' },
    ];
    recommendations.exercises = [
      { id: 1, title: 'Deep Breathing', duration: '5 minutes', type: 'breathing' },
      { id: 2, title: 'Progressive Muscle Relaxation', duration: '10 minutes', type: 'relaxation' },
    ];
    recommendations.tips = [
      'Take a moment for yourself.',
      'Remember, feelings are temporary.',
      'Practice self-compassion.',
    ];
  }

  // Analyze trends - if negative moods are frequent
  const negativeMoodCount = moodHistory.filter((m) =>
    ['sad', 'angry', 'stressed', 'anxious'].includes(m.moodType)
  ).length;

  if (negativeMoodCount > 3) {
    recommendations.tips.push(
      'You\'ve been experiencing some challenging moods lately. Consider reaching out for support.'
    );
  }

  return recommendations;
};

module.exports = router;

