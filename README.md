# 💀 Code Reaper

> Where Your Bugs Come to Die.

An AI-powered haunted code reviewer built with Google Gemini that provides real-time code analysis, suggestions, and automated pull request creation. Experience code review like never before with a spooky Halloween-themed interface.

![Code Reaper](https://img.shields.io/badge/Code%20Reaper-Haunted%20Reviewer-red?style=for-the-badge&logo=ghost)

## ✨ Features

- **🔍 AI-Powered Code Review**: Leverages Google Gemini 2.0 Flash for intelligent code analysis
- **💀 Halloween Theme**: Spooky, haunted interface with cinematic animations and effects
  - Binary rain background effect
  - Fog and atmospheric lighting
  - Ghost flicker animations
  - Lightning flash effects
  - Screen shake on code review
  - Audio effects (scream sounds)
- **📊 Visual Code Improvements**: See your code transformed with highlighted changes and diff view
- **📋 Copy to Clipboard**: Easily copy improved code with one click
- **🔗 GitHub Integration**: OAuth authentication and direct pull request creation
- **💻 Multi-Language Support**: JavaScript, TypeScript, Python, Java, C++, Rust
- **⚡ Modern UI**: Beautiful interface built with React, Tailwind CSS, and Radix UI
- **🎯 Manual Review**: Trigger reviews only when you click the button (no auto-review)
- **📈 Curse Level System**: Visual indicator (0-100) showing code quality
- **🎨 Interactive Animations**: Smooth transitions and hover effects throughout

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
- **RunAnywhere SDK** (Optional) - Deploy as portable microservice

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
cd microhard/microhard
```

**Note**: The project is located in the `microhard/` subdirectory.

### 2. Install Dependencies

```bash
# From the microhard/ directory
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

# Optional - RunAnywhere SDK (for microservice deployment)
RUNANYWHERE_TOKEN=your_runanywhere_token

# Server Configuration
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Start the Application

```bash
# From microhard/ directory - starts both servers
npm run dev

# Or start manually in separate terminals:
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**Note**: The `npm run dev` command runs both servers concurrently. Make sure both ports (3000 and 5173) are available.

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

- **Ctrl + Shift + R** (or **Cmd + Shift + R** on Mac): Scroll to demo section and automatically trigger code review

### Visual Effects

The application includes several atmospheric effects that enhance the spooky theme:

- **Binary Rain**: Animated falling binary code in the background
- **Fog Background**: Dynamic fog effect that intensifies with curse level
- **Ghost Flicker**: Random ghost animations during code analysis
- **Lightning Flash**: Lightning effects that appear during review
- **Screen Shake**: Screen shake animation when summoning the reaper
- **Audio Effects**: Creepy scream sounds during code analysis

## 📁 Project Structure

```
microhard/
├── client/                    # Frontend application
│   ├── public/
│   │   └── favicon.svg       # App favicon
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Demo.tsx      # Main demo component with code editor
│   │   │   ├── Hero.tsx      # Landing page hero section
│   │   │   ├── HowItWorks.tsx # Feature explanation
│   │   │   ├── AudioControls.tsx # Audio effects
│   │   │   ├── BinaryRain.tsx # Animated background effect
│   │   │   ├── FogBackground.tsx # Atmospheric fog effect
│   │   │   ├── GhostFlicker.tsx # Ghost animation
│   │   │   ├── LightningFlash.tsx # Lightning effects
│   │   │   ├── ParallaxContainer.tsx # Parallax scrolling
│   │   │   └── ui/           # Radix UI components (50+ components)
│   │   ├── services/
│   │   │   └── api.ts        # API service layer
│   │   ├── styles/
│   │   │   └── globals.css   # Global styles
│   │   ├── App.tsx           # Root component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Base styles
│   ├── package.json
│   ├── vite.config.ts       # Vite configuration
│   └── tailwind.config.js    # Tailwind configuration
│
├── server/                    # Backend application
│   ├── src/
│   │   ├── routes/
│   │   │   ├── review.js     # Code review endpoint
│   │   │   └── github.js     # GitHub OAuth & PR creation
│   │   ├── services/
│   │   │   └── gemini.js     # Gemini AI integration
│   │   └── server.js         # Express server setup
│   ├── runanywhere.js        # RunAnywhere SDK integration (optional)
│   ├── package.json
│   └── .env                  # Environment variables (create this)
│
├── package.json              # Root package.json with scripts
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
| `RUNANYWHERE_TOKEN` | ⚠️ Optional | RunAnywhere SDK token for microservice deployment |
| `PORT` | No | Server port (default: 3000) |
| `CLIENT_URL` | No | Frontend URL (default: http://localhost:5173) |
| `NODE_ENV` | No | Environment mode (development/production) |

### Client (`client/.env` - Optional)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API URL (default: uses proxy `/api`) |

## 🎨 Features in Detail

### Supported Languages

The Code Reaper supports the following programming languages:

- **JavaScript** - Full ES6+ support
- **TypeScript** - Type-safe JavaScript
- **Python** - Python 3.x syntax
- **Java** - Java 8+ features
- **C++** - Modern C++ standards
- **Rust** - Rust language features

Each language has pre-configured code templates with intentional bugs for testing.

### Code Review Process

1. **Input**: User enters code and selects language from dropdown
2. **Summon**: Click "Summon the Reaper" button (or press `Ctrl + Shift + R`)
3. **Analysis**: Code is sent to Gemini 2.0 Flash for review
   - Visual effects activate (ghosts, lightning, fog)
   - Curse level animates during analysis
   - Screen shake and audio effects play
4. **Response**: AI returns structured review with:
   - **Errors** (critical issues) - Red indicators
   - **Warnings** (potential problems) - Yellow indicators
   - **Suggestions** (improvements) - Purple indicators
   - **Improved code** (with fixes applied) - Complete corrected version
   - **Curse level** (0-100) - Visual progress bar indicating code quality
     - 0-25: Clean code (green)
     - 26-50: Minor issues (yellow)
     - 51-75: Moderate issues (orange)
     - 76-100: Critical issues (red)
   - **Changes array** - Line-by-line diff showing what changed
5. **Display**: Results shown with visual highlights, diff view, and improved code modal
6. **Actions**: 
   - Copy improved code to clipboard
   - Accept changes and create GitHub PR
   - Discard changes

### GitHub Integration

- **OAuth Flow**: Secure authentication via GitHub OAuth 2.0
- **Repository Selection**: Browse and select from your accessible repositories
- **PR Creation**: Automatically:
  1. Creates a new branch with unique name
  2. Commits the improved code to the branch
  3. Opens a pull request against the main branch
  4. Includes category, explanation, and improved code in PR description
- **Token Storage**: GitHub token stored securely in browser localStorage
- **Error Handling**: Clear error messages for OAuth failures

### RunAnywhere SDK Integration (Optional)

The Code Reaper can be deployed as a portable microservice using the RunAnywhere SDK. This allows you to expose the code review functionality as serverless functions.

**Features:**
- Deploy code review logic as a microservice
- Expose functions via RunAnywhere API endpoints
- Automatic scaling and deployment
- No server management required

**To Enable:**

1. Install the RunAnywhere SDK:
   ```bash
   cd server
   npm install runanywhere-sdk
   ```

2. Get your RunAnywhere token from [RunAnywhere](https://runanywhere.ai)

3. Add to `server/.env`:
   ```env
   RUNANYWHERE_TOKEN=your_runanywhere_token
   ```

4. The microservice will start automatically when the server starts

**Available Functions:**

Once deployed, your functions will be available at:
- `https://runanywhere.ai/api/<teamname>/reviewCode` - Code review endpoint
- `https://runanywhere.ai/api/<teamname>/autoFix` - Auto-fix endpoint

**Note:** The RunAnywhere integration is optional. The app works perfectly fine with just the local Express server. The SDK integration is disabled by default and only activates when `RUNANYWHERE_TOKEN` is set.

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
- Check that `CLIENT_URL` in server `.env` matches frontend URL (http://localhost:5173)
- Verify CORS is configured correctly
- Check browser console for CORS errors
- Ensure Vite proxy is configured correctly (should use `/api` prefix)

### Visual effects not working

- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page
- Check that Motion library is properly installed

### RunAnywhere SDK not starting

- **Cause**: Missing SDK or invalid token
- **Solution**:
  1. Install RunAnywhere SDK: `npm install runanywhere-sdk` in `server/` directory
  2. Verify `RUNANYWHERE_TOKEN` is set in `server/.env`
  3. Check that the token is valid
  4. The app will continue to work with the local Express server even if RunAnywhere fails
  5. Check server logs for specific error messages

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

### Development Guidelines

1. **Code Style**: Follow existing code style and use TypeScript for type safety
2. **Components**: Use functional components with hooks
3. **Styling**: Use Tailwind CSS utility classes
4. **Animations**: Use Motion (Framer Motion) for animations
5. **API**: Follow RESTful conventions for API endpoints
6. **Testing**: Test your changes locally before submitting

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🎬 Demo

Watch the demo video to see Code Reaper in action:

🎥 [Demo Video on Google Drive](https://drive.google.com/file/d/1byr4KX9EXAPctizE2CBanNt5lTSMPce5/view?usp=drive_link)

## 📊 Project Status

- ✅ Core code review functionality
- ✅ GitHub OAuth integration
- ✅ Pull request creation
- ✅ Multi-language support
- ✅ Visual effects and animations
- ✅ Responsive design
- 🔄 Additional language support (coming soon)
- 🔄 Batch code review (coming soon)

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
