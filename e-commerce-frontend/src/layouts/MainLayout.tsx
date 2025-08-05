import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              E-Commerce
            </RouterLink>
          </Typography>
          <Button color="inherit" onClick={() => handleNavigate('/products')}>
            Products
          </Button>
          {isAuthenticated ? (
            <>
              <IconButton color="inherit" onClick={() => handleNavigate('/cart')}>
                <ShoppingCartIcon />
              </IconButton>
              <IconButton color="inherit" onClick={() => handleNavigate('/profile')}>
                <PersonIcon />
              </IconButton>
            </>
          ) : (
            <Button color="inherit" onClick={() => handleNavigate('/login')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
