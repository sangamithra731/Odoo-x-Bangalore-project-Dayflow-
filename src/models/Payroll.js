const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true // Format: YYYY-MM
  },
  basicSalary: Number,
  allowances: Number,
  deductions: Number,
  totalSalary: Number,
  paymentDate: Date,
  status: {
    type: String,
    enum: ['draft', 'processed', 'paid'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payroll', payrollSchema);