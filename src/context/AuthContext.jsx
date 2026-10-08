import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { tokenManager } from '../services/tokenManager';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedUser = tokenManager.getUser();
      const storedToken = tokenManager.getAccessToken();
      const storedRefreshToken = tokenManager.getRefreshToken();

      if (storedUser && (storedToken || storedRefreshToken)) {
        // If access token is expired or expiring within 60s, but we have a refresh token:
        if (storedRefreshToken && tokenManager.isAccessTokenExpired(60)) {
          try {
            const data = await authService.refreshToken();
            if (isMounted) {
              setUser(storedUser);
              setToken(data.token);
            }
          } catch (err) {
            console.warn('Initial session refresh could not be completed:', err?.message);
            tokenManager.clearSession();
            if (isMounted) {
              setUser(null);
              setToken(null);
            }
          }
        } else {
          if (isMounted) {
            setUser(storedUser);
            setToken(storedToken);
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for cross-service or background token refresh events
    const handleAuthChange = (e) => {
      if (!isMounted) return;
      const { isAuthenticated: isAuth, user: updatedUser, token: updatedToken } = e.detail || {};
      if (isAuth) {
        setUser(updatedUser || tokenManager.getUser());
        setToken(updatedToken || tokenManager.getAccessToken());
      } else {
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener('yovexa_auth_change', handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('yovexa_auth_change', handleAuthChange);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    setToken(res.token);
    return res;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const res = await authService.refreshToken();
    setToken(res.token);
    return res;
  }, []);

  const isAuthenticated = !!(user && token && user.role === 'ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
