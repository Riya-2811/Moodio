/**
 * Therapist Controller
 * Handles therapist consultation requests
 */

const TherapistRequest = require('../models/TherapistRequest');
const { sendContactEmail } = require('../utils/sendEmail');
const mongoose = require('mongoose');

/**
 * Submit therapist request
 * POST /api/therapist
 */
const submitTherapistRequest = async (req, res) => {
  try {
    console.log('📥 Therapist request submission received');
    console.log('   Request body:', req.body);

    const { preferredMethod, timeAvailability, reason, userEmail, userName } = req.body;

    // Validation
    if (!preferredMethod || !['video', 'phone', 'in-person', 'any'].includes(preferredMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Valid preferred consultation method is required',
      });
    }

    if (!timeAvailability || !['morning', 'afternoon', 'evening', 'any'].includes(timeAvailability)) {
      return res.status(400).json({
        success: false,
        error: 'Valid time availability is required',
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected. Connection state:', mongoose.connection.readyState);
      return res.status(500).json({
        success: false,
        error: 'Database connection error. Please try again later.',
      });
    }

    // Create therapist request document
    console.log('💾 Creating therapist request document...');
    const therapistRequest = new TherapistRequest({
      preferredMethod: preferredMethod.trim(),
      timeAvailability: timeAvailability.trim(),
      reason: reason ? reason.trim() : '',
      userEmail: userEmail ? userEmail.trim().toLowerCase() : undefined,
      userName: userName ? userName.trim() : undefined,
    });

    // Save to MongoDB
    console.log('💾 Saving to MongoDB...');
    const savedRequest = await therapistRequest.save();
    console.log('✅ Therapist request saved to database:', savedRequest._id);

    // Format consultation method for email
    const methodMap = {
      'video': 'Video Call (Online)',
      'phone': 'Phone Call',
      'in-person': 'In-Person',
      'any': 'Any Method',
    };

    const timeMap = {
      'morning': 'Morning (9 AM - 12 PM)',
      'afternoon': 'Afternoon (12 PM - 5 PM)',
      'evening': 'Evening (5 PM - 9 PM)',
      'any': 'Any Time',
    };

    // Create email message
    const emailMessage = `
New Therapist Consultation Request

Preferred Consultation Method: ${methodMap[preferredMethod]}
Preferred Time Availability: ${timeMap[timeAvailability]}
${userName ? `User Name: ${userName}` : ''}
${userEmail ? `User Email: ${userEmail}` : ''}

${reason ? `What they need help with:\n${reason}` : 'No additional details provided.'}
    `.trim();

    // Send email notification (non-blocking - don't fail if email fails)
    try {
      const emailResult = await sendContactEmail({
        name: userName || 'Anonymous User',
        email: userEmail || 'no-email-provided@moodio.com',
        subject: 'New Therapist Consultation Request - Moodio',
        message: emailMessage,
      });

      if (emailResult.success) {
        console.log('✅ Therapist request email sent successfully');
        console.log('   Email details:', {
          messageId: emailResult.messageId,
          response: emailResult.response,
        });
      } else {
        console.error('❌ Therapist request email failed to send, but request was saved');
        console.error('   Error:', emailResult.error);
        console.error('   Details:', emailResult.details || 'No additional details');
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('❌ Email sending error (request still saved):');
      console.error('   Error:', emailError.message);
      console.error('   Stack:', emailError.stack);
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Request submitted! We\'ll help you find suitable therapists and connect with you shortly.',
      data: {
        id: savedRequest._id,
        preferredMethod: savedRequest.preferredMethod,
        timeAvailability: savedRequest.timeAvailability,
        createdAt: savedRequest.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Error submitting therapist request:');
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Error stack:', error.stack);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('   Validation errors:', errors);
      return res.status(400).json({
        success: false,
        error: errors.join(', '),
      });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError') {
      console.error('   MongoDB error detected');
      return res.status(500).json({
        success: false,
        error: 'Database connection error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      error: 'Failed to submit request. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get all therapist requests (Admin only - optional)
 * GET /api/therapist
 */
const getTherapistRequests = async (req, res) => {
  try {
    const requests = await TherapistRequest.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select('-__v');

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('❌ Error fetching therapist requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch requests',
    });
  }
};

module.exports = {
  submitTherapistRequest,
  getTherapistRequests,
};

