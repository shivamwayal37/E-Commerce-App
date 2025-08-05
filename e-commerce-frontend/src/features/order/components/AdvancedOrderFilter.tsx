import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  ListItem,
  ListItemText,
  List,
  Grid,
  Slider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrders } from '../../../store/orderSlice';
import { format } from 'date-fns';

interface AdvancedOrderFilterProps {
  onFilter: (filters: OrderFilters) => void;
}

interface OrderFilters {
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  totalRange: [number, number];
  paymentMethod: string[];
  shippingMethod: string[];
  customer: string;
  orderBy: string;
  orderDirection: string;
}

const AdvancedOrderFilter: React.FC<AdvancedOrderFilterProps> = ({ onFilter }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<OrderFilters>({
    status: [],
    dateRange: {
      start: null,
      end: null,
    },
    totalRange: [0, 1000],
    paymentMethod: [],
    shippingMethod: [],
    customer: '',
    orderBy: 'date',
    orderDirection: 'desc',
  });

  const handleFilter = () => {
    onFilter(filters);
    setOpen(false);
  };

  const handleDateChange = (field: 'start' | 'end', value: Date | null) => {
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Advanced Filters
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        <DialogTitle>Advanced Order Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value as string[] })
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  multiple
                  value={filters.paymentMethod}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      paymentMethod: e.target.value as string[],
                    })
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="cash_on_delivery">Cash on Delivery</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Shipping Method</InputLabel>
                <Select
                  multiple
                  value={filters.shippingMethod}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      shippingMethod: e.target.value as string[],
                    })
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="standard">Standard Shipping</MenuItem>
                  <MenuItem value="express">Express Shipping</MenuItem>
                  <MenuItem value="pickup">Store Pickup</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={filters.customer}
                onChange={(e) =>
                  setFilters({ ...filters, customer: e.target.value })
                }
              />
            </Grid>

            <Grid xs={12}>
              <Typography variant="subtitle2">Total Amount Range</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography>${filters.totalRange[0]}</Typography>
                <Box sx={{ flex: 1 }}>
                  <Slider
                    value={filters.totalRange}
                    onChange={(_, newValue) =>
                      setFilters({
                        ...filters,
                        totalRange: newValue as [number, number],
                      })
                    }
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                  />
                </Box>
                <Typography>${filters.totalRange[1]}</Typography>
              </Box>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.orderBy}
                  onChange={(e) =>
                    setFilters({ ...filters, orderBy: e.target.value })
                  }
                  label="Sort By"
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="total">Total Amount</MenuItem>
                  <MenuItem value="customer">Customer Name</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sort Direction</InputLabel>
                <Select
                  value={filters.orderDirection}
                  onChange={(e) =>
                    setFilters({ ...filters, orderDirection: e.target.value })
                  }
                  label="Sort Direction"
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleFilter} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedOrderFilter;
