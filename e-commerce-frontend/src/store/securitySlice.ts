import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SecurityCheck } from '../types/security';
import { securityService } from '../services/securityService';
import { RootState } from '../store';

interface SecurityState {
  checks: SecurityCheck[];
  loading: boolean;
  error: string | null;
  lastCheck: SecurityCheck | null;
}

const initialState: SecurityState = {
  checks: [],
  loading: false,
  error: null,
  lastCheck: null,
};

export const fetchSecurityAudit = createAsyncThunk<
  SecurityCheck[],
  void,
  { rejectValue: string }
>(
  'security/fetchSecurityAudit',
  async (_, { rejectWithValue }) => {
    try {
      const response = await securityService.getSecurityChecks();
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurityAudit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSecurityAudit.fulfilled, (state, action) => {
        state.loading = false;
        state.checks = action.payload;
      })
      .addCase(fetchSecurityAudit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
      });
  },
});

export default securitySlice.reducer;
