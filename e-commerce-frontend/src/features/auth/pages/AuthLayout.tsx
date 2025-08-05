import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import AuthPageLayout from '../../../components/auth/AuthPageLayout';

const AuthLayout: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect them to the home page, but save the current location they were trying to go to
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <AuthPageLayout>
      <Outlet />
    </AuthPageLayout>
  );
};

export default AuthLayout;
