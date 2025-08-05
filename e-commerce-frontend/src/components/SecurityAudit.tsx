import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSecurityAudit } from '../store/securitySlice';
import type { RootState } from '../store';
import { SecurityCheck } from '../types/security';

const SecurityAudit: React.FC = () => {
  const dispatch = useAppDispatch();
  const { checks, loading, error } = useAppSelector((state: RootState) => state.security);

  React.useEffect(() => {
    dispatch(fetchSecurityAudit());
  }, [dispatch]);

  const getStatusIcon = (check: SecurityCheck) => {
    switch (check.status) {
      case 'pass':
        return <CheckCircleIcon color="success" />;
      case 'fail':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (check: SecurityCheck) => {
    switch (check.status) {
      case 'pass':
        return 'success.main';
      case 'fail':
        return 'error.main';
      case 'warning':
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Security Audit
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper>
          <List>
            {checks.map((check: SecurityCheck) => (
              <ListItem key={check.id}>
                <ListItemIcon>{getStatusIcon(check)}</ListItemIcon>
                <ListItemText
                  primary={check.checkName}
                  secondary={check.description}
                />
                <Chip
                  label={check.status.toUpperCase()}
                  color={
                    check.status === 'pass' ? 'success' :
                    check.status === 'fail' ? 'error' :
                    'warning'
                  }
                />
                <Typography variant="caption" color="textSecondary">
                  Last checked: {check.lastChecked}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SecurityAudit;
