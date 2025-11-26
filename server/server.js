/**
 * Express Server for Moodio Backend
 * Handles API routes for mood tracking, journaling, and other features
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Performance Optimization: Enable compression (reduces network load by ~70%)
app.use(compression());

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Performance Optimization: Cache static files for 1 year
app.use(express.static(path.join(__dirname, '../public'), { 
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodio';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
  });

// Basic route for health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Moodio API is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
try {
  const moodRoutes = require('./routes/moodRoutes');
  const journalRoutes = require('./routes/journalRoutes');
  const detectMoodRoutes = require('./routes/detectMoodRoutes');
  const recommendationRoutes = require('./routes/recommendationRoutes');
  const userPreferencesRoutes = require('./routes/userPreferencesRoutes');
  const chatRoutes = require('./routes/chatRoutes');
  const playlistRoutes = require('./routes/playlistRoutes');
  const musicRoutes = require('./routes/musicRoutes');
  const contactRoutes = require('./routes/contactRoutes');
  const therapistRoutes = require('./routes/therapistRoutes');
  
  app.use('/api/moods', moodRoutes);
  app.use('/api/journal', journalRoutes);
  app.use('/api/detect-mood', detectMoodRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/user/preferences', userPreferencesRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/playlists', playlistRoutes);
  app.use('/api/music', musicRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/therapist', therapistRoutes);
  
  console.log('✅ All routes loaded successfully');
  console.log('   - Music routes: /api/music/recommend, /api/music/test');
  console.log('   - Contact routes: /api/contact');
  console.log('   - Therapist routes: /api/therapist');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error(error.stack);
}

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Moodio API',
    version: '1.0.0',
      endpoints: {
        health: '/api/health',
        moods: '/api/moods',
        journal: '/api/journal',
        detectMood: '/api/detect-mood',
        recommendations: '/api/recommendations',
        chat: '/api/chat',
        userPreferences: '/api/user/preferences',
        playlists: '/api/playlists',
        music: '/api/music'
      }
  });
});

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Moodio server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

module.exports = app;

