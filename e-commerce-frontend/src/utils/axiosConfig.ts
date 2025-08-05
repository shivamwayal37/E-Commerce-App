import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, clearAuthData } from './authUtils';

// Extend the AxiosRequestConfig interface to include our custom properties
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;      // Skip adding Authorization header
    _retry?: boolean;        // Internal flag for retry attempts
    skipErrorHandler?: boolean; // Skip global error handling
  }
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: false, // Using JWT in Authorization header
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Prevent browser auth dialog
    'Accept': 'application/json',
  },
});

// Add a request interceptor to handle auth headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Don't add auth header if skipAuth is set to true
    if (config.skipAuth) {
      return config;
    }

    // Get token from auth utils
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!config.skipAuth) {
      console.warn('No auth token available for authenticated request');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses (status code 2xx)
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { 
      _retry?: boolean;
      skipErrorHandler?: boolean;
    };

    // Skip error handling if skipErrorHandler is set
    if (originalRequest?.skipErrorHandler) {
      return Promise.reject(error);
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'));
    }

    const { status, data } = error.response;
    
    // Handle 401 Unauthorized (token expired or invalid)
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const { authService } = await import('../services/authService');
        await authService.refresh();
        
        // Update the auth header with the new token
        const newToken = getAuthToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth data and redirect to login
        console.error('Token refresh failed:', refreshError);
        clearAuthData();
        
        // Only redirect if we're in the browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
    }
    
    // Handle specific error statuses
    switch (status) {
      case 400:
        console.error('Bad Request:', data);
        break;
      case 403:
        console.error('Forbidden - Insufficient permissions');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Server Error:', data);
        break;
      default:
        console.error(`Error ${status}:`, data);
    }
    
    // Return a user-friendly error message if available
    const errorMessage = 
      (typeof data === 'object' && data !== null && 'message' in data)
        ? String((data as { message: unknown }).message)
        : error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
