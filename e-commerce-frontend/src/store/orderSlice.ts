import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Order, OrderState } from '../types/order';
import { orderService } from '../services/orderService';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  return await orderService.getOrders();
});

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId: string) => {
    return await orderService.getOrder(orderId);
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: {
    items: Order['items'];
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
  }) => {
    return await orderService.createOrder(orderData);
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string) => {
    await orderService.cancelOrder(orderId);
    return orderId;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: string }) => {
    await orderService.updateOrderStatus(orderId, status);
    return { orderId, status };
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId: string) => {
    await orderService.deleteOrder(orderId);
    return orderId;
  }
);

const initialState: OrderState = {
  orders: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const orderIndex = state.orders.findIndex((o) => o.id === action.payload);
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = 'cancelled';
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to cancel order';
      });
  },
});

export const { setError, setLoading } = orderSlice.actions;

export default orderSlice.reducer;
