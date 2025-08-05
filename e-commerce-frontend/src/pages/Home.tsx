import React, { FC } from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: FC = () => {
  const navigate = useNavigate();

  const handleViewProducts = (): void => {
    navigate('/products');
  };

  return (
    <Box sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to Our E-Commerce Store
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
              Discover amazing products and enjoy seamless shopping experience.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleViewProducts}
              sx={{ mt: 2 }}
            >
              View Products
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
