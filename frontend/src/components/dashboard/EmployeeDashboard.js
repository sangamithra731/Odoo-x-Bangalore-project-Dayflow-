import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profile: null,
    attendance: null,
    leaves: [],
    payroll: null,
    pendingLeaves: 0,
    totalLeaves: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, attendanceRes, leavesRes, payrollRes] = await Promise.all([
        axios.get(`${API_URL}/users/profile`, { headers }),
        axios.get(`${API_URL}/attendance`, { headers }),
        axios.get(`${API_URL}/leaves`, { headers }),
        axios.get(`${API_URL}/payroll`, { headers }),
      ]);

      const leaves = leavesRes.data || [];
      setStats({
        profile: profileRes.data?.profile,
        attendance: attendanceRes.data?.[0] || null,
        leaves: leaves,
        payroll: payrollRes.data?.[0] || null,
        pendingLeaves: leaves.filter(l => l.status === 'pending').length,
        totalLeaves: leaves.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const quickActions = [
    { 
      title: 'Check In/Out', 
      icon: <AccessTimeIcon />, 
      color: '#1976d2', 
      path: '/attendance', 
      desc: 'Mark your attendance' 
    },
    { 
      title: 'Apply Leave', 
      icon: <AssignmentIcon />, 
      color: '#ed6c02', 
      path: '/leaves/apply', 
      desc: 'Request time off' 
    },
    { 
      title: 'View Profile', 
      icon: <PersonIcon />, 
      color: '#2e7d32', 
      path: '/profile', 
      desc: 'Manage your info' 
    },
    { 
      title: 'Payroll', 
      icon: <MoneyIcon />, 
      color: '#7b1fa2', 
      path: '/payroll', 
      desc: 'View salary details' 
    },
  ];

  const recentLeaves = stats.leaves.slice(0, 3);
  const fullName = stats.profile?.firstName || user?.employeeId || 'User';

  return (
    <Box sx={{ bgcolor: '#f0f4f8', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Welcome Banner - Fixed */}
        <Paper sx={{ 
          p: { xs: 3, sm: 4 }, 
          mb: 4, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #0d1445 0%, #1a237e 40%, #0d47a1 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.08 }}>
            <PersonIcon sx={{ fontSize: 200 }} />
          </Box>
          
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                👋 Welcome, {fullName}!
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.85 }}>
                Employee ID: {user?.employeeId || 'N/A'} • Role: {user?.role || 'Employee'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label="✅ Active" 
                  sx={{ bgcolor: 'rgba(76,175,80,0.3)', color: 'white' }} 
                />
                <Chip 
                  label={stats.attendance ? '📅 Present Today' : '⏳ Not Checked In'} 
                  sx={{ 
                    bgcolor: stats.attendance ? 'rgba(76,175,80,0.3)' : 'rgba(255,152,0,0.3)', 
                    color: 'white' 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/attendance')}
                startIcon={<AccessTimeIcon />}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                }}
              >
                {stats.attendance ? 'Check Out' : 'Check In'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards - Fixed width and text */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              height: '100%',
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography color="textSecondary" variant="body2" fontWeight={500} noWrap>
                      Pending Leaves
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="warning.main" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                      {stats.pendingLeaves}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#fff3e0', color: '#ed6c02', width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}>
                    <AssignmentIcon sx={{ fontSize: { xs: 20, sm: 28 } }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              height: '100%',
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography color="textSecondary" variant="body2" fontWeight={500} noWrap>
                      Total Leaves
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="primary.main" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                      {stats.totalLeaves}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}>
                    <CheckCircleIcon sx={{ fontSize: { xs: 20, sm: 28 } }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              height: '100%',
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography color="textSecondary" variant="body2" fontWeight={500} noWrap>
                      Monthly Salary
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="success.main" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}>
                      ${stats.payroll?.totalSalary?.toLocaleString() || '0'}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}>
                    <MoneyIcon sx={{ fontSize: { xs: 20, sm: 28 } }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              height: '100%',
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography color="textSecondary" variant="body2" fontWeight={500} noWrap>
                      Attendance Rate
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="info.main" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                      92%
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#e1f5fe', color: '#0288d1', width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}>
                    <TrendingUpIcon sx={{ fontSize: { xs: 20, sm: 28 } }} />
                  </Avatar>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={92} 
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                  color="success"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions - Fixed card sizes */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action) => (
            <Grid item xs={6} sm={6} md={3} key={action.title}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  },
                  height: '100%',
                }}
                onClick={() => navigate(action.path)}
              >
                <CardContent sx={{ 
                  textAlign: 'center', 
                  py: { xs: 2, sm: 3 },
                  px: { xs: 1, sm: 2 },
                }}>
                  <Avatar 
                    sx={{ 
                      mx: 'auto', 
                      mb: 1.5, 
                      bgcolor: action.color, 
                      width: { xs: 48, sm: 56 }, 
                      height: { xs: 48, sm: 56 } 
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {action.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {action.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)' 
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Activity
                </Typography>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/leaves/history')}
                >
                  View All
                </Button>
              </Box>
              {recentLeaves.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">No recent activity</Typography>
                </Box>
              ) : (
                <List sx={{ px: 0 }}>
                  {recentLeaves.map((leave, index) => (
                    <React.Fragment key={leave._id}>
                      <ListItem sx={{ px: 0, flexWrap: 'wrap' }}>
                        <ListItemText
                          primary={
                            <Typography fontWeight={500} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                              {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Chip 
                                label={leave.status} 
                                size="small" 
                                color={leave.status === 'approved' ? 'success' : leave.status === 'pending' ? 'warning' : 'error'}
                                sx={{ height: 22, fontSize: '0.7rem' }}
                              />
                              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                                {new Date(leave.createdAt).toLocaleDateString()} at {new Date(leave.createdAt).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small"
                            onClick={() => navigate('/leaves/history')}
                          >
                            <ArrowForwardIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      {index < recentLeaves.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)' 
            }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#e8f5e9', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Typography variant="body2" fontWeight={500}>✅ Present This Week</Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main">5/5</Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#fff3e0', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Typography variant="body2" fontWeight={500}>📋 Pending Tasks</Typography>
                  <Typography variant="h6" fontWeight={700} color="warning.main">3</Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#e3f2fd', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Typography variant="body2" fontWeight={500}>💳 Leave Balance</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">12</Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#f3e5f5', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Typography variant="body2" fontWeight={500}>📅 Work Days</Typography>
                  <Typography variant="h6" fontWeight={700} color="secondary.main">22</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EmployeeDashboard;