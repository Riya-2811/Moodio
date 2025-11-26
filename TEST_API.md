# Testing AI Twin Chat API

## Quick Test Steps:

1. **Start the backend server:**
   ```bash
   npm run server
   ```
   Or:
   ```bash
   cd server
   node server.js
   ```
   You should see: `🚀 Moodio server is running on port 5000`

2. **Check if server is running:**
   Open your browser and visit: `http://localhost:5000/api/health`
   Should return: `{"status":"OK","message":"Moodio API is running"}`

3. **Test the chat endpoint manually:**
   Use your browser's developer console (F12) and run:
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

4. **If the frontend still can't connect:**
   - Check browser console for CORS errors
   - Verify the server is running on port 5000
   - Check if firewall is blocking the connection
   - Ensure the frontend is making requests to `http://localhost:5000/api`

