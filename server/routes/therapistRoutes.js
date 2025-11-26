/**
 * Therapist Routes
 * Handles API endpoints for therapist consultation requests
 * 
 * Routes:
 * - POST /api/therapist - Submit therapist request
 * - GET /api/therapist - Get all therapist requests (admin)
 */

const express = require('express');
const router = express.Router();
const { submitTherapistRequest, getTherapistRequests } = require('../controllers/therapistController');

/**
 * POST /api/therapist
 * Submit a new therapist consultation request
 */
router.post('/', submitTherapistRequest);

/**
 * GET /api/therapist
 * Get all therapist requests (optional admin endpoint)
 */
router.get('/', getTherapistRequests);

module.exports = router;

