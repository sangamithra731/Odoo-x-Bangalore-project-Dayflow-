const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HRMS API is running',
    timestamp: new Date().toISOString()
  });
});

// ==================== HRMS ROUTES ====================

// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// User management routes
app.use('/api/users', require('./routes/users'));

// Attendance management routes
app.use('/api/attendance', require('./routes/attendance'));

// Leave management routes
app.use('/api/leaves', require('./routes/leaves'));

// Payroll management routes
app.use('/api/payroll', require('./routes/payroll'));

// ==================== END ROUTES ====================

// 404 handler - for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`👤 Users: http://localhost:${PORT}/api/users`);
  console.log(`📅 Attendance: http://localhost:${PORT}/api/attendance`);
  console.log(`📋 Leaves: http://localhost:${PORT}/api/leaves`);
  console.log(`💰 Payroll: http://localhost:${PORT}/api/payroll`);
});