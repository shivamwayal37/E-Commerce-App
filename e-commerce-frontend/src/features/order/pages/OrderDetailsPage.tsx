import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  ListItem,
  ListItemText,
  List,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrder, cancelOrder } from '../../../store/orderSlice';
import {
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  LocationOn as LocationOnIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import CardActions from '@mui/material/CardActions';
import { useNavigate } from 'react-router-dom';

const OrderDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orderId = window.location.pathname.split('/').pop() as string;
  const { orders, isLoading, error } = useAppSelector((state) => state.orders);
  const order = orders.find((o) => o.id === orderId);

  React.useEffect(() => {
    if (orderId) {
      dispatch(fetchOrder(orderId));
    }
  }, [dispatch, orderId]);

  type TimelineDotColor = 'error' | 'inherit' | 'warning' | 'info' | 'success' | 'primary' | 'secondary' | 'grey';

const getStatusColor = (status: string): TimelineDotColor => {
    switch (status) {
      case 'pending':
        return 'warning' as TimelineDotColor;
      case 'processing':
        return 'info' as TimelineDotColor;
      case 'shipped':
        return 'success' as TimelineDotColor;
      case 'delivered':
        return 'success' as TimelineDotColor;
      case 'cancelled':
        return 'error' as TimelineDotColor;
      default:
        return 'inherit' as TimelineDotColor;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap();
      } catch (err) {
        console.error('Error cancelling order:', err);
      }
    }
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <Typography variant="h5">Order not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Order #{order.id}
        </Typography>
        <Typography variant="subtitle1" color={getStatusColor(order.status)}>
          Status: {getStatusLabel(order.status)}
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              {order.items.map((item) => (
                <Card key={item.productId} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="h6" gutterBottom>
                          {item.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ mr: 1 }}
                          >
                            ${item.price.toFixed(2)}
                          </Typography>
                          <Typography variant="body1">
                            × {item.quantity}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="h6">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Timeline
              </Typography>
              <Timeline>
                {[
                  { status: 'pending', label: 'Order Placed' },
                  { status: 'processing', label: 'Processing' },
                  { status: 'shipped', label: 'Shipped' },
                  { status: 'delivered', label: 'Delivered' },
                ].map((step) => (
                  <TimelineItem key={step.status}>
                    <TimelineSeparator>
                      <TimelineDot
                        color={
                          order.status === step.status
                            ? getStatusColor(step.status)
                            : 'grey'
                        }
                      />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body1">{step.label}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    Order ID: #{order.id}
                  </Typography>
                  <Typography variant="subtitle1">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="subtitle1">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Total Amount:
                  </Typography>
                  <Typography variant="subtitle1">
                    ${order.totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                {order.discountedTotal < order.totalAmount && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Discount:
                    </Typography>
                    <Typography variant="subtitle1">
                      ${order.totalAmount - order.discountedTotal}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Final Total:
                  </Typography>
                  <Typography variant="h6">
                    ${order.discountedTotal.toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography variant="body1">
                  {order.shippingAddress.street}
                </Typography>
                <Typography variant="body1">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Typography>
                <Typography variant="body1">
                  {order.shippingAddress.country}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/orders')}
                  startIcon={<OpenInNewIcon />}
                >
                  View All Orders
                </Button>
                {order.status === 'pending' && (
                  <IconButton
                    color="error"
                    onClick={handleCancelOrder}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default OrderDetailsPage;
