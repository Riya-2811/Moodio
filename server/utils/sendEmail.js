/**
 * Email Utility
 * Sends emails using Resend API (works better with Render free tier - no SMTP blocking)
 * Configure via environment variables: RESEND_API_KEY, ADMIN_EMAIL, FROM_EMAIL
 * Fallback to nodemailer if RESEND_API_KEY is not set
 */

const nodemailer = require('nodemailer');
const { Resend } = require('resend');

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

  // Use explicit Gmail SMTP configuration with STARTTLS (port 587)
  // Port 587 is more commonly allowed through firewalls than 465
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS instead of SSL
    requireTLS: true, // Require TLS
    auth: {
      user: emailUser,
      pass: emailPass, // Use App Password for Gmail (spaces removed)
    },
    // Connection timeout settings - shorter for faster failure
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 15000, // 15 seconds
    // Retry settings
    pool: false, // Don't pool connections
    // TLS options
    tls: {
      rejectUnauthorized: true, // Verify SSL certificates
    },
  });
};

/**
 * Send email using Resend API (HTTP-based, works with Render free tier)
 * This is the preferred method as it doesn't require SMTP connections
 */
const sendWithResend = async (contactData) => {
  const { name, email, subject, message } = contactData;
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Resend free tier restriction: can only send to account owner's email
  // To send to contact.moodio@gmail.com, you need to:
  // Option 1: Verify a domain in Resend (recommended)
  // Option 2: Use Gmail forwarding from riyachandna2005@gmail.com to contact.moodio@gmail.com
  
  // Check if domain is verified (FROM_EMAIL contains a custom domain)
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const hasVerifiedDomain = fromEmail.includes('@') && !fromEmail.includes('@resend.dev') && !fromEmail.includes('@onboarding.resend.dev');
  
  // If domain is verified, use ADMIN_EMAIL; otherwise use Resend account email
  const adminEmail = hasVerifiedDomain 
    ? (process.env.ADMIN_EMAIL || 'contact.moodio@gmail.com').trim()
    : (process.env.RESEND_ACCOUNT_EMAIL || process.env.EMAIL_USER || 'riyachandna2005@gmail.com').trim();
  
  console.log('📧 Resend API Configuration:');
  console.log('   From:', fromEmail);
  console.log('   To:', adminEmail);
  console.log('   Has verified domain:', hasVerifiedDomain);
  if (!hasVerifiedDomain) {
    console.log('   ⚠️  Free tier: Sending to Resend account email. To send to contact.moodio@gmail.com, verify a domain in Resend.');
  }
  
  console.log('📧 Attempting to send email via Resend API...');
  console.log('   From:', fromEmail);
  console.log('   To:', adminEmail);
  console.log('   Subject: New Contact Form Message – Moodio');

  try {
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

    const { data, error } = await resend.emails.send({
      from: `Moodio Contact Form <${fromEmail}>`,
      to: [adminEmail],
      replyTo: email,
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
                padding: 20px;
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
                background: #f9f9f9;
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
                  <p>Reply to: ${safeEmail}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      return {
        success: false,
        error: `Resend API error: ${error.message}`,
        details: error,
      };
    }

    console.log('✅ Contact email sent successfully via Resend!');
    console.log('   Email ID:', data?.id);
    console.log('   To:', adminEmail);
    
    return {
      success: true,
      messageId: data?.id,
      response: 'Email sent via Resend API',
    };
  } catch (error) {
    console.error('❌ Error sending email via Resend:', error);
    return {
      success: false,
      error: `Resend error: ${error.message}`,
      details: error,
    };
  }
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

  // Try Resend API first (works better with Render free tier - no SMTP blocking)
  if (process.env.RESEND_API_KEY) {
    return await sendWithResend(contactData);
  }

  // Fallback to nodemailer (SMTP) if Resend not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email not sent: No email service configured');
    console.warn('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'NOT SET');
    console.warn('   EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
    console.warn('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'NOT SET');
    return {
      success: false,
      error: 'Email service not configured. Please set RESEND_API_KEY (recommended) or EMAIL_USER/EMAIL_PASS',
    };
  }

  // Get admin email from environment or use default
  const adminEmail = (process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '').trim();
  
  console.log('📧 Attempting to send email via SMTP (fallback)...');
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

    // Skip verification - it's slow and not necessary
    // We'll catch errors during actual send if credentials are wrong
    console.log('📧 Skipping email verification (will verify during send)...');

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

    // Send email with retry logic and timeout protection
    console.log('📤 Sending email...');
    
    let lastError;
    const maxRetries = 2;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`   Retry attempt ${attempt}/${maxRetries}...`);
          // Wait a bit before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        const sendPromise = transporter.sendMail(mailOptions);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email send timeout (25s)')), 25000)
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
        lastError = error;
        console.warn(`   Attempt ${attempt} failed:`, error.message);
        
        // If it's a connection timeout and we have retries left, continue
        if (error.code === 'ETIMEDOUT' && attempt < maxRetries) {
          continue;
        }
        // Otherwise, throw the error
        throw error;
      }
    }
    
    // Should not reach here, but just in case
    throw lastError;
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

