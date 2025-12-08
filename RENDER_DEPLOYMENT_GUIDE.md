# Render Deployment Guide for Moodio

This guide will help you deploy Moodio on Render and configure email functionality.

## 🚀 Frontend Deployment (Static Site)

### Step 1: Create Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `moodio-frontend` (or your preferred name)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Environment**: Leave as default

### Step 2: Set Environment Variables (Frontend)

Add these environment variables in Render dashboard:

```
REACT_APP_API_URL=https://moodio-pmxy.onrender.com/api
```

**Important**: After adding environment variables, you MUST rebuild the site for them to take effect.

## 🔧 Backend Deployment (Web Service)

### Step 1: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `moodio-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
   - **Plan**: Free tier is fine for testing

### Step 2: Set Environment Variables (Backend) - CRITICAL FOR EMAIL

Go to your Web Service → Environment tab and add these variables:

#### Required Variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Email Configuration (REQUIRED FOR EMAIL TO WORK)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
ADMIN_EMAIL=your-admin-email@gmail.com

# Server Port (Render sets this automatically, but you can override)
PORT=10000
```

#### How to Get Gmail App Password:

1. **Enable 2-Step Verification**:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as device
   - Enter: "Moodio Render"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcdefghijklmnop`)
   - **Remove all spaces** when adding to Render

3. **Add to Render**:
   ```
   EMAIL_USER=yourname@gmail.com
   EMAIL_PASS=abcdefghijklmnop  (no spaces!)
   ADMIN_EMAIL=yourname@gmail.com
   ```

### Step 3: Verify Backend is Running

1. Check the logs in Render dashboard
2. You should see: `✅ Connected to MongoDB`
3. You should see: `🚀 Moodio backend running on [port]`

### Step 4: Test Email Configuration

After deployment, test the email endpoint:

```
GET https://moodio-pmxy.onrender.com/api/contact/test-email
```

You should see a JSON response indicating if email is configured correctly.

## 🔍 Troubleshooting

### Issue: Forms Submit but No Emails Received

**Symptoms**: 
- Form shows "Message sent successfully"
- No email received
- 404 error in browser console

**Solutions**:

1. **Check Environment Variables on Render**:
   - Go to your Web Service → Environment
   - Verify `EMAIL_USER`, `EMAIL_PASS`, and `ADMIN_EMAIL` are set
   - Make sure there are NO spaces in `EMAIL_PASS`
   - Make sure you're using an App Password, not your regular password

2. **Check Backend Logs**:
   - Go to Render dashboard → Your Web Service → Logs
   - Look for email-related errors:
     - `⚠️ Email credentials not configured` → Environment variables not set
     - `❌ Email transporter verification failed` → Wrong credentials
     - `❌ Error sending contact email: EAUTH` → Authentication failed

3. **Test Email Endpoint**:
   - Visit: `https://moodio-pmxy.onrender.com/api/contact/test-email`
   - Check the response for error details

4. **Verify App Password**:
   - Make sure 2-Step Verification is enabled
   - Generate a new App Password if needed
   - Update `EMAIL_PASS` in Render environment variables
   - **Restart the service** after updating variables

### Issue: 404 Error on Form Submission

**Symptoms**:
- Browser console shows: `Failed to load resource: 404`
- Form stays in "Sending..." state

**Solutions**:

1. **Check API Base URL**:
   - Verify `REACT_APP_API_URL` is set correctly in Frontend environment variables
   - Should be: `https://moodio-pmxy.onrender.com/api` (replace with your backend URL)
   - **Rebuild the frontend** after changing environment variables

2. **Verify Backend Routes**:
   - Check backend logs for route registration
   - Should see: `✅ All routes loaded successfully`
   - Test backend directly: `https://moodio-pmxy.onrender.com/api/health`

3. **Check CORS Configuration**:
   - Verify your frontend URL is in the `allowedOrigins` array in `server/server.js`
   - Add your frontend URL if it's not there

4. **Check Backend URL**:
   - Make sure backend is actually running
   - Check Render dashboard for service status
   - Verify the backend URL matches what's in frontend environment variables

### Issue: CORS Errors

**Symptoms**:
- Browser console shows: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions**:

1. **Update CORS in server.js**:
   - Add your frontend URL to `allowedOrigins` array
   - Example: `"https://moodio-10.onrender.com"`
   - Redeploy backend after changes

2. **Check Origin Header**:
   - Verify the frontend URL matches exactly (including https/http, www/non-www)

## 📝 Environment Variables Checklist

### Frontend (Static Site):
- [ ] `REACT_APP_API_URL` = `https://moodio-pmxy.onrender.com/api` (your backend URL)

### Backend (Web Service):
- [ ] `MONGODB_URI` = Your MongoDB connection string
- [ ] `EMAIL_USER` = Your Gmail address
- [ ] `EMAIL_PASS` = 16-character App Password (no spaces!)
- [ ] `ADMIN_EMAIL` = Email where you want to receive messages
- [ ] `PORT` = (Optional, Render sets this automatically)

## 🔄 After Making Changes

### Frontend Changes:
1. Update environment variables in Render
2. **Manually trigger a new deploy** (or push to GitHub if auto-deploy is enabled)
3. Wait for build to complete

### Backend Changes:
1. Update environment variables in Render
2. **Restart the service** (Render → Your Service → Manual Deploy → Clear build cache & deploy)
3. Check logs to verify it started correctly

## ✅ Verification Steps

1. **Backend Health Check**:
   ```
   GET https://moodio-pmxy.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Moodio API running"}`

2. **Email Test**:
   ```
   GET https://moodio-pmxy.onrender.com/api/contact/test-email
   ```
   Should return success message if email is configured

3. **Contact Form Test**:
   - Go to your frontend: `https://moodio-10.onrender.com/contact`
   - Fill out and submit the form
   - Check browser console for errors
   - Check backend logs in Render
   - Check your email inbox (and spam folder)

4. **Therapist Form Test**:
   - Go to your frontend: `https://moodio-10.onrender.com/therapist`
   - Fill out and submit the form
   - Check browser console for errors
   - Check backend logs in Render
   - Check your email inbox (and spam folder)

## 🆘 Still Having Issues?

1. **Check Render Logs**: Most errors will show up in the service logs
2. **Check Browser Console**: Look for network errors or API errors
3. **Test Backend Directly**: Use Postman or curl to test endpoints
4. **Verify Environment Variables**: Double-check all variables are set correctly
5. **Check MongoDB Connection**: Verify database is accessible from Render

## 📧 Email Service Alternatives

If Gmail continues to have issues, consider:

1. **SendGrid** (Recommended for production):
   - Sign up at: https://sendgrid.com
   - Get API key
   - Update `server/utils/sendEmail.js` to use SendGrid SMTP

2. **Mailgun**:
   - Sign up at: https://www.mailgun.com
   - Configure SMTP settings

3. **AWS SES**:
   - Use Amazon SES for high-volume email sending

---

**Remember**: Environment variables must be set in Render dashboard, and services must be restarted/redeployed for changes to take effect!

