import { api, extractData } from './api';
import { tokenManager } from './tokenManager';

export const authService = {
  /**
   * Register initial admin account
   */
  async register(data) {
    const res = await api.post('/auth/register', data);
    return extractData(res);
  },

  /**
   * Authenticate admin credentials and persist session tokens
   */
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    const data = extractData(res);

    if (data && data.token && data.user) {
      tokenManager.setSession({
        token: data.token,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        user: data.user,
      });
      return data;
    }
    throw new Error(res?.message || 'Invalid login response received from server.');
  },

  /**
   * Manually or proactively trigger JWT refresh using stored refresh token
   */
  async refreshToken() {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available to renew session.');
    }

    const res = await api.post('/auth/refresh', { refreshToken });
    const data = extractData(res);

    if (data && data.token) {
      tokenManager.setSession({
        token: data.token,
        refreshToken: data.refreshToken || refreshToken,
        expiresIn: data.expiresIn,
      });
      return data;
    }
    throw new Error(res?.message || 'Failed to refresh authentication session.');
  },

  /**
   * Revoke refresh token on backend and wipe local storage session
   */
  async logout() {
    const refreshToken = tokenManager.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      } else {
        await api.post('/auth/logout');
      }
    } catch (err) {
      // Ignore network errors during logout to guarantee client-side cleanup
      console.warn('Backend logout notification failed, continuing local cleanup:', err);
    } finally {
      tokenManager.clearSession();
    }
  },

  /**
   * Accessor methods
   */
  getStoredToken() {
    return tokenManager.getAccessToken();
  },

  getStoredRefreshToken() {
    return tokenManager.getRefreshToken();
  },

  getStoredUser() {
    return tokenManager.getUser();
  },

  getTokenExpiresAt() {
    return tokenManager.getExpiresAt();
  },

  isTokenExpired(bufferSeconds = 30) {
    return tokenManager.isAccessTokenExpired(bufferSeconds);
  },

  isAuthenticated() {
    const token = tokenManager.getAccessToken();
    const user = tokenManager.getUser();
    return !!(token && user && user.role === 'ADMIN');
  },
};

export default authService;
