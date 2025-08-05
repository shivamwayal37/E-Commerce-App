import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { exportService } from '../services/exportService';

interface ExportProps {
  entityType: 'products' | 'orders' | 'users';
}

const Export: React.FC<ExportProps> = ({ entityType }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [format, setFormat] = React.useState<string>('csv');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const availableFormats = [
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel' },
    { value: 'pdf', label: 'PDF' },
  ];

  const handleExport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await exportService.exportData({
        entityType,
        format,
      });

      const blob = new Blob([response.data], {
        type: 'application/octet-stream',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);

      setOpen(false);
    } catch (err) {
      setError('Failed to export data');
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Export
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Format</InputLabel>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              label="Format"
              disabled={loading}
            >
              {availableFormats.map((option) => (
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
            onClick={handleExport}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Export;
