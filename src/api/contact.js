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
    console.log('[Contact API] Submitting form to:', '/contact');
    const response = await api.post('/contact', formData);
    console.log('[Contact API] Success:', response.status);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Message sent successfully!',
    };
  } catch (error) {
    console.error('[Contact API] Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      let errorMessage = error.response.data?.error || 'Failed to send message. Please try again.';
      
      if (status === 404) {
        errorMessage = 'Contact endpoint not found. Please check backend configuration.';
      } else if (status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      return {
        success: false,
        error: errorMessage,
        status: status,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'Network error. Unable to reach server. Please check your connection and try again.',
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

