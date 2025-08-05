import axios from 'axios';
import { AuditLogFilter } from '../types/audit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const auditService = {
  async getAuditLogs(filter: AuditLogFilter & { page?: number; pageSize?: number }) {
    try {
      const params = {
        ...filter,
        page: filter.page,
        pageSize: filter.pageSize,
      };
      
      const response = await axios.get(`${API_URL}/audit/logs`, {
        params: params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async clearAuditLogs() {
    try {
      await axios.delete(`${API_URL}/audit/logs`);
    } catch (error) {
      throw error;
    }
  },

  async exportAuditLogs(format: string) {
    try {
      const response = await axios.post(
        `${API_URL}/audit/logs/export`,
        { format },
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
