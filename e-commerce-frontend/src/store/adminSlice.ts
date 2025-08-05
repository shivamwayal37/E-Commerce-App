import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Order, Product, User } from '../types';
import { adminService } from '../services/adminService';
import { RootState } from './store';

interface AdminState {
  products: Product[];
  orders: Order[];
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  products: [],
  orders: [],
  users: [],
  isLoading: false,
  error: null,
};

export const updateProducts = createAsyncThunk(
  'admin/updateProducts',
  async (data: { ids: string[]; action: string }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateProducts(data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateOrders = createAsyncThunk(
  'admin/updateOrders',
  async (data: { ids: string[]; action: string }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateOrders(data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async (data: { ids: string[]; action: string }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateUserStatus(data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(updateProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(updateOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
