import axios from 'axios';
import { Order, Product, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface BulkUpdateData {
  ids: string[];
  action: string;
}

export const adminService = {
  updateProducts: async (data: BulkUpdateData): Promise<Product[]> => {
    const response = await axios.patch(`${API_URL}/admin/products`, data);
    return response.data;
  },

  updateOrders: async (data: BulkUpdateData): Promise<Order[]> => {
    const response = await axios.patch(`${API_URL}/admin/orders`, data);
    return response.data;
  },

  updateUserStatus: async (data: BulkUpdateData): Promise<User[]> => {
    const response = await axios.patch(`${API_URL}/admin/users`, data);
    return response.data;
  },
};
