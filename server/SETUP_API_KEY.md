# 🔑 Setting Up Your Gemini API Key

## Quick Setup Guide

The error "AI service configuration error. Please check API key" occurs because the Gemini API key is not configured.

### Step 1: Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or use an existing key
4. Copy the API key (it looks like: `AIzaSy...`)

### Step 2: Update Your .env File

1. Open the `.env` file in the `server` directory:
   ```bash
   cd server
   nano .env
   # or use your preferred editor
   ```

2. Replace the placeholder with your actual API key:
   ```env
   GEMINI_API_KEY=AIzaSyYourActualKeyHere
   ```

   **Important:** 
   - Remove any quotes around the key
   - Don't include spaces
   - The key should start with `AIzaSy`

3. Save the file

### Step 3: Restart the Server

After updating the `.env` file, restart your server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

You should see:
- ✅ No warning about GEMINI_API_KEY
- ✅ Server running successfully

### Step 4: Test

1. Open the frontend application
2. Click "Summon the Reaper" button
3. The code review should now work!

## Troubleshooting

### Still Getting Errors?

1. **Check the .env file location**: Make sure it's in the `server` directory, not the root directory
2. **Verify the key format**: Should start with `AIzaSy` and be about 39 characters long
3. **Check for typos**: Make sure there are no extra spaces or quotes
4. **Restart the server**: Environment variables are loaded on startup

### Example .env File

```env
# Server Configuration
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Google Gemini API Key (REQUIRED)
GEMINI_API_KEY=AIzaSyExample1234567890abcdefghijklmnopqrstuvwxyz

# GitHub OAuth (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/github/callback
```

## Need Help?

- [Google AI Studio Documentation](https://ai.google.dev/docs)
- [Gemini API Quickstart](https://ai.google.dev/tutorials/node_quickstart)

