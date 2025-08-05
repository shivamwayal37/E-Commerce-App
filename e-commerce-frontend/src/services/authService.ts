import axios from '../utils/axiosConfig';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  LoginResponse, 
  RegisterResponse, 
  User 
} from '../types/auth';
import { 
  setAuthToken, 
  clearAuthData, 
  saveUserData,
  getAuthToken
} from '../utils/authUtils';

export const authService = {
  /**
   * Authenticate user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.log('Attempting login with credentials:', {
        email: credentials.email,
        password: credentials.password ? '[PROVIDED]' : '[MISSING]'
      });

      const response = await axios.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password
      }, {
        skipAuth: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      const { token, user } = response.data;
      
      if (token && user) {
        // Store the token and set auth header
        setAuthToken(token);
        saveUserData(user);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Clear any existing auth data on error
      clearAuthData();
      
      if (error.response) {
        // Server responded with an error status code
        let message = 'Login failed';
        
        if (error.response.status === 401) {
          message = 'Invalid email or password';
        } else if (error.response.data?.message) {
          message = error.response.data.message;
        } else if (error.response.statusText) {
          message = error.response.statusText;
        }
        
        throw new Error(message);
      } else if (error.request) {
        // No response received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Request setup error
        throw new Error(error.message || 'An error occurred during login');
      }
    }
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      // Optional: Call backend logout endpoint if needed
      // await axios.post('/api/auth/logout', {}, { skipAuth: true });
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local auth state
      clearAuthData();
    }
  },

  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    try {
      const response = await axios.post('/api/auth/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword
      }, {
        skipAuth: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      const { token, user } = response.data;
      
      if (token && user) {
        setAuthToken(token);
        saveUserData(user);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Clear auth data on error
      clearAuthData();
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.statusText) {
        throw new Error(error.response.statusText);
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  },

  /**
   * Refresh the authentication token
   */
  refresh: async (): Promise<void> => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(
        '/api/auth/refresh-token', 
        { token: currentToken },
        { skipAuth: true }
      );
      
      const { token, user } = response.data;
      
      if (token && user) {
        setAuthToken(token);
        saveUserData(user);
        return Promise.resolve();
      }
      
      throw new Error('Invalid token response');
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      throw new Error('Session expired. Please log in again.');
    }
  },

  /**
   * Get the current user's profile
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await axios.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  },

  /**
   * Check if the current token is valid
   */
  checkAuth: async (): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      await axios.get('/api/auth/validate-token');
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
};
