import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const AttendanceView = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);

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
      setAttendance(response.data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Attendance Records</Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No attendance records found</TableCell></TableRow>
              ) : (
                attendance.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'}</TableCell>
                    <TableCell>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={record.status} 
                        color={record.status === 'present' ? 'success' : record.status === 'absent' ? 'error' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{record.remarks || '-'}</TableCell>
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

export default AttendanceView;