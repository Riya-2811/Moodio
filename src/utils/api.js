/**
 * API Configuration
 * Centralized axios configuration for API calls
 */

import axios from 'axios';

// Base URL for backend API
// Use environment variable if available, otherwise default to local backend for development
// For production, set REACT_APP_API_URL=https://moodio-pmxy.onrender.com/api in .env
const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://moodio-pmxy.onrender.com/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

