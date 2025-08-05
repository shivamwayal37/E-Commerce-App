import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const exportService = {
  async exportData({ entityType, format }: { entityType: string; format: string }) {
    try {
      const response = await axios.post(
        `${API_URL}/export/${entityType}`,
        { format },
        {
          responseType: 'blob',
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  async exportAnalytics({ startDate, endDate, format }: {
    startDate: string;
    endDate: string;
    format: string;
  }) {
    try {
      const response = await axios.post(
        `${API_URL}/export/analytics`,
        { startDate, endDate, format },
        {
          responseType: 'blob',
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
