import api from '../utils/api';

/**
 * Submit therapist consultation request
 * @param {Object} requestData - Therapist request data
 * @param {string} requestData.preferredMethod - Preferred consultation method (video, phone, in-person, any)
 * @param {string} requestData.timeAvailability - Preferred time availability (morning, afternoon, evening, any)
 * @param {string} requestData.reason - Optional reason/description
 * @param {string} requestData.userEmail - Optional user email
 * @param {string} requestData.userName - Optional user name
 * @returns {Promise<Object>} - API response
 */
export const submitTherapistRequest = async (requestData) => {
  try {
    const response = await api.post('/therapist', requestData);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Request submitted successfully!',
    };
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data?.message || error.response.data?.error || 'Failed to submit request. Please try again.',
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

