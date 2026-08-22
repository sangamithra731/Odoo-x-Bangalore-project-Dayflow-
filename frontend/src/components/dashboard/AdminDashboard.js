import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tabs,
  Tab,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  People as PeopleIcon,
  EventNote as EventIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  MoreVert as MoreIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({ 
    employees: [], 
    attendance: [], 
    leaves: [], 
    payroll: [] 
  });
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [employeesRes, attendanceRes, leavesRes, payrollRes] = await Promise.all([
        axios.get(`${API_URL}/users`, { headers }),
        axios.get(`${API_URL}/attendance/all`, { headers }),
        axios.get(`${API_URL}/leaves/all`, { headers }),
        axios.get(`${API_URL}/payroll/all`, { headers }),
      ]);

      setData({
        employees: employeesRes.data || [],
        attendance: attendanceRes.data || [],
        leaves: leavesRes.data || [],
        payroll: payrollRes.data || [],
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAdminData();
    setRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/leaves/${leaveId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Leave ${status} successfully`);
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update leave status');
    }
  };

  const handleMenuOpen = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const getStatusChip = (status) => {
    const colors = { pending: 'warning', approved: 'success', rejected: 'error' };
    return <Chip label={status} color={colors[status]} size="small" />;
  };

  const getAttendanceChip = (status) => {
    const config = {
      present: { color: 'success', label: '✅ Present' },
      absent: { color: 'error', label: '❌ Absent' },
      'half-day': { color: 'warning', label: '🌓 Half Day' },
      leave: { color: 'info', label: '📋 Leave' },
    };
    const { color, label } = config[status] || { color: 'default', label: status };
    return <Chip label={label} color={color} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const pendingLeaves = data.leaves.filter(l => l.status === 'pending');
  const totalEmployees = data.employees.length;
  const presentToday = data.attendance.filter(a => a.status === 'present').length;
  const totalPayroll = data.payroll.reduce((sum, p) => sum + (p.totalSalary || 0), 0);
  const attendanceRate = data.attendance.length > 0 
    ? Math.round((presentToday / data.attendance.length) * 100) 
    : 0;

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', right: -50, top: -50, opacity: 0.1 }}>
            <DashboardIcon sx={{ fontSize: 200 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                🏢 Admin Dashboard
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                Manage employees, attendance, leaves, and payroll from one place
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${totalEmployees} Employees`} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
                <Chip 
                  label={`${presentToday} Present Today`} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
                <Chip 
                  label={`${pendingLeaves.length} Pending Leaves`} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 } }}>
              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={handleRefresh} 
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }}
                  disabled={refreshing}
                >
                  {refreshing ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
                </IconButton>
              </Tooltip>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<PersonAddIcon />}
                sx={{ borderRadius: 2 }}
                onClick={() => navigate('/signup')}
              >
                Add Employee
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              },
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" fontWeight={500}>
                      Total Employees
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="primary.main">
                      {totalEmployees}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      +12 this month
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 50, height: 50 }}>
                    <PeopleIcon />
                  </Avatar>
                </Box>
                <LinearProgress variant="determinate" value={75} sx={{ mt: 2, height: 6, borderRadius: 3 }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              },
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" fontWeight={500}>
                      Present Today
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="success.main">
                      {presentToday}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {attendanceRate}% rate
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 50, height: 50 }}>
                    <EventIcon />
                  </Avatar>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={attendanceRate} 
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                  color="success"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              },
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" fontWeight={500}>
                      Pending Leaves
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="warning.main">
                      {pendingLeaves.length}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {data.leaves.length} total
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#fff3e0', color: '#ed6c02', width: 50, height: 50 }}>
                    <AssignmentIcon />
                  </Avatar>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={data.leaves.length > 0 ? (pendingLeaves.length / data.leaves.length) * 100 : 0} 
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                  color="warning"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              },
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" fontWeight={500}>
                      Total Payroll
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      ${totalPayroll.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {data.payroll.length} records
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 50, height: 50 }}>
                    <MoneyIcon />
                  </Avatar>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ mt: 2, height: 6, borderRadius: 3 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
              },
            }}
          >
            <Tab 
              icon={<AssignmentIcon />} 
              iconPosition="start" 
              label={`Leave Requests (${pendingLeaves.length})`} 
            />
            <Tab 
              icon={<PeopleIcon />} 
              iconPosition="start" 
              label={`Employees (${totalEmployees})`} 
            />
            <Tab 
              icon={<EventIcon />} 
              iconPosition="start" 
              label={`Attendance (${data.attendance.length})`} 
            />
          </Tabs>

          {/* Tab 1: Leave Requests */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Pending Leave Requests
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/leaves/approvals')}
                >
                  View All
                </Button>
              </Box>
              
              {pendingLeaves.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="textSecondary">🎉 No pending leave requests</Typography>
                  <Typography variant="body2" color="textSecondary">All leave requests have been reviewed</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell><strong>Employee</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Period</strong></TableCell>
                        <TableCell><strong>Duration</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell align="center"><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingLeaves.map((leave) => {
                        const start = new Date(leave.startDate);
                        const end = new Date(leave.endDate);
                        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                        return (
                          <TableRow key={leave._id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ width: 36, height: 36, bgcolor: '#1a237e' }}>
                                  {leave.user?.profile?.firstName?.charAt(0) || 'E'}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    {leave.user?.profile?.firstName || 'N/A'} {leave.user?.profile?.lastName || ''}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {leave.user?.employeeId}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={leave.leaveType} 
                                size="small" 
                                color={leave.leaveType === 'paid' ? 'success' : leave.leaveType === 'sick' ? 'warning' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {start.toLocaleDateString()} - {end.toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={`${days} day${days > 1 ? 's' : ''}`} 
                                size="small" 
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label="⏳ Pending" 
                                color="warning" 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleLeaveAction(leave._id, 'approved')}
                                startIcon={<CheckIcon />}
                                sx={{ mr: 1, borderRadius: 2 }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handleLeaveAction(leave._id, 'rejected')}
                                startIcon={<CancelIcon />}
                                sx={{ borderRadius: 2 }}
                              >
                                Reject
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Tab 2: Employees */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  All Employees
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate('/signup')}
                >
                  Add Employee
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell><strong>Employee</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Department</strong></TableCell>
                      <TableCell><strong>Role</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.employees.map((employee) => (
                      <TableRow key={employee._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: '#1a237e' }}>
                              {employee.profile?.firstName?.charAt(0) || 'E'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {employee.profile?.firstName || 'N/A'} {employee.profile?.lastName || ''}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {employee.employeeId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.profile?.department || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={employee.role} 
                            color={employee.role === 'hr' ? 'primary' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Active" 
                            color="success" 
                            size="small" 
                            icon={<CheckIcon sx={{ fontSize: 16 }} />}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Profile">
                            <IconButton 
                              size="small"
                              onClick={() => navigate(`/profile`)}
                            >
                              <PeopleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More Options">
                            <IconButton 
                              size="small"
                              onClick={(e) => handleMenuOpen(e, employee)}
                            >
                              <MoreIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Employee Action Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>View Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { navigate('/admin/payroll'); handleMenuClose(); }}>
                  <ListItemIcon><MoneyIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>View Payroll</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { navigate('/attendance/view'); handleMenuClose(); }}>
                  <ListItemIcon><CalendarIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>View Attendance</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Manage Access</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* Tab 3: Attendance */}
          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Attendance Records
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<DownloadIcon />}
                  >
                    Export
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<PrintIcon />}
                  >
                    Print
                  </Button>
                </Box>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell><strong>Employee</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Check In</strong></TableCell>
                      <TableCell><strong>Check Out</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.attendance.slice(0, 10).map((record) => (
                      <TableRow key={record._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#1a237e' }}>
                              {record.user?.profile?.firstName?.charAt(0) || 'E'}
                            </Avatar>
                            <Typography variant="body2">
                              {record.user?.profile?.firstName || 'N/A'} {record.user?.profile?.lastName || ''}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </TableCell>
                        <TableCell>
                          {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {getAttendanceChip(record.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {data.attendance.length > 10 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="caption" color="textSecondary">
                            Showing 10 of {data.attendance.length} records
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>

        {/* Quick Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: 4, 
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<PeopleIcon />}
            sx={{ borderRadius: 2, minWidth: 160 }}
            onClick={() => navigate('/signup')}
          >
            Add Employee
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            size="large"
            startIcon={<AssignmentIcon />}
            sx={{ borderRadius: 2, minWidth: 160 }}
            onClick={() => navigate('/leaves/approvals')}
          >
            Manage Leaves
          </Button>
          <Button 
            variant="contained" 
            color="info"
            size="large"
            startIcon={<MoneyIcon />}
            sx={{ borderRadius: 2, minWidth: 160 }}
            onClick={() => navigate('/admin/payroll')}
          >
            Manage Payroll
          </Button>
          <Button 
            variant="contained" 
            color="warning"
            size="large"
            startIcon={<TrendingUpIcon />}
            sx={{ borderRadius: 2, minWidth: 160 }}
            onClick={() => navigate('/reports')}
          >
            Reports
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;