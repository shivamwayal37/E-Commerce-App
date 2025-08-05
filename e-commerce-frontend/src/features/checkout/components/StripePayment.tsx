import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateOrderStatus } from '../../../store/orderSlice';
import { stripeService } from '../../../services/stripeService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface PaymentFormProps {
  orderId: string;
  amount: number;
  currency: string;
  onClose: () => void;
}

const StripePayment: React.FC<PaymentFormProps> = ({ orderId, amount, currency, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!stripe) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe initialization failed');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements?.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (!paymentMethod) {
        throw new Error('Payment method creation failed');
      }

      // Create Stripe session
      const session = await stripeService.createStripeSession(orderId, amount);
      const sessionId = session.id;

      // Confirm card payment
      const { error: paymentError } = await stripe.confirmCardPayment(sessionId, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Test User'
          }
        }
      });

      if (paymentError) {
        throw new Error(paymentError.message || 'Payment confirmation failed');
      }

      // Update order status
      await dispatch(updateOrderStatus({ orderId, status: 'paid' })).unwrap();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        disabled={!(stripe && elements) || loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Pay Now'}
      </Button>
    </form>
  );
};

export default StripePayment;