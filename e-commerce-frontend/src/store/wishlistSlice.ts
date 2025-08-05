import { createSlice } from '@reduxjs/toolkit';
import { WishlistItem, WishlistState } from '../types/wishlist';

const loadWishlistFromStorage = (): WishlistState => {
  const storedWishlist = localStorage.getItem('wishlist');
  return storedWishlist ? JSON.parse(storedWishlist) : {
    items: [],
    isLoading: false,
    error: null,
  };
};

const saveWishlistToStorage = (wishlist: WishlistState) => {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
};

const syncWishlistWithStorage = (state: WishlistState) => {
  saveWishlistToStorage(state);
};

const initialState: WishlistState = loadWishlistFromStorage();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (!existingItem) {
        state.items.push(item);
        syncWishlistWithStorage(state);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      syncWishlistWithStorage(state);
    },

    clearWishlist: (state) => {
      state.items = [];
      syncWishlistWithStorage(state);
    },

    setError: (state, action) => {
      state.error = action.payload;
      syncWishlistWithStorage(state);
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
      syncWishlistWithStorage(state);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setError,
  setLoading,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
