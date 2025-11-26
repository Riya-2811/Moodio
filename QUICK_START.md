# Quick Start Guide - AI Twin Chat

## Issue: Chat Not Working

If you see "Unable to connect to AI Twin" error, follow these steps:

### Step 1: Start the Backend Server

**Option A: Using npm script (Recommended)**
```bash
npm run server
```

**Option B: Run directly**
```bash
cd server
node server.js
```

You should see:
```
🚀 Moodio server is running on port 5000
📡 API available at http://localhost:5000/api
✅ Connected to MongoDB successfully
```

### Step 2: Verify Server is Running

Open your browser and visit:
- Health check: `http://localhost:5000/api/health`
- Should show: `{"status":"OK","message":"Moodio API is running"}`

### Step 3: Test Chat Endpoint

Open browser console (F12) and run:
```javascript
fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Expected response:
```json
{
  "success": true,
  "response": "Hey there! I'm here to listen...",
  "timestamp": "..."
}
```

### Step 4: If Still Not Working

1. **Check if port 5000 is in use:**
   ```bash
   netstat -ano | findstr :5000
   ```

2. **Check server logs** for any errors

3. **Verify API URL** in `src/utils/api.js` is `http://localhost:5000/api`

4. **Restart the server:**
   - Stop the server (Ctrl+C)
   - Start again: `npm run server`

### Step 5: Optional - Add AI API Key

The chat works with fallback responses, but for real AI:
1. Get API key from OpenAI or Google Gemini
2. Add to `.env` file:
   ```
   AI_PROVIDER=openai
   OPENAI_API_KEY=your_key_here
   ```
3. Restart server

### Common Issues:

- **Port 5000 already in use:** Change PORT in `.env` or kill the process
- **MongoDB not connected:** That's OK, chat will still work with fallback
- **CORS errors:** Make sure `cors()` is enabled in `server/server.js`
- **Frontend on different port:** Make sure API URL matches your frontend port

