import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  ListItemButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAppSelector } from '../../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      color: 'primary.main',
    },
  });

  const dashboardItems = [
    {
      title: 'Products',
      description: 'Manage products, categories, and inventory',
      path: '/admin/products',
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      path: '/admin/orders',
    },
    {
      title: 'Users',
      description: 'Manage user accounts and permissions',
      path: '/admin/users',
    },
    {
      title: 'Analytics',
      description: 'View sales and performance metrics',
      path: '/admin/analytics',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Welcome, {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your e-commerce platform from here
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                {dashboardItems.map((item, index) => (
                  <React.Fragment key={item.title}>
                    <ListItemButton
                      component={Link}
                      href={item.path}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.title}
                        secondary={item.description}
                      />
                    </ListItemButton>
                    {index < dashboardItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
