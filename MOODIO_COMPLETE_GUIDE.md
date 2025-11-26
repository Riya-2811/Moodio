# 🧠💚 MOODIO - COMPLETE PROJECT DOCUMENTATION
## Everything You Need to Know for Viva Preparation

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Structure](#architecture--structure)
4. [Database Schema](#database-schema)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [User Interaction Flow](#user-interaction-flow)
8. [API Endpoints](#api-endpoints)
9. [File-by-File Breakdown](#file-by-file-breakdown)
10. [Key Features Implementation](#key-features-implementation)
11. [Flowcharts & Diagrams](#flowcharts--diagrams)

---

## 🎯 PROJECT OVERVIEW

**Moodio** is a comprehensive mental wellness platform designed to help users:
- Track daily moods and emotions with real-time facial emotion detection
- Write journal entries to express feelings
- Get personalized music recommendations based on mood
- Chat with an empathetic AI Twin for emotional support
- Access wellness exercises and activities

**Target Audience**: Individuals seeking to improve their mental health and emotional well-being.

**Core Philosophy**: Mental wellness should be accessible, simple, and supportive.

---

## 🛠️ TECHNOLOGY STACK

### **Frontend Technologies**
1. **React 19.0.2** - UI library for building interactive user interfaces
2. **React Router DOM 7.9.5** - Client-side routing and navigation
3. **Tailwind CSS 3.3** - Utility-first CSS framework for styling
4. **PostCSS 8.5.6** - CSS processing tool
5. **Autoprefixer 10.4.21** - Automatic vendor prefixing
6. **React Icons 5.5.0** - Icon library
7. **Chart.js 4.4.1** - Data visualization library
8. **React Chart.js 2.5.3.1** - React wrapper for Chart.js
9. **Axios 1.13.1** - HTTP client for API requests
10. **face-api.js 0.22.2** - Real-time facial emotion detection

### **Backend Technologies**
1. **Node.js** - JavaScript runtime environment
2. **Express.js 4.21.2** - Web application framework
3. **MongoDB** - NoSQL database for data storage
4. **Mongoose 8.19.2** - MongoDB object modeling (ODM)
5. **CORS 2.8.5** - Cross-Origin Resource Sharing middleware
6. **dotenv 16.3.1** - Environment variable management

### **AI/ML Technologies**
1. **OpenAI GPT-3.5-turbo** - AI chatbot support (optional)
2. **Google Gemini** - Alternative AI provider (optional)
3. **face-api.js** - Facial emotion detection models:
   - Tiny Face Detector
   - Face Landmark 68
   - Face Recognition Net
   - Face Expression Net

### **Development Tools**
1. **React Scripts 5.0.1** - Build tool for React apps
2. **Concurrently 8.2.2** - Run multiple commands simultaneously
3. **Web Vitals 2.1.4** - Performance monitoring

### **Languages Used**
- **JavaScript (ES6+)** - Primary language for both frontend and backend
- **JSX** - React's syntax extension for writing UI components
- **JSON** - Data interchange format
- **CSS** - Styling (via Tailwind)
- **HTML** - Markup structure

---

## 🏗️ ARCHITECTURE & STRUCTURE

### **Project Structure**
```
moodio/
├── public/                          # Static assets
│   ├── models/                      # face-api.js ML models
│   │   ├── face_expression_model-shard1
│   │   ├── face_expression_model-weights_manifest.json
│   │   ├── face_landmark_68_model-shard1
│   │   ├── face_landmark_68_model-weights_manifest.json
│   │   ├── face_recognition_model-shard1/2
│   │   ├── face_recognition_model-weights_manifest.json
│   │   ├── tiny_face_detector_model-shard1
│   │   └── tiny_face_detector_model-weights_manifest.json
│   ├── index.html                   # Main HTML entry point
│   ├── favicon.ico                  # App icon
│   └── manifest.json                # PWA manifest
│
├── server/                          # Backend Express server
│   ├── models/                      # MongoDB models (Mongoose schemas)
│   │   ├── User.js                  # User model with preferences
│   │   ├── Mood.js                  # Mood tracking entries
│   │   ├── JournalEntry.js          # Journal entries
│   │   └── Playlist.js              # Music playlists
│   ├── routes/                      # API route handlers
│   │   ├── moodRoutes.js            # Mood CRUD operations
│   │   ├── journalRoutes.js         # Journal CRUD operations
│   │   ├── detectMoodRoutes.js      # Auto-detected mood saving
│   │   ├── recommendationRoutes.js  # Personalized recommendations
│   │   ├── userPreferencesRoutes.js # User settings & preferences
│   │   ├── chatRoutes.js            # AI chat endpoints
│   │   └── playlistRoutes.js        # Playlist management
│   └── server.js                    # Express server entry point
│
├── src/                             # React frontend source
│   ├── components/                  # Reusable React components
│   │   ├── Navbar.jsx               # Navigation bar with theme toggle
│   │   ├── Footer.jsx               # Footer component
│   │   ├── MoodTracker.jsx          # Manual mood selection & tracking
│   │   ├── EmotionDetector.jsx      # Full-page emotion detection
│   │   ├── RealTimeMoodDetector.jsx # Real-time webcam mood detection
│   │   ├── Chatbot.jsx              # AI Twin chat interface
│   │   ├── MusicRecommender.jsx     # Music recommendation component
│   │   ├── Journal.jsx              # Journal entry component (page)
│   │   ├── ProtectedRoute.jsx       # Route authentication guard
│   │   ├── SmartSuggestions.jsx     # Mood-based suggestions modal
│   │   ├── NegativeMoodSupportModal.jsx # Support for negative moods
│   │   ├── WebcamModal.jsx          # Webcam detection modal
│   │   ├── FloatingCameraButton.jsx # Floating action button
│   │   ├── CuteAssistant.jsx        # Animated assistant character
│   │   ├── Logo.jsx                 # App logo component
│   │   ├── SplashScreen.jsx         # Loading splash screen
│   │   ├── ThoughtOfTheDay.jsx      # Daily motivational quotes
│   │   └── Toast.jsx                # Toast notification component
│   │
│   ├── pages/                        # Page-level components
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Login.jsx                # User login page
│   │   ├── Signup.jsx               # User registration page
│   │   ├── Journal.jsx              # Journal page (uses component)
│   │   ├── Profile.jsx              # User profile page
│   │   ├── Exercises.jsx            # Wellness exercises page
│   │   ├── Therapist.jsx           # Therapist information page
│   │   └── Contact.jsx             # Contact page
│   │
│   ├── context/                      # React Context API providers
│   │   ├── AuthContext.jsx          # Authentication state management
│   │   └── MoodContext.jsx          # Mood state management
│   │
│   ├── utils/                        # Utility functions
│   │   ├── api.js                   # Axios API configuration
│   │   ├── NotificationService.js   # Notification helpers
│   │   └── wearables.js             # Wearable device integration (future)
│   │
│   ├── data/                         # Static data
│   │   └── musicRecommendations.js  # Pre-defined music suggestions
│   │
│   ├── App.jsx                       # Main app component with routing
│   ├── App.css                       # Global app styles
│   ├── index.js                      # React entry point
│   └── index.css                     # Global styles with Tailwind
│
├── package.json                      # Dependencies & scripts
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── README.md                         # Project documentation
├── QUICK_START.md                    # Quick setup guide
└── TEST_API.md                       # API testing guide
```

---

## 🗄️ DATABASE SCHEMA

### **MongoDB Collections**

#### **1. Users Collection**
**Model**: `server/models/User.js`

**Schema Structure**:
```javascript
{
  // Authentication & Identity
  userId: String (required, unique, indexed),
  email: String (optional, unique, sparse),
  name: String (optional, default: 'User'),
  
  // Personal Information
  personalInfo: {
    age: Number (1-120),
    gender: String (enum: 'male', 'female', 'other', 'prefer-not-to-say'),
    country: String
  },
  
  // Music Preferences
  musicPreferences: {
    favoriteGenres: [String] (enum: pop, rock, jazz, classical, etc.),
    preferredPlatform: String (enum: spotify, youtube, apple-music, etc.),
    preferenceType: String (enum: 'with-lyrics', 'instrumental', 'both')
  },
  
  // Wellness Preferences
  wellnessPreferences: {
    exerciseTypes: [String] (enum: breathing, meditation, yoga, etc.),
    negativeMoodAlertSensitivity: String (enum: 'low', 'medium', 'high'),
    dailyGoal: String
  },
  
  // Notification Preferences
  notificationPreferences: {
    thoughtOfTheDay: Boolean (default: true),
    reminders: Boolean (default: true),
    moodTrackingReminder: Boolean (default: true)
  },
  
  // App Settings
  appSettings: {
    language: String (enum: 'en', 'es', 'fr', 'de', 'it'),
    appTone: String (enum: 'friendly', 'professional', 'casual', 'supportive')
  },
  
  // Assistant Settings
  assistantSettings: {
    avatar: String (enum: 'default', 'cute', 'professional', etc.),
    greetingTone: String (enum: 'cheerful', 'warm', 'calm', etc.)
  },
  
  // Automatic timestamps
  createdAt: Date,
  updatedAt: Date
}
```

#### **2. Moods Collection**
**Model**: `server/models/Mood.js`

**Schema Structure**:
```javascript
{
  moodType: String (required),          // e.g., 'happy', 'sad', 'angry'
  timestamp: Date (default: now),      // When mood was logged
  note: String (optional),             // Additional notes
  userId: String (required),           // Associated user
  emotion: String (optional),          // Detected emotion name
  confidence: Number (default: 0),     // Detection confidence (0-1)
  detectionMethod: String (enum: 'manual', 'auto'),
  createdAt: Date,
  updatedAt: Date
}
```

#### **3. JournalEntries Collection**
**Model**: `server/models/JournalEntry.js`

**Schema Structure**:
```javascript
{
  userId: String (required),
  content: String (required),         // Journal entry text
  date: Date (default: now),          // Entry date
  tags: [String] (default: []),       // Categorization tags
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `{ userId: 1, date: -1 }` (for efficient queries)

#### **4. Playlists Collection**
**Model**: `server/models/Playlist.js`

**Schema Structure**:
```javascript
{
  userId: String (required),
  title: String (required, maxlength: 100),
  description: String (maxlength: 500),
  thumbnail: String (default: '🎵'),
  songs: [{
    title: String (required),
    artist: String,
    url: String,
    platform: String (enum: spotify, youtube, apple-music, etc.)
  }],
  mood: String (enum: happy, sad, angry, etc.),
  genre: [String],
  platform: String (enum: spotify, youtube, etc., default: 'mixed'),
  isPublic: Boolean (default: false),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: 
- `{ userId: 1, createdAt: -1 }`
- `{ mood: 1 }`
- `{ genre: 1 }`

---

## 🎨 FRONTEND ARCHITECTURE

### **Component Hierarchy**

```
App (Router)
├── AuthProvider (Context)
│   └── MoodProvider (Context)
│       └── AppContent
│           ├── Navbar (conditional)
│           ├── Routes
│           │   ├── Home
│           │   │   ├── WebcamModal
│           │   │   ├── FloatingCameraButton
│           │   │   ├── CuteAssistant
│           │   │   ├── ThoughtOfTheDay
│           │   │   └── ToastContainer
│           │   ├── MoodTracker (ProtectedRoute)
│           │   │   ├── RealTimeMoodDetector (Modal)
│           │   │   ├── SmartSuggestions
│           │   │   └── ToastContainer
│           │   ├── Journal (ProtectedRoute)
│           │   ├── MusicRecommender (ProtectedRoute)
│           │   ├── Chatbot (ProtectedRoute)
│           │   │   └── Chat Messages
│           │   ├── Exercises (ProtectedRoute)
│           │   ├── Profile (ProtectedRoute)
│           │   └── Contact (ProtectedRoute)
│           └── Footer (conditional)
```

### **State Management**

**React Context API** (No Redux):
1. **AuthContext** (`src/context/AuthContext.jsx`)
   - Manages user authentication state
   - Handles login, signup, logout
   - Manages user preferences
   - Uses localStorage for persistence

2. **MoodContext** (`src/context/MoodContext.jsx`)
   - Manages current mood state
   - Stores mood history
   - Handles mood saving

**Local State**: Components use `useState` and `useEffect` hooks for local state management.

### **Routing**

**React Router DOM 7.9.5**:
- **Public Routes**: `/login`, `/signup`
- **Protected Routes**: All other routes wrapped with `<ProtectedRoute>`
- **Navigation**: Programmatic navigation using `useNavigate()` hook

### **Styling System**

**Tailwind CSS 3.3** with custom configuration:
- **Custom Colors**:
  - Light: `sky-blue`, `soft-green`, `calm-purple`, `warm-pink`
  - Dark: `dark-bg`, `dark-surface`, `accent-blue`, `accent-purple`
- **Custom Border Radius**: `rounded-soft` (1rem), `rounded-softer` (1.5rem)
- **Dark Mode**: Toggleable via class-based system
- **Responsive**: Mobile-first design with breakpoints

---

## 🔧 BACKEND ARCHITECTURE

### **Server Setup**

**Entry Point**: `server/server.js`

**Middleware Stack**:
1. **CORS** - Enables cross-origin requests
2. **express.json()** - Parses JSON request bodies
3. **express.urlencoded()** - Parses URL-encoded bodies
4. **Error Handling** - Global error middleware

**MongoDB Connection**:
- Uses Mongoose ODM
- Connection string from environment variable
- Automatic connection retry logic

### **API Route Structure**

All routes prefixed with `/api`:

1. **Health Check**: `GET /api/health`
2. **Moods**: `/api/moods`
3. **Journal**: `/api/journal`
4. **Mood Detection**: `/api/detect-mood`
5. **Recommendations**: `/api/recommendations`
6. **User Preferences**: `/api/user/preferences`
7. **Chat**: `/api/chat`
8. **Playlists**: `/api/playlists`

### **Authentication Strategy**

**Current Implementation**: 
- Frontend-only authentication using localStorage
- User ID passed in request body/query/headers
- No JWT tokens or session management

**Future Enhancement**: Can implement JWT-based authentication

---

## 👤 USER INTERACTION FLOW

### **1. Application Entry Flow**

```
User Opens App
    ↓
Check localStorage for 'moodio_user'
    ↓
If User Found → Load User Data → Fetch Preferences from Backend
    ↓
If No User → Redirect to /login
    ↓
Protected Routes Check Authentication
    ↓
Show Home Page or Login Page
```

### **2. Authentication Flow**

```
User Registration:
    ↓
Fill Signup Form (email, name, password)
    ↓
Validate Input (email format, password length ≥ 6)
    ↓
Check if email exists in localStorage
    ↓
Create User Object → Store in localStorage
    ↓
Call Backend: POST /api/user/preferences (create user in MongoDB)
    ↓
Set Auth Context → Redirect to Home
```

```
User Login:
    ↓
Fill Login Form (email, password)
    ↓
Find User in localStorage 'moodio_users' array
    ↓
Verify Password (plain text comparison)
    ↓
Set Auth Context → Fetch Preferences from Backend
    ↓
Redirect to Home
```

### **3. Mood Tracking Flow**

#### **Option A: Manual Mood Selection**

```
User Clicks "Track Your Mood"
    ↓
MoodTracker Component Renders
    ↓
User Sees 8 Mood Options (Happy, Sad, Angry, etc.)
    ↓
User Selects Mood → Highlights Selected
    ↓
User Clicks "Log My Mood"
    ↓
Frontend: POST /api/moods
    Body: { mood, notes, userId, date }
    ↓
Backend: Create Mood Document → Save to MongoDB
    ↓
Save to MoodContext → Update localStorage
    ↓
Check Mood Type:
    - Positive (happy, calm, excited) → Navigate to /music
    - Negative (sad, angry, anxious) → Show SmartSuggestions Modal
```

#### **Option B: Real-Time Emotion Detection**

```
User Clicks "Detect Mood with Webcam"
    ↓
Request Camera Permission
    ↓
Load face-api.js Models (if not loaded)
    ↓
Start Webcam Stream
    ↓
Real-TimeMoodDetector Component:
    - Capture frames every 200ms
    - Run face-api.js detection on each frame
    - Collect detections for 10 seconds OR until 5 detections
    ↓
Calculate Dominant Mood from collected frames
    ↓
Frontend: POST /api/detect-mood
    Body: { mood, emotion, confidence, userId, timestamp }
    ↓
Backend: Create Mood Document with detectionMethod: 'auto'
    ↓
Save to MoodContext → Show Success Toast
    ↓
Based on Mood:
    - Negative → Show SmartSuggestions Modal
    - Positive → Navigate to /music
```

### **4. Journal Entry Flow**

```
User Navigates to /journal
    ↓
Journal Page Renders → Fetch Previous Entries
    GET /api/journal?userId=...
    ↓
Display Journal Entry Form + Previous Entries
    ↓
User Writes Entry → Click "Save Entry"
    ↓
Frontend: POST /api/journal
    Body: { content, userId, date, tags }
    ↓
Backend: Create JournalEntry Document → Save to MongoDB
    ↓
Refresh Entry List → Show Success Message
```

### **5. AI Chat Flow**

```
User Navigates to /chat
    ↓
Chatbot Component Renders with Welcome Message
    ↓
User Types Message → Click "Send"
    ↓
Frontend: POST /api/chat
    Body: { message, conversationHistory }
    ↓
Backend chatRoutes.js:
    - Check AI_PROVIDER env variable
    - If OpenAI → Call OpenAI API (gpt-3.5-turbo)
    - If Gemini → Call Google Gemini API
    - If No API Key → Use Fallback Responses
    ↓
Return AI Response
    ↓
Frontend: Display Response in Chat UI
    ↓
Add to Conversation History
```

### **6. Music Recommendation Flow**

```
User Navigates to /music OR Redirected from Mood Tracking
    ↓
MusicRecommender Component Renders
    ↓
Fetch User's Recent Moods: GET /api/moods?userId=...
    ↓
Frontend: GET /api/recommendations?userId=...&mood=...
    ↓
Backend:
    - Analyze mood history (last 10 entries)
    - Determine dominant mood
    - Generate recommendations based on mood:
      * Positive moods → Upbeat playlists
      * Negative moods → Calming playlists + exercises
    ↓
Display Recommendations:
    - Music Playlists
    - Wellness Tips
    - Exercises (if negative mood)
```

### **7. User Preferences Flow**

```
User Navigates to /profile
    ↓
Profile Page Renders → Fetch Current Preferences
    GET /api/user/preferences?userId=...
    ↓
Display Preference Forms:
    - Personal Info (age, gender, country)
    - Music Preferences (genres, platform)
    - Wellness Preferences (exercise types)
    - Notification Preferences
    - App Settings (language, tone)
    - Assistant Settings (avatar, greeting tone)
    ↓
User Updates Preferences → Click "Save"
    ↓
Frontend: POST /api/user/preferences
    Body: { userId, ...preferences }
    ↓
Backend:
    - Find or Create User Document
    - Merge new preferences with existing
    - Save to MongoDB
    ↓
Update AuthContext Preferences
    ↓
Show Success Message
```

---

## 📡 API ENDPOINTS

### **Base URL**: `http://localhost:5000/api`

### **1. Health Check**
- **GET** `/api/health`
- **Response**: `{ status: 'OK', message: 'Moodio API is running', timestamp: '...' }`

### **2. Mood Routes** (`/api/moods`)

#### **Get All Moods**
- **GET** `/api/moods?userId=...`
- **Query Params**: `userId` (required)
- **Response**: `{ success: true, data: [...], count: 10 }`

#### **Create Mood Entry**
- **POST** `/api/moods`
- **Body**: `{ mood: 'happy', notes: '...', date: '...', userId: '...' }`
- **Response**: `{ success: true, data: {...}, message: '...' }`

#### **Get Single Mood**
- **GET** `/api/moods/:id?userId=...`
- **Response**: `{ success: true, data: {...} }`

#### **Update Mood**
- **PUT** `/api/moods/:id`
- **Body**: `{ userId: '...', mood: '...', notes: '...', date: '...' }`
- **Response**: `{ success: true, data: {...} }`

#### **Delete Mood**
- **DELETE** `/api/moods/:id?userId=...`
- **Response**: `{ success: true, message: '...' }`

### **3. Journal Routes** (`/api/journal`)

#### **Get All Journal Entries**
- **GET** `/api/journal?userId=...`
- **Response**: `{ success: true, data: [...], count: 5 }`

#### **Create Journal Entry**
- **POST** `/api/journal`
- **Body**: `{ content: '...', userId: '...', date: '...', tags: [...] }`
- **Response**: `{ success: true, data: {...} }`

#### **Get Single Entry**
- **GET** `/api/journal/:id?userId=...`
- **Response**: `{ success: true, data: {...} }`

#### **Update Entry**
- **PUT** `/api/journal/:id`
- **Body**: `{ userId: '...', content: '...', date: '...', tags: [...] }`
- **Response**: `{ success: true, data: {...} }`

#### **Delete Entry**
- **DELETE** `/api/journal/:id?userId=...`
- **Response**: `{ success: true, message: '...' }`

### **4. Mood Detection Routes** (`/api/detect-mood`)

#### **Save Detected Mood**
- **POST** `/api/detect-mood`
- **Body**: `{ mood: 'happy', emotion: 'happy', confidence: 0.85, userId: '...', timestamp: '...' }`
- **Response**: `{ success: true, data: {...} }`

### **5. Recommendation Routes** (`/api/recommendations`)

#### **Get Personalized Recommendations**
- **GET** `/api/recommendations?userId=...&mood=happy`
- **Response**: 
```json
{
  "success": true,
  "data": {
    "dominantMood": "happy",
    "moodHistory": [...],
    "recommendations": {
      "music": [...],
      "exercises": [...],
      "tips": [...]
    },
    "trends": {
      "totalEntries": 10,
      "moodDistribution": {...}
    }
  }
}
```

### **6. User Preferences Routes** (`/api/user/preferences`)

#### **Get Preferences**
- **GET** `/api/user/preferences?userId=...`
- **Response**: `{ success: true, data: { personalInfo: {...}, musicPreferences: {...}, ... } }`

#### **Update Preferences**
- **POST** `/api/user/preferences`
- **PUT** `/api/user/preferences`
- **Body**: `{ userId: '...', personalInfo: {...}, musicPreferences: {...}, ... }`
- **Response**: `{ success: true, data: {...}, message: '...' }`

### **7. Chat Routes** (`/api/chat`)

#### **Send Message to AI Twin**
- **POST** `/api/chat`
- **Body**: `{ message: 'Hello', conversationHistory: [...] }`
- **Response**: `{ success: true, response: '...', timestamp: '...' }`

**AI Provider Logic**:
- Checks `AI_PROVIDER` env variable
- Supports: `openai`, `gemini`
- Falls back to rule-based responses if no API key

### **8. Playlist Routes** (`/api/playlists`)

#### **Get All Playlists**
- **GET** `/api/playlists?userId=...&mood=happy&genre=pop&limit=10`
- **Response**: `{ success: true, data: [...] }`

#### **Create Playlist**
- **POST** `/api/playlists`
- **Body**: `{ userId: '...', title: '...', description: '...', songs: [...], mood: '...', genre: [...], platform: '...' }`
- **Response**: `{ success: true, data: {...} }`

#### **Add Songs to Playlist**
- **POST** `/api/playlists/:id/songs`
- **Body**: `{ userId: '...', songs: [...] }`
- **Response**: `{ success: true, data: {...} }`

#### **Remove Song from Playlist**
- **DELETE** `/api/playlists/:id/songs/:songIndex`
- **Response**: `{ success: true, data: {...} }`

#### **Delete Playlist**
- **DELETE** `/api/playlists/:id?userId=...`
- **Response**: `{ success: true, message: '...' }`

---

## 📁 FILE-BY-FILE BREAKDOWN

### **Backend Files**

#### **`server/server.js`**
- Express server setup and configuration
- MongoDB connection using Mongoose
- Middleware configuration (CORS, JSON parsing)
- Route imports and mounting
- Error handling middleware
- Server startup on PORT 5000

#### **`server/models/User.js`**
- User Mongoose schema definition
- Contains all user preferences and settings
- Schema validation rules
- Indexes on userId for performance

#### **`server/models/Mood.js`**
- Mood entry schema
- Tracks mood type, timestamp, notes
- Supports both manual and auto-detected moods
- Stores confidence scores for AI detection

#### **`server/models/JournalEntry.js`**
- Journal entry schema
- Stores content, date, tags
- Indexed on userId and date for efficient queries

#### **`server/models/Playlist.js`**
- Playlist schema with songs array
- Supports multiple music platforms
- Indexed on userId, mood, and genre

#### **`server/routes/moodRoutes.js`**
- CRUD operations for mood entries
- User-specific filtering (userId required)
- GET, POST, PUT, DELETE endpoints

#### **`server/routes/journalRoutes.js`**
- CRUD operations for journal entries
- User-specific filtering
- Content validation

#### **`server/routes/detectMoodRoutes.js`**
- Single POST endpoint for saving auto-detected moods
- Stores detection metadata (confidence, method)

#### **`server/routes/recommendationRoutes.js`**
- Analyzes mood history
- Generates personalized recommendations
- Returns music, exercises, and tips based on mood

#### **`server/routes/userPreferencesRoutes.js`**
- GET, POST, PUT endpoints for user preferences
- Find or create user logic
- Merges new preferences with existing

#### **`server/routes/chatRoutes.js`**
- AI chat endpoint
- Supports OpenAI and Google Gemini
- Fallback rule-based responses
- Context-aware conversation history

#### **`server/routes/playlistRoutes.js`**
- Full CRUD for playlists
- Song management within playlists
- Filtering by mood and genre

### **Frontend Files**

#### **`src/App.jsx`**
- Main app component with Router setup
- Wraps app with AuthProvider and MoodProvider
- Handles dark mode toggle
- Conditional Navbar/Footer rendering
- Protected route definitions

#### **`src/index.js`**
- React application entry point
- Renders App component to DOM root
- React.StrictMode enabled

#### **`src/pages/Home.jsx`**
- Landing page with hero section
- Features grid
- Welcome banner with last mood
- Thought of the day component
- Auto-showing webcam modal (first visit)
- Floating camera button

#### **`src/pages/Login.jsx`**
- User login form
- Validates credentials against localStorage
- Updates AuthContext on success
- Redirects to home

#### **`src/pages/Signup.jsx`**
- User registration form
- Creates user in localStorage
- Calls backend to create user in MongoDB
- Validates input (email, password length)

#### **`src/components/MoodTracker.jsx`**
- Manual mood selection interface
- 8 mood options with emojis
- Mood submission to backend
- Mood history display
- Integration with RealTimeMoodDetector
- SmartSuggestions for negative moods

#### **`src/components/EmotionDetector.jsx`**
- Full-page emotion detection component
- Loads face-api.js models
- Webcam access handling
- 10-second or 5-detection capture
- Progress bar visualization
- Dominant mood calculation
- Auto-redirect based on mood

#### **`src/components/RealTimeMoodDetector.jsx`**
- Real-time mood detection in modal
- Reusable component for modal embedding
- Frame-by-frame emotion analysis
- Visual feedback on canvas

#### **`src/components/Chatbot.jsx`**
- AI chat interface
- Message list with timestamps
- Typing indicators
- Conversation history management
- Error handling with fallback messages
- Sweet nickname integration

#### **`src/components/MusicRecommender.jsx`**
- Displays personalized music recommendations
- Playlist creation interface
- Song management
- Integration with user preferences

#### **`src/components/Journal.jsx` / `src/pages/Journal.jsx`**
- Journal entry form
- Previous entries list
- CRUD operations for entries
- Tag management

#### **`src/context/AuthContext.jsx`**
- Authentication state management
- Login, signup, logout functions
- User preferences management
- localStorage persistence
- API calls to fetch/update preferences

#### **`src/context/MoodContext.jsx`**
- Mood state management
- Last mood tracking
- Mood history (localStorage)
- saveMood() function

#### **`src/utils/api.js`**
- Axios instance configuration
- Base URL: `http://localhost:5000/api`
- Default headers setup
- Centralized API client

#### **`src/components/ProtectedRoute.jsx`**
- Route guard component
- Checks authentication from AuthContext
- Redirects to /login if not authenticated
- Shows loading state

#### **`src/components/SmartSuggestions.jsx`**
- Modal component for mood-based suggestions
- Shows for negative moods
- Provides support resources
- Links to exercises, music, chat

#### **`tailwind.config.js`**
- Tailwind CSS configuration
- Custom color palette
- Custom border radius values
- Dark mode configuration
- Custom gradients

---

## 🎯 KEY FEATURES IMPLEMENTATION

### **1. Real-Time Emotion Detection**

**Technology**: face-api.js with TensorFlow.js models

**Process**:
1. Load models from `/public/models/` directory
2. Request camera permission via `getUserMedia()`
3. Capture video frames
4. Run `faceapi.detectAllFaces()` with expression detection
5. Extract emotion scores (happy, sad, angry, etc.)
6. Map emotions to mood types
7. Collect multiple detections over time
8. Calculate dominant mood using weighted average
9. Save to database with confidence score

**Models Used**:
- TinyFaceDetector (fast face detection)
- FaceLandmark68Net (facial landmarks)
- FaceRecognitionNet (face recognition)
- FaceExpressionNet (emotion classification)

### **2. AI Chatbot (AI Twin)**

**Implementation**:
- Supports multiple AI providers (OpenAI, Gemini)
- Fallback rule-based responses if no API key
- Context-aware using conversation history
- Personality: Warm, empathetic, uses sweet nicknames
- Short, supportive responses (1-3 sentences)

**System Prompt** (for AI providers):
```
"You are AI Twin, a warm, empathetic mental wellness companion.
Your role: listen actively, validate feelings, offer gentle support.
Keep responses short (1-2 sentences typically).
Use sweet, gender-neutral nicknames frequently.
Never provide medical advice."
```

### **3. Mood-Based Recommendations**

**Algorithm**:
1. Fetch user's last 10 mood entries
2. Calculate mood distribution
3. Determine dominant mood
4. Generate recommendations:
   - **Positive moods** (happy, calm, excited):
     * Upbeat music playlists
     * Motivational tips
   - **Negative moods** (sad, angry, stressed, anxious):
     * Calming music playlists
     * Breathing exercises
     * Supportive tips
5. Analyze trends (if >3 negative moods, suggest support)

### **4. Dark Mode Toggle**

**Implementation**:
- Uses Tailwind's class-based dark mode
- Toggle stored in localStorage
- `.dark` class added to `<html>` element
- All components respect dark mode colors
- Smooth transitions

### **5. Protected Routes**

**Logic**:
```javascript
// Checks AuthContext.isAuthenticated
// If false → redirect to /login
// If true → render protected component
```

---

## 📊 FLOWCHARTS & DIAGRAMS

### **Application Flow Diagram**

```
┌─────────────────────────────────────────────────────────┐
│                    User Opens App                       │
└────────────────────────┬──────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Check localStorage  │
              │   for 'moodio_user'  │
              └──────────┬────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
            ▼                         ▼
    ┌───────────────┐         ┌──────────────┐
    │ User Found    │         │ No User      │
    └───────┬───────┘         └──────┬───────┘
            │                         │
            │                         ▼
            │              ┌──────────────────┐
            │              │  Redirect to     │
            │              │    /login        │
            │              └──────────────────┘
            │
            ▼
    ┌──────────────────────┐
    │ Fetch Preferences    │
    │  from Backend        │
    └──────────┬───────────┘
                │
                ▼
    ┌──────────────────────┐
    │  Show Home Page       │
    │  with Features        │
    └──────────────────────┘
```

### **Mood Tracking Flow**

```
┌─────────────────────────────────────────────────────────┐
│              User Wants to Track Mood                  │
└────────────────────────┬──────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
            ▼                         ▼
    ┌───────────────┐         ┌──────────────┐
    │ Manual Select │         │  Webcam      │
    │   Mood Buttons│         │  Detection   │
    └───────┬───────┘         └──────┬───────┘
            │                         │
            ▼                         ▼
    ┌─────────────────┐       ┌───────────────┐
    │ Select Mood     │       │ Request Camera│
    │  (8 options)    │       │   Permission  │
    └────────┬────────┘       └───────┬───────┘
             │                        │
             ▼                        ▼
    ┌─────────────────┐       ┌───────────────┐
    │ Click "Log Mood"│       │ Load ML Models│
    └────────┬────────┘       └───────┬───────┘
             │                        │
             │                        ▼
             │              ┌───────────────────┐
             │              │ Capture Frames    │
             │              │ (10 sec / 5 det)  │
             │              └──────────┬─────────┘
             │                        │
             │                        ▼
             │              ┌───────────────────┐
             │              │ Calculate Dominant│
             │              │       Mood        │
             │              └──────────┬─────────┘
             │                        │
             └────────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ POST /api/moods       │
              │  or                   │
              │ POST /api/detect-mood │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Save to MongoDB       │
              │ Update MoodContext    │
              │ Update localStorage  │
              └───────────┬───────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
    ┌───────────────┐          ┌───────────────┐
    │ Positive Mood │          │ Negative Mood │
    │   → /music    │          │ → Show Smart  │
    │               │          │  Suggestions  │
    └───────────────┘          └───────────────┘
```

### **AI Chat Flow**

```
┌─────────────────────────────────────────────────────────┐
│            User Types Message in Chat                    │
└────────────────────────┬──────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Prepare Request Body  │
              │ { message,            │
              │   conversationHistory }│
              └──────────┬────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ POST /api/chat         │
              └──────────┬─────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
            ▼                         ▼
    ┌───────────────┐         ┌──────────────┐
    │ Check Env      │         │ No API Key   │
    │ AI_PROVIDER    │         │ Configured   │
    └───────┬───────┘         └──────┬───────┘
            │                         │
    ┌───────┴───────┐                │
    │               │                │
    ▼               ▼                ▼
┌───────┐     ┌─────────┐    ┌─────────────┐
│OpenAI │     │ Gemini  │    │ Fallback    │
│ API   │     │  API    │    │ Rule-Based  │
└───┬───┘     └────┬────┘    │ Responses   │
    │              │          └──────┬───────┘
    └──────────────┴───────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Format Response       │
              │ Add Sweet Nickname    │
              └──────────┬─────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Display in Chat UI    │
              │ Add to History        │
              └───────────────────────┘
```

### **Data Flow: Mood Detection to Database**

```
Frontend Component
    │
    │ User selects mood or detects via webcam
    │
    ▼
React Context (MoodContext)
    │ saveMood()
    │
    ▼
API Call (Axios)
    │ POST /api/moods or POST /api/detect-mood
    │
    ▼
Express Router (moodRoutes.js or detectMoodRoutes.js)
    │
    ▼
Mongoose Model (Mood.js)
    │ new Mood({ ... })
    │
    ▼
MongoDB Database
    │ Collection: moods
    │
    ▼
Response to Frontend
    │
    ▼
Update LocalStorage
    │
    ▼
Update UI (Mood History, Toast Notification)
```

---

## 🎓 VIVA PREPARATION CHECKLIST

### **Technical Questions You Should Know:**

1. **Why did you choose React over other frameworks?**
   - React provides component reusability, virtual DOM for performance, large community, and JSX for readable code.

2. **Why MongoDB instead of SQL databases?**
   - Flexible schema for user preferences, JSON-like documents, easy to scale, good for rapid prototyping.

3. **How does face-api.js work?**
   - Uses TensorFlow.js models pre-trained on facial expressions. Models detect faces, extract landmarks, and classify emotions.

4. **Why use Context API instead of Redux?**
   - Simpler setup, less boilerplate, sufficient for this project's state management needs.

5. **Explain the authentication flow.**
   - Frontend-only using localStorage. User credentials stored locally. User ID passed to backend for data association.

6. **How do you handle errors?**
   - Try-catch blocks in async functions, error middleware in Express, user-friendly error messages, fallback responses for AI chat.

7. **What's the difference between manual and auto mood detection?**
   - Manual: User selects from 8 options. Auto: Webcam captures frames, AI analyzes expressions, calculates dominant mood.

8. **How does the recommendation system work?**
   - Analyzes last 10 mood entries, calculates mood distribution, generates music/exercises/tips based on dominant mood.

9. **What security measures are in place?**
   - User-specific data filtering (userId required), input validation, CORS configuration, no sensitive data exposure.

10. **How would you scale this application?**
    - Add JWT authentication, implement caching (Redis), use cloud MongoDB (Atlas), add load balancing, optimize database queries.

---

## 🚀 QUICK REFERENCE

### **Start Development**
```bash
# Install dependencies
npm install

# Start frontend only
npm start

# Start backend only
npm run server

# Start both (recommended)
npm run dev
```

### **Environment Variables** (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodio
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

### **Key URLs**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

---

## 📝 NOTES FOR PRESENTATION

1. **Emphasize Real-Time Emotion Detection** - This is a unique feature using ML models in the browser.
2. **AI Integration** - Explain how you support multiple AI providers with fallback.
3. **User-Centric Design** - Dark mode, personalized recommendations, empathetic AI.
4. **Scalability** - Mention how the architecture allows for future enhancements.
5. **Mental Health Focus** - Highlight the supportive, non-judgmental approach.

---

**End of Documentation**

This comprehensive guide covers every aspect of Moodio for your viva preparation. Good luck! 💚
