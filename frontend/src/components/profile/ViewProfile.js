import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const ViewProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const userProfile = profile?.profile || {};
  const fullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Not Set';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 120, height: 120, bgcolor: '#1a237e' }}>
              {fullName.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>{fullName}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {userProfile.jobTitle || 'No Job Title'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Chip label={profile?.role || 'employee'} color="primary" size="small" />
                <Chip label={`ID: ${profile?.employeeId || 'N/A'}`} variant="outlined" size="small" />
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate('/profile/edit')}
            sx={{ mt: { xs: 2, sm: 0 }, borderRadius: 2 }}
          >
            Edit Profile
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon /> Personal Information
                </Typography>
                <List dense>
                  <ListItem><ListItemIcon><EmailIcon /></ListItemIcon><ListItemText primary="Email" secondary={profile?.email || 'N/A'} /></ListItem>
                  <ListItem><ListItemIcon><PhoneIcon /></ListItemIcon><ListItemText primary="Phone" secondary={userProfile.phone || 'N/A'} /></ListItem>
                  <ListItem><ListItemIcon><HomeIcon /></ListItemIcon><ListItemText primary="Address" secondary={userProfile.address || 'N/A'} /></ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon /> Employment Information
                </Typography>
                <List dense>
                  <ListItem><ListItemIcon><BadgeIcon /></ListItemIcon><ListItemText primary="Employee ID" secondary={profile?.employeeId || 'N/A'} /></ListItem>
                  <ListItem><ListItemIcon><BusinessIcon /></ListItemIcon><ListItemText primary="Department" secondary={userProfile.department || 'N/A'} /></ListItem>
                  <ListItem><ListItemIcon><WorkIcon /></ListItemIcon><ListItemText primary="Job Title" secondary={userProfile.jobTitle || 'N/A'} /></ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon /> Salary Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, bgcolor: '#4caf50', color: 'white', borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Basic Salary</Typography>
                      <Typography variant="h6">${userProfile.salaryStructure?.basic?.toLocaleString() || '0'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, bgcolor: '#2196f3', color: 'white', borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Allowances</Typography>
                      <Typography variant="h6">${userProfile.salaryStructure?.allowances?.toLocaleString() || '0'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, bgcolor: '#ff9800', color: 'white', borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Deductions</Typography>
                      <Typography variant="h6">${userProfile.salaryStructure?.deductions?.toLocaleString() || '0'}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, p: 2, bgcolor: '#1a237e', borderRadius: 2, color: 'white' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Total Salary: ${userProfile.salary?.toLocaleString() || '0'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewProfile;