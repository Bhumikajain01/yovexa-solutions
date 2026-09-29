import { api, extractData } from './api';

const TOKEN_KEY = 'yovexa_auth_token';
const USER_KEY = 'yovexa_auth_user';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return extractData(res);
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    const data = extractData(res);

    if (data && data.token && data.user) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    }
    throw new Error(res?.message || 'Invalid login response');
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user && user.role === 'ADMIN');
  },
};
