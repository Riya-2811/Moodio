/**
 * Email Utility
 * Sends emails using nodemailer
 * Configure via environment variables: EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL
 */

const nodemailer = require('nodemailer');

/**
 * Create reusable transporter object using SMTP transport
 */
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not configured. Email sending will be disabled.');
    return null;
  }

  // Clean email password - remove spaces (Gmail app passwords sometimes have spaces in env vars)
  const emailPass = String(process.env.EMAIL_PASS).replace(/\s+/g, '').trim();
  const emailUser = String(process.env.EMAIL_USER).trim();

  console.log('📧 Email configuration:');
  console.log('   EMAIL_USER:', emailUser);
  console.log('   EMAIL_PASS length:', emailPass.length, 'characters');
  console.log('   EMAIL_PASS (first 4 chars):', emailPass.substring(0, 4) + '****');

  return nodemailer.createTransport({
    service: 'gmail', // You can change this to 'outlook', 'yahoo', etc.
    auth: {
      user: emailUser,
      pass: emailPass, // Use App Password for Gmail (spaces removed)
    },
  });
};

/**
 * Send contact form email to admin
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - User's name
 * @param {string} contactData.email - User's email
 * @param {string} contactData.subject - Message subject
 * @param {string} contactData.message - Message content
 * @returns {Promise<Object>} - Email sending result
 */
const sendContactEmail = async (contactData) => {
  const { name, email, subject, message } = contactData;

  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email not sent: Email credentials not configured');
    console.warn('   EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
    console.warn('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'NOT SET');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  // Get admin email from environment or use default
  const adminEmail = (process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '').trim();
  
  console.log('📧 Attempting to send email...');
  console.log('   From:', process.env.EMAIL_USER);
  console.log('   To:', adminEmail);
  console.log('   Subject: New Contact Form Message – Moodio');

  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('❌ Email transporter is null - credentials may be invalid');
      return {
        success: false,
        error: 'Email transporter not available',
      };
    }

    // Verify transporter connection with timeout
    try {
      const verifyPromise = transporter.verify();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email verification timeout (5s)')), 5000)
      );
      await Promise.race([verifyPromise, timeoutPromise]);
      console.log('✅ Email transporter verified successfully');
    } catch (verifyError) {
      console.error('❌ Email transporter verification failed:', verifyError.message);
      console.error('   Full error:', verifyError);
      return {
        success: false,
        error: `Email configuration error: ${verifyError.message}`,
      };
    }

    // Escape HTML to prevent XSS attacks
    const escapeHtml = (text) => {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    // Email content
    const mailOptions = {
      from: `"Moodio Contact Form" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      replyTo: email, // Allow replying directly to the user
      subject: 'New Contact Form Message – Moodio',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
              }
              .email-container {
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #B39BC8 0%, #F8BBD0 100%);
                color: white;
                padding: 20px;
                text-align: center;
              }
              .content {
                background: #f9f9f9;
                padding: 20px;
                border: 1px solid #ddd;
                border-top: none;
              }
              .field {
                margin-bottom: 15px;
              }
              .label {
                font-weight: bold;
                color: #666;
                display: block;
                margin-bottom: 5px;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .value {
                color: #333;
                padding: 10px;
                background: white;
                border-radius: 5px;
                border-left: 3px solid #B39BC8;
                word-wrap: break-word;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #666;
                text-align: center;
              }
              .reply-button {
                display: inline-block;
                margin-top: 10px;
                padding: 10px 20px;
                background: #B39BC8;
                color: white;
                text-decoration: none;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h2 style="margin: 0;">📬 New Contact Form Message</h2>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">Name:</span>
                  <div class="value">${safeName}</div>
                </div>
                <div class="field">
                  <span class="label">Email:</span>
                  <div class="value">${safeEmail}</div>
                </div>
                <div class="field">
                  <span class="label">Subject:</span>
                  <div class="value">${safeSubject}</div>
                </div>
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value" style="white-space: pre-wrap;">${safeMessage}</div>
                </div>
                <div class="footer">
                  <p>This message was sent from the Moodio contact form.</p>
                  <a href="mailto:${safeEmail}?subject=Re: ${safeSubject}" class="reply-button">Reply to ${safeEmail}</a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Message – Moodio

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the Moodio contact form.
Reply to: ${email}
      `,
    };

    // Send email with timeout
    console.log('📤 Sending email...');
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout (15s)')), 15000)
    );
    const info = await Promise.race([sendPromise, timeoutPromise]);
    
    console.log('✅ Contact email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   To:', adminEmail);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error('❌ Error sending contact email:');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Command:', error.command);
    console.error('   Full error:', error);
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS in .env file. Make sure you\'re using an App Password for Gmail.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Check your internet connection.';
    } else if (error.message) {
      errorMessage = `Email error: ${error.message}`;
    }
    
    return {
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

module.exports = {
  sendContactEmail,
  createTransporter,
};

