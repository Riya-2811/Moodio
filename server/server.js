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

// CORS Configuration - MUST be first, before any other middleware
const allowedOrigins = [
  "https://moodio-10.onrender.com",
  "http://localhost:3000",
  "http://localhost:3001"
];

// Use cors package with explicit configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or same-origin)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Log for debugging
        console.log(`[CORS] Origin not in allowed list: ${origin}`);
        // In production, be strict; in development, allow all
        if (process.env.NODE_ENV === 'production') {
          callback(new Error('Not allowed by CORS'));
        } else {
          callback(null, true);
        }
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  })
);

// Additional manual CORS middleware as backup - ensures headers are always set
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Log for debugging
  console.log(`[CORS] Request from origin: ${origin}, Method: ${req.method}, Path: ${req.path}`);
  
  // Always set CORS headers if origin matches
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type, Authorization');
    console.log(`[CORS] Headers set for origin: ${origin}`);
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[CORS] Handling OPTIONS preflight for ${req.path}`);
    return res.status(204).end();
  }
  
  next();
});

// Performance Optimization: Enable compression (reduces network load by ~70%)
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Performance Optimization: Cache static files for 1 year
app.use(express.static(path.join(__dirname, '../public'), { 
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodio';

// Validate MongoDB URI format
if (MONGODB_URI && !MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  console.warn('⚠️  Invalid MongoDB URI format. Expected "mongodb://" or "mongodb+srv://"');
  console.warn('⚠️  Server will continue without database connection');
} else if (MONGODB_URI) {
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
      console.warn('⚠️  Server will continue without database connection');
    });
} else {
  console.warn('⚠️  No MongoDB URI provided. Server will continue without database connection');
}

// Basic route for health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Moodio API is running',
    timestamp: new Date().toISOString()
  });
});

// CORS test route
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    status: 'CORS is working',
    origin: req.headers.origin,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Test route for preferences endpoint
app.get('/api/user/preferences/test', (req, res) => {
  res.json({ 
    status: 'Preferences endpoint is accessible',
    origin: req.headers.origin,
    method: req.method,
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

// Start server - bind to 0.0.0.0 for Render deployment
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Moodio server is running on port ${PORT}`);
  console.log(`📡 API available at http://0.0.0.0:${PORT}/api`);
  console.log(`🌐 Server bound to 0.0.0.0 for external access`);
});

module.exports = app;

