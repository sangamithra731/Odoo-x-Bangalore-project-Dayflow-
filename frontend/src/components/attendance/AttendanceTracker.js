import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { CheckCircle as CheckInIcon, ExitToApp as CheckOutIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const AttendanceTracker = () => {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [records, setRecords] = useState([]);
  const [today, setToday] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data || [];
      setRecords(data);

      const todayStr = new Date().toDateString();
      const todayRecord = data.find(
        (r) => new Date(r.date).toDateString() === todayStr
      );
      setToday(todayRecord || null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setBusy(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/attendance/checkin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Checked in successfully!');
      fetchAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed');
    } finally {
      setBusy(false);
    }
  };

  const handleCheckOut = async () => {
    setBusy(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/attendance/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Checked out successfully!');
      fetchAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-out failed');
    } finally {
      setBusy(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'half-day': return 'warning';
      case 'leave': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const isCheckedIn = Boolean(today && today.checkIn);
  const isCheckedOut = Boolean(today && today.checkOut);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          Attendance
        </Typography>

        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Today - {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">Status:</Typography>
                <Chip
                  label={today?.status || 'Not Recorded'}
                  color={getStatusColor(today?.status)}
                  size="medium"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1">
                Check In: {today?.checkIn ? new Date(today.checkIn).toLocaleTimeString() : 'Not yet'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1">
                Check Out: {today?.checkOut ? new Date(today.checkOut).toLocaleTimeString() : 'Not yet'}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                onClick={handleCheckIn}
                disabled={Boolean(busy || isCheckedIn)}
                startIcon={<CheckInIcon />}
              >
                {isCheckedIn ? 'Already Checked In' : 'Check In'}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                size="large"
                onClick={handleCheckOut}
                disabled={Boolean(busy || !isCheckedIn || isCheckedOut)}
                startIcon={<CheckOutIcon />}
              >
                {isCheckedOut ? 'Already Checked Out' : 'Check Out'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Attendance History
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No attendance records found</TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'}</TableCell>
                    <TableCell>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Chip label={record.status} color={getStatusColor(record.status)} size="small" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AttendanceTracker;