# Fix 404 Error on Contact Form

## 🔴 The Problem

You're seeing a 404 error when submitting the contact form. This happens because the frontend can't find the backend API endpoint.

## ✅ Solution 1: Rebuild Frontend (Recommended)

The code has been updated to automatically detect the correct backend URL. You need to rebuild your frontend on Render:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click on your Frontend service** (moodio-10 or similar)
3. **Go to Settings tab**
4. **Set Environment Variable** (if not already set):
   ```
   REACT_APP_API_URL=https://moodio-pmxy.onrender.com/api
   ```
5. **Go to Manual Deploy tab**
6. **Click "Clear build cache & deploy"**
7. **Wait for deployment to complete** (usually 2-5 minutes)

## ✅ Solution 2: Quick Test (No Rebuild Needed)

The updated code includes runtime detection, so if you've already deployed the latest code, it should work automatically. However, you still need to rebuild to get the latest changes.

## 🔍 Verify It's Working

After rebuilding:

1. **Open your frontend**: https://moodio-10.onrender.com/contact
2. **Open browser console** (F12 → Console tab)
3. **Submit the form**
4. **Check console logs** - you should see:
   ```
   [API Request] POST https://moodio-pmxy.onrender.com/api/contact
   ```
5. **No more 404 errors!**

## 🐛 If Still Getting 404

### Check 1: Verify Backend is Running
- Go to: https://moodio-pmxy.onrender.com/api/health
- Should return: `{"status":"OK","message":"Moodio API running"}`

### Check 2: Check Browser Console
- Look for the actual URL being called
- Should be: `https://moodio-pmxy.onrender.com/api/contact`
- If it's something else, the environment variable isn't set correctly

### Check 3: Verify Environment Variable
- In Render dashboard → Frontend service → Environment
- Make sure `REACT_APP_API_URL` is set to: `https://moodio-pmxy.onrender.com/api`
- **Important**: No trailing slash!

### Check 4: Clear Browser Cache
- Sometimes old JavaScript is cached
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

## 📝 What Changed

The API configuration now:
1. ✅ Automatically detects if you're on the production frontend
2. ✅ Uses the correct backend URL automatically
3. ✅ Has better error logging for debugging
4. ✅ Handles trailing slashes correctly

## 🚀 Next Steps

1. Rebuild frontend on Render (see Solution 1 above)
2. Test the contact form
3. Test the therapist form
4. Check that emails are being sent (see QUICK_FIX_EMAIL_ISSUES.md)

---

**The code fix is done! You just need to rebuild your frontend on Render to apply the changes.**

