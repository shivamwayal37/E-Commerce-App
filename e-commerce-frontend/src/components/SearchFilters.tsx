import React from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  CircularProgress,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { format } from 'date-fns';

interface SearchFiltersProps {
  entityType: 'products' | 'orders' | 'users';
  onSearch: (filters: any) => void;
}

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  type: 'text' | 'select' | 'dateRange' | 'priceRange' | 'categories' | 'tags';
  label: string;
  name: string;
  options?: FilterOption[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  entityType,
  onSearch,
}) => {
  const [open, setOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    search: '',
    status: '',
    dateRange: {
      startDate: new Date(),
      endDate: new Date(),
    },
    priceRange: [0, 1000],
    categories: [],
    tags: [],
  });

  const handleSearch = () => {
    onSearch(filters);
    setOpen(false);
  };

  const availableFilters = (): Filter[] => {
    switch (entityType) {
      case 'products':
        return [
          { type: 'text', label: 'Search', name: 'search' },
          {
            type: 'select',
            label: 'Status',
            name: 'status',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
          { type: 'dateRange', label: 'Date Range', name: 'dateRange' },
          { type: 'priceRange', label: 'Price Range', name: 'priceRange' },
          { type: 'categories', label: 'Categories', name: 'categories' },
          { type: 'tags', label: 'Tags', name: 'tags' },
        ];
      case 'orders':
        return [
          { type: 'text', label: 'Search', name: 'search' },
          {
            type: 'select',
            label: 'Status',
            name: 'status',
            options: [
              { value: 'pending', label: 'Pending' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' },
            ],
          },
          { type: 'dateRange', label: 'Date Range', name: 'dateRange' },
          { type: 'priceRange', label: 'Total Amount', name: 'priceRange' },
          { type: 'tags', label: 'Tags', name: 'tags' },
        ];
      case 'users':
        return [
          { type: 'text', label: 'Search', name: 'search' },
          {
            type: 'select',
            label: 'Role',
            name: 'role',
            options: [
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Admin' },
            ],
          },
          { type: 'dateRange', label: 'Registration Date', name: 'dateRange' },
          {
            type: 'select',
            label: 'Status',
            name: 'status',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
        ];
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Advanced Search
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm">
        <DialogTitle>Advanced Search</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {availableFilters().map((filter) => (
              <Grid xs={12} key={filter.name}>
                {filter.type === 'text' && (
                  <TextField
                    fullWidth
                    label={filter.label}
                    value={(filters as any)[filter.name]}
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        [filter.name]: e.target.value,
                      }))
                    }
                  />
                )}
                {filter.type === 'select' && (
                  <FormControl fullWidth>
                    <InputLabel>{filter.label}</InputLabel>
                    <Select
                      value={(filters as any)[filter.name]}
                      onChange={(e) =>
                        setFilters((prev: any) => ({
                          ...prev,
                          [filter.name]: e.target.value,
                        }))
                      }
                    >
                      {filter.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {filter.type === 'dateRange' && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={format(filters.dateRange.startDate, 'yyyy-MM-dd')}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          dateRange: {
                            ...filters.dateRange,
                            startDate: new Date(e.target.value),
                          },
                        })
                      }
                    />
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={format(filters.dateRange.endDate, 'yyyy-MM-dd')}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          dateRange: {
                            ...filters.dateRange,
                            endDate: new Date(e.target.value),
                          },
                        })
                      }
                    />
                  </Box>
                )}
                {filter.type === 'priceRange' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2">
                      {filter.label}
                    </Typography>
                    <Slider
                      value={filters.priceRange}
                      onChange={(_, newValue) =>
                        setFilters({
                          ...filters,
                          priceRange: newValue as [number, number],
                        })
                      }
                      valueLabelDisplay="auto"
                      min={0}
                      max={1000}
                    />
                  </Box>
                )}
                {filter.type === 'categories' && (
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Electronics"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Clothing"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Books"
                    />
                  </FormGroup>
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSearch} variant="contained">
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchFilters;
