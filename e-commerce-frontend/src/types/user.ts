export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      showEmail: boolean;
      showPhoneNumber: boolean;
    };
  };
  security: {
    twoFactorAuth: boolean;
    passwordLastChanged: Date;
    lastLogin: Date;
    failedLoginAttempts: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhoneNumber: boolean;
  };
}

export interface UserSecuritySettings {
  twoFactorAuth: boolean;
  passwordLastChanged: Date;
  lastLogin: Date;
  failedLoginAttempts: number;
}
