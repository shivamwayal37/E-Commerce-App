declare global {
  interface ImportMetaEnv {
    VITE_STRIPE_PUBLIC_KEY: string;
  }
}

// Stripe configuration
import Stripe from 'stripe';

// Initialize Stripe with your publishable key
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_12345'; // Replace with your actual test key

if (!stripePublicKey || stripePublicKey === 'pk_test_12345') {
  console.warn('Stripe public key is not configured - using test key');
}

export const stripe = new Stripe(stripePublicKey, {
  apiVersion: '2025-05-28.basil',
});

// Export types for better type safety
export type StripePaymentMethod = {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
};

export type StripePaymentIntent = {
  id: string;
  status: string;
  client_secret: string;
  amount: number;
  currency: string;
};
