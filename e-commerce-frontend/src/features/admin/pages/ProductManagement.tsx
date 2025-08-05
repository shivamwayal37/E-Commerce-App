import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  GridProps,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../../store/productSlice';
import { Product } from '../../../types/product';

// Fix 1: Create a proper type for form values
interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: string;
  brand: string;
}

const ProductManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading, error } = useAppSelector((state) => state.products);
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [formValues, setFormValues] = React.useState<ProductFormValues>({
    name: '',
    description: '',
    price: 0,
    discount: 0,
    stock: 0,
    category: '',
    brand: '',
  });
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleOpen = (product?: Product) => {
    if (product) {
      setFormValues({
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
      });
      setSelectedProduct(product);
    } else {
      setFormValues({
        name: '',
        description: '',
        price: 0,
        discount: 0,
        stock: 0,
        category: '',
        brand: '',
      });
      setSelectedProduct(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedProduct) {
        await dispatch(
          updateProduct({
            id: selectedProduct.id,
            data: formValues
          })
        ).unwrap();
      } else {
        await dispatch(
          createProduct({
            ...formValues,
            images: [],
            rating: 0,
            reviews: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        ).unwrap();
      }
      handleClose();
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message);
      }
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  React.useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // Fix 3: Handle number inputs properly
  const handleNumberChange = (field: keyof Pick<ProductFormValues, 'price' | 'discount' | 'stock'>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setFormValues({ ...formValues, [field]: value });
    };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography variant="h4" gutterBottom>
            Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ mb: 2 }}
          >
            Add Product
          </Button>
        </Grid>

        <Grid xs={12}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Card>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Chip
                            label={product.stock > 0 ? 'active' : 'out of stock'}
                            color={product.stock > 0 ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpen(product)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(product.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formValues.name}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formValues.description}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formValues.price}
              onChange={handleNumberChange('price')}
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Discount (%)"
              type="number"
              value={formValues.discount}
              onChange={handleNumberChange('discount')}
              margin="normal"
              inputProps={{ min: 0, max: 100 }}
            />
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={formValues.stock}
              onChange={handleNumberChange('stock')}
              margin="normal"
              required
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              label="Category"
              value={formValues.category}
              onChange={(e) =>
                setFormValues({ ...formValues, category: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Brand"
              value={formValues.brand}
              onChange={(e) =>
                setFormValues({ ...formValues, brand: e.target.value })
              }
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductManagement;