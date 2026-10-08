/**
 * Generic API Client with JWT Header attachment, Refresh Token Rotation Interceptor,
 * URL Normalization & Response Unwrapping.
 */
import { tokenManager } from './tokenManager';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yovexa-solutions-backend.vercel.app/api';

/**
 * Normalizes URL and handles relative vs absolute endpoints
 */
export function getCleanUrl(endpoint) {
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith('http://') || cleanEndpoint.startsWith('https://')) {
    return cleanEndpoint;
  }
  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  if (cleanBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    cleanEndpoint = cleanEndpoint.replace(/^\/api/, '');
  }
  return `${cleanBase}${cleanEndpoint}`;
}

// Single-flight refresh token mutex promise to avoid race condition rotations
let refreshPromise = null;

/**
 * Directly executes a token refresh with the backend without triggering 401 interceptor loops
 */
async function executeTokenRefresh() {
  const refreshToken = tokenManager.getRefreshToken();
  const refreshUrl = getCleanUrl('/auth/refresh');

  const response = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(refreshToken ? { refreshToken } : {}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || 'Session expired. Please log in again.';
    throw new Error(message);
  }

  const resJson = await response.json();
  const data = resJson.data || resJson;

  if (!data || !data.token) {
    throw new Error('Malformed token refresh response received from server.');
  }

  // Update stored tokens with new access token and rotated refresh token
  tokenManager.setSession({
    token: data.token,
    refreshToken: data.refreshToken || refreshToken,
    expiresIn: data.expiresIn,
  });

  return data.token;
}

/**
 * Returns existing in-flight refresh promise or initiates a new one
 */
function getRefreshedToken() {
  if (!refreshPromise) {
    refreshPromise = executeTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Normalizes URL and attaches JWT authentication headers.
 * Intercepts 401 Unauthorized responses to perform automatic token refresh and retry.
 */
export async function apiRequest(endpoint, options = {}) {
  const isAuthEndpoint =
    endpoint.includes('/auth/login') ||
    endpoint.includes('/auth/register') ||
    endpoint.includes('/auth/refresh') ||
    endpoint.includes('/auth/logout');

  const token = tokenManager.getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // If body is FormData (e.g. file upload), remove Content-Type header so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const url = getCleanUrl(endpoint);

  const fetchOptions = {
    ...options,
    headers,
    credentials: options.credentials || 'include',
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Automatic Token Refresh Interceptor on 401 Unauthorized
    if (response.status === 401) {
      if (!options._retry && !isAuthEndpoint) {
        if (tokenManager.hasRefreshToken()) {
          try {
            const newToken = await getRefreshedToken();

            const retryHeaders = {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            };
            if (options.body instanceof FormData) {
              delete retryHeaders['Content-Type'];
            }

            return await apiRequest(endpoint, {
              ...options,
              _retry: true,
              headers: retryHeaders,
            });
          } catch (refreshErr) {
            console.warn('Authentication refresh failed:', refreshErr.message);
            tokenManager.clearSession();
            if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
              window.location.href = '/login';
            }
            throw refreshErr;
          }
        } else {
          // No refresh token available, session expired
          tokenManager.clearSession();
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            window.location.href = '/login';
          }
        }
      } else if (isAuthEndpoint && endpoint.includes('/auth/refresh')) {
        // Direct refresh call returned 401
        tokenManager.clearSession();
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login';
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || (Array.isArray(errorData.errors) ? errorData.errors.join(', ') : null);
      throw new Error(message || `Request failed with status ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Extracts payload data from backend ApiResponse<T>
 */
export function extractData(res, fallback = null) {
  if (res === null || res === undefined) return fallback;
  if (res && typeof res === 'object' && 'success' in res) {
    return res.data !== undefined && res.data !== null ? res.data : fallback;
  }
  if (res.data !== undefined) return res.data !== null ? res.data : fallback;
  return res;
}

/**
 * Extracts list from backend ApiResponse<List<T>> or ApiResponse<PagedResponse<T>>
 */
export function extractListData(res, fallback = []) {
  if (!res) return fallback;
  if (res.data !== undefined) {
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.content)) return res.data.content;
  }
  if (Array.isArray(res)) return res;
  return fallback;
}

export const api = {
  request: apiRequest,
  extractData,
  extractListData,
  get: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
