import { createSlice } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../types/cart';

// Load cart from localStorage on app start
const loadCartFromStorage = (): CartState => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    discountedTotal: 0,
    isLoading: false,
    error: null,
  };
};

// Save cart to localStorage
const saveCartToStorage = (cart: CartState) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Sync cart with localStorage
const syncCartWithStorage = (state: CartState) => {
  saveCartToStorage(state);
};

const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number; discountedTotal: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal = items.reduce(
    (sum, item) => sum + (item.price * (1 - item.discount / 100)) * item.quantity,
    0
  );

  return {
    totalItems,
    totalPrice,
    discountedTotal,
  };
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.discountedTotal = totals.discountedTotal;
      syncCartWithStorage(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.discountedTotal = totals.discountedTotal;
      syncCartWithStorage(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity = quantity;
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        state.discountedTotal = totals.discountedTotal;
        syncCartWithStorage(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.discountedTotal = 0;
      syncCartWithStorage(state);
    },

    setError: (state, action) => {
      state.error = action.payload;
      syncCartWithStorage(state);
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
      syncCartWithStorage(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setError,
  setLoading,
} = cartSlice.actions;

export default cartSlice.reducer;
