const mongoose = require('mongoose');

const employeeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  dateOfBirth: Date,
  gender: String,
  address: String,
  phone: String,
  profilePicture: String,
  jobTitle: { type: String, default: '' },
  department: { type: String, default: '' },
  hireDate: Date,
  salary: { type: Number, default: 0 },
  salaryStructure: {
    basic: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 }
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmployeeProfile', employeeProfileSchema);