import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Box, 
  Button, 
  TextField, 
  Alert, 
  Link, 
  CircularProgress
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { register as registerUser } from '../../../store/authSlice';
import type { RootState, AppDispatch } from '../../../store';
import { RegisterCredentials } from '../../../types/auth';
import AuthPageLayout from '../../../components/auth/AuthPageLayout';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state: RootState) => state.auth);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });
  
  // Helper function to register form fields with proper typing
  const registerField = (name: 'name' | 'email' | 'password' | 'confirmPassword') => ({
    ...register(name),
    error: !!errors[name],
    helperText: errors[name]?.message as string | undefined,
  });

  const onSubmit = async (formData: FieldValues) => {
    try {
      const userData = {
        name: formData.name as string,
        email: formData.email as string,
        password: formData.password as string,
        confirmPassword: formData.confirmPassword as string,
      } as const;
      
      await (dispatch as AppDispatch)(registerUser(userData));
      navigate('/auth/login');
    } catch (err) {
      // Error is already handled by the auth slice
    }
  };

  return (
    <AuthPageLayout title="Create an account">
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
          id="name"
          label="Full Name"
          autoComplete="name"
          autoFocus
          {...registerField('name')}
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          {...registerField('email')}
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          {...registerField('password')}
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          {...registerField('confirmPassword')}
          disabled={isLoading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/auth/login" variant="body2">
            Already have an account? Sign In
          </Link>
        </Box>
      </Box>
    </AuthPageLayout>
  );
};

export default RegisterForm;
