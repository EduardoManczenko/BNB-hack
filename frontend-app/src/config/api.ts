// API Configuration
// This file centralizes the API base URL configuration

const getApiBaseUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  // In production (Vercel), VITE_API_BASE_URL must be set
  if (import.meta.env.PROD && !apiUrl) {
    console.error('VITE_API_BASE_URL is not configured in production!');
    throw new Error('API base URL is not configured. Please set VITE_API_BASE_URL environment variable.');
  }
  
  // Fallback to localhost only in development
  return apiUrl || 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

