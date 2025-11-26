/**
 * Contact API
 * Handles contact form API calls
 */

import api from '../utils/api';

/**
 * Submit contact form
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - User's name
 * @param {string} formData.email - User's email
 * @param {string} formData.subject - Message subject
 * @param {string} formData.message - Message content
 * @returns {Promise<Object>} - API response
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/contact', formData);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Message sent successfully!',
    };
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data?.error || 'Failed to send message. Please try again.',
        status: error.response.status,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message || 'An unexpected error occurred.',
      };
    }
  }
};

