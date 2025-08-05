import React, { useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts, setFilters, setSearchQuery } from '../../../store/productSlice';
import ProductCard from '../components/ProductCard';
import { ProductFilters } from '../../../types/product';

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, total, page, totalPages, filters, searchQuery, isLoading, error } = useAppSelector(
    (state) => state.products || {
      products: [],
      total: 0,
      page: 1,
      totalPages: 1,
      filters: {} as ProductFilters,
      searchQuery: '',
      isLoading: false,
      error: null
    }
  );
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newFilters = createNewFilters({});
    newFilters.sort = filters.sort as 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc' | undefined;
    dispatch(fetchProducts(newFilters));
  }, [dispatch, filters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          dispatch(
            fetchProducts({
              ...filters,
              sort: filters.sort as 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc' | undefined,
              page: page + 1,
            })
          );
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [dispatch, filters, page, totalPages]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    dispatch(setSearchQuery(query));
    // Implement search functionality here
  };

  const createNewFilters = (updates: Partial<ProductFilters>): ProductFilters => {
    const newFilters: ProductFilters = {
      category: updates.category || filters.category,
      brand: updates.brand || filters.brand,
      minPrice: updates.minPrice || filters.minPrice,
      maxPrice: updates.maxPrice || filters.maxPrice,
      sort: (updates.sort || filters.sort) as 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc' | undefined,
      page: 1,
      limit: updates.limit || filters.limit
    };
    return newFilters;
  };

  const handleFilterChange = (field: keyof ProductFilters) => 
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      const newFilters = createNewFilters({});
      
      if (field === 'sort') {
        newFilters.sort = value as 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc';
      } else {
        newFilters[field] = value as any;
      }

      dispatch(setFilters(newFilters));
    };

  const handlePriceRange = (type: 'min' | 'max') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    
    const newFilters = createNewFilters({ [`${type}Price`]: value });
    dispatch(setFilters(newFilters));
  };

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Search products"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button variant="contained" color="primary">
            Search
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category || ''}
                onChange={handleFilterChange('category')}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {/* Add categories dynamically from API */}
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="books">Books</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Brand</InputLabel>
              <Select
                value={filters.brand || ''}
                onChange={handleFilterChange('brand')}
                label="Brand"
              >
                <MenuItem value="">All Brands</MenuItem>
                {/* Add brands dynamically from API */}
                <MenuItem value="apple">Apple</MenuItem>
                <MenuItem value="samsung">Samsung</MenuItem>
                <MenuItem value="nike">Nike</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sort || 'price_asc'}
                onChange={handleFilterChange('sort')}
                label="Sort By"
              >
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="rating_asc">Rating: Low to High</MenuItem>
                <MenuItem value="rating_desc">Rating: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <TextField
            type="number"
            label="Min Price"
            value={filters.minPrice || ''}
            onChange={handlePriceRange('min')}
            sx={{ mr: 2 }}
          />
          <TextField
            type="number"
            label="Max Price"
            value={filters.maxPrice || ''}
            onChange={handlePriceRange('max')}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {isLoading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : (
          Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                No products found
              </Typography>
            </Grid>
          )
        )}
      </Grid>

      <Box ref={observerRef} sx={{ height: 1 }} />
    </Container>
  );
};

export default ProductsPage;
