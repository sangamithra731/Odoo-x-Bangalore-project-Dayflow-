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
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const EmployeePayroll = () => {
  const [loading, setLoading] = useState(true);
  const [payrolls, setPayrolls] = useState([]);
  const [summary, setSummary] = useState({ total: 0, average: 0, latest: null, monthCount: 0 });

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/payroll`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data || [];
      setPayrolls(data);

      const total = data.reduce((sum, p) => sum + (p.totalSalary || 0), 0);
      const monthCount = data.length;
      setSummary({
        total: total,
        average: monthCount > 0 ? total / monthCount : 0,
        latest: data.length > 0 ? data[0] : null,
        monthCount: monthCount
      });
    } catch (error) {
      console.error('Error fetching payroll:', error);
      toast.error('Failed to load payroll data');
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
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>My Payroll</Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Earnings</Typography>
                <Typography variant="h5" color="primary" fontWeight={700}>
                  ${summary.total.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Average Monthly</Typography>
                <Typography variant="h5" color="success.main" fontWeight={700}>
                  ${summary.average.toFixed(0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Records</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {summary.monthCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {payrolls.length === 0 ? (
          <Alert severity="info">No payroll records found.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Basic</TableCell>
                  <TableCell align="right">Allowances</TableCell>
                  <TableCell align="right">Deductions</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.map((payroll) => (
                  <TableRow key={payroll._id}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default EmployeePayroll;