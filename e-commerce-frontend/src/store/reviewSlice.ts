import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Review, ReviewFormValues, ReviewState } from '../types/review';
import { reviewService } from '../services/reviewService';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId: string) => {
    const reviews = await reviewService.getReviews(productId);
    const averageRating = await reviewService.getAverageRating(productId);
    return { reviews, averageRating, reviewCount: reviews.length };
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (data: { productId: string; review: ReviewFormValues }) => {
    return await reviewService.addReview(data.productId, data.review);
  }
);

const initialState: ReviewState = {
  reviews: [],
  averageRating: 0,
  reviewCount: 0,
  isLoading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.reviews;
        state.averageRating = action.payload.averageRating;
        state.reviewCount = action.payload.reviewCount;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.push(action.payload);
        state.reviewCount++;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add review';
      });
  },
});

export const { setError, setLoading } = reviewSlice.actions;

export default reviewSlice.reducer;
