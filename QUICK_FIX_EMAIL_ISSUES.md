# Quick Fix: Email Not Sending on Render

## 🔴 The Problem

Your forms are submitting but emails aren't being sent. This is because the email environment variables aren't configured on your Render backend.

## ✅ Quick Fix Steps

### Step 1: Set Email Environment Variables on Render Backend

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **backend service** (`moodio-pmxy` or similar)
3. Go to **Environment** tab
4. Add these three variables:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
ADMIN_EMAIL=your-email@gmail.com
```

### Step 2: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. If you haven't enabled 2-Step Verification, do that first
3. Generate an App Password:
   - Select "Mail"
   - Select "Other (Custom name)"
   - Enter "Moodio"
   - Copy the 16-character password
   - **Remove all spaces** when adding to Render

### Step 3: Restart Backend Service

1. In Render dashboard, go to your backend service
2. Click **Manual Deploy** → **Clear build cache & deploy**
3. Wait for deployment to complete

### Step 4: Verify Frontend API URL

1. Go to your **frontend service** on Render
2. Go to **Environment** tab
3. Make sure this is set:
   ```
   REACT_APP_API_URL=https://moodio-pmxy.onrender.com/api
   ```
4. If you just added/changed it, **rebuild the frontend**:
   - Go to **Manual Deploy** → **Deploy latest commit**

### Step 5: Test

1. Test email configuration:
   - Visit: `https://moodio-pmxy.onrender.com/api/contact/test-email`
   - Should show success message

2. Test contact form:
   - Go to: `https://moodio-10.onrender.com/contact`
   - Submit the form
   - Check your email inbox

3. Test therapist form:
   - Go to: `https://moodio-10.onrender.com/therapist`
   - Submit the form
   - Check your email inbox

## 🔍 If Still Not Working

### Check Backend Logs

1. In Render dashboard → Your backend service → **Logs** tab
2. Look for these messages:
   - ✅ `Email transporter verified successfully` → Good!
   - ❌ `Email credentials not configured` → Environment variables not set
   - ❌ `EAUTH` error → Wrong password/credentials

### Common Issues

1. **Using regular password instead of App Password**
   - Solution: Generate App Password from Google account settings

2. **Spaces in App Password**
   - Solution: Remove all spaces when copying to Render

3. **2-Step Verification not enabled**
   - Solution: Enable it first, then generate App Password

4. **Frontend not rebuilt after changing REACT_APP_API_URL**
   - Solution: Manually trigger a new deploy

5. **Backend not restarted after adding environment variables**
   - Solution: Restart the service in Render

## 📝 Environment Variables Checklist

### Backend (Web Service):
```
✅ MONGODB_URI=your_mongodb_uri
✅ EMAIL_USER=your-email@gmail.com
✅ EMAIL_PASS=16-char-app-password-no-spaces
✅ ADMIN_EMAIL=your-email@gmail.com
```

### Frontend (Static Site):
```
✅ REACT_APP_API_URL=https://moodio-pmxy.onrender.com/api
```

## 🎯 Expected Behavior After Fix

1. Forms submit successfully ✅
2. Success message appears ✅
3. Email received in ADMIN_EMAIL inbox ✅
4. No errors in browser console ✅
5. Backend logs show "Email sent successfully" ✅

---

**Most Common Issue**: Environment variables not set or backend not restarted after setting them. Follow Step 1-3 above!


