import React, { useState } from 'react';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
  Divider,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAppSelector } from '../../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import CircularProgress from '@mui/material/CircularProgress';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  paymentMethod: string;
}

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  street: yup.string().required('Street is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('Zip code is required'),
  country: yup.string().required('Country is required'),
  phone: yup.string().required('Phone is required'),
  paymentMethod: yup.string().required('Payment method is required'),
});

const CheckoutPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { items, totalPrice, discountedTotal } = useAppSelector(
    (state) => state.cart
  );

  const methods = useForm<CheckoutFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      paymentMethod: 'credit-card',
    },
  });

  const handleNext = async () => {
    if (activeStep === 0) {
      try {
        await methods.trigger();
        setActiveStep(activeStep + 1);
      } catch (err) {
        setError('Please fill in all required fields');
      }
    } else if (activeStep === 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Place order
      setLoading(true);
      try {
        // TODO: Implement order placement API call
        navigate('/order-confirmation');
      } catch (err) {
        setError('Failed to place order');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    methods.reset();
  };

  if (items.length === 0) {
    return (
      <Container>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid xs={12} >
        <Grid xs={12} md={8}>
          {activeStep === 0 && (
            <Box component="form" onSubmit={methods.handleSubmit(handleNext)}>
              <Grid xs={12}>
                <Grid xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    {...methods.register('firstName')}
                    error={!!methods.formState.errors.firstName}
                    helperText={methods.formState.errors.firstName?.message}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    {...methods.register('lastName')}
                    error={!!methods.formState.errors.lastName}
                    helperText={methods.formState.errors.lastName?.message}
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Street Address"
                    {...methods.register('street')}
                    error={!!methods.formState.errors.street}
                    helperText={methods.formState.errors.street?.message}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    {...methods.register('city')}
                    error={!!methods.formState.errors.city}
                    helperText={methods.formState.errors.city?.message}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="State/Province"
                    {...methods.register('state')}
                    error={!!methods.formState.errors.state}
                    helperText={methods.formState.errors.state?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    {...methods.register('zipCode')}
                    error={!!methods.formState.errors.zipCode}
                    helperText={methods.formState.errors.zipCode?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    {...methods.register('country')}
                    error={!!methods.formState.errors.country}
                    helperText={methods.formState.errors.country?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...methods.register('phone')}
                    error={!!methods.formState.errors.phone}
                    helperText={methods.formState.errors.phone?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Next'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Method
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    fullWidth
                    variant={methods.watch('paymentMethod') === 'credit-card' ? 'contained' : 'outlined'}
                    onClick={() => methods.setValue('paymentMethod', 'credit-card')}
                    startIcon={<CreditCardIcon />}
                  >
                    Credit Card
                  </Button>
                  <Button
                    fullWidth
                    variant={methods.watch('paymentMethod') === 'paypal' ? 'contained' : 'outlined'}
                    onClick={() => methods.setValue('paymentMethod', 'paypal')}
                    startIcon={<PaymentIcon />}
                  >
                    PayPal
                  </Button>
                  <Button
                    fullWidth
                    variant={methods.watch('paymentMethod') === 'bank-transfer' ? 'contained' : 'outlined'}
                    onClick={() => methods.setValue('paymentMethod', 'bank-transfer')}
                    startIcon={<AccountBalanceIcon/>}
                  >
                    Bank Transfer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                {items.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{item.name}</Typography>
                    <Typography>${item.price.toFixed(2)}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="subtitle1">Subtotal:</Typography>
                  <Typography variant="h6" color="primary">
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1">Discount:</Typography>
                  <Typography variant="h6" color="primary">
                    ${totalPrice - discountedTotal}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${discountedTotal}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/cart')}
                disabled={activeStep === 0}
              >
                Edit Cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleReset}
          sx={{ ml: 1 }}
        >
          Reset
        </Button>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
