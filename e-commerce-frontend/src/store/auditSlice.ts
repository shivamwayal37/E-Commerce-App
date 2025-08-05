import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuditLogEntry, AuditState, AuditLogFilter } from '../types/audit';
import { auditService } from '../services/auditService';

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchAuditLogs',
  async (filter: AuditLogFilter = {}) => {
    const response = await auditService.getAuditLogs(filter);
    return response;
  }
);

export const clearAuditLogs = createAsyncThunk(
  'audit/clearAuditLogs',
  async () => {
    await auditService.clearAuditLogs();
    return null;
  }
);

const initialState: AuditState = {
  logs: [],
  loading: false,
  error: null,
  filter: {
    startDate: undefined,
    endDate: undefined,
    user: undefined,
    action: undefined,
    resource: undefined,
    status: undefined,
    search: undefined,
  },
  total: 0,
  page: 1,
  pageSize: 10,
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        state.total = action.payload.total;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch audit logs';
      })
      .addCase(clearAuditLogs.fulfilled, (state) => {
        state.logs = [];
        state.total = 0;
      });
  },
});

export const { setFilter, setPage, setPageSize } = auditSlice.actions;
export default auditSlice.reducer;
