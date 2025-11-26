import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * Auth Context
 * Manages user authentication state using localStorage
 */
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Auth Provider Component
 * Wraps the app and provides authentication state and methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch user preferences from backend
   */
  const fetchPreferences = useCallback(async (userId) => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get(`/user/preferences?userId=${userId}`);
      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('moodio_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Fetch preferences from backend
        const userId = userData.id || userData.userId || userData.email;
        fetchPreferences(userId);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('moodio_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchPreferences]);

  /**
   * Update preferences
   */
  const updatePreferences = async (prefsData) => {
    try {
      if (!user) {
        return { success: false, error: 'User not logged in' };
      }

      const userId = user?.id || user?.userId || user?.email;
      if (!userId) {
        return { success: false, error: 'User ID not found' };
      }

      const response = await api.post('/user/preferences', {
        userId,
        email: user?.email || '',
        name: user?.name || 'User',
        ...prefsData,
      });

      if (response.data && response.data.success) {
        // Update preferences state with the response data
        setPreferences(response.data.data);
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data?.error || 'Failed to update preferences' };
    } catch (error) {
      console.error('Error updating preferences:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save preferences. Please check if the backend server is running.';
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sign up a new user
   */
  const signup = async (email, name, password) => {
    try {
      // Simple validation
      if (!email || !name || !password) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('moodio_users') || '[]');
      if (existingUsers.find(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      // Store user
      existingUsers.push({ ...newUser, password }); // In real app, password would be hashed
      localStorage.setItem('moodio_users', JSON.stringify(existingUsers));
      localStorage.setItem('moodio_user', JSON.stringify(newUser));
      
      setUser(newUser);
      
      // Fetch preferences after signup
      const userId = newUser.id || newUser.userId || newUser.email;
      fetchPreferences(userId);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Log in an existing user
   */
  const login = async (email, password) => {
    try {
      // Simple validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Check user credentials
      const existingUsers = JSON.parse(localStorage.getItem('moodio_users') || '[]');
      const user = existingUsers.find(u => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('moodio_user', JSON.stringify(userWithoutPassword));
      
      setUser(userWithoutPassword);
      
      // Fetch preferences after login
      const userId = userWithoutPassword.id || userWithoutPassword.userId || userWithoutPassword.email;
      fetchPreferences(userId);
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    localStorage.removeItem('moodio_user');
    localStorage.removeItem('moodio_lastMood');
    localStorage.removeItem('moodio_moodHistory');
    localStorage.removeItem('moodio_userId');
    setUser(null);
    setPreferences(null);
  };

  const value = {
    user,
    preferences,
    loading,
    signup,
    login,
    logout,
    updatePreferences,
    fetchPreferences,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

