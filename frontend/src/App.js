import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ViewProfile from './components/profile/ViewProfile';
import EditProfile from './components/profile/EditProfile';
import AttendanceTracker from './components/attendance/AttendanceTracker';
import AttendanceView from './components/attendance/AttendanceView';
import ApplyLeave from './components/leaves/ApplyLeave';
import LeaveHistory from './components/leaves/LeaveHistory';
import LeaveApprovals from './components/leaves/LeaveApprovals';
import EmployeePayroll from './components/payroll/EmployeePayroll';
import AdminPayroll from './components/payroll/AdminPayroll';
import ReportsDashboard from './components/dashboard/ReportsDashboard';
import EmailSender from './components/email/EmailSender';
import Predictions from './components/predictions/Predictions';
import Settings from './components/settings/Settings';

// ============================================================
// SIDEBAR WIDTH CONSTANT
// ============================================================
const SIDEBAR_WIDTH = 240;

// ============================================================
// PROFESSIONAL LIGHT THEME
// ============================================================
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8' },
    secondary: { main: '#7c3aed', light: '#8b5cf6', dark: '#6d28d9' },
    success: { main: '#10b981', light: '#34d399', dark: '#059669' },
    warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
    info: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.75rem' },
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    h6: { fontWeight: 600, fontSize: '1.25rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          borderRadius: 16,
          transition: 'all 0.25s ease',
          '&:hover': {
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px', fontWeight: 600 },
        contained: { boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
  },
});

// ============================================================
// PROFESSIONAL DARK THEME
// ============================================================
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#60a5fa', light: '#93bbfc', dark: '#3b82f6' },
    secondary: { main: '#a78bfa', light: '#c4b5fd', dark: '#8b5cf6' },
    success: { main: '#34d399', light: '#6ee7b7', dark: '#10b981' },
    warning: { main: '#fbbf24', light: '#fcd34d', dark: '#f59e0b' },
    error: { main: '#f87171', light: '#fca5a5', dark: '#ef4444' },
    info: { main: '#22d3ee', light: '#67e8f9', dark: '#06b6d4' },
    background: { default: '#0f172a', paper: '#1e293b' },
    text: { primary: '#f1f5f9', secondary: '#94a3b8' },
    divider: '#334155',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.75rem' },
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    h6: { fontWeight: 600, fontSize: '1.25rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1e293b',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          borderRadius: 16,
          transition: 'all 0.25s ease',
          '&:hover': {
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { background: '#1e293b', borderRadius: 16 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15,23,42,0.8)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(15,23,42,0.9)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        },
      },
    },
  },
});

// ============================================================
// APP COMPONENT
// ============================================================
function App() {
  const [themeMode, setThemeMode] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = useMemo(
    () => (themeMode === 'light' ? lightTheme : darkTheme),
    [themeMode]
  );

  const toggleTheme = () => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, sidebarOpen, toggleSidebar }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
              <Navbar />
              <Sidebar open={sidebarOpen} />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
                  transition: 'margin-left 0.25s ease',
                  mt: '64px',
                  minHeight: 'calc(100vh - 64px)',
                  bgcolor: 'background.default',
                  p: 3,
                  width: sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
                  maxWidth: sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
                  overflowX: 'hidden',
                }}
              >
                <Routes>
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<EmployeeDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/profile" element={<ViewProfile />} />
                    <Route path="/profile/edit" element={<EditProfile />} />
                    <Route path="/attendance" element={<AttendanceTracker />} />
                    <Route path="/attendance/view" element={<AttendanceView />} />
                    <Route path="/leaves/apply" element={<ApplyLeave />} />
                    <Route path="/leaves/history" element={<LeaveHistory />} />
                    <Route path="/leaves/approvals" element={<LeaveApprovals />} />
                    <Route path="/payroll" element={<EmployeePayroll />} />
                    <Route path="/admin/payroll" element={<AdminPayroll />} />
                    <Route path="/reports" element={<ReportsDashboard />} />
                    <Route path="/email" element={<EmailSender />} />
                    <Route path="/predictions" element={<Predictions />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Box>
              <ToastContainer position="top-right" autoClose={3000} />
            </Box>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;