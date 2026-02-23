const RAW_BASE =
  (import.meta.env.VITE_API_V1_URL as string | undefined) ||
  (import.meta.env.VITE_API_URL as string | undefined);

const baseUrl = RAW_BASE ? RAW_BASE.replace(/\/$/, '') : '';
const TOKEN_KEY = 'rk_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (!token) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch {
    /* ignore storage errors */
  }
}

type FetchOptions = RequestInit & { skipAuth?: boolean };

export function apiV1Fetch(path: string, options: FetchOptions = {}) {
  if (!baseUrl) {
    throw new Error('VITE_API_V1_URL or VITE_API_URL is not configured');
  }

  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token && !options.skipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, { ...options, headers });
}
