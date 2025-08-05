import axios from 'axios';
import { stripe } from './stripe';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const stripeService = {
  async createPaymentIntent(orderId: string, amount: number) {
    try {
      const response = await axios.post(`${API_URL}/payment/intent`, {
        orderId,
        amount,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async handlePaymentSuccess(paymentIntentId: string, orderId: string) {
    try {
      const response = await axios.post(`${API_URL}/payment/success`, {
        paymentIntentId,
        orderId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async handlePaymentFailure(paymentIntentId: string, orderId: string) {
    try {
      const response = await axios.post(`${API_URL}/payment/failure`, {
        paymentIntentId,
        orderId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createStripeSession(orderId: string, amount: number) {
    try {
      const response = await axios.post(`${API_URL}/payment/session`, {
        orderId,
        amount,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
