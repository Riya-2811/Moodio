# Contact Form Setup Guide

This guide will help you set up the fully working contact form feature for Moodio.

## 📋 Prerequisites

- Node.js and npm installed
- MongoDB database running
- Email account (Gmail recommended for easy setup)

## 🔧 Installation Steps

### Step 1: Install Nodemailer

The contact form requires `nodemailer` for sending emails. Install it:

```bash
npm install nodemailer
```

### Step 2: Configure Environment Variables

Create or update your `.env` file in the root directory with the following variables:

```env
# MongoDB Connection (if not already set)
MONGODB_URI=mongodb://localhost:27017/moodio

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=your-admin-email@gmail.com
```

#### For Gmail Users:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Moodio Contact Form"
   - Copy the 16-character password
   - Use this as your `EMAIL_PASS` value

3. **Set EMAIL_USER**: Your Gmail address (e.g., `yourname@gmail.com`)
4. **Set ADMIN_EMAIL**: The email where you want to receive contact form messages (can be same as EMAIL_USER)

#### For Other Email Providers:

Update the `service` field in `server/utils/sendEmail.js`:
- Outlook: `service: 'outlook'`
- Yahoo: `service: 'yahoo'`
- Custom SMTP: Use `host` and `port` instead of `service`

### Step 3: Verify File Structure

Ensure your project has the following structure:

```
moodio/
├── server/
│   ├── models/
│   │   └── ContactMessage.js ✅
│   ├── routes/
│   │   └── contactRoutes.js ✅
│   ├── controllers/
│   │   └── contactController.js ✅
│   ├── utils/
│   │   └── sendEmail.js ✅
│   └── server.js ✅
├── src/
│   ├── api/
│   │   └── contact.js ✅
│   └── pages/
│       └── Contact.jsx ✅
└── .env
```

### Step 4: Restart Your Server

After adding environment variables, restart your Node.js server:

```bash
npm run server
```

Or if using concurrently:

```bash
npm run dev
```

## 🧪 Testing

### Test the Contact Form:

1. Navigate to `/contact` in your browser
2. Fill out the form with test data:
   - Name: Test User
   - Email: test@example.com
   - Subject: Test Message
   - Message: This is a test message
3. Click "Send Message"
4. You should see:
   - Success toast message
   - Form clears
   - Email arrives in your ADMIN_EMAIL inbox
   - Message saved in MongoDB `contact_messages` collection

### Verify Database:

Check MongoDB to confirm messages are being saved:

```javascript
// In MongoDB shell or Compass
use moodio
db.contact_messages.find().pretty()
```

### Check Server Logs:

Look for these messages in your server console:
- ✅ `Contact message saved to database: [id]`
- ✅ `Contact email sent successfully`

## 📧 Email Configuration Details

### Gmail Setup (Recommended):

1. **Security Settings**:
   - Enable 2-Step Verification
   - Generate App Password (16 characters)
   - Use App Password, NOT your regular password

2. **Environment Variables**:
   ```env
   EMAIL_USER=yourname@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop  # 16-char app password (no spaces)
   ADMIN_EMAIL=yourname@gmail.com
   ```

### Troubleshooting Email:

If emails aren't sending:

1. **Check credentials**: Verify EMAIL_USER and EMAIL_PASS are correct
2. **Check App Password**: Make sure you're using an App Password, not your regular password
3. **Check logs**: Look for email errors in server console
4. **Test transporter**: The code will log warnings if email isn't configured
5. **Firewall**: Ensure your server can make outbound SMTP connections

**Note**: Messages are still saved to MongoDB even if email fails. Check server logs for email errors.

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use App Passwords, not regular passwords
- Keep your email credentials secure
- Consider rate limiting for production (not implemented in this basic version)

## 📝 API Endpoints

### POST /api/contact
Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about Moodio",
  "message": "I have a question..."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Message received! We'll get back to you soon.",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question about Moodio",
    "createdAt": "2025-11-21T..."
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

### GET /api/contact (Optional)
Get all contact messages (for admin dashboard - optional feature).

## ✅ Verification Checklist

- [ ] Nodemailer installed (`npm install nodemailer`)
- [ ] `.env` file created with EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL
- [ ] Gmail App Password generated (if using Gmail)
- [ ] Server restarted after adding environment variables
- [ ] MongoDB connection working
- [ ] Contact form submits successfully
- [ ] Email received in admin inbox
- [ ] Message saved in MongoDB

## 🚀 Production Considerations

For production deployment:

1. **Use environment variables** from your hosting platform (Heroku, Vercel, etc.)
2. **Add rate limiting** to prevent spam
3. **Add CAPTCHA** for bot protection
4. **Add input sanitization** (basic validation is included)
5. **Set up email service** (SendGrid, Mailgun, AWS SES) for better deliverability
6. **Add admin authentication** for GET /api/contact endpoint

## 📞 Support

If you encounter issues:

1. Check server console logs for errors
2. Verify MongoDB connection
3. Test email credentials separately
4. Check network/firewall settings
5. Review error messages in browser console

---

**All files have been created and integrated. Follow the steps above to complete the setup!**

