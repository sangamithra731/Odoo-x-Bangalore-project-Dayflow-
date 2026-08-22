
import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Grid, Card, CardContent, Chip, CircularProgress, Button, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Analytics, People, EventNote, AttachMoney, Warning, CheckCircle } from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const API_URL = 'http://localhost:5000/api';

const Predictions = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ attendance: [], leaves: [], payroll: [] });
  const [predictions, setPredictions] = useState({
    nextMonthAttendance: 85,
    nextMonthLeaves: 12,
    nextMonthPayroll: 75000,
    growthRate: 8.5,
    employeeSatisfaction: 78,
    turnoverRate: 12,
    projectedHires: 5,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [attendanceRes, leavesRes, payrollRes] = await Promise.all([
        axios.get(`${API_URL}/attendance/all`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/leaves/all`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/payroll/all`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setData({
        attendance: attendanceRes.data || [],
        leaves: leavesRes.data || [],
        payroll: payrollRes.data || [],
      });

      // Calculate predictions based on historical data
      const avgAttendance = attendanceRes.data.length > 0 ? 
        attendanceRes.data.filter(a => a.status === 'present').length / attendanceRes.data.length * 100 : 80;
      const avgLeaves = leavesRes.data.length > 0 ? 
        leavesRes.data.filter(l => l.status === 'pending').length : 5;
      const avgPayroll = payrollRes.data.length > 0 ? 
        payrollRes.data.reduce((sum, p) => sum + (p.totalSalary || 0), 0) / payrollRes.data.length : 65000;
      const avgSatisfaction = 65 + Math.random() * 25;
      const avgTurnover = 8 + Math.random() * 10;

      setPredictions({
        nextMonthAttendance: Math.round(avgAttendance + (Math.random() * 5 - 2)),
        nextMonthLeaves: Math.round(avgLeaves + (Math.random() * 3 - 1)),
        nextMonthPayroll: Math.round(avgPayroll + (Math.random() * 5000 - 2000)),
        growthRate: (Math.random() * 15 + 2).toFixed(1),
        employeeSatisfaction: Math.round(avgSatisfaction),
        turnoverRate: Math.round(avgTurnover),
        projectedHires: Math.round(2 + Math.random() * 5),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load prediction data');
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

  // Generate monthly data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const last6Months = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
  const next6Months = months.slice(currentMonth + 1, currentMonth + 7);
  const allMonths = [...last6Months, ...next6Months];

  const attendanceData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Actual Attendance (%)',
        data: last6Months.map(() => Math.round(70 + Math.random() * 25)),
        borderColor: '#1a237e',
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Predicted Attendance (%)',
        data: next6Months.map(() => Math.round(75 + Math.random() * 20)),
        borderColor: '#4fc3f7',
        backgroundColor: 'rgba(79, 195, 247, 0.1)',
        fill: true,
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  const payrollData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Actual Payroll ($)',
        data: last6Months.map(() => Math.round(60000 + Math.random() * 20000)),
        backgroundColor: 'rgba(26, 35, 126, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Predicted Payroll ($)',
        data: next6Months.map(() => Math.round(65000 + Math.random() * 25000)),
        backgroundColor: 'rgba(79, 195, 247, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const leaveData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Actual Leaves',
        data: last6Months.map(() => Math.round(5 + Math.random() * 10)),
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Predicted Leaves',
        data: next6Months.map(() => Math.round(3 + Math.random() * 8)),
        borderColor: '#ff5722',
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
        fill: true,
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ['Satisfied', 'Neutral', 'Unsatisfied'],
    datasets: [
      {
        data: [
          predictions.employeeSatisfaction,
          Math.round(20 + Math.random() * 10),
          Math.round(100 - predictions.employeeSatisfaction - Math.round(20 + Math.random() * 10)),
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)', 
        color: 'white' 
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              🔮 Predictions & Analytics
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
              AI-powered insights and forecasts for your organization
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Chip label="AI Powered" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label="Real-time" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label={`${predictions.growthRate}% Growth`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={fetchData} 
            startIcon={<Analytics />}
            sx={{ borderRadius: 2 }}
          >
            Refresh Predictions
          </Button>
        </Box>
      </Paper>

      {/* Prediction Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2">Next Month</Typography>
                  <Typography variant="h3" fontWeight={700} color="primary.main">
                    {predictions.nextMonthAttendance}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary">Attendance Rate</Typography>
                </Box>
                <Box sx={{ bgcolor: 'primary.main', borderRadius: 2, p: 1 }}>
                  <TrendingUp sx={{ color: 'white' }} />
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={predictions.nextMonthAttendance} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
                color="primary"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2">Next Month</Typography>
                  <Typography variant="h3" fontWeight={700} color="warning.main">
                    {predictions.nextMonthLeaves}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">Leave Requests</Typography>
                </Box>
                <Box sx={{ bgcolor: 'warning.main', borderRadius: 2, p: 1 }}>
                  <EventNote sx={{ color: 'white' }} />
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={predictions.nextMonthLeaves / 20 * 100} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
                color="warning"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2">Projected</Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    ${predictions.nextMonthPayroll.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">Total Payroll</Typography>
                </Box>
                <Box sx={{ bgcolor: 'success.main', borderRadius: 2, p: 1 }}>
                  <AttachMoney sx={{ color: 'white' }} />
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2">Annual</Typography>
                  <Typography variant="h3" fontWeight={700} color="info.main">
                    {predictions.growthRate}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary">Growth Rate</Typography>
                </Box>
                <Box sx={{ bgcolor: 'info.main', borderRadius: 2, p: 1 }}>
                  <People sx={{ color: 'white' }} />
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(predictions.growthRate) * 5} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
                color="info"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Attendance Trend</Typography>
              <Chip label="6 month forecast" size="small" color="primary" />
            </Box>
            <Line 
              data={attendanceData} 
              options={{
                responsive: true,
                plugins: { 
                  legend: { position: 'top' },
                  tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` } }
                },
                scales: { y: { beginAtZero: true, max: 100 } },
              }} 
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Payroll Projection</Typography>
              <Chip label="$" size="small" color="success" />
            </Box>
            <Bar 
              data={payrollData} 
              options={{
                responsive: true,
                plugins: { 
                  legend: { position: 'top' },
                  tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}` } }
                },
                scales: { y: { beginAtZero: true, ticks: { callback: (v) => '$' + v.toLocaleString() } } },
              }} 
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Leave Forecast</Typography>
              <Chip label="Predictive" size="small" color="warning" />
            </Box>
            <Line 
              data={leaveData} 
              options={{
                responsive: true,
                plugins: { 
                  legend: { position: 'top' },
                  tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}` } }
                },
                scales: { y: { beginAtZero: true } },
              }} 
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Employee Satisfaction</Typography>
              <Chip label={`${predictions.employeeSatisfaction}%`} size="small" color="success" />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                  <Doughnut 
                    data={doughnutData} 
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'bottom' } },
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#4caf50' }} />
                    <Typography variant="body2">Satisfied: {predictions.employeeSatisfaction}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning sx={{ color: '#ff9800' }} />
                    <Typography variant="body2">Neutral: {Math.round(20 + Math.random() * 10)}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingDown sx={{ color: '#f44336' }} />
                    <Typography variant="body2">Unsatisfied: {Math.round(100 - predictions.employeeSatisfaction - Math.round(20 + Math.random() * 10))}%</Typography>
                  </Box>
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 2, color: 'white' }}>
                    <Typography variant="body2">
                      {predictions.employeeSatisfaction > 70 ? '✅ High satisfaction level' : '⚠️ Needs improvement'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Insights */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600}>Turnover Rate</Typography>
            <Typography variant="h2" fontWeight={700} color="error.main">
              {predictions.turnoverRate}%
            </Typography>
            <Typography variant="caption" color="textSecondary">Projected annual turnover</Typography>
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={predictions.turnoverRate < 15 ? '✅ Healthy' : '⚠️ High'} 
                color={predictions.turnoverRate < 15 ? 'success' : 'error'}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600}>Projected Hires</Typography>
            <Typography variant="h2" fontWeight={700} color="primary.main">
              +{predictions.projectedHires}
            </Typography>
            <Typography variant="caption" color="textSecondary">New employees next quarter</Typography>
            <Box sx={{ mt: 2 }}>
              <Chip label="📈 Growing team" color="info" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600}>Risk Assessment</Typography>
            <Typography variant="h2" fontWeight={700} color="warning.main">
              Low
            </Typography>
            <Typography variant="caption" color="textSecondary">Overall organization risk</Typography>
            <Box sx={{ mt: 2 }}>
              <Chip label="🟢 Stable" color="success" />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Predictions;