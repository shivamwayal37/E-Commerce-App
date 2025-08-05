import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { RootState } from '../store';
import AuthLayout from '@/features/auth/pages/AuthLayout';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import MainLayout from '@/layouts/MainLayout';
import ProductsPage from '../features/products/pages/ProductsPage';
import ProductDetailsPage from '../features/products/pages/ProductDetailsPage';
import CartPage from '../features/cart/pages/CartPage';
import ProfilePage from '../features/user/pages/ProfilePage';
import CheckoutPage from '../features/checkout/pages/CheckoutPage';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import ProductManagement from '../features/admin/pages/ProductManagement';
import OrderManagement from '../features/admin/pages/OrderManagement';
import UserManagement from '../features/admin/pages/UserManagement';
import OrderHistoryPage from '../features/order/pages/OrderHistoryPage';
import OrderDetailsPage from '../features/order/pages/OrderDetailsPage';
import WishlistPage from '../features/wishlist/pages/WishlistPage';

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

// Add type declarations for react-dom
// This is a temporary fix until we install @types/react-dom
// declare module 'react-dom/client';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirect old login route to new auth path */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      
      {/* Public Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ProductsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
