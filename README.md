# 💀 Code Reaper

> Where Your Bugs Come to Die.

An AI-powered haunted code reviewer built with Google Gemini that provides real-time code analysis, suggestions, and automated pull request creation. Experience code review like never before with a spooky Halloween-themed interface.

![Code Reaper](https://img.shields.io/badge/Code%20Reaper-Haunted%20Reviewer-red?style=for-the-badge&logo=ghost)

## ✨ Features

- **🔍 AI-Powered Code Review**: Leverages Google Gemini 2.0 Flash for intelligent code analysis
- **💀 Halloween Theme**: Spooky, haunted interface with animations and effects
- **📊 Visual Code Improvements**: See your code transformed with highlighted changes
- **📋 Copy to Clipboard**: Easily copy improved code with one click
- **🔗 GitHub Integration**: OAuth authentication and direct pull request creation
- **💻 Multi-Language Support**: JavaScript, TypeScript, Python, Java, C++, Rust, and more
- **⚡ Modern UI**: Beautiful interface built with React, Tailwind CSS, and Radix UI
- **🎯 Manual Review**: Trigger reviews only when you click the button (no auto-review)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Motion (Framer Motion)** - Smooth animations
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Google Generative AI (Gemini 2.0 Flash)** - AI code analysis
- **GitHub OAuth** - Authentication and PR creation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **Google Gemini API Key** - [Get one here](https://makersuite.google.com/app/apikey)
- **GitHub OAuth App** (Optional, for PR features) - [Create one here](https://github.com/settings/developers)

- 🎥 **Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1byr4KX9EXAPctizE2CBanNt5lTSMPce5/view?usp=drive_link)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/microhard.git
cd microhard
```

### 2. Install Dependencies

```bash
# Install all dependencies (recommended)
npm run install:all

# Or install manually
cd server && npm install
cd ../client && npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env
```

Add the following to `server/.env`:

```env
# Required - Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - GitHub OAuth (for PR features)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/github/callback

# Server Configuration
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Start the Application

```bash
# From root directory - starts both servers
npm run dev

# Or start manually:
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 📖 Getting API Keys

### Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy...`)
5. Add it to `server/.env` as `GEMINI_API_KEY`

**Note**: The free tier allows 200 requests per day. The quota resets daily.

### GitHub OAuth App (Optional)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `Code Reaper` (or any name)
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:3000/api/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**
6. Add both to `server/.env`

## 🎯 Usage

### Basic Code Review

1. Open the application at http://localhost:5173
2. Select your programming language from the dropdown
3. Enter or paste your code in the editor
4. Click **"Summon the Reaper"** button
5. Wait for the AI to analyze your code
6. Review the suggestions, errors, and warnings
7. View the improved code with highlighted changes
8. Copy the improved code or accept changes to create a PR

### GitHub Integration

1. Click **"Connect GitHub"** button (top right)
2. Authorize the application on GitHub
3. After reviewing code, click **"Accept Changes"**
4. Select a repository and file path
5. Click **"Create PR"** to create a pull request

### Keyboard Shortcuts

- **Ctrl + Shift + R**: Scroll to demo section and summon the reaper

## 📁 Project Structure

```
aicodereviewer/
├── client/                    # Frontend application
│   ├── public/
│   │   └── favicon.svg       # App favicon
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Demo.tsx      # Main demo component
│   │   │   ├── Hero.tsx      # Landing page hero
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── ui/           # Radix UI components
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.ts        # API service layer
│   │   ├── App.tsx           # Root component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.ts        # Vite configuration
│   └── tailwind.config.js    # Tailwind configuration
│
├── server/                    # Backend application
│   ├── src/
│   │   ├── routes/
│   │   │   ├── review.js     # Code review endpoint
│   │   │   └── github.js     # GitHub OAuth & PR
│   │   ├── services/
│   │   │   └── gemini.js     # Gemini AI integration
│   │   └── server.js         # Express server setup
│   ├── package.json
│   └── .env                  # Environment variables (create this)
│
├── .gitignore
├── package.json              # Root package.json
└── README.md                 # This file
```

## 🔌 API Endpoints

### Code Review

```http
POST /api/review
Content-Type: application/json

{
  "code": "function example() { ... }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "errors": [...],
  "warnings": [...],
  "suggestions": [...],
  "verdict": "...",
  "curseLevel": 0-100,
  "updatedCode": "...",
  "changes": [...]
}
```

### GitHub OAuth

```http
GET  /api/github/login          # Initiate OAuth flow
GET  /api/github/callback       # OAuth callback handler
GET  /api/github/repos          # Get user repositories (requires auth)
POST /api/github/pull-request   # Create pull request (requires auth)
```

### Health Check

```http
GET /api/health
```

## 🔒 Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `GITHUB_CLIENT_ID` | ⚠️ Optional | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | ⚠️ Optional | GitHub OAuth app secret |
| `GITHUB_REDIRECT_URI` | ⚠️ Optional | OAuth callback URL (must match GitHub app settings) |
| `PORT` | No | Server port (default: 3000) |
| `CLIENT_URL` | No | Frontend URL (default: http://localhost:5173) |
| `NODE_ENV` | No | Environment mode (development/production) |

### Client (`client/.env` - Optional)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API URL (default: uses proxy `/api`) |

## 🎨 Features in Detail

### Code Review Process

1. **Input**: User enters code and selects language
2. **Analysis**: Code is sent to Gemini 2.0 Flash for review
3. **Response**: AI returns structured review with:
   - Errors (critical issues)
   - Warnings (potential problems)
   - Suggestions (improvements)
   - Improved code (with fixes applied)
   - Curse level (0-100, indicating code quality)
4. **Display**: Results shown with visual highlights and diff view

### GitHub Integration

- **OAuth Flow**: Secure authentication via GitHub
- **Repository Selection**: Browse and select from your repositories
- **PR Creation**: Automatically creates branch, commits changes, and opens PR
- **PR Details**: Includes category, explanation, and improved code

## 🐛 Troubleshooting

### "The Reaper has reached its daily quota limit"

- **Cause**: You've hit the free tier limit of 200 requests/day
- **Solution**: 
  - Wait for daily reset (usually midnight Pacific Time)
  - Upgrade your Google Cloud plan for higher quotas
  - Use a different API key if available

### "GitHub OAuth configuration error"

- **Cause**: Missing or incorrect GitHub OAuth credentials
- **Solution**:
  1. Check that `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in `server/.env`
  2. Verify `GITHUB_REDIRECT_URI` matches your GitHub app settings exactly
  3. Restart the server after updating `.env`

### "The Reaper could not be summoned… check your API key"

- **Cause**: Invalid or missing Gemini API key
- **Solution**:
  1. Verify `GEMINI_API_KEY` is set in `server/.env`
  2. Ensure the key starts with `AIzaSy`
  3. Check for typos or extra spaces
  4. Restart the server after updating `.env`

### Server not starting

- Check that port 3000 is not already in use
- Verify all dependencies are installed: `npm install` in `server/`
- Check server logs for specific error messages

### Frontend not connecting to backend

- Ensure backend is running on port 3000
- Check that `CLIENT_URL` in server `.env` matches frontend URL
- Verify CORS is configured correctly

## 🧪 Development

### Running in Development Mode

```bash
# Start both servers with auto-reload
npm run dev

# Or start individually:
cd server && npm run dev    # Backend with nodemon
cd client && npm run dev    # Frontend with Vite HMR
```

### Building for Production

```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

## 📝 Scripts

### Root Directory

- `npm run install:all` - Install all dependencies
- `npm run dev` - Start both servers in development mode
- `npm run dev:server` - Start only backend
- `npm run dev:client` - Start only frontend
- `npm run build` - Build frontend for production
- `npm start` - Start production server

### Server Directory

- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start without auto-reload

### Client Directory

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini AI** - [AI-powered code analysis](https://deepmind.google/technologies/gemini/)
- **Radix UI** - [Accessible component primitives](https://www.radix-ui.com/)
- **Lucide Icons** - [Beautiful icon library](https://lucide.dev/)
- **Tailwind CSS** - [Utility-first CSS framework](https://tailwindcss.com/)
- **Motion** - [Animation library](https://motion.dev/)

## 🔗 Links

- [Google AI Studio](https://makersuite.google.com/app/apikey) - Get Gemini API key
- [GitHub Developer Settings](https://github.com/settings/developers) - Create OAuth app
- [Gemini API Documentation](https://ai.google.dev/docs)

---

**Made with 💀 by the Code Reaper**

*Where Your Bugs Come to Die.*
