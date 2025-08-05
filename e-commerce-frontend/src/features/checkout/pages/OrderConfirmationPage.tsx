import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { clearCart } from '../../../store/cartSlice';

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleContinueShopping = () => {
    dispatch(clearCart());
    navigate('/products');
  };

  const handleViewOrder = () => {
    dispatch(clearCart());
    navigate('/profile/orders');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Thank You for Your Order!
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          Order #123456789
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Your order has been placed successfully and is being processed.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You will receive an email confirmation shortly.
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">Order Date:</Typography>
            <Typography variant="body1" color="primary">
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">Delivery Time:</Typography>
            <Typography variant="body1" color="primary">
              5-7 business days
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1">Order Status:</Typography>
            <Typography variant="body1" color="primary">
              Processing
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewOrder}
            sx={{ mr: 1 }}
          >
            View Order
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default OrderConfirmationPage;
