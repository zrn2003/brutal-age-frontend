/**
 * Dynamic Production & Local API Base URL Resolver.
 * Defaults to the live cloud Render backend: https://brutal-age-backend.onrender.com/api
 * Can be overridden by environment variable VITE_API_BASE_URL or localStorage.
 */
export const getApiBaseUrl = (): string => {
  // 1. Environment variable override if provided (e.g. .env or Vite build)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. LocalStorage override (allows switching between local and live backend dynamically if needed)
  try {
    const override = localStorage.getItem('API_BASE_URL') || localStorage.getItem('VITE_API_BASE_URL');
    if (override) return override;
  } catch {}

  // 3. Official Live Production Render Backend API URL
  return 'https://brutal-age-backend.onrender.com/api';
};
