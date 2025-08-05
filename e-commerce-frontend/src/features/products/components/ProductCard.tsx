import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addToCart } from '../../../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../../store/wishlistSlice';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discount: number;
    images: string[];
    rating: number;
    reviews: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const isInWishlist = useAppSelector((state) =>
    state.wishlist.items.some((item: { id: string }) => item.id === product.id)
  );

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.images[0],
      quantity: 1,
    }));
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.images[0],
    }));
  };

  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <Card sx={{ maxWidth: 345, height: '100%' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.images[0]}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            color="primary"
            sx={{ textDecoration: 'line-through', mr: 1 }}
          >
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="h6" color="primary">
            ${discountedPrice.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={product.rating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <IconButton
            color={isInWishlist ? 'error' : 'default'}
            onClick={handleAddToWishlist}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
