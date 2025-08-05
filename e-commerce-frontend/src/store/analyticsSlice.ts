import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AnalyticsStats, AnalyticsState } from '../types/analytics';
import { analyticsService } from '../services/analyticsService';

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async () => {
    const response = await analyticsService.getAnalytics();
    return response;
  }
);

const initialState: AnalyticsState = {
  stats: {
    salesData: [],
    productDistribution: [],
    topProducts: [],
    userGrowthData: [],
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  },
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
