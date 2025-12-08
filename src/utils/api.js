/**
 * API Configuration
 * Centralized axios configuration for API calls
 */

import axios from 'axios';

// Base URL for backend API
// This function determines the correct API URL at runtime
const getApiBaseUrl = () => {
  // First, check if environment variable is set (set at build time)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/$/, ''); // Remove trailing slash
  }
  
  // Runtime detection: Check current hostname to determine backend URL
  const hostname = window.location.hostname;
  
  // If on production frontend (moodio-10.onrender.com), use production backend
  if (hostname.includes('moodio-10.onrender.com') || hostname.includes('moodio-frontend.onrender.com')) {
    return 'https://moodio-pmxy.onrender.com/api';
  }
  
  // If on localhost, use local backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Default to production backend
  return 'https://moodio-pmxy.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log for debugging (only in browser console, not in production builds)
if (typeof window !== 'undefined') {
  console.log('[API Config] Using base URL:', API_BASE_URL);
  console.log('[API Config] REACT_APP_API_URL:', process.env.REACT_APP_API_URL || 'Not set (using auto-detection)');
}

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`[API] ${config.method?.toUpperCase()} ${fullUrl}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const fullUrl = error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown';
    console.error('[API Error]', {
      url: fullUrl,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;

