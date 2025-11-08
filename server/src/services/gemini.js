import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Validate API key on startup
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
  console.error('❌ GEMINI_API_KEY is not set or is using placeholder value');
  console.error('Please add your actual API key to the .env file');
  console.error('Get your API key from: https://makersuite.google.com/app/apikey');
}

// Only initialize if we have a valid API key
const genAI = apiKey && apiKey !== 'your_gemini_api_key_here' 
  ? new GoogleGenerativeAI(apiKey) 
  : null;

// Default model - gemini-2.0-flash
// Users can override with GEMINI_MODEL environment variable
const DEFAULT_MODEL = 'gemini-2.0-flash';

export async function reviewCode(code, language) {
  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '' || !genAI) {
    throw new Error('API key not configured. Please set GEMINI_API_KEY in your .env file with a valid API key from https://makersuite.google.com/app/apikey');
  }

  try {
    // Use model from env or default to gemini-2.0-flash
    const modelName = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const model = genAI.getGenerativeModel({ model: modelName });
    console.log(`✅ Using Gemini model: ${modelName}`);

    const prompt = `You are "The Code Reaper" — an ancient, haunted compiler that performs code reviews and also proposes fixes.

Analyze the following ${language} code. Then:
1. Identify all real ERRORS, WARNINGS, and SUGGESTIONS.
2. Produce an improved version of the code that resolves them.
3. Return all info as strict valid JSON (no markdown).

Input:
\`\`\`${language}
${code}
\`\`\`

Respond in this exact JSON shape:
{
  "errors": [{"line": <number>, "message": "<specific error>"}],
  "warnings": [{"line": <number>, "message": "<specific warning>"}],
  "suggestions": [{"line": <number>, "fix": "<specific improvement>"}],
  "verdict": "<short spooky summary>",
  "curseLevel": <0-100 integer>,
  "updatedCode": "<the fully corrected code>",
  "changes": [{"line": <number>, "old": "<old line>", "new": "<new line>"}]
}

Guidelines:
- Only output JSON, never markdown.
- Maintain original indentation.
- updatedCode must compile cleanly.
- Keep arrays even if empty.
- Use concise, technical messages.
- Verdict must keep haunted tone.
- Use 1-based line numbers (first line is line 1).
- Calculate curseLevel: 0-100 based on actual issues found (0 = perfect code, 100 = completely broken).
  - Each error adds 25-30 points
  - Each warning adds 10-15 points
  - Each suggestion adds 2-5 points
  - Maximum is 100
- For changes array: Include only lines that were actually modified, showing old and new versions.
- For updatedCode: Provide the complete corrected code with all fixes applied.`;

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

    // Set defaults for new fields
    parsedResponse.updatedCode = parsedResponse.updatedCode || null;
    parsedResponse.changes = Array.isArray(parsedResponse.changes) ? parsedResponse.changes : [];

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

    if (error.message?.includes('model') || error.message?.includes('MODEL_NOT_FOUND') || error.message?.includes('404 Not Found') || error.message?.includes('is not found')) {
      // Provide helpful error message
      const currentModel = process.env.GEMINI_MODEL || DEFAULT_MODEL;
      console.error(`❌ Model "${currentModel}" is not available. Error: ${error.message}`);
      throw new Error(`The Gemini model "${currentModel}" is not available for your API key. Please check your API key permissions and ensure gemini-2.0-flash is available.`);
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
    // Use model from env or default to gemini-2.0-flash
    const modelName = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const model = genAI.getGenerativeModel({ model: modelName });
    console.log(`✅ Using Gemini model for fixCode: ${modelName}`);

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
    
    if (error.message?.includes('API key') || error.message?.includes('GEMINI_API_KEY') || error.message?.includes('API_KEY_NOT_VALID')) {
      throw new Error('The Reaper could not be summoned… check your API key.');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('Too Many Requests') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('The Reaper is overwhelmed. Please wait a moment and try again.');
    }

    if (error.message?.includes('model') || error.message?.includes('MODEL_NOT_FOUND') || error.message?.includes('404 Not Found') || error.message?.includes('is not found')) {
      const currentModel = process.env.GEMINI_MODEL || DEFAULT_MODEL;
      console.error(`❌ Model "${currentModel}" is not available. Error: ${error.message}`);
      throw new Error(`The Gemini model "${currentModel}" is not available for your API key. Please check your API key permissions and ensure gemini-2.0-flash is available.`);
    }

    throw new Error(`Auto-exorcise failed: ${error.message || 'Unknown error'}`);
  }
}
