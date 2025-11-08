# Code Reaper - Setup Guide

## Environment Variables

### Server (.env file in `server/` directory)

Create a `.env` file in the `server/` directory with the following variables:

```env
# Google Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# RunAnywhere SDK (Optional - for microservice deployment)
RUNANYWHERE_TOKEN=your_runanywhere_token_here

# GitHub OAuth (Optional - for PR feature)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/github/callback
```

### Client (.env file in `client/` directory)

Create a `.env` file in the `client/` directory (optional):

```env
# Backend API URL (Optional - defaults to /api which uses Vite proxy)
VITE_API_URL=http://localhost:3000/api
```

## Getting API Keys

### Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `server/.env` file as `GEMINI_API_KEY`

### RunAnywhere Token (Optional)

1. Visit [RunAnywhere](https://runanywhere.ai)
2. Sign up for an account
3. Get your token from the dashboard
4. Add it to your `server/.env` file as `RUNANYWHERE_TOKEN`

**Note:** The RunAnywhere SDK integration is optional. The app works without it using the local Express server.

## Running the Application

### Development Mode

From the root directory:

```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev
```

Or manually:

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

### Production Build

```bash
# Build frontend
cd client
npm run build

# Start backend
cd server
npm start
```

## API Endpoints

### Code Review
- **POST** `/api/review`
- **Body:** `{ "code": "...", "language": "javascript" }`
- **Response:** `{ "errors": [...], "warnings": [...], "suggestions": [...], "verdict": "...", "curseLevel": 0-100 }`

### Auto-Exorcise (Fix Code)
- **POST** `/api/fix`
- **Body:** `{ "code": "...", "language": "javascript" }`
- **Response:** `{ "fixedCode": "..." }`

### Health Check
- **GET** `/api/health`

## RunAnywhere Integration

When the RunAnywhere SDK is installed and `RUNANYWHERE_TOKEN` is set, your functions will be available as microservices at:

- `https://runanywhere.ai/api/<teamname>/reviewCode`
- `https://runanywhere.ai/api/<teamname>/autoFix`

To install the RunAnywhere SDK (when available):

```bash
cd server
npm install runanywhere-sdk
```

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` in server `.env` matches your frontend URL
- Default is `http://localhost:5173` for Vite dev server

### API Key Errors
- Verify `GEMINI_API_KEY` is set correctly in `server/.env`
- Check that the API key is valid and has quota available

### RunAnywhere Integration
- The app works without RunAnywhere SDK
- If you see warnings about RunAnywhere, the app will continue to work with the local Express server
- To enable RunAnywhere, install the SDK and set `RUNANYWHERE_TOKEN`

## Support

For issues or questions, please check the main README.md or open an issue on GitHub.

