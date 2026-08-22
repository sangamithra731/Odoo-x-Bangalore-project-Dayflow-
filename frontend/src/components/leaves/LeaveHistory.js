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
  Button,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import { CheckCircle, Cancel, Refresh } from '@mui/icons-material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const LeaveApprovals = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/leaves/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(response.data || []);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/leaves/${leaveId}/status`,
        { status, adminComments: adminComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Leave ${status} successfully`);
      setDialogOpen(false);
      setAdminComment('');
      fetchLeaves();
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error('Failed to update leave status');
    }
  };

  const openDialog = (leave, status) => {
    setSelectedLeave({ ...leave, status });
    setDialogOpen(true);
  };

  const getStatusChip = (status) => {
    const colors = { pending: 'warning', approved: 'success', rejected: 'error' };
    return <Chip label={status} color={colors[status]} size="small" />;
  };

  const filteredLeaves = leaves.filter(leave => {
    if (tabValue === 0) return leave.status === 'pending';
    if (tabValue === 1) return leave.status === 'approved';
    if (tabValue === 2) return leave.status === 'rejected';
    return true;
  });

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
          <Typography variant="h4" fontWeight={700}>Leave Approvals</Typography>
          <IconButton onClick={fetchLeaves}>
            <Refresh />
          </IconButton>
        </Box>

        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>

        {filteredLeaves.length === 0 ? (
          <Alert severity="info">No {tabValue === 0 ? 'pending' : tabValue === 1 ? 'approved' : 'rejected'} leave requests found.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeaves.map((leave) => {
                  const start = new Date(leave.startDate);
                  const end = new Date(leave.endDate);
                  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                  return (
                    <TableRow key={leave._id}>
                      <TableCell>
                        {leave.user?.profile?.firstName || 'N/A'} {leave.user?.profile?.lastName || ''}
                      </TableCell>
                      <TableCell><Chip label={leave.leaveType} size="small" variant="outlined" /></TableCell>
                      <TableCell>{start.toLocaleDateString()} - {end.toLocaleDateString()}</TableCell>
                      <TableCell>{days} day{days > 1 ? 's' : ''}</TableCell>
                      <TableCell>{getStatusChip(leave.status)}</TableCell>
                      <TableCell>
                        {leave.status === 'pending' ? (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button
                              size="small"
                              color="success"
                              onClick={() => openDialog(leave, 'approved')}
                              startIcon={<CheckCircle />}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => openDialog(leave, 'rejected')}
                              startIcon={<Cancel />}
                            >
                              Reject
                            </Button>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            {leave.adminComments || '-'}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>
            {selectedLeave?.status === 'approved' ? 'Approve' : 'Reject'} Leave Request
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Admin Comments"
              fullWidth
              multiline
              rows={3}
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Add comments (optional)"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => handleLeaveAction(selectedLeave?._id, selectedLeave?.status)}
              color={selectedLeave?.status === 'approved' ? 'success' : 'error'}
              variant="contained"
            >
              {selectedLeave?.status === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default LeaveApprovals;