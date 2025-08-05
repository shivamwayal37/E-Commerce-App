import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/authSlice';
import { useAppDispatch } from '../../../store/hooks';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" gutterBottom>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Name:</Typography>
                <Typography>{user.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Email:</Typography>
                <Typography>{user.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Role:</Typography>
                <Typography>{user.role}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
                fullWidth
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
