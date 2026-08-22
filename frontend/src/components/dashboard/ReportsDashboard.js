import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const ReportsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ attendance: [], leaves: [], payroll: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [attendanceRes, leavesRes, payrollRes] = await Promise.all([
        axios.get(`${API_URL}/attendance/all`, { 
          headers: { Authorization: `Bearer ${token}` } 
        }),
        axios.get(`${API_URL}/leaves/all`, { 
          headers: { Authorization: `Bearer ${token}` } 
        }),
        axios.get(`${API_URL}/payroll/all`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
      ]);

      setData({
        attendance: attendanceRes.data || [],
        leaves: leavesRes.data || [],
        payroll: payrollRes.data || []
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
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

  const attendanceStatus = {
    present: data.attendance.filter(a => a.status === 'present').length,
    absent: data.attendance.filter(a => a.status === 'absent').length,
    'half-day': data.attendance.filter(a => a.status === 'half-day').length,
    leave: data.attendance.filter(a => a.status === 'leave').length
  };

  const leaveStatus = {
    pending: data.leaves.filter(l => l.status === 'pending').length,
    approved: data.leaves.filter(l => l.status === 'approved').length,
    rejected: data.leaves.filter(l => l.status === 'rejected').length
  };

  const totalPayroll = data.payroll.reduce((sum, p) => sum + (p.totalSalary || 0), 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Analytics & Reports</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Attendance Distribution</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Chip label={`Present: ${attendanceStatus.present}`} color="success" />
              <Chip label={`Absent: ${attendanceStatus.absent}`} color="error" />
              <Chip label={`Half-Day: ${attendanceStatus['half-day']}`} color="warning" />
              <Chip label={`Leave: ${attendanceStatus.leave}`} color="info" />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Leave Status</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Chip label={`Pending: ${leaveStatus.pending}`} color="warning" />
              <Chip label={`Approved: ${leaveStatus.approved}`} color="success" />
              <Chip label={`Rejected: ${leaveStatus.rejected}`} color="error" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Employees</Typography>
              <Typography variant="h4" fontWeight={700}>
                {new Set(data.attendance.map(a => a.user?._id)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Leave Requests</Typography>
              <Typography variant="h4" fontWeight={700}>{data.leaves.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Payroll</Typography>
              <Typography variant="h4" fontWeight={700}>
                ${totalPayroll.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportsDashboard;