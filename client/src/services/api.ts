// Use environment variable if set, otherwise use relative path (works with Vite proxy)
// IMPORTANT: Always use /api prefix to ensure Vite proxy works correctly
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

// Ensure API_BASE_URL always uses /api prefix
const getApiUrl = (endpoint: string) => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  
  if (API_BASE_URL.startsWith('http')) {
    // Absolute URL (e.g., http://localhost:3000/api or http://localhost:3000)
    // Ensure /api is in the path
    if (API_BASE_URL.endsWith('/api')) {
      return `${API_BASE_URL}${cleanEndpoint}`;
    } else if (API_BASE_URL.endsWith('/')) {
      return `${API_BASE_URL}api${cleanEndpoint}`;
    } else {
      return `${API_BASE_URL}/api${cleanEndpoint}`;
    }
  } else {
    // Relative URL - ensure it starts with /api
    const base = API_BASE_URL.startsWith('/api') ? API_BASE_URL : '/api';
    return `${base}${cleanEndpoint}`;
  }
};

export interface ReviewError {
  line: number;
  message: string;
}

export interface ReviewWarning {
  line: number;
  message: string;
}

export interface ReviewSuggestion {
  line: number;
  fix: string;
}

export interface ReviewResponse {
  errors: ReviewError[];
  warnings: ReviewWarning[];
  suggestions: ReviewSuggestion[];
  verdict: string;
  curseLevel: number;
}

export interface FixResponse {
  fixedCode: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  owner: string;
  default_branch: string;
  url: string;
}

export interface GitHubReposResponse {
  repos: GitHubRepo[];
}

export interface CreatePRResponse {
  success: boolean;
  url: string;
  number: number;
  branch: string;
}

/**
 * Review code using the backend API
 */
export async function reviewCode(code: string, language: string): Promise<ReviewResponse> {
  try {
    const url = getApiUrl('/review');
    console.log('Making API request to:', url);
    console.log('API_BASE_URL:', API_BASE_URL);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to review code' }));
      console.error('API Error:', error);
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error - is the backend server running?', error);
      throw new Error('The Reaper could not be summoned… failed to connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
}

/**
 * Fix code using the backend API (Auto-Exorcise)
 */
export async function fixCode(code: string, language: string): Promise<FixResponse> {
  try {
    const url = getApiUrl('/fix');
    console.log('Making fix API request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fix code' }));
      console.error('API Error:', error);
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error - is the backend server running?', error);
      throw new Error('The Reaper could not be summoned… failed to connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
}

/**
 * Initiate GitHub OAuth flow
 */
export function initiateGitHubOAuth(): void {
  window.location.href = getApiUrl('/github/login');
}

/**
 * Get GitHub access token from URL params (after OAuth callback)
 */
export function getGitHubTokenFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

/**
 * Store GitHub token in localStorage
 */
export function storeGitHubToken(token: string): void {
  localStorage.setItem('github_token', token);
}

/**
 * Get stored GitHub token
 */
export function getStoredGitHubToken(): string | null {
  return localStorage.getItem('github_token');
}

/**
 * Clear stored GitHub token
 */
export function clearGitHubToken(): void {
  localStorage.removeItem('github_token');
}

/**
 * Fetch user's GitHub repositories
 */
export async function fetchGitHubRepos(token: string): Promise<GitHubReposResponse> {
  const response = await fetch(getApiUrl('/github/repos'), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch repositories' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a pull request with improved code
 */
export async function createPullRequest(
  token: string,
  owner: string,
  repo: string,
  filePath: string,
  improvedCode: string,
  category: string,
  explanation: string
): Promise<CreatePRResponse> {
  const response = await fetch(getApiUrl('/github/pull-request'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: token,
      owner,
      repo,
      filePath,
      improvedCode,
      category,
      explanation,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create pull request' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

