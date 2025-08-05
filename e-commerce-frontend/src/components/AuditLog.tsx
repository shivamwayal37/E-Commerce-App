import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAuditLogs, setFilter, setPage, setPageSize } from '../store/auditSlice';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { AuditLogEntry, AuditState, AuditLogFilter } from '../types/audit';

const AuditLog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, loading, error, filter, page, pageSize, total } = useAppSelector((state: { audit: AuditState }) => state.audit);
  const [filterOpen, setFilterOpen] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchAuditLogs(filter));
  }, [dispatch, filter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(setFilter({ ...filter, [name]: value }));
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPageSize(Number(event.target.value)));
  };

  const handleDownload = () => {
    // Add download logic here
  };

  const getStatusColor = (status: 'success' | 'failed') => {
    switch (status) {
      case 'success':
        return '#4caf50';
      case 'failed':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Audit Logs</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Filter">
              <IconButton onClick={() => setFilterOpen(!filterOpen)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton onClick={handleDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {filterOpen && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={filter.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log: AuditLogEntry) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(log.status),
                        }}
                      />
                      <Typography>{log.status}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </Box>
  );
};

export default AuditLog;
