# Moodio 🧠💚

**Moodio - Your Mood's Best Friend In Your Pocket**

A comprehensive mental wellness platform that helps users track, improve, and stabilize their mental health through mood tracking, journaling, personalized music recommendations, AI chatbot support, and wellness exercises.

---

## 🌿 Project Overview

Moodio is designed to be a supportive companion for mental wellness, offering:

- **Real-time Mood Tracking** - Track your emotions with facial emotion detection or manual selection
- **Personalized Music Recommendations** - Get music suggestions based on your mood and preferences
- **AI Twin Chatbot** - Chat with an empathetic AI companion for emotional support
- **Journaling** - Express your feelings through private journal entries
- **Wellness Exercises** - Access mindfulness exercises and emotion regulation tips
- **Therapist Connection** - Request professional mental health support
- **Personalized Notifications** - Receive caring, supportive reminders throughout the day

The design focuses on calmness and positivity with smooth colors, rounded edges, and minimal clutter.

---

## 🛠️ Complete Tech Stack

### **Frontend Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI library for building interactive interfaces |
| **React DOM** | 19.2.0 | React rendering for web |
| **React Router DOM** | 7.9.5 | Client-side routing and navigation |
| **Tailwind CSS** | 3.4.3 | Utility-first CSS framework |
| **PostCSS** | 8.5.6 | CSS processing tool |
| **Autoprefixer** | 10.4.21 | Automatic vendor prefixing |
| **React Icons** | 5.5.0 | Icon library (Font Awesome, etc.) |
| **Chart.js** | 4.5.1 | Data visualization library |
| **React Chart.js 2** | 5.3.1 | React wrapper for Chart.js |
| **Axios** | 1.13.1 | HTTP client for API requests |
| **face-api.js** | 0.22.2 | Real-time facial emotion detection |
| **React Scripts** | 5.0.1 | Build tool for React apps |
| **Web Vitals** | 2.1.4 | Performance monitoring |

### **Backend Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | JavaScript runtime environment |
| **Express.js** | 4.21.2 | Web application framework |
| **MongoDB** | Cloud (Atlas) | NoSQL database for data storage |
| **Mongoose** | 8.19.2 | MongoDB object modeling (ODM) |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 16.3.1 | Environment variable management |
| **compression** | 1.7.4 | GZIP compression middleware |
| **Nodemailer** | 7.0.10 | Email sending functionality |

### **AI/ML Technologies**

| Technology | Purpose |
|------------|---------|
| **OpenAI GPT-3.5-turbo** | AI chatbot support (optional) |
| **Google Gemini** | Alternative AI provider (optional) |
| **face-api.js Models** | Facial emotion detection:
| | - Tiny Face Detector |
| | - Face Landmark 68 |
| | - Face Recognition Net |
| | - Face Expression Net |

### **Development Tools**

| Tool | Version | Purpose |
|------|---------|---------|
| **Concurrently** | 8.2.2 | Run frontend and backend simultaneously |
| **Testing Library** | Latest | React component testing |

### **External Services**

- **MongoDB Atlas** - Cloud database hosting
- **Spotify** - Music search integration (no API key required)
- **Gmail SMTP** - Email notifications via Nodemailer

---

## 📁 Project Structure

```
moodio/
├── public/
│   ├── models/                      # face-api.js ML models
│   │   ├── face_expression_model-shard1
│   │   ├── face_landmark_68_model-shard1
│   │   ├── face_recognition_model-shard1/2
│   │   └── tiny_face_detector_model-shard1
│   ├── index.html                   # Main HTML entry point
│   ├── favicon.ico & favicon.svg    # App icons
│   ├── manifest.json                # PWA manifest
│   └── robots.txt                   # SEO robots file
│
├── src/
│   ├── components/                  # Reusable React components
│   │   ├── Navbar.jsx               # Navigation bar with theme toggle
│   │   ├── Footer.jsx               # Footer with links
│   │   ├── MoodTracker.jsx          # Mood tracking interface
│   │   ├── MusicRecommender.jsx     # Music recommendations
│   │   ├── Chatbot.jsx              # AI Twin chatbot
│   │   ├── RealTimeMoodDetector.jsx # Webcam mood detection
│   │   ├── WebcamModal.jsx          # Webcam modal wrapper
│   │   ├── SmartSuggestions.jsx     # Mood-based suggestions
│   │   ├── NegativeMoodSupportModal.jsx # Support for negative moods
│   │   ├── ConfirmationModal.jsx    # Reusable confirmation dialogs
│   │   ├── PasswordVerificationModal.jsx # Password verification
│   │   ├── EmotionTipCard.jsx       # Emotion regulation tip cards
│   │   ├── EmotionTipsSection.jsx  # Tips section component
│   │   ├── ThoughtOfTheDay.jsx     # Daily inspirational thoughts
│   │   ├── ProtectedRoute.jsx      # Route protection wrapper
│   │   └── ...
│   │
│   ├── pages/                       # Main page components
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Login.jsx                # User login
│   │   ├── Signup.jsx               # User registration
│   │   ├── ForgotPassword.jsx       # Password recovery
│   │   ├── UserPreferences.jsx      # Initial preferences setup
│   │   ├── Profile.jsx              # User profile & settings
│   │   ├── Journal.jsx              # Journaling page
│   │   ├── Exercises.jsx            # Wellness exercises
│   │   ├── Contact.jsx              # Contact form
│   │   ├── Therapist.jsx            # Therapist request form
│   │   └── PrivacyPolicy.jsx        # Privacy policy page
│   │
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.jsx         # Authentication state
│   │   └── MoodContext.jsx          # Mood tracking state
│   │
│   ├── utils/                       # Utility functions
│   │   ├── api.js                   # Axios API configuration
│   │   ├── Toast.jsx                 # Toast notification component
│   │   ├── NotificationService.js   # Notification management
│   │   ├── spotifyMoodMapping.js    # Spotify URL generation
│   │   └── wearables.js             # Wearable device integration
│   │
│   ├── data/                        # Static data files
│   │   ├── musicRecommendations.js  # Music data
│   │   └── spotifyMoodPlaylists.js  # Spotify playlist data
│   │
│   ├── api/                         # API service functions
│   │   ├── contact.js               # Contact form API
│   │   └── therapist.js             # Therapist request API
│   │
│   ├── App.jsx                      # Main app component
│   ├── index.js                     # React entry point
│   └── index.css                    # Global styles
│
├── server/
│   ├── models/                      # Mongoose database models
│   │   ├── User.js                  # User schema
│   │   ├── Mood.js                  # Mood entry schema
│   │   ├── JournalEntry.js          # Journal entry schema
│   │   ├── Chat.js                  # Chat message schema
│   │   ├── Playlist.js              # Playlist schema
│   │   ├── ContactMessage.js        # Contact form schema
│   │   └── TherapistRequest.js      # Therapist request schema
│   │
│   ├── routes/                      # Express API routes
│   │   ├── moodRoutes.js            # Mood tracking endpoints
│   │   ├── journalRoutes.js         # Journal endpoints
│   │   ├── musicRoutes.js           # Music recommendation endpoints
│   │   ├── chatRoutes.js            # Chatbot endpoints
│   │   ├── playlistRoutes.js       # Playlist endpoints
│   │   ├── userPreferencesRoutes.js # User preferences endpoints
│   │   ├── contactRoutes.js         # Contact form endpoints
│   │   ├── therapistRoutes.js       # Therapist request endpoints
│   │   └── detectMoodRoutes.js      # Mood detection endpoints
│   │
│   ├── controllers/                 # Route controllers
│   │   ├── contactController.js     # Contact form logic
│   │   └── therapistController.js   # Therapist request logic
│   │
│   ├── data/                        # Backend data generators
│   │   ├── musicRecommendations.js  # Music data
│   │   └── generateMusicData.js     # Dynamic music data generator
│   │
│   ├── utils/                       # Backend utilities
│   │   └── sendEmail.js             # Email sending utility
│   │
│   └── server.js                    # Express server setup
│
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
├── .env                             # Environment variables (not in git)
└── README.md                        # This file
```

---

## ✨ Complete Features List

### **🔐 Authentication & User Management**
- ✅ User registration with email validation
- ✅ Secure login with password authentication
- ✅ Password recovery / Forgot password
- ✅ Protected routes (require authentication)
- ✅ User session management
- ✅ User profile management

### **😊 Mood Tracking**
- ✅ Manual mood selection (12 moods: Happy, Sad, Angry, Stressed, Calm, Excited, Anxious, Grateful, Neutral, Tired, Lonely, Overwhelmed)
- ✅ Real-time facial emotion detection using webcam
- ✅ Mood history tracking with timestamps
- ✅ Mood trends visualization (charts)
- ✅ Mood distribution analytics
- ✅ Clear mood history functionality
- ✅ Mood-based navigation to music recommendations

### **📝 Journaling**
- ✅ Private journal entries
- ✅ Rich text journaling
- ✅ Journal entry history
- ✅ Password-protected privacy toggle (show/hide entries)
- ✅ Clear all journal entries
- ✅ Timestamp tracking

### **🎵 Music Recommendations**
- ✅ Personalized music recommendations based on:
  - User preferences (genres, languages, artists)
  - Current mood
  - Listening history
- ✅ Spotify integration (search links)
- ✅ Mood-based Spotify playlists (12 unique playlists)
- ✅ Custom playlist creation
- ✅ Add songs to playlists
- ✅ Filter by genre, language, and artist
- ✅ Dynamic artist lists based on language
- ✅ Comprehensive music database (thousands of songs)

### **🤖 AI Twin Chatbot**
- ✅ Empathetic AI chatbot for emotional support
- ✅ Gender-based personalized nicknames
- ✅ Chat history storage
- ✅ Show/hide chat history
- ✅ Clear chat history
- ✅ OpenAI GPT-3.5-turbo integration (optional)
- ✅ Google Gemini integration (optional)
- ✅ Fallback responses if no API key

### **🧘 Wellness & Exercises**
- ✅ Mindfulness exercises page
- ✅ Breathing exercises
- ✅ 15 Emotion Regulation Tip Cards
- ✅ Mood-based exercise recommendations
- ✅ Negative mood support suggestions

### **👤 User Preferences & Profile**
- ✅ Personal information (age, gender, country)
- ✅ Music preferences (genres, platform, type)
- ✅ Wellness preferences (exercise types, goals)
- ✅ Notification preferences (7 types):
  - Thought of the Day
  - Daily Reminders
  - Mood Tracking Reminders
  - Personalized Care Notifications
  - Mood Detection Reminders
  - Well-being Reminders
  - Supportive Reminders
- ✅ App settings (language, tone)
- ✅ Assistant customization
- ✅ Mood trends charts in profile

### **🔔 Notifications System**
- ✅ Personalized care notifications (every 2 minutes)
- ✅ Mood detection reminders
- ✅ Well-being reminders
- ✅ Supportive reminders
- ✅ Thought of the day
- ✅ Daily motivational reminders
- ✅ User-controlled notification preferences

### **💬 Contact & Support**
- ✅ Contact form with email integration
- ✅ Therapist request form
- ✅ Email notifications to admin
- ✅ Gmail SMTP integration
- ✅ Form validation and error handling

### **🎨 UI/UX Features**
- ✅ Dark/Light theme toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Confirmation modals
- ✅ Password verification modals
- ✅ Optimized performance (Lighthouse 90+)

### **📊 Analytics & Insights**
- ✅ Mood trends over time
- ✅ Mood distribution charts
- ✅ Journal entry statistics
- ✅ CSV export for mood data

### **🔒 Privacy & Security**
- ✅ Password-protected journal entries
- ✅ Private chat history
- ✅ Secure authentication
- ✅ Privacy Policy page
- ✅ Data encryption in transit
- ✅ Environment variable security

---

## 🗄️ Database Models

### **User Model**
```javascript
{
  name: String (required)
  email: String (required, unique)
  password: String (required, hashed)
  personalInfo: {
    age: Number
    gender: String (enum: male, female, other, prefer-not-to-say)
    country: String
  }
  musicPreferences: {
    favoriteGenres: [String]
    preferredPlatform: String
    preferenceType: String
  }
  wellnessPreferences: {
    exerciseTypes: [String]
    negativeMoodAlertSensitivity: String
    dailyGoal: String
  }
  notificationPreferences: {
    thoughtOfTheDay: Boolean
    reminders: Boolean
    moodTrackingReminder: Boolean
    personalizedCareNotifications: Boolean
    moodDetectionReminders: Boolean
    wellbeingReminders: Boolean
    supportiveReminders: Boolean
  }
  journalPreferences: {
    showPreviousEntries: Boolean
  }
  createdAt: Date
  updatedAt: Date
}
```

### **Mood Model**
```javascript
{
  userId: String (required)
  mood: String (required, enum: 12 moods)
  timestamp: Date (default: now)
  label: String (mood display name)
}
```

### **JournalEntry Model**
```javascript
{
  userId: String (required)
  content: String (required)
  timestamp: Date (default: now)
}
```

### **Chat Model**
```javascript
{
  userId: String (required)
  message: String (required)
  response: String (required)
  timestamp: Date (default: now)
}
```

### **Playlist Model**
```javascript
{
  userId: String (required)
  title: String (required)
  description: String
  thumbnail: String
  mood: String
  platform: String
  songs: [{
    title: String
    artist: String
    url: String
    platform: String
    thumbnail: String
  }]
  createdAt: Date
}
```

### **ContactMessage Model**
```javascript
{
  name: String (required)
  email: String (required)
  subject: String (required)
  message: String (required)
  createdAt: Date
}
```

### **TherapistRequest Model**
```javascript
{
  userId: String (optional)
  userName: String (required)
  userEmail: String (required)
  preferredMethod: String (enum: video, phone, in-person, any)
  preferredTime: String (enum: morning, afternoon, evening, any)
  reason: String
  status: String (enum: pending, reviewed, connected, closed)
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user

### **Mood Tracking**
- `GET /api/moods?userId=xxx` - Get user's mood history
- `POST /api/moods` - Create new mood entry
- `DELETE /api/moods?userId=xxx` - Clear all mood history
- `DELETE /api/moods/:id` - Delete specific mood entry

### **Journal**
- `GET /api/journal?userId=xxx` - Get user's journal entries
- `POST /api/journal` - Create new journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal?userId=xxx` - Clear all journal entries
- `DELETE /api/journal/:id` - Delete specific entry

### **Music Recommendations**
- `GET /api/music/recommend?userId=xxx&mood=xxx` - Get personalized recommendations
- `GET /api/music/test` - Test endpoint

### **Chatbot**
- `POST /api/chat` - Send message to AI Twin
- `GET /api/chat/history?userId=xxx` - Get chat history
- `DELETE /api/chat/history?userId=xxx` - Clear chat history

### **Playlists**
- `GET /api/playlists?userId=xxx` - Get user's playlists
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### **User Preferences**
- `GET /api/user/preferences` - Get user preferences
- `POST /api/user/preferences` - Create/update preferences
- `PUT /api/user/preferences/:id` - Update preferences

### **Contact & Support**
- `POST /api/contact` - Submit contact form
- `GET /api/contact/test-email` - Test email configuration
- `POST /api/therapist` - Submit therapist request

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for email notifications - optional)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moodio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodio?retryWrites=true&w=majority
   
   # AI Configuration (Optional - for AI Twin)
   AI_PROVIDER=openai  # Options: 'openai' or 'gemini'
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   # OR
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-pro
   
   # Email Configuration (Optional - for contact form)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=contact.moodio@gmail.com
   ```

4. **Get API Keys** (Optional)

   **MongoDB Atlas:**
   - Visit https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string
   - Add to `.env` as `MONGODB_URI`

   **OpenAI (for AI Twin):**
   - Visit https://platform.openai.com/api-keys
   - Create API key
   - Add to `.env` as `OPENAI_API_KEY`

   **Google Gemini (Alternative):**
   - Visit https://makersuite.google.com/app/apikey
   - Create API key
   - Add to `.env` as `GEMINI_API_KEY`
   - Set `AI_PROVIDER=gemini`

   **Gmail (for email notifications):**
   - Enable 2-factor authentication
   - Generate App Password
   - Add to `.env` as `EMAIL_PASS`

5. **Start the development server**

   **Option 1: Run both concurrently (Recommended)**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**
   ```bash
   # Terminal 1: Frontend
   npm start
   
   # Terminal 2: Backend
   npm run server
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

---

## 📝 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start Frontend | `npm start` | Start React development server (port 3000) |
| Start Backend | `npm run server` | Start Express server (port 5000) |
| Run Both | `npm run dev` | Run frontend and backend concurrently |
| Build | `npm run build` | Build React app for production |
| Test | `npm test` | Run React tests |

---

## 🎨 Design System

### **Color Palette**

**Light Theme:**
- Sky Blue: `#E3F2FD` (background)
- Soft Green: `#C8E6C9` (accent)
- Calm Purple: `#B39BC8` (primary)
- Warm Pink: `#F8BBD0` (secondary)
- White: `#FFFFFF` (surface)

**Dark Theme:**
- Dark Background: `#0A0E27` (background)
- Dark Surface: `#1A1F3A` (surface)
- Accent Blue: `#64B5F6` (primary)
- Accent Purple: `#9C27B0` (secondary)
- Accent Green: `#4CAF50` (success)

### **Design Principles**
- Smooth, rounded corners (`rounded-soft`, `rounded-softer`)
- Gentle transitions and animations
- Minimal clutter
- Positive, calming aesthetic
- Responsive design (mobile-first)

---

## 🔒 Security Features

- ✅ Password hashing (bcrypt)
- ✅ Protected routes (authentication required)
- ✅ CORS configuration
- ✅ Environment variable security
- ✅ Input validation and sanitization
- ✅ Secure password verification
- ✅ Private journal entries
- ✅ Private chat history

---

## 📊 Performance Optimizations

- ✅ React lazy loading for code splitting
- ✅ Image optimization (WebP support)
- ✅ GZIP compression (server-side)
- ✅ Static file caching (1 year)
- ✅ Optimized CSS (removed unused styles)
- ✅ Reduced shadow complexity
- ✅ CSS transforms instead of top/left
- ✅ Lighthouse Performance: 90+

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📚 Additional Documentation

- `MOODIO_COMPLETE_GUIDE.md` - Comprehensive project documentation
- `CONTACT_FORM_SETUP.md` - Contact form setup guide
- `EMAIL_DEBUG_GUIDE.md` - Email debugging guide
- `PERFORMANCE_OPTIMIZATIONS.md` - Performance optimization details
- `QUICK_START.md` - Quick start guide

---

## 🤝 Contributing

This is a learning project. Contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open source and available for educational purposes.

---

## 💚 Acknowledgments

Built with ❤️ for mental wellness and mental health awareness.

**Moodio** - Your Mood's Best Friend In Your Pocket

---

## 📞 Support

For questions or support:
- Email: contact.moodio@gmail.com
- Contact Form: `/contact` page
- Privacy Policy: `/privacy-policy` page

---

**Note:** This is a comprehensive mental wellness platform. For production use, additional security measures, error handling, and testing should be implemented.
