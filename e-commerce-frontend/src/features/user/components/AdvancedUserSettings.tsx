import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateProfile, updatePreferences, updateSecuritySettings } from '../../../store/userSlice';
import { useTheme } from '@mui/material/styles';
import { UserPreferences, UserSecuritySettings } from '../../../types/user';

interface AdvancedUserSettingsProps {
  onClose: () => void;
}

const AdvancedUserSettings: React.FC<AdvancedUserSettingsProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { selectedUser, loading, error: stateError } = useAppSelector((state) => state.users);
  const theme = useTheme();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        showEmail: true,
        showPhoneNumber: true,
      },
    },
    security: {
      twoFactorAuth: false,
      passwordLastChanged: new Date(),
      lastLogin: new Date(),
      failedLoginAttempts: 0,
    },
  });

  const handleSubmit = async () => {
    try {
      if (!selectedUser?.id) return;
      await Promise.all([
        dispatch(updatePreferences({ userId: selectedUser.id, preferences: formData.preferences })).unwrap(),
        dispatch(updateSecuritySettings({ userId: selectedUser.id, security: formData.security })).unwrap(),
      ]);
      onClose();
    } catch (err) {
      console.error('Failed to update settings:', err);
      setFormError('Failed to update settings. Please try again.');
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md">
      <DialogTitle>Advanced User Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Paper>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      E
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive notifications via email"
                  />
                  <Switch
                    checked={formData.preferences.notifications.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          notifications: {
                            ...formData.preferences.notifications,
                            email: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                      S
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="SMS Notifications"
                    secondary="Receive notifications via SMS"
                  />
                  <Switch
                    checked={formData.preferences.notifications.sms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          notifications: {
                            ...formData.preferences.notifications,
                            sms: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                      P
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive notifications on your device"
                  />
                  <Switch 
                    checked={formData.preferences.notifications.push}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          notifications: {
                            ...formData.preferences.notifications,
                            push: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid xs={12}>
            <Typography variant="h6" gutterBottom>
              Privacy Settings
            </Typography>
            <Paper>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                      O
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Show Online Status"
                    secondary="Display your online status to other users"
                  />
                  <Switch
                    checked={formData.preferences.privacy.showEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          privacy: {
                            ...formData.preferences.privacy,
                            showEmail: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                      C
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Allow Contact"
                    secondary="Allow other users to contact you"
                  />
                  <Switch
                    checked={formData.preferences.privacy.showPhoneNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          privacy: {
                            ...formData.preferences.privacy,
                            showPhoneNumber: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                      H
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Share Purchase History"
                    secondary="Share your purchase history with other users"
                  />
                  <Switch
                    checked={formData.security.twoFactorAuth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          twoFactorAuth: e.target.checked,
                        },
                      })
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid xs={12}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Paper>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      2FA
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Enable additional security layer"
                  />
                  <Switch
                    checked={formData.security.twoFactorAuth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          twoFactorAuth: e.target.checked,
                        },
                      })
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                      PR
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Password Reset"
                    secondary="Request password reset"
                  />
                  <Switch
                    checked={formData.security.passwordLastChanged !== null}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          passwordLastChanged: e.target.checked ? new Date() : new Date('1970-01-01'),
                        },
                      })
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                      SM
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Session Management"
                    secondary="Manage active sessions"
                  />
                  <Switch
                    checked={formData.security.failedLoginAttempts > 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          failedLoginAttempts: e.target.checked ? 1 : 0,
                        },
                      })
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {formError && <Alert severity="error">{formError}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {loading ? <CircularProgress size={20} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvancedUserSettings;
