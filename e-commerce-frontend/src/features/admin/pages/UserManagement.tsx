import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchUsers, updateUser, deleteUser } from '../../../store/userSlice';
import type { User } from '../../../types/user';
import type { RootState } from '../../../store';

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state: RootState) => state.users);
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [formValues, setFormValues] = React.useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    status: 'active' as 'active' | 'inactive',
  });
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleOpen = (user: User) => {
    setSelectedUser(user);
    setFormValues({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      status: user.status || 'active',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setFormValues({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        await dispatch(
          updateUser({
            userId: selectedUser.id,
            user: formValues,
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

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(userId)).unwrap();
    }
  };

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LockIcon />}
                        onClick={() =>
                          handleOpen({ ...user, status: 'inactive' })
                        }
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<LockOpenIcon />}
                        onClick={() =>
                          handleOpen({ ...user, status: 'active' })
                        }
                      >
                        Activate
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
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
            />
            <TextField
              fullWidth
              label="Email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({ ...formValues, email: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Role"
              value={formValues.role}
              onChange={(e) =>
                setFormValues({ ...formValues, role: e.target.value as 'user' | 'admin' })
              }
              margin="normal"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Status"
              value={formValues.status}
              onChange={(e) =>
                setFormValues({ ...formValues, status: e.target.value as 'active' | 'inactive' })
              }
              margin="normal"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
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

export default UserManagement;
