// API Configuration
// This file centralizes the API base URL configuration

const getApiBaseUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Log for debugging (both dev and prod)
  console.log('[API Config] Environment:', import.meta.env.MODE);
  console.log('[API Config] VITE_API_BASE_URL from env:', apiUrl);
  
  // In production (Vercel), VITE_API_BASE_URL must be set
  if (import.meta.env.PROD && !apiUrl) {
    console.error('[API Config] ERROR: VITE_API_BASE_URL is not configured in production!');
    console.error('[API Config] This will cause API calls to fail. Please set VITE_API_BASE_URL in Vercel environment variables.');
  }
  
  // Fallback to localhost only in development
  const finalUrl = apiUrl || 'http://localhost:3001';
  console.log('[API Config] Final API Base URL:', finalUrl);
  
  return finalUrl;
};

export const API_BASE_URL = getApiBaseUrl();

