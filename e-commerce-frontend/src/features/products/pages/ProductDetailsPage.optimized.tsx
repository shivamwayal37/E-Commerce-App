import React, { memo, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Rating,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchProduct } from '../../../store/productSlice';
import { addToCart } from '../../../store/cartSlice';
import { addToWishlist } from '../../../store/wishlistSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useParams } from 'react-router-dom';
import { Product } from '../../../types/product';
import { useInView } from 'react-intersection-observer';

interface ProductImageProps {
  src: string;
  alt: string;
}

const ProductImage = memo(({ src, alt }: ProductImageProps) => (
  <img
    src={src}
    alt={alt}
    style={{
      width: '100%',
      height: 'auto',
      borderRadius: '4px',
      objectFit: 'cover',
    }}
    loading="lazy"
    decoding="async"
  />
));

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = memo(({ product }: ProductDetailsProps) => {
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const handleAddToCart = useCallback(() => {
    dispatch(addToCart(product.id));
  }, [dispatch, product.id]);

  const handleAddToWishlist = useCallback(() => {
    dispatch(addToWishlist(product.id));
  }, [dispatch, product.id]);

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={6}>
        <ProductImage src={product.images[0]} alt={product.name} />
      </Grid>
      <Grid xs={12} md={6}>
        <Typography variant="h4" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          ${product.price.toFixed(2)}
        </Typography>
        <Rating value={product.rating} readOnly />
        <Typography variant="body1" gutterBottom>
          {product.description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          sx={{ mr: 2 }}
        >
          Add to Cart
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleAddToWishlist}
        >
          Add to Wishlist
        </Button>
      </Grid>
    </Grid>
  );
});

const ProductDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { selectedProduct, isLoading, error } = useAppSelector((state) => state.products);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  React.useEffect(() => {
    if (inView && id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id, inView]);

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container ref={ref} maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {selectedProduct && <ProductDetails product={selectedProduct} />}
    </Container>
  );
};

export default memo(ProductDetailsPage);
