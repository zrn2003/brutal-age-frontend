/**
 * Browser Cookie Helper Utility for Fast Local Caching & Visitor Recognition
 */

export const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

export const eraseCookie = (name: string) => {
  document.cookie = `${name}=;Max-Age=-99999999;path=/;`;
};

/**
 * Cache frequently visited listings and preferences into fast browser cookies & localStorage
 */
export const cacheVisitorState = (key: string, data: any) => {
  try {
    const jsonStr = JSON.stringify(data);
    setCookie(key, jsonStr, 30);
    localStorage.setItem(`fast_cache_${key}`, jsonStr);
  } catch (err) {}
};

export const getCachedVisitorState = (key: string) => {
  try {
    const cookieData = getCookie(key);
    if (cookieData) return JSON.parse(cookieData);

    const localData = localStorage.getItem(`fast_cache_${key}`);
    if (localData) return JSON.parse(localData);
  } catch (err) {}
  return null;
};
