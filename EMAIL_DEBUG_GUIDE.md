# Email Debugging Guide

If emails are not being received, follow these steps to diagnose and fix the issue.

## 🔍 Step 1: Check Server Logs

When you submit a contact form, check your server console for these messages:

### ✅ Success Indicators:
```
📧 Attempting to send email...
   From: your-email@gmail.com
   To: admin@example.com
   Subject: New Contact Form Message – Moodio
✅ Email transporter verified successfully
📤 Sending email...
✅ Contact email sent successfully!
   Message ID: <...>
   Response: 250 2.0.0 OK ...
```

### ❌ Error Indicators:
```
⚠️  Email not sent: Email credentials not configured
   EMAIL_USER: NOT SET
   EMAIL_PASS: NOT SET
```

OR

```
❌ Email transporter verification failed: Invalid login
❌ Error sending contact email:
   Error code: EAUTH
   Error message: Invalid login: 535-5.7.8 Username and Password not accepted
```

## 🧪 Step 2: Test Email Configuration

Use the test endpoint to verify your email setup:

1. **Open your browser** and go to:
   ```
   http://localhost:5000/api/contact/test-email
   ```
   (Or `http://localhost:5001/api/contact/test-email` if your server runs on port 5001)

2. **Check the response:**
   - If successful: You'll see a JSON response with `success: true` and a message ID
   - If failed: You'll see error details explaining what's wrong

## 🔧 Step 3: Verify Environment Variables

### Check if .env file exists:
- Location: Root directory of your project (same level as `package.json`)
- File name: `.env` (with the dot at the beginning)

### Required Variables:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
ADMIN_EMAIL=your-admin-email@gmail.com
```

### Common Issues:

#### Issue 1: Variables Not Set
**Symptom:** Server logs show "EMAIL_USER: NOT SET"
**Fix:** 
- Create `.env` file in root directory
- Add the three variables above
- **Restart your server** (environment variables are loaded on startup)

#### Issue 2: Using Regular Password Instead of App Password
**Symptom:** Error code `EAUTH` or "Invalid login"
**Fix:**
- Gmail requires an **App Password**, not your regular password
- Generate one at: https://myaccount.google.com/apppasswords
- Use the 16-character password (remove spaces if any)

#### Issue 3: 2-Factor Authentication Not Enabled
**Symptom:** Can't generate App Password
**Fix:**
- Enable 2-Step Verification first
- Then generate App Password

## 📝 Step 4: Gmail App Password Setup

### Detailed Steps:

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification:**
   - Click "2-Step Verification"
   - Follow the setup process
   - Verify with your phone

3. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as device
   - Enter: "Moodio Contact Form"
   - Click "Generate"
   - **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

4. **Add to .env:**
   ```env
   EMAIL_USER=yourname@gmail.com
   EMAIL_PASS=abcdefghijklmnop
   ADMIN_EMAIL=yourname@gmail.com
   ```
   **Important:** Remove spaces from the App Password!

5. **Restart Server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run server
   ```

## 🐛 Step 5: Common Error Codes

### EAUTH (Authentication Failed)
- **Cause:** Wrong email or password
- **Fix:** 
  - Verify EMAIL_USER is your full Gmail address
  - Verify EMAIL_PASS is the App Password (not regular password)
  - Make sure there are no extra spaces

### ECONNECTION (Connection Failed)
- **Cause:** Network/firewall issue
- **Fix:** 
  - Check internet connection
  - Check if port 587 or 465 is blocked
  - Try from a different network

### ETIMEDOUT (Timeout)
- **Cause:** Gmail server not responding
- **Fix:** 
  - Wait a few minutes and try again
  - Check Gmail status: https://status.google.com/

## ✅ Step 6: Verify Email Was Sent

### Check Server Logs:
Look for these lines after submitting the form:
```
✅ Contact email sent successfully!
   Message ID: <...>
   Response: 250 2.0.0 OK ...
```

### Check Your Email:
1. **Check Inbox** - Look for subject: "New Contact Form Message – Moodio"
2. **Check Spam/Junk** - Sometimes emails go to spam initially
3. **Check All Mail** - Gmail might categorize it
4. **Search for:** "Moodio Contact Form" or "New Contact Form Message"

### Check ADMIN_EMAIL:
- Make sure `ADMIN_EMAIL` in `.env` is the email you're checking
- If not set, it defaults to `EMAIL_USER`

## 🔄 Step 7: Restart Everything

After making changes to `.env`:

1. **Stop the server** (Ctrl+C in terminal)
2. **Restart the server:**
   ```bash
   npm run server
   ```
3. **Check startup logs** for any errors
4. **Test again** using the test endpoint or contact form

## 📊 Quick Diagnostic Checklist

- [ ] `.env` file exists in root directory
- [ ] `EMAIL_USER` is set to your Gmail address
- [ ] `EMAIL_PASS` is set to a 16-character App Password
- [ ] `ADMIN_EMAIL` is set (or defaults to EMAIL_USER)
- [ ] Server was restarted after adding/changing .env
- [ ] 2-Step Verification is enabled on Google account
- [ ] App Password was generated (not using regular password)
- [ ] No spaces in App Password in .env file
- [ ] Test endpoint shows success: `/api/contact/test-email`
- [ ] Server logs show "Email sent successfully"
- [ ] Checked spam/junk folder in email

## 🆘 Still Not Working?

If emails still aren't working after following all steps:

1. **Check server console** for the exact error message
2. **Test the endpoint:** `GET /api/contact/test-email`
3. **Verify MongoDB:** Messages should still be saved even if email fails
4. **Try a different email service:** Update `sendEmail.js` to use Outlook, SendGrid, etc.

## 📧 Alternative: Use a Different Email Service

If Gmail continues to have issues, you can switch to:

### Outlook/Hotmail:
```javascript
// In server/utils/sendEmail.js, change:
service: 'outlook',
```

### SendGrid (Recommended for Production):
- Sign up at: https://sendgrid.com
- Get API key
- Update transporter to use SMTP with SendGrid credentials

---

**Remember:** Even if email fails, messages are still saved to MongoDB. Check your database to confirm messages are being received.

