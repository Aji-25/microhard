import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Validate API key on startup
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables');
  console.error('Please add your API key to the .env file');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function reviewCode(code, language) {
  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('API key not configured. Please set GEMINI_API_KEY in environment variables.');
  }

  try {
    // Use gemini-pro (most widely available model)
    // If you have access to gemini-1.5-pro or gemini-1.5-flash, change the model name below
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are "The Code Reaper" — an expert code reviewer that analyzes ${language} code with technical precision. Your task is to identify REAL issues in the code.

Analyze the following ${language} code line by line and identify:
1. ERRORS: Critical bugs that will cause the code to fail (syntax errors, type errors, undefined variables, null pointer exceptions, infinite loops, division by zero, etc.)
2. WARNINGS: Potential issues that may cause problems (memory leaks, security vulnerabilities, performance issues, deprecated APIs, unhandled edge cases, etc.)
3. SUGGESTIONS: Code quality improvements (better naming, code organization, best practices, optimization opportunities, etc.)

Code to review:
\`\`\`${language}
${code}
\`\`\`

IMPORTANT INSTRUCTIONS:
- Analyze the code ACTUALLY. Don't make up issues. Only report real problems.
- For errors: Report syntax errors, logic errors, runtime errors that WILL occur
- For warnings: Report potential security issues, performance problems, bad practices
- For suggestions: Provide helpful improvements for code quality
- Use 1-based line numbers (first line is line 1)
- Be specific and technical in your messages
- Calculate curseLevel: 0-100 based on actual issues found (0 = perfect code, 100 = completely broken)
  - Each error adds 25-30 points
  - Each warning adds 10-15 points
  - Each suggestion adds 2-5 points
  - Maximum is 100

Return ONLY valid JSON in this exact format (no markdown, no code blocks, no text outside JSON):
{
  "errors": [{"line": <number>, "message": "<specific error description>"}],
  "warnings": [{"line": <number>, "message": "<specific warning description>"}],
  "suggestions": [{"line": <number>, "fix": "<specific improvement suggestion>"}],
  "verdict": "<1-2 sentence spooky summary of code quality>",
  "curseLevel": <0-100 integer>
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from the response
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      let cleanedText = text.trim();
      
      // Try to extract JSON from markdown code blocks
      const jsonBlockMatch = cleanedText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonBlockMatch) {
        cleanedText = jsonBlockMatch[1];
      } else {
        // Remove leading/trailing non-JSON text
        cleanedText = cleanedText.replace(/^[^{]*/, '');
        cleanedText = cleanedText.replace(/[^}]*$/, '');
        
        // If still doesn't start with {, try to find JSON object
        if (!cleanedText.startsWith('{')) {
          const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            cleanedText = jsonMatch[0];
          } else {
            throw new Error('No JSON object found in response');
          }
        }
      }
      
      parsedResponse = JSON.parse(cleanedText);
      console.log('✅ Successfully parsed Gemini response');
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('Raw response text (first 500 chars):', text.substring(0, 500));
      console.error('Full response length:', text.length);
      
      // Try to provide a fallback response
      parsedResponse = {
        errors: [],
        warnings: [{ line: 1, message: 'Failed to parse AI response. Please check the code and try again.' }],
        suggestions: [],
        verdict: 'The Reaper encountered an issue analyzing your code.',
        curseLevel: 50
      };
      
      // Still throw the error so the user knows something went wrong
      throw new Error('Failed to parse AI response. Please ensure your code is valid and try again.');
    }

    // Validate response structure
    if (!parsedResponse.errors || !parsedResponse.warnings || !parsedResponse.suggestions) {
      // Set defaults if missing
      parsedResponse.errors = parsedResponse.errors || [];
      parsedResponse.warnings = parsedResponse.warnings || [];
      parsedResponse.suggestions = parsedResponse.suggestions || [];
    }

    if (typeof parsedResponse.curseLevel !== 'number') {
      // Calculate curse level based on errors and warnings
      const errorCount = parsedResponse.errors?.length || 0;
      const warningCount = parsedResponse.warnings?.length || 0;
      parsedResponse.curseLevel = Math.min(100, (errorCount * 30) + (warningCount * 10));
    }

    if (!parsedResponse.verdict || typeof parsedResponse.verdict !== 'string') {
      parsedResponse.verdict = 'The code has been analyzed by The Code Reaper.';
    }

    // Ensure arrays are arrays
    parsedResponse.errors = Array.isArray(parsedResponse.errors) ? parsedResponse.errors : [];
    parsedResponse.warnings = Array.isArray(parsedResponse.warnings) ? parsedResponse.warnings : [];
    parsedResponse.suggestions = Array.isArray(parsedResponse.suggestions) ? parsedResponse.suggestions : [];

    // Clamp curseLevel between 0 and 100
    parsedResponse.curseLevel = Math.max(0, Math.min(100, Math.round(parsedResponse.curseLevel)));

    return parsedResponse;
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Provide more specific error messages
    if (error.message?.includes('API key') || error.message?.includes('GEMINI_API_KEY') || error.message?.includes('API_KEY_NOT_VALID')) {
      throw new Error('The Reaper could not be summoned… check your API key.');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('Too Many Requests') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('The Reaper is overwhelmed. Please wait a moment and try again.');
    }
    
    if (error.message?.includes('rate limit') || error.message?.includes('RATE_LIMIT_EXCEEDED')) {
      throw new Error('The Reaper is overwhelmed. Please wait a moment and try again.');
    }

    if (error.message?.includes('model') || error.message?.includes('MODEL_NOT_FOUND')) {
      throw new Error('The Reaper model is not available. Please check your API configuration.');
    }

    // Re-throw with context
    throw new Error(`The Reaper could not be summoned: ${error.message || 'Unknown error'}`);
  }
}

export async function fixCode(code, language) {
  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('API key not configured. Please set GEMINI_API_KEY in environment variables.');
  }

  try {
    // Use gemini-pro (most widely available model)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are "The Code Reaper" — an ancient haunted compiler that fixes cursed code.

Fix all errors, warnings, and apply suggestions to this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Return ONLY the fixed code. No explanation, no markdown, no JSON, just the complete corrected code.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let fixedCode = response.text();

    // Clean up the response
    fixedCode = fixedCode.trim();
    // Remove markdown code blocks if present
    fixedCode = fixedCode.replace(/^```(?:${language})?\s*/i, '').replace(/\s*```$/g, '');
    
    return fixedCode;
  } catch (error) {
    console.error('Gemini API error (fixCode):', error);
    
    if (error.message.includes('API key') || error.message.includes('GEMINI_API_KEY')) {
      throw new Error('The Reaper could not be summoned… check your API key.');
    }
    
    if (error.message.includes('quota') || error.message.includes('429') || error.message.includes('Too Many Requests')) {
      throw new Error('The Reaper is overwhelmed. Please wait a moment and try again.');
    }

    throw new Error(`Auto-exorcise failed: ${error.message}`);
  }
}
