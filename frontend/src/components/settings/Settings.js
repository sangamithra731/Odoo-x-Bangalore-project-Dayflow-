import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  Avatar,
  Chip,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as AttachMoneyIcon,
  SystemUpdate as SystemUpdateIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');

  // Profile Settings State
  const [profile, setProfile] = useState({
    firstName: user?.profile?.firstName || 'John',
    lastName: user?.profile?.lastName || 'Doe',
    email: user?.email || 'admin@hrms.com',
    phone: '+1 234 567 8900',
    department: 'Human Resources',
    jobTitle: 'HR Manager',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    leaveReminders: true,
    attendanceAlerts: true,
    payrollUpdates: true,
    systemUpdates: true,
    marketingEmails: false,
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordLastChanged: '2024-01-15',
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: themeMode,
    fontSize: 'medium',
    denseLayout: false,
    animations: true,
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleSecurityChange = (e) => {
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  const handleAppearanceChange = (e) => {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAppearance({ ...appearance, [name]: value });
  };

  const handleSave = () => {
    toast.success('✅ Settings saved successfully!');
  };

  const handlePasswordReset = () => {
    toast.info('📧 Password reset link sent to your email');
    setDialogOpen(false);
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion request submitted');
    setDialogOpen(false);
  };

  const openDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)', 
        color: 'white' 
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              ⚙️ Settings
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
              Manage your account preferences and application settings
            </Typography>
          </Box>
          <Chip 
            label="v2.4.0" 
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Sidebar Navigation */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 3, position: 'sticky', top: 80 }}>
            <List component="nav">
              <ListItem 
                button 
                selected={activeTab === 0}
                onClick={() => setActiveTab(0)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem 
                button 
                selected={activeTab === 1}
                onClick={() => setActiveTab(1)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon><NotificationsIcon /></ListItemIcon>
                <ListItemText primary="Notifications" />
                <Chip label="5" size="small" color="primary" />
              </ListItem>
              <ListItem 
                button 
                selected={activeTab === 2}
                onClick={() => setActiveTab(2)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon><SecurityIcon /></ListItemIcon>
                <ListItemText primary="Security" />
              </ListItem>
              <ListItem 
                button 
                selected={activeTab === 3}
                onClick={() => setActiveTab(3)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon><PaletteIcon /></ListItemIcon>
                <ListItemText primary="Appearance" />
              </ListItem>
              <ListItem 
                button 
                selected={activeTab === 4}
                onClick={() => setActiveTab(4)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon><LanguageIcon /></ListItemIcon>
                <ListItemText primary="Language" />
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ borderRadius: 2 }}
            >
              Save All Changes
            </Button>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Tab 1: Profile */}
          {activeTab === 0 && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Profile Settings
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                  {user?.employeeId?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Button variant="outlined" size="small" component="label">
                    Change Photo
                    <input type="file" hidden accept="image/*" />
                  </Button>
                  <Typography variant="caption" display="block" color="textSecondary">
                    JPG, PNG or GIF. Max 2MB
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={profile.department}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    name="jobTitle"
                    value={profile.jobTitle}
                    onChange={handleProfileChange}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                  Save Profile
                </Button>
                <Button variant="outlined" onClick={() => navigate('/profile')}>
                  View Full Profile
                </Button>
              </Box>
            </Paper>
          )}

          {/* Tab 2: Notifications */}
          {activeTab === 1 && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Notification Preferences
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive notifications via email" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      name="emailNotifications"
                      checked={notifications.emailNotifications}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><NotificationsIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Leave Reminders" 
                    secondary="Get reminders about pending leave requests" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      name="leaveReminders"
                      checked={notifications.leaveReminders}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><CalendarIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Attendance Alerts" 
                    secondary="Alerts for missed check-ins" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      name="attendanceAlerts"
                      checked={notifications.attendanceAlerts}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Payroll Updates" 
                    secondary="Notifications about salary processing" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      name="payrollUpdates"
                      checked={notifications.payrollUpdates}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><SystemUpdateIcon /></ListItemIcon>
                  <ListItemText 
                    primary="System Updates" 
                    secondary="New features and improvements" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      name="systemUpdates"
                      checked={notifications.systemUpdates}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          )}

          {/* Tab 3: Security */}
          {activeTab === 2 && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Security Settings
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                🔒 Your account is secure. Last password change: {security.passwordLastChanged}
              </Alert>

              <List>
                <ListItem>
                  <ListItemIcon><LockIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Two-Factor Authentication" 
                    secondary="Add an extra layer of security" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      name="twoFactorAuth"
                      checked={security.twoFactorAuth}
                      onChange={(e) => setSecurity({ ...security, twoFactorAuth: e.target.checked })}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><LockIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Session Timeout" 
                    secondary="Auto logout after inactivity" 
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        name="sessionTimeout"
                        value={security.sessionTimeout}
                        onChange={handleSecurityChange}
                      >
                        <MenuItem value="15">15 minutes</MenuItem>
                        <MenuItem value="30">30 minutes</MenuItem>
                        <MenuItem value="60">1 hour</MenuItem>
                        <MenuItem value="120">2 hours</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="warning" 
                  onClick={() => openDialog('password')}
                  startIcon={<LockIcon />}
                >
                  Change Password
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => openDialog('delete')}
                  startIcon={<DeleteIcon />}
                >
                  Delete Account
                </Button>
              </Box>
            </Paper>
          )}

          {/* Tab 4: Appearance */}
          {activeTab === 3 && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Appearance Settings
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    {themeMode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dark Mode" 
                    secondary={themeMode === 'light' ? 'Light theme active' : 'Dark theme active'} 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={themeMode === 'dark'}
                      onChange={toggleTheme}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><Typography fontSize="small">Aa</Typography></ListItemIcon>
                  <ListItemText 
                    primary="Font Size" 
                    secondary="Adjust text size" 
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        name="fontSize"
                        value={appearance.fontSize}
                        onChange={handleAppearanceChange}
                      >
                        <MenuItem value="small">Small</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="large">Large</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><Typography fontSize="small">📐</Typography></ListItemIcon>
                  <ListItemText 
                    primary="Compact Layout" 
                    secondary="Reduce spacing and padding" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      name="denseLayout"
                      checked={appearance.denseLayout}
                      onChange={handleAppearanceChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><Typography fontSize="small">🎬</Typography></ListItemIcon>
                  <ListItemText 
                    primary="Animations" 
                    secondary="Enable smooth transitions" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      name="animations"
                      checked={appearance.animations}
                      onChange={handleAppearanceChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          )}

          {/* Tab 5: Language */}
          {activeTab === 4 && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Language Preferences
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Interface Language</InputLabel>
                <Select value="en" label="Interface Language">
                  <MenuItem value="en">🇺🇸 English</MenuItem>
                  <MenuItem value="es">🇪🇸 Spanish</MenuItem>
                  <MenuItem value="fr">🇫🇷 French</MenuItem>
                  <MenuItem value="de">🇩🇪 German</MenuItem>
                  <MenuItem value="hi">🇮🇳 Hindi</MenuItem>
                </Select>
              </FormControl>

              <Alert severity="info">
                🌐 Language support is coming soon. Currently only English is available.
              </Alert>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        {dialogType === 'password' && (
          <>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Current Password"
                type="password"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="New Password"
                type="password"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Confirm New Password"
                type="password"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handlePasswordReset} variant="contained" color="primary">
                Update Password
              </Button>
            </DialogActions>
          </>
        )}
        {dialogType === 'delete' && (
          <>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogContent>
              <Alert severity="error" sx={{ mb: 2 }}>
                ⚠️ This action cannot be undone. All your data will be permanently deleted.
              </Alert>
              <TextField
                autoFocus
                margin="dense"
                label="Type 'DELETE' to confirm"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteAccount} variant="contained" color="error">
                Delete Account
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Settings;