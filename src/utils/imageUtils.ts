import { getApiBaseUrl } from '../config/api';

/**
 * Ensures image URLs display reliably across Vercel frontend and Render backend.
 * Handles Firebase URLs, Base64 Data URLs, and relative /uploads/ paths.
 */
export const formatImageUrl = (url: string | undefined): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return 'https://placehold.co/600x400/ffffff/0f172a?text=Brutal+Age';
  }

  const trimmed = url.trim();

  // 1. Direct HTTPS or Data URL (Firebase, Imgur, Base64) -> Return as is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  ) {
    return trimmed;
  }

  // 2. Relative upload path -> Prepend backend API domain
  const apiBase = getApiBaseUrl();
  const backendOrigin = apiBase.replace(/\/api\/?$/, ''); // e.g. https://brutal-age-backend.onrender.com

  if (trimmed.startsWith('/')) {
    return `${backendOrigin}${trimmed}`;
  }

  return `${backendOrigin}/${trimmed}`;
};
