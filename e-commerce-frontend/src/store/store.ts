import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './authSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import wishlistReducer from './wishlistSlice';
import analyticsReducer from './analyticsSlice';
import auditReducer from './auditSlice';
import reviewReducer from './reviewSlice';
import securityReducer from './securitySlice';

// Define the root state type
export interface RootState {
  auth: AuthState;
  // Add other slice states as needed
  products: any;
  orders: any;
  cart: any;
  users: any;
  wishlist: any;
  analytics: any;
  audit: any;
  reviews: any;
  security: any;
}

// Create the store with proper typing
export const store = configureStore<RootState>({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    cart: cartReducer,
    users: userReducer,
    wishlist: wishlistReducer,
    analytics: analyticsReducer,
    audit: auditReducer,
    reviews: reviewReducer,
    security: securityReducer,
  },
  // Add middleware if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.user', 'meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});

// Export the typed hooks
export type AppDispatch = typeof store.dispatch;

// Re-export the hooks with proper typing
export { useAppDispatch, useAppSelector } from './hooks';
