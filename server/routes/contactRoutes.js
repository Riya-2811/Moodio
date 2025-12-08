/**
 * Contact Routes
 * Handles API endpoints for contact form functionality
 * 
 * Routes:
 * - POST /api/contact - Submit contact form
 * - GET /api/contact - Get all contact messages (admin)
 * - GET /api/contact/test-email - Test email configuration
 */

const express = require('express');
const router = express.Router();
const { submitContact, getContactMessages } = require('../controllers/contactController');
const { sendContactEmail } = require('../utils/sendEmail');

/**
 * GET /api/contact/test-email
 * Test email configuration (for debugging)
 * This route must come BEFORE GET / to avoid routing conflicts
 */
router.get('/test-email', async (req, res) => {
  try {
    // Set JSON content type
    res.setHeader('Content-Type', 'application/json');
    
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({
        success: false,
        error: 'Email not configured',
        details: {
          EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'NOT SET',
          EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'NOT SET',
          ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'Using EMAIL_USER',
        },
        message: 'Please set EMAIL_USER and EMAIL_PASS in your .env file',
      });
    }

    console.log('🧪 Test email endpoint called');
    console.log('   EMAIL_USER:', process.env.EMAIL_USER);
    console.log('   ADMIN_EMAIL:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);

    // Try to send a test email
    const testResult = await sendContactEmail({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Email from Moodio',
      message: 'This is a test email to verify your email configuration is working correctly.',
    });

    if (testResult.success) {
      console.log('✅ Test email sent successfully');
      return res.json({
        success: true,
        message: 'Test email sent successfully!',
        details: {
          messageId: testResult.messageId,
          response: testResult.response,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        },
      });
    } else {
      console.error('❌ Test email failed:', testResult.error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send test email',
        details: testResult.error,
        message: 'Check your email credentials and server logs for more details',
      });
    }
  } catch (error) {
    console.error('❌ Test email error:', error);
    return res.status(500).json({
      success: false,
      error: 'Test email failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * POST /api/contact
 * Submit a new contact form message
 */
router.post('/', submitContact);

/**
 * GET /api/contact
 * Get all contact messages (optional admin endpoint)
 */
router.get('/', getContactMessages);

module.exports = router;
