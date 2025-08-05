import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Tab,
  Tabs,
  TextField,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Favorite as WishlistIcon,
  FavoriteBorder as WishlistBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as BackIcon,
  AddPhotoAlternate as AddPhotoIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addToCart } from '../../../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../../store/wishlistSlice';
import { fetchProduct } from '../../../store/productSlice';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ReviewFormValues } from '../../../types/review';
import { fetchReviews, addReview } from '../../../store/reviewSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const product = useAppSelector((state) => state.products.selectedProduct);
  const isInWishlist = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === id)
  );
  const { reviews, averageRating, reviewCount } = useAppSelector((state) => state.reviews);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [wishlistOpen, setWishlistOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);

  const reviewSchema = yup.object<ReviewFormValues>().shape({
    rating: yup.number().required('Rating is required').min(1).max(5),
    comment: yup.string().required('Comment is required'),
    images: yup.mixed<FileList>()
      .test('fileArray', 'Invalid file array', (value) => {
        if (!value) return true;
        return value instanceof FileList;
      })
      .nullable()
      .optional(),
  });

  const methods = useForm<ReviewFormValues>({
    resolver: yupResolver(reviewSchema as any),
  });

  const handleAddReview = async () => {
    try {
      if (!product) return;
      
      const formData = methods.getValues();
      const reviewData: ReviewFormValues = {
        rating: formData.rating,
        comment: formData.comment,
        images: formData.images
      };

      await dispatch(addReview({ productId: product.id, review: reviewData })).unwrap();
      setReviewOpen(false);
      dispatch(fetchReviews(product.id));
    } catch (err) {
      console.error('Error adding review:', err);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
      dispatch(fetchReviews(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          image: product.images[0],
          quantity: quantity,
        })
      );
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          image: product.images[0],
        })
      );
    }
  };

  const handleRemoveFromWishlist = () => {
    if (id) {
      dispatch(removeFromWishlist(id));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(100, Number(e.target.value)));
    setQuantity(value);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Box sx={{ position: 'relative', height: 500 }}>
            <CardMedia
              component="img"
              height="100%"
              image={product.images[0]}
              alt={product.name}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                p: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  {product.discount}% off
                </Typography>
              </Box>
              <Rating value={averageRating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({reviewCount} reviews)
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Category:
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.category}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Brand:
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.brand}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Stock:
              </Typography>
              <Typography
                variant="body1"
                color={product.stock > 0 ? 'success.main' : 'error.main'}
              >
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Quantity:
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                size="small"
                sx={{ maxWidth: 100 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
              <IconButton
                color={isInWishlist ? 'error' : 'default'}
                onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
              >
                <FavoriteIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Description" />
          <Tab label="Reviews" />
          <Tab label="Shipping Info" />
          <Tab label="Return Policy" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography paragraph>{product.description}</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setReviewOpen(true)}
              startIcon={<AddPhotoIcon />}
            >
              Write a Review
            </Button>
          </Box>
          <Box>
            {reviews.map((review) => (
              <Card key={review.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ mr: 1 }}>
                      {review.userName}
                    </Typography>
                    <Rating value={review.rating} precision={0.5} readOnly />
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {review.comment}
                  </Typography>
                  {review.images && review.images.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt="review"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      ))}
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography paragraph>
            Free shipping on orders over $50
          </Typography>
          <Typography paragraph>
            Estimated delivery: 3-5 business days
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography paragraph>
            30-day return policy
          </Typography>
          <Typography paragraph>
            Items must be in original condition
          </Typography>
        </TabPanel>
      </Box>

      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <form onSubmit={methods.handleSubmit(handleAddReview)}>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Rating</InputLabel>
                <Select
                  {...methods.register('rating')}
                  label="Rating"
                  error={!!methods.formState.errors.rating}
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <MenuItem key={rating} value={rating}>
                      {rating} stars
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!!methods.formState.errors.rating}>
                  {methods.formState.errors.rating?.message}
                </FormHelperText>
              </FormControl>

              <TextField
                {...methods.register('comment')}
                label="Your Review"
                multiline
                rows={4}
                fullWidth
                error={!!methods.formState.errors.comment}
                helperText={methods.formState.errors.comment?.message}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="review-images"
                  multiple
                  type="file"
                  onChange={(e) => methods.setValue('images', e.target.files || undefined)}
                />
                <label htmlFor="review-images">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<AddPhotoIcon />}
                  >
                    Add Photos
                  </Button>
                </label>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Submit Review
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ProductDetailsPage;
