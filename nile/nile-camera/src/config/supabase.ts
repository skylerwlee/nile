/**
 * API Configuration
 * IMPORTANT: Credentials are loaded from .env file for security
 * Never commit your actual keys to git!
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY, API_URL } from '@env';

// Supabase configuration (kept for backwards compatibility)
export const SUPABASE_CONFIG = {
  url: SUPABASE_URL || '',
  anonKey: SUPABASE_ANON_KEY || '',
};

// API configuration for Next.js backend
export const API_CONFIG = {
  // Use environment variable or default to production
  baseUrl: API_URL || 'https://nile-webapp.vercel.app',

  // Endpoints
  endpoints: {
    scan: '/api/scan',
  },

  // Get full URL for an endpoint
  getUrl: (endpoint: string) => {
    return `${API_CONFIG.baseUrl}${endpoint}`;
  },
};

// Validate that credentials are set (for legacy Supabase direct access)
if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  console.warn('⚠️  Supabase credentials not found in .env file');
}

// Validate API URL
if (!API_CONFIG.baseUrl) {
  console.error('⚠️  API URL not configured! Please set API_URL in your .env file');
}

// Table name for scanned books (legacy)
export const SCANNED_BOOKS_TABLE = 'scanned_books';
