import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reviewRoutes from './routes/review.js';
import githubRouter from './routes/github.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AIReviewMate API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', reviewRoutes);
app.use('/api/github', githubRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON in request body'
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'The Reaper could not be summoned… internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler - must be last
app.use((req, res) => {
  console.log(`⚠️  404 - Route not found: ${req.method} ${req.originalUrl}`);
  console.log(`   Available routes: POST /api/review, POST /api/fix, GET /api/health, GET /api/github/*`);
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    message: 'Available routes: POST /api/review, POST /api/fix, GET /api/health'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 GitHub OAuth endpoints available at /api/github/*`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - POST /api/review - Code review endpoint`);
  console.log(`   - POST /api/fix - Auto-exorcise (fix code) endpoint`);
  console.log(`   - GET  /api/github/login - GitHub OAuth login`);
  console.log(`   - GET  /api/github/callback - GitHub OAuth callback`);
  console.log(`   - GET  /api/github/repos - Fetch user repositories`);
  console.log(`   - POST /api/github/pull-request - Create pull request`);
  
  // Optionally start RunAnywhere microservice (in background, won't block server start)
  if (process.env.RUNANYWHERE_TOKEN) {
    // Import in background to not block server startup
    import('../runanywhere.js').catch((err) => {
      // Silently fail if SDK is not available
    });
  }
});
