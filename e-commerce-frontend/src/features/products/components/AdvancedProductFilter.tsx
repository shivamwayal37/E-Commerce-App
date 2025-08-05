import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Autocomplete,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/productSlice';

interface AdvancedProductFilterProps {
  onFilter: (filters: ProductFilters) => void;
}

interface ProductFilters {
  search: string;
  category: string[];
  priceRange: [number, number];
  rating: number;
  tags: string[];
  stockStatus: 'all' | 'in_stock' | 'out_of_stock';
  sortBy: string;
  minReviews: number;
}

interface Category {
  id: string;
  name: string;
}

const AdvancedProductFilter: React.FC<AdvancedProductFilterProps> = ({ onFilter }) => {
  const dispatch = useAppDispatch();
  const { products, isLoading: productsLoading, error: productsError, filters: { category: categories = [] } } = useAppSelector((state) => state.products);
  const [open, setOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<ProductFilters>({
    search: '',
    category: [],
    priceRange: [0, 1000] as [number, number],
    rating: 0,
    tags: [] as string[],
    stockStatus: 'all',
    sortBy: 'relevance',
    minReviews: 0,
  });

  React.useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const handleFilter = () => {
    onFilter(filters);
    setOpen(false);
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
        <DialogTitle>Advanced Product Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={filters.category}
                  onChange={(e) => {
                    // For multiple select, e.target.value is already an array
                    setFilters({ ...filters, category: e.target.value as string[] })
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {(categories as string[]).map((category: string) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  label="Sort By"
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="priceLow">Price: Low to High</MenuItem>
                  <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <Typography variant="subtitle2">Price Range</Typography>
              <Slider
                value={filters.priceRange}
                onChange={(_, newValue) =>
                  setFilters({ ...filters, priceRange: newValue as [number, number] })
                }
                valueLabelDisplay="auto"
                min={0}
                max={1000}
              />
            </Grid>

            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Rating"
                value={filters.rating}
                onChange={(e) =>
                  setFilters({ ...filters, rating: Number(e.target.value) || 0 })
                }
                InputProps={{
                  inputProps: { min: 0, max: 5 },
                }}
              />
            </Grid>

            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Reviews"
                value={filters.minReviews}
                onChange={(e) =>
                  setFilters({ ...filters, minReviews: Number(e.target.value) || 0 })
                }
              />
            </Grid>

            <Grid xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.stockStatus === 'in_stock'}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          stockStatus: e.target.checked ? 'in_stock' : 'all',
                        })
                      }
                    />
                  }
                  label="In Stock Only"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.stockStatus === 'out_of_stock'}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          stockStatus: e.target.checked ? 'out_of_stock' : 'all',
                        })
                      }
                    />
                  }
                  label="Out of Stock Only"
                />
              </FormGroup>
            </Grid>
          </Grid>

          {productsError && (
            <Alert severity="error">
              {productsError}
            </Alert>
          )}
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

export default AdvancedProductFilter;
