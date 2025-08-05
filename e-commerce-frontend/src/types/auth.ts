export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface LoginResponse {
  token: string;
  user: User;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterResponse {
  token: string;
  user: User;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface RefreshTokenResponse {
  token: string;
  expiresAt: string;
}

// For Redux state
export interface RootState {
  auth: AuthState;
}
