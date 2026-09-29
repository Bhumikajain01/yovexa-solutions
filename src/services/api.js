/**
 * Generic API Client with JWT Header attachment, URL Normalization & Response Unwrapping
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yovexa-solutions-backend.vercel.app/api';

/**
 * Normalizes URL and attaches JWT authentication headers
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('yovexa_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // If body is FormData (e.g. file upload), remove Content-Type header so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url;
  if (cleanEndpoint.startsWith('http://') || cleanEndpoint.startsWith('https://')) {
    url = cleanEndpoint;
  } else {
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    if (cleanBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
      cleanEndpoint = cleanEndpoint.replace(/^\/api/, '');
    }
    url = `${cleanBase}${cleanEndpoint}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Unauthorized or expired token
      localStorage.removeItem('yovexa_auth_token');
      localStorage.removeItem('yovexa_auth_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
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
