import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Visibility, Delete, Edit } from '@mui/icons-material';
import { Order, OrderItem } from '../../../types/order';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../../../store/orderSlice';

const OrderManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState('');
  const [errorDialog, setErrorDialog] = useState<string>('');

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setStatus('');
    setErrorDialog('');
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await dispatch(updateOrderStatus({ orderId: selectedOrder.id, status })).unwrap();
      setOpenDialog(false);
      setErrorDialog('');
    } catch (err) {
      if (err instanceof Error) {
        setErrorDialog(err.message);
      } else {
        setErrorDialog('Failed to update order status');
      }
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
      } catch (err) {
        console.error('Error deleting order:', err);
      }
    }
  };

  React.useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="h6" gutterBottom>
            Orders
          </Typography>
        </Grid>
        <Grid xs={12}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order: Order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</TableCell>
                      <TableCell>${order.discountedTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setSelectedOrder(order);
                            setStatus(order.status);
                            setOpenDialog(true);
                          }}
                        >
                          {order.status}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => {
                          setSelectedOrder(order);
                          setOpenDialog(true);
                        }}>
                          <Visibility />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(order.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order #{selectedOrder.id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Customer: {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Total: ${selectedOrder.discountedTotal.toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Status: {selectedOrder.status}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Items
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.items.map((item: OrderItem) => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Total:</Typography>
                <Typography>${selectedOrder.discountedTotal}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderManagement;
