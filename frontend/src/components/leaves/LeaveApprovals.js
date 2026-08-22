import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  Alert,
} from '@mui/material';
import { Add as AddIcon, CheckCircle, Cancel, Pending } from '@mui/icons-material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const LeaveHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/leaves`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(response.data || []);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle color="success" />;
      case 'rejected': return <Cancel color="error" />;
      case 'pending': return <Pending color="warning" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>Leave History</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/leaves/apply')}
            sx={{ borderRadius: 2 }}
          >
            Apply Leave
          </Button>
        </Box>

        {leaves.length === 0 ? (
          <Alert severity="info">You haven't applied for any leave yet.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.map((leave) => {
                  const start = new Date(leave.startDate);
                  const end = new Date(leave.endDate);
                  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                  return (
                    <TableRow key={leave._id}>
                      <TableCell>
                        <Chip label={leave.leaveType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{start.toLocaleDateString()}</TableCell>
                      <TableCell>{end.toLocaleDateString()}</TableCell>
                      <TableCell>{days} day{days > 1 ? 's' : ''}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={getStatusIcon(leave.status)}
                          label={leave.status.charAt(0).toUpperCase() + leave.status.slice(1)} 
                          color={getStatusColor(leave.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{leave.adminComments || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default LeaveHistory;