import axios from 'axios';
import { Product, ProductFilters, ProductResponse } from '../types/product';

const API_BASE_URL = ''; // Empty string means it will use the proxy configuration from package.json

export const productService = {
  getAll: async (filters: ProductFilters = {}): Promise<ProductResponse> => {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: {
        category: filters.category,
        brand: filters.brand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        page: filters.page || 1,
        limit: filters.limit || 12,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/search`, {
      params: { q: query },
    });
    return response.data;
  },

  create: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const response = await axios.post(`${API_BASE_URL}/products`, productData);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/products/${id}`);
  },
};
