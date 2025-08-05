import axios from 'axios';
import { Order, OrderItem } from '../types/order';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await axios.get('/api/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async createOrder(order: {
    items: OrderItem[];
    shippingAddress: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone: string;
    };
    paymentMethod: string;
  }): Promise<Order> {
    try {
      const response = await axios.post('/api/orders', order);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async cancelOrder(orderId: string): Promise<void> {
    try {
      await axios.put(`/api/orders/${orderId}/cancel`);
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async deleteOrder(orderId: string): Promise<void> {
    try {
      await axios.delete(`/api/orders/${orderId}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },
};
