import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { removeFromWishlist, clearWishlist } from '../../../store/wishlistSlice';
import { addToCart } from '../../../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { WishlistItem } from '../../../types/wishlist';

const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, error } = useAppSelector((state) => state.wishlist);

  const handleRemove = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (item: WishlistItem) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.id));
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Wishlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {items.length} items in your wishlist
        </Typography>
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">Your wishlist is empty</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item: WishlistItem) => (
            <Grid xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ textDecoration: 'line-through', mr: 1 }}
                    >
                      ${item.price.toFixed(2)}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${item.price * (1 - item.discount / 100)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleRemove(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleClearWishlist}
        >
          Clear Wishlist
        </Button>
      </Box>
    </Container>
  );
};

export default WishlistPage;
