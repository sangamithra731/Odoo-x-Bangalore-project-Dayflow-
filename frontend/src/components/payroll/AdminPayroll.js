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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const AdminPayroll = () => {
  const [loading, setLoading] = useState(true);
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    month: '',
    basicSalary: '',
    allowances: '',
    deductions: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [payrollRes, employeesRes] = await Promise.all([
        axios.get(`${API_URL}/payroll/all`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setPayrolls(payrollRes.data || []);
      setEmployees(employeesRes.data || []);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (payroll = null) => {
    if (payroll) {
      setEditingPayroll(payroll);
      setFormData({
        userId: payroll.user?._id || '',
        month: payroll.month || '',
        basicSalary: payroll.basicSalary || '',
        allowances: payroll.allowances || '',
        deductions: payroll.deductions || ''
      });
    } else {
      setEditingPayroll(null);
      setFormData({ userId: '', month: '', basicSalary: '', allowances: '', deductions: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPayroll(null);
    setFormData({ userId: '', month: '', basicSalary: '', allowances: '', deductions: '' });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary) || 0,
        allowances: parseFloat(formData.allowances) || 0,
        deductions: parseFloat(formData.deductions) || 0
      };

      if (editingPayroll) {
        await axios.put(`${API_URL}/payroll/${editingPayroll._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Payroll updated successfully');
      } else {
        await axios.post(`${API_URL}/payroll`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Payroll created successfully');
      }

      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error('Error saving payroll:', error);
      toast.error('Failed to save payroll');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/payroll/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Payroll deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting payroll:', error);
        toast.error('Failed to delete payroll');
      }
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
          <Typography variant="h4" fontWeight={700}>Payroll Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            Add Payroll
          </Button>
        </Box>

        {payrolls.length === 0 ? (
          <Alert severity="info">No payroll records found.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Basic</TableCell>
                  <TableCell align="right">Allowances</TableCell>
                  <TableCell align="right">Deductions</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.map((payroll) => (
                  <TableRow key={payroll._id}>
                    <TableCell>
                      {payroll.user?.profile?.firstName || 'N/A'} {payroll.user?.profile?.lastName || ''}
                    </TableCell>
                    <TableCell>{payroll.month}</TableCell>
                    <TableCell align="right">${payroll.basicSalary?.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>
                      ${payroll.allowances?.toLocaleString()}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'error.main' }}>
                      ${payroll.deductions?.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={700} color="primary">
                        ${payroll.totalSalary?.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payroll.status}
                        color={payroll.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleOpenDialog(payroll)}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(payroll._id)}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingPayroll ? 'Edit Payroll' : 'Add New Payroll'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  name="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  label="Employee"
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.profile?.firstName || 'N/A'} {emp.profile?.lastName || ''} ({emp.employeeId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="month"
                label="Month"
                name="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="number"
                label="Basic Salary"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                InputProps={{ startAdornment: '$' }}
              />
              <TextField
                type="number"
                label="Allowances"
                name="allowances"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                InputProps={{ startAdornment: '$' }}
              />
              <TextField
                type="number"
                label="Deductions"
                name="deductions"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                InputProps={{ startAdornment: '$' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingPayroll ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AdminPayroll;