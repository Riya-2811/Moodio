/**
 * Contact Controller
 * Handles contact form submissions
 */

const ContactMessage = require('../models/ContactMessage');
const { sendContactEmail } = require('../utils/sendEmail');
const mongoose = require('mongoose');

/**
 * Submit contact form
 * POST /api/contact
 */
const submitContact = async (req, res) => {
  try {
    console.log('📥 Contact form submission received');
    console.log('   Request body:', { 
      name: req.body?.name?.substring(0, 20) + '...', 
      email: req.body?.email, 
      subject: req.body?.subject?.substring(0, 30) + '...',
      messageLength: req.body?.message?.length 
    });

    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Name is required',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Basic email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Subject is required',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
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

    // Create contact message document
    console.log('💾 Creating contact message document...');
    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Save to MongoDB
    console.log('💾 Saving to MongoDB...');
    const savedMessage = await contactMessage.save();
    console.log('✅ Contact message saved to database:', savedMessage._id);

    // Send email notification (non-blocking - don't fail if email fails)
    try {
      const emailResult = await sendContactEmail({
        name: savedMessage.name,
        email: savedMessage.email,
        subject: savedMessage.subject,
        message: savedMessage.message,
      });

      if (emailResult.success) {
        console.log('✅ Contact email sent successfully');
        console.log('   Email details:', {
          messageId: emailResult.messageId,
          response: emailResult.response,
        });
      } else {
        console.error('❌ Contact email failed to send, but message was saved');
        console.error('   Error:', emailResult.error);
        console.error('   Details:', emailResult.details || 'No additional details');
        console.error('   ⚠️  Check your .env file for EMAIL_USER, EMAIL_PASS, and ADMIN_EMAIL');
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('❌ Email sending error (message still saved):');
      console.error('   Error:', emailError.message);
      console.error('   Stack:', emailError.stack);
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Message received! We\'ll get back to you soon.',
      data: {
        id: savedMessage._id,
        name: savedMessage.name,
        email: savedMessage.email,
        subject: savedMessage.subject,
        createdAt: savedMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Error submitting contact form:');
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Error stack:', error.stack);
    console.error('   Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));

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

    // Handle duplicate key errors (if any)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry detected',
      });
    }

    // Generic error - include more details in development
    res.status(500).json({
      success: false,
      error: 'Failed to submit message. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get all contact messages (Admin only - optional)
 * GET /api/contact
 */
const getContactMessages = async (req, res) => {
  try {
    // Optional: Add admin authentication here
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select('-__v');

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('❌ Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
};

module.exports = {
  submitContact,
  getContactMessages,
};

