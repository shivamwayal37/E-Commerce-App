import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductFilters, ProductResponse, Product } from '../types/product';
import { productService } from '../services/productService';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters) => {
    const response = await productService.getAll(filters);
    return response;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string) => {
    const response = await productService.getById(id);
    return response;
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string) => {
    const response = await productService.search(query);
    return response;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Omit<Product, 'id'>) => {
    const response = await productService.create(productData);
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: Partial<Product> }) => {
    const response = await productService.update(id, data);
    return response;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await productService.delete(id);
    return id;
  }
);

const initialState = {
  products: [] as Product[],
  total: 0,
  page: 1,
  totalPages: 1,
  selectedProduct: null as Product | null,
  filters: {
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 0,
    sort: 'price_asc',
    page: 1,
    limit: 12,
  },
  searchQuery: '',
  searchResults: [] as Product[],
  isLoading: false,
  error: null as string | null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const updates = action.payload as Partial<ProductFilters>;
      state.filters = {
        ...state.filters,
        category: updates.category || state.filters.category,
        brand: updates.brand || state.filters.brand,
        minPrice: updates.minPrice || state.filters.minPrice,
        maxPrice: updates.maxPrice || state.filters.maxPrice,
        sort: updates.sort || state.filters.sort,
        page: 1,
        limit: updates.limit || state.filters.limit
      };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.isLoading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch products';
        state.isLoading = false;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { setFilters, setSearchQuery, clearSearch, clearError } = productSlice.actions;
export default productSlice.reducer;
