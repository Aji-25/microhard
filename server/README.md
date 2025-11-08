# Code Reaper Backend Server

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:

#### Required for Code Review:
- **GEMINI_API_KEY**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### Required for GitHub Integration (Optional):
- **GITHUB_CLIENT_ID**: Create a GitHub OAuth App at [GitHub Developer Settings](https://github.com/settings/developers)
- **GITHUB_CLIENT_SECRET**: From your GitHub OAuth App
- **GITHUB_REDIRECT_URI**: Set to `http://localhost:3000/api/github/callback` (or your production URL)

#### Optional Configuration:
- **PORT**: Server port (default: 3000)
- **NODE_ENV**: Environment (development/production)
- **CLIENT_URL**: Frontend URL (default: http://localhost:5173)

### 3. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

- `POST /api/review` - Review code using AI
- `GET /api/github/login` - Initiate GitHub OAuth
- `GET /api/github/callback` - GitHub OAuth callback
- `GET /api/github/repos` - Fetch user repositories
- `POST /api/github/pull-request` - Create pull request with reviewed code
- `GET /api/health` - Health check endpoint

## Notes

- The code review feature requires a valid `GEMINI_API_KEY`
- GitHub features require all three GitHub OAuth variables to be set
- CORS is configured to allow requests from the frontend URL specified in `CLIENT_URL`

