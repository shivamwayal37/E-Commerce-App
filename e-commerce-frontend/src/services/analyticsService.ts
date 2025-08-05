import axios from 'axios';
import { AnalyticsStats } from '../types/analytics';

const API_URL = ''; // Empty string means it will use the proxy configuration from package.json

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsStats> {
    try {
      const response = await axios.get(`${API_URL}/analytics`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getSalesReport(dateRange: { startDate: string; endDate: string }) {
    try {
      const response = await axios.get(`${API_URL}/analytics/sales`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProductPerformance() {
    try {
      const response = await axios.get(`${API_URL}/analytics/products`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserAnalytics() {
    try {
      const response = await axios.get(`${API_URL}/analytics/users`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
