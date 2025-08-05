import React from 'react';
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Typography,
  Alert,
  Box,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProducts, updateOrders, updateUserStatus } from '../store/adminSlice';
import type { RootState } from '../store';

interface BulkActionsProps {
  selectedItems: string[];
  onClearSelection: () => void;
  entityType: 'products' | 'orders' | 'users';
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  onClearSelection,
  entityType,
}) => {
  const dispatch = useAppDispatch();
  const [action, setAction] = React.useState<string>('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAction = async () => {
    if (!action || !selectedItems.length) return;

    setLoading(true);
    setError(null);

    try {
      switch (entityType) {
        case 'products':
          await dispatch(
            updateProducts({ ids: selectedItems, action })
          ).unwrap();
          break;
        case 'orders':
          await dispatch(
            updateOrders({ ids: selectedItems, action })
          ).unwrap();
          break;
        case 'users':
          await dispatch(
            updateUserStatus({ ids: selectedItems, action })
          ).unwrap();
          break;
      }
      onClearSelection();
      setOpen(false);
    } catch (err) {
      setError('Failed to perform bulk action');
      console.error('Bulk action failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const availableActions = () => {
    switch (entityType) {
      case 'products':
        return [
          { value: 'activate', label: 'Activate' },
          { value: 'deactivate', label: 'Deactivate' },
          { value: 'delete', label: 'Delete' },
        ];
      case 'orders':
        return [
          { value: 'cancel', label: 'Cancel Orders' },
          { value: 'ship', label: 'Mark as Shipped' },
          { value: 'deliver', label: 'Mark as Delivered' },
        ];
      case 'users':
        return [
          { value: 'activate', label: 'Activate Users' },
          { value: 'deactivate', label: 'Deactivate Users' },
          { value: 'delete', label: 'Delete Users' },
        ];
    }
  };

  return (
    <Box>
      {selectedItems.length > 0 && (
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          Bulk Actions ({selectedItems.length})
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Bulk Actions</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              label="Action"
              disabled={loading}
            >
              {availableActions().map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAction}
            variant="contained"
            disabled={loading || !action}
          >
            {loading ? <CircularProgress size={20} /> : 'Apply'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkActions;
