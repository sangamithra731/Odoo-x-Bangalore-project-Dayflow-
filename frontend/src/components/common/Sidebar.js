import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  Tooltip,
  useMediaQuery,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  CheckCircle as CheckIcon,
  Email as EmailIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const SIDEBAR_WIDTH = 240;

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { themeMode, toggleTheme, toggleSidebar } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Attendance', icon: <CalendarIcon />, path: '/attendance' },
    { text: 'Leave History', icon: <AssignmentIcon />, path: '/leaves/history' },
    { text: 'Apply Leave', icon: <CheckIcon />, path: '/leaves/apply' },
    { text: 'Payroll', icon: <MoneyIcon />, path: '/payroll' },
    { text: 'Email', icon: <EmailIcon />, path: '/email' },
    { text: 'Predictions', icon: <TrendingUpIcon />, path: '/predictions' },
  ];

  const adminItems = [
    { text: 'Admin Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Leave Approvals', icon: <AssignmentIcon />, path: '/leaves/approvals' },
    { text: 'All Employees', icon: <PeopleIcon />, path: '/admin/employees' },
    { text: 'Admin Payroll', icon: <MoneyIcon />, path: '/admin/payroll' },
    { text: 'Reports', icon: <TrendingUpIcon />, path: '/reports' },
  ];

  const allItems = isAdmin ? [...menuItems, ...adminItems] : menuItems;

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      pt: '64px', // Add padding top to account for navbar
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            {user?.employeeId?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {user?.employeeId || 'User'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {isAdmin ? '🛡️ Admin' : '👤 Employee'}
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Collapse Sidebar">
          <IconButton onClick={toggleSidebar} size="small">
            <MenuOpenIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: 2, px: 1 }}>
        {allItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              py: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '& .MuiListItemIcon-root': { color: 'white' },
              },
              '&:hover': {
                bgcolor: 'rgba(37,99,235,0.06)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'white' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontSize: '0.9rem',
                fontWeight: location.pathname === item.path ? 600 : 400,
              }} 
            />
          </ListItem>
        ))}
      </List>

      {/* Bottom Actions */}
      <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', p: 2 }}>
        <ListItem
          button
          onClick={toggleTheme}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          <ListItemText 
            primary={themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </ListItem>
        <ListItem
          button
          onClick={() => navigate('/settings')}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Settings"
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  // Don't render sidebar on auth pages
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      {!open && !isAuthPage && (
        <Fab
          size="medium"
          color="primary"
          aria-label="open sidebar"
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            top: 80,
            left: 16,
            zIndex: 1200,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <MenuIcon />
        </Fab>
      )}

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={isMobile ? toggleSidebar : undefined}
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            bgcolor: 'background.paper',
            overflowX: 'hidden',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1100,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;