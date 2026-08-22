import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
} from '@mui/material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    leaveType: 'paid',
    startDate: '',
    endDate: '',
    remarks: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (start > end) {
      setError('Start date must be before end date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/leaves`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Leave request submitted successfully!');
      navigate('/leaves/history');
    } catch (error) {
      console.error('Error applying for leave:', error);
      setError(error.response?.data?.message || 'Failed to submit leave request');
      toast.error('Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Apply for Leave</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  label="Leave Type"
                >
                  <MenuItem value="paid">Paid Leave</MenuItem>
                  <MenuItem value="sick">Sick Leave</MenuItem>
                  <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks / Reason"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/leaves/history')}
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ApplyLeave;