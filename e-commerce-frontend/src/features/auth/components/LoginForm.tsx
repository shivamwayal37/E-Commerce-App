import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, TextField, Typography, Link, Alert, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { login, clearError } from '../../../store/authSlice';
import type { RootState } from '../../../store';
import { LoginCredentials } from '../../../types/auth';
import AuthPageLayout from '../../../components/auth/AuthPageLayout';

const validationSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state: RootState) => state.auth);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginCredentials>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      const result = await dispatch(login(data));
      if (login.fulfilled.match(result)) {
        navigate('/');
      }
    } catch (err) {
      // Error is handled by the auth slice and displayed in the UI
      console.error('Login error:', err);
    }
  };

  return (
    <AuthPageLayout title="Sign In">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isLoading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Link href="#" variant="body2" onClick={(e) => e.preventDefault()}>
            Forgot password?
          </Link>
          <Link href="/auth/register" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
    </AuthPageLayout>
  );
};

export default LoginForm;
