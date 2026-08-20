/**
 * Dynamic Production & Local API Base URL Resolver.
 * Connects frontend directly to live Render backend: https://brutal-age-backend.onrender.com/api
 */
export const getApiBaseUrl = (): string => {
  // 1. Environment variable override if provided
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const hostname = window.location.hostname;

  // 2. Localhost & local Wi-Fi development network
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return `http://${hostname}:5000/api`;
  }

  // 3. Official Live Production Render Backend API URL
  return 'https://brutal-age-backend.onrender.com/api';
};
