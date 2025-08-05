export interface SecurityCheck {
  id: string;
  checkName: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  lastChecked: string;
  recommendations?: string[];
}

export interface SecurityState {
  checks: SecurityCheck[];
  isLoading: boolean;
  error: string | null;
  lastCheck: SecurityCheck | null;
}
