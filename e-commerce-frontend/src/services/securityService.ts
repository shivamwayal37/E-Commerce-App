import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface SecurityCheck {
  id: string;
  checkName: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  lastChecked: string;
  recommendations?: string[];
}

export const securityService = {
  getSecurityChecks: async (): Promise<SecurityCheck[]> => {
    const response = await axios.get(`${API_URL}/security/audit`);
    return response.data;
  },
};
