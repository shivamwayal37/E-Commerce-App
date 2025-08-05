import { User } from '../types/auth';
import axios from './axiosConfig';

// Token storage key
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Get the current authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Save authentication token to localStorage and axios defaults
 */
export const setAuthToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * Check if user is authenticated by verifying token existence and expiration
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token && !isTokenExpired(token);
};

/**
 * Check if the JWT token is expired
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // JWT exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    console.error('Error checking token expiration:', e);
    return true;
  }
};

/**
 * Get user info from JWT token
 */
export const getUserFromToken = (): User | null => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    return {
      id: payload.sub || '',
      email: payload.email || '',
      name: payload.name || '',
      role: (payload.role || 'USER') as 'USER' | 'ADMIN',
      isActive: payload.active !== false,
    };
  } catch (e) {
    console.error('Error parsing token:', e);
    return null;
  }
};

/**
 * Save user data to localStorage
 */
export const saveUserData = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Get user data from localStorage
 */
export const getUserData = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  delete axios.defaults.headers.common['Authorization'];
};
