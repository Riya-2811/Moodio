# Moodio 🧠💚

**Moodio** is a mental wellness platform that helps users track, improve, and stabilize their mental health through mood tracking, journaling, music recommendations, and AI chatbot support.

## 🌿 Project Overview

Moodio aims to help users:
- Track their daily mood and emotions
- Get personalized motivational quotes, music, and exercises
- Chat with AI Twin for emotional support and mental wellness
- Write short journal entries to express how they feel

The design focuses on calmness and positivity with smooth colors, rounded edges, and minimal clutter.

## 🧩 Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Routing

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Tools
- **Concurrently** - Run frontend and backend simultaneously

## 🏗️ Project Structure

```
moodio/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with theme toggle
│   │   ├── MoodTracker.jsx      # Mood tracking component (to be created)
│   │   ├── Journal.jsx          # Journaling component (to be created)
│   │   ├── MusicRecommender.jsx # Music recommendations (to be created)
│   │   ├── Chatbot.jsx          # AI chatbot component (to be created)
│   │   └── Footer.jsx           # Footer component
│   ├── pages/
│   │   ├── Home.jsx             # Home page with hero section
│   │   ├── About.jsx            # About page (to be created)
│   │   └── Contact.jsx          # Contact page (to be created)
│   ├── App.jsx                  # Main app component
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles with Tailwind
├── server/
│   ├── server.js                # Express server setup
│   └── routes/
│       └── moodRoutes.js        # Mood tracking API routes
├── package.json
├── tailwind.config.js           # Tailwind configuration
└── README.md
```

## 🎨 Design Theme

### Color Palette

**Light Theme:**
- Sky Blue: `#E3F2FD`
- Soft Green: `#C8E6C9`
- White: `#FFFFFF`
- Calm Purple: `#B39BC8`
- Warm Pink: `#F8BBD0`

**Dark Theme:**
- Dark Background: `#121212`
- Dark Surface: `#1E1E1E`
- Accent Blue: `#90CAF9`

### Design Principles
- Smooth, rounded corners (`rounded-soft`, `rounded-softer`)
- Gentle transitions and animations
- Minimal clutter
- Positive, calming aesthetic

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

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
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/moodio
   
   # AI Configuration - Choose one provider
   AI_PROVIDER=openai  # Options: 'openai' or 'gemini'
   
   # OpenAI Configuration (if using OpenAI)
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   
   # Google Gemini Configuration (if using Gemini)
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-pro
   ```

4. **Get AI API Keys** (for AI Twin functionality):
   
   **Option 1: OpenAI**
   - Visit https://platform.openai.com/api-keys
   - Sign up or log in
   - Create a new API key
   - Add it to `.env` as `OPENAI_API_KEY`
   
   **Option 2: Google Gemini** (Free alternative)
   - Visit https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Create a new API key
   - Add it to `.env` as `GEMINI_API_KEY`
   - Set `AI_PROVIDER=gemini` in `.env`
   
   **Note:** AI Twin will use fallback responses if no API key is configured, but real AI responses require a valid API key.

5. **Start the development server**
   
   Option 1: Run frontend and backend separately
   ```bash
   # Terminal 1: Frontend
   npm start
   
   # Terminal 2: Backend
   npm run server
   ```
   
   Option 2: Run both concurrently
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📝 Available Scripts

- `npm start` - Start React development server
- `npm run server` - Start Express backend server
- `npm run dev` - Run frontend and backend concurrently
- `npm run build` - Build React app for production
- `npm test` - Run tests

## 🎯 Features

### ✅ Completed
- [x] Project structure setup
- [x] Tailwind CSS configuration with custom colors
- [x] Dark/Light theme toggle
- [x] Navbar component
- [x] Footer component
- [x] Home page with Hero section
- [x] Basic Express server setup
- [x] Mood routes API structure

### 🚧 In Progress / To Do
- [ ] Mood Tracker component
- [ ] Journal component
- [ ] Music Recommender component
- [ ] AI Chatbot component
- [ ] User authentication
- [ ] Database models (MongoDB)
- [ ] API integration with frontend
- [ ] Additional pages (About, Contact)

## 🗄️ Database Models (To Be Created)

- User model
- Mood Entry model
- Journal Entry model
- Music Preferences model

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodio
NODE_ENV=development
```

## 📚 Code Style

- Use ES6+ syntax (arrow functions, destructuring, etc.)
- Keep code clean, readable, and beginner-friendly
- Add short, clear comments for functions and components
- Use meaningful variable and function names
- Follow React best practices

## 🤝 Contributing

This is a learning project. Contributions and suggestions are welcome!

## 📄 License

This project is open source and available for educational purposes.

## 💚 Acknowledgments

Built with ❤️ for mental wellness and mental health awareness.

---

**Note:** This is a prototype/learning project. For production use, additional security measures, error handling, and testing should be implemented.
