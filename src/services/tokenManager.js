/**
 * Token & Session Storage Manager
 * Centralizes localStorage operations, token expiration tracking, and cross-tab/cross-component sync
 */

const ACCESS_TOKEN_KEY = 'yovexa_auth_token';
const REFRESH_TOKEN_KEY = 'yovexa_refresh_token';
const USER_KEY = 'yovexa_auth_user';
const EXPIRES_AT_KEY = 'yovexa_token_expires_at';

/**
 * Safely decodes base64url encoded JWT payload
 */
function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const tokenManager = {
  getAccessToken() {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getRefreshToken() {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getUser() {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getExpiresAt() {
    try {
      const exp = localStorage.getItem(EXPIRES_AT_KEY);
      return exp ? Number(exp) : null;
    } catch {
      return null;
    }
  },

  hasRefreshToken() {
    return !!this.getRefreshToken();
  },

  /**
   * Checks whether the current access token is expired or within a safety buffer
   * @param {number} bufferSeconds - Safety window in seconds (default 30s)
   */
  isAccessTokenExpired(bufferSeconds = 30) {
    const expiresAt = this.getExpiresAt();
    if (expiresAt) {
      return Date.now() >= expiresAt - bufferSeconds * 1000;
    }

    const token = this.getAccessToken();
    if (!token) return true;

    const payload = decodeJwtPayload(token);
    if (payload && payload.exp) {
      return Date.now() >= (payload.exp - bufferSeconds) * 1000;
    }

    return false;
  },

  /**
   * Sets or updates authentication session
   */
  setSession({ token, refreshToken, expiresIn, user }) {
    try {
      if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      }

      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      if (expiresIn !== undefined && expiresIn !== null) {
        // Handle expiresIn in seconds (< 10000000) or milliseconds
        const numExp = Number(expiresIn);
        const expiresAt = numExp < 10000000 ? Date.now() + numExp * 1000 : Date.now() + numExp;
        localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
      } else if (token) {
        const payload = decodeJwtPayload(token);
        if (payload && payload.exp) {
          localStorage.setItem(EXPIRES_AT_KEY, (payload.exp * 1000).toString());
        }
      }

      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }

      // Dispatch event to notify AuthContext and other listeners
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('yovexa_auth_change', {
            detail: {
              isAuthenticated: true,
              token: token || this.getAccessToken(),
              user: user || this.getUser(),
            },
          })
        );
      }
    } catch (err) {
      console.error('Failed to save session to localStorage:', err);
    }
  },

  /**
   * Clears all session keys from storage and dispatches auth change event
   */
  clearSession() {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(EXPIRES_AT_KEY);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('yovexa_auth_change', {
            detail: {
              isAuthenticated: false,
              token: null,
              user: null,
            },
          })
        );
      }
    } catch (err) {
      console.error('Failed to clear session from localStorage:', err);
    }
  },
};

export default tokenManager;
