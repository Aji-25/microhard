/**
 * RunAnywhere SDK Integration
 * 
 * This file integrates the Code Reaper with RunAnywhere SDK to deploy
 * the AI code review logic as a portable microservice.
 * 
 * To enable:
 * 1. Install RunAnywhere SDK: npm install runanywhere-sdk
 * 2. Set RUNANYWHERE_TOKEN in your .env file
 * 3. The microservice will start automatically when the server starts
 * 
 * The functions will be available at:
 * - https://runanywhere.ai/api/<teamname>/reviewCode
 * - https://runanywhere.ai/api/<teamname>/autoFix
 */

import { reviewCode, fixCode } from "./src/services/gemini.js";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check for RunAnywhere token
if (!process.env.RUNANYWHERE_TOKEN) {
  console.warn('⚠️  RUNANYWHERE_TOKEN not set. RunAnywhere integration will not start.');
  console.warn('   Set RUNANYWHERE_TOKEN in your .env file to enable RunAnywhere deployment.');
  process.exit(0);
}

// Async function to initialize RunAnywhere
(async () => {
  try {
    // Dynamic import to handle missing SDK gracefully
    const { createApp } = await import("runanywhere-sdk");
    
    const app = createApp({
      token: process.env.RUNANYWHERE_TOKEN,
    });

    // Expose the main code review function
    app.fn("reviewCode", async (code, language) => {
      try {
        console.log(`🔍 RunAnywhere: Review request for ${language} code (${code?.length || 0} chars)`);
        const result = await reviewCode(code, language);
        console.log(`✅ RunAnywhere: Review completed - Curse Level ${result.curseLevel}%`);
        return result;
      } catch (error) {
        console.error('❌ RunAnywhere: Review error:', error.message);
        throw error;
      }
    });

    // Expose the auto-fix feature
    app.fn("autoFix", async (code, language) => {
      try {
        console.log(`🔧 RunAnywhere: Fix request for ${language} code (${code?.length || 0} chars)`);
        const fixed = await fixCode(code, language);
        console.log(`✅ RunAnywhere: Code fixed successfully`);
        return { fixedCode: fixed };
      } catch (error) {
        console.error('❌ RunAnywhere: Fix error:', error.message);
        throw error;
      }
    });

    // Start the RunAnywhere app
    app.start().then(() => {
      console.log('🚀 RunAnywhere microservice started successfully');
      console.log('📡 Your functions are now available at: https://runanywhere.ai/api/<teamname>/reviewCode');
      console.log('📡 And: https://runanywhere.ai/api/<teamname>/autoFix');
    }).catch((error) => {
      console.error('❌ Failed to start RunAnywhere microservice:', error);
    });
  } catch (error) {
    console.warn('⚠️  RunAnywhere SDK not found. Install it with: npm install runanywhere-sdk');
    console.warn('   The app will continue to work with the local Express server.');
  }
})();

