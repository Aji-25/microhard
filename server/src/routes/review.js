import express from 'express';
import { reviewCode, fixCode } from '../services/gemini.js';

const router = express.Router();

// Simple in-memory rate limiter
const requestTimestamps = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 requests per minute

const rateLimiter = (req, res, next) => {
  const clientId = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Get or create timestamp array for this client
  if (!requestTimestamps.has(clientId)) {
    requestTimestamps.set(clientId, []);
  }
  
  const timestamps = requestTimestamps.get(clientId);
  
  // Remove timestamps older than the window
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  // Check if limit exceeded
  if (recentTimestamps.length >= MAX_REQUESTS) {
    console.warn(`⚠️  Rate limit exceeded for ${clientId}: ${recentTimestamps.length} requests in the last minute`);
    return res.status(429).json({
      error: `Too many requests (${recentTimestamps.length}/${MAX_REQUESTS}). Please wait a moment before trying again.`
    });
  }
  
  // Add current timestamp
  recentTimestamps.push(now);
  requestTimestamps.set(clientId, recentTimestamps);
  
  console.log(`✅ Rate limiter: ${clientId} - ${recentTimestamps.length}/${MAX_REQUESTS} requests in window`);
  next();
};

router.post('/review', rateLimiter, async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    // Validation
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        error: 'Code is required and cannot be empty'
      });
    }

    if (!language || typeof language !== 'string') {
      return res.status(400).json({
        error: 'Language is required'
      });
    }

    if (code.length > 10000) {
      return res.status(400).json({
        error: 'Code is too long (maximum 10,000 characters)'
      });
    }

    // Log request for debugging
    console.log(`📝 Review request from ${clientIp} for ${language} code (${code.length} chars)`);
    console.log(`🔍 Rate limiter check passed`);

    // Call Gemini service
    const result = await reviewCode(code, language);

    // Validate result structure before sending
    if (!result || typeof result !== 'object') {
      console.error('❌ Invalid result type:', typeof result);
      throw new Error('Invalid response structure from AI service');
    }

    // Ensure all required fields exist
    if (!Array.isArray(result.errors)) result.errors = [];
    if (!Array.isArray(result.warnings)) result.warnings = [];
    if (!Array.isArray(result.suggestions)) result.suggestions = [];
    if (typeof result.curseLevel !== 'number') {
      const errorCount = result.errors.length;
      const warningCount = result.warnings.length;
      result.curseLevel = Math.min(100, (errorCount * 30) + (warningCount * 10));
    }
    if (!result.verdict || typeof result.verdict !== 'string') {
      result.verdict = 'The code has been analyzed by The Code Reaper.';
    }

    console.log(`✅ Review completed: ${result.errors.length} errors, ${result.warnings.length} warnings, ${result.suggestions.length} suggestions, Curse Level ${result.curseLevel}%`);

    res.json(result);
  } catch (error) {
    console.error('❌ Review error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Send appropriate error response
    if (error.message?.includes('API key') || error.message?.includes('Reaper could not be summoned')) {
      return res.status(500).json({
        error: error.message || 'The Reaper could not be summoned… check your API key.'
      });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('overwhelmed')) {
      return res.status(429).json({
        error: 'The Reaper is overwhelmed. Please wait a moment and try again.'
      });
    }

    // Return a generic error for other cases
    return res.status(500).json({
      error: error.message || 'An error occurred while reviewing the code.'
    });
  }
});

// Auto-Exorcise (Fix Code) endpoint
router.post('/fix', rateLimiter, async (req, res, next) => {
  try {
    const { code, language } = req.body;

    // Validation
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        error: 'Code is required and cannot be empty'
      });
    }

    if (!language || typeof language !== 'string') {
      return res.status(400).json({
        error: 'Language is required'
      });
    }

    if (code.length > 10000) {
      return res.status(400).json({
        error: 'Code is too long (maximum 10,000 characters)'
      });
    }

    // Log request for debugging
    console.log(`🔧 Fix request for ${language} code (${code.length} chars)`);

    // Call Gemini service to fix code
    const fixedCode = await fixCode(code, language);

    if (!fixedCode || typeof fixedCode !== 'string' || fixedCode.trim().length === 0) {
      throw new Error('Invalid response from AI service - no fixed code returned');
    }

    console.log(`✅ Code fixed successfully`);

    res.json({ fixedCode: fixedCode.trim() });
  } catch (error) {
    console.error('❌ Fix error:', error.message);
    
    // Send appropriate error response
    if (error.message.includes('API key') || error.message.includes('Reaper could not be summoned')) {
      return res.status(500).json({
        error: 'The Reaper could not be summoned… check your API key.'
      });
    }
    
    if (error.message.includes('quota') || error.message.includes('rate limit') || error.message.includes('overwhelmed')) {
      return res.status(429).json({
        error: 'The Reaper is overwhelmed. Please wait a moment and try again.'
      });
    }

    next(error);
  }
});

export default router;
