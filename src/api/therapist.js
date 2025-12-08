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
    console.log('[Therapist API] Submitting request to:', '/therapist');
    const response = await api.post('/therapist', requestData);
    console.log('[Therapist API] Success:', response.status);
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Request submitted successfully!',
    };
  } catch (error) {
    console.error('[Therapist API] Error:', {
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
      let errorMessage = error.response.data?.message || error.response.data?.error || 'Failed to submit request. Please try again.';
      
      if (status === 404) {
        errorMessage = 'Therapist endpoint not found. Please check backend configuration.';
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

