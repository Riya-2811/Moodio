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

/* ------------------------------------------------------------------
   FIXED + CLEAN CORS CONFIGURATION
------------------------------------------------------------------ */

const allowedOrigins = [
  "https://moodio-frontend.onrender.com",     // your new frontend
  "https://moodio-10.onrender.com",           // old frontend if needed
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5001",
  "http://localhost:5173"                     // vite default
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / same-origin

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`[CORS BLOCKED] Origin not allowed: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true
  })
);

/* ------------------------------------------------------------------
   PERFORMANCE + MIDDLEWARE
------------------------------------------------------------------ */

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Don't serve static files - frontend is deployed separately on Render
// Static file serving removed to prevent %PUBLIC_URL% errors

// Handle any path containing %PUBLIC_URL% (React build placeholders) - must be early
app.use((req, res, next) => {
  if (req.path.includes('%PUBLIC_URL%') || req.path.includes('PUBLIC_URL')) {
    return res.status(404).json({
      error: "Resource not found",
      message: "This is the backend API server. Frontend assets are served at https://moodio-10.onrender.com",
      path: req.path,
    });
  }
  next();
});

/* ------------------------------------------------------------------
   MONGODB CONNECTION
------------------------------------------------------------------ */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("⚠️  No MONGODB_URI provided.");
} else {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) =>
      console.error("❌ MongoDB connection error:", err.message)
    );
}

/* ------------------------------------------------------------------
   ROUTES
------------------------------------------------------------------ */

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Moodio API running",
    timestamp: new Date().toISOString(),
  });
});

// Test routes
app.get("/api/cors-test", (req, res) => {
  res.json({
    status: "CORS is working",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/user/preferences/test", (req, res) => {
  res.json({
    status: "Preferences endpoint OK",
    origin: req.headers.origin,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Import actual routes
try {
  const moodRoutes = require("./routes/moodRoutes");
  const journalRoutes = require("./routes/journalRoutes");
  const detectMoodRoutes = require("./routes/detectMoodRoutes");
  const recommendationRoutes = require("./routes/recommendationRoutes");
  const userPreferencesRoutes = require("./routes/userPreferencesRoutes");
  const chatRoutes = require("./routes/chatRoutes");
  const playlistRoutes = require("./routes/playlistRoutes");
  const musicRoutes = require("./routes/musicRoutes");
  const contactRoutes = require("./routes/contactRoutes");
  const therapistRoutes = require("./routes/therapistRoutes");

  app.use("/api/moods", moodRoutes);
  app.use("/api/journal", journalRoutes);
  app.use("/api/detect-mood", detectMoodRoutes);
  app.use("/api/recommendations", recommendationRoutes);
  app.use("/api/user/preferences", userPreferencesRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/playlists", playlistRoutes);
  app.use("/api/music", musicRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/therapist", therapistRoutes);

  console.log("✅ All routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading routes:", error.message);
}

/* ------------------------------------------------------------------
   HANDLE COMMON BROWSER RESOURCE REQUESTS
   These prevent 404 errors when browsers try to load favicon, manifest, etc.
------------------------------------------------------------------ */

app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // No content
});

app.get("/favicon.svg", (req, res) => {
  res.status(204).end(); // No content
});

app.get("/manifest.json", (req, res) => {
  res.status(204).end(); // No content
});

app.get("/robots.txt", (req, res) => {
  res.status(204).end(); // No content
});

/* ------------------------------------------------------------------
   DEFAULT ROUTE
------------------------------------------------------------------ */

app.get("/", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    message: "Welcome to Moodio API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      contact: "/api/contact",
      therapist: "/api/therapist",
    },
    note: "This is the backend API. Frontend is available at https://moodio-10.onrender.com",
  });
});

// Catch-all for non-API routes (must come after all other routes)
app.use((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  // Only handle non-API routes
  if (!req.path.startsWith("/api")) {
    res.status(404).json({
      error: "Not Found",
      message: "This is the backend API server. The frontend is available at https://moodio-10.onrender.com",
      path: req.path,
    });
  } else {
    // API route not found
    res.status(404).json({
      error: "API endpoint not found",
      path: req.path,
      method: req.method,
    });
  }
});

/* ------------------------------------------------------------------
   ERROR HANDLER
------------------------------------------------------------------ */

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

/* ------------------------------------------------------------------
   SERVER START
------------------------------------------------------------------ */

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Moodio backend running on ${PORT}`);
});

server.on("error", (e) => console.error("❌ Server error:", e));
server.on("close", () => console.log("⚠️ Server closed"));

module.exports = app;
