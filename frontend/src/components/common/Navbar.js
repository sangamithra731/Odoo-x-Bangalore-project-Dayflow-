import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';  // ✅ CORRECT - from ThemeContext
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Tooltip,
  Divider,
  Badge,
} from '@mui/material';  // ✅ Removed useTheme from here
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  CalendarMonth as CalendarIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { toggleSidebar } = useTheme();  // ✅ Get toggleSidebar from ThemeContext
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifAnchor, setNotifAnchor] = React.useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleNotifOpen = (event) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const handleLogout = () => {
    logout();
    navigate('/signin');
    handleClose();
  };

  if (!isAuthenticated) {
    return (
      <AppBar position="fixed" sx={{ bgcolor: '#1a237e', zIndex: 1201, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.5px' }}>
            🏢 Dayflow HRMS
          </Typography>
          <Button color="inherit" onClick={() => navigate('/signin')} sx={{ fontWeight: 600 }}>
            Sign In
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/signup')}
            sx={{ ml: 2, fontWeight: 600 }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  const navItems = isAdmin ? [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { label: 'Attendance', icon: <CalendarIcon />, path: '/attendance' },
    { label: 'Leaves', icon: <DescriptionIcon />, path: '/leaves/approvals' },
    { label: 'Payroll', icon: <DescriptionIcon />, path: '/admin/payroll' },
    { label: 'Reports', icon: <DescriptionIcon />, path: '/reports' },
  ] : [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Attendance', icon: <CalendarIcon />, path: '/attendance' },
    { label: 'Leaves', icon: <DescriptionIcon />, path: '/leaves/history' },
    { label: 'Payroll', icon: <DescriptionIcon />, path: '/payroll' },
  ];

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#1a237e', zIndex: 1201, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
          onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dashboard')}
        >
          🏢 Dayflow HRMS
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{
                fontWeight: location.pathname === item.path ? 700 : 500,
                borderBottom: location.pathname === item.path ? '3px solid #4fc3f7' : '3px solid transparent',
                borderRadius: 0,
                px: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              {item.label}
            </Button>
          ))}

          {isAdmin && (
            <Tooltip title="Admin Panel">
              <IconButton color="inherit" onClick={() => navigate('/admin/dashboard')}>
                <AdminIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotifOpen}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar sx={{ bgcolor: '#4fc3f7', width: 38, height: 38, fontWeight: 700 }}>
                {user?.employeeId?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          sx={{ mt: 1 }}
        >
          <Box sx={{ px: 3, py: 2, minWidth: 220 }}>
            <Typography variant="subtitle1" fontWeight={700}>{user?.email}</Typography>
            <Typography variant="caption" color="textSecondary">
              {isAdmin ? '🛡️ Admin' : '👤 Employee'} • {user?.employeeId}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
            <PersonIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/profile/edit'); handleClose(); }}>
            <SettingsIcon sx={{ mr: 1 }} /> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={handleNotifClose}
          sx={{ mt: 1 }}
        >
          <Box sx={{ px: 3, py: 2, minWidth: 300 }}>
            <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
          </Box>
          <Divider />
          <MenuItem>📋 3 pending leave requests</MenuItem>
          <MenuItem>⏰ Attendance reminder</MenuItem>
          <MenuItem>💰 Payroll processed</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;