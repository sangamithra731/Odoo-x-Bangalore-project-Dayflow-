const Payroll = require('../models/Payroll');
const EmployeeProfile = require('../models/EmployeeProfile');
const User = require('../models/User');

// @desc    Get user payroll
// @route   GET /api/payroll
exports.getPayroll = async (req, res) => {
  try {
    const { userId, month } = req.query;
    const targetUserId = userId && req.user.role === 'hr' ? userId : req.user.id;

    const query = { user: targetUserId };
    if (month) {
      query.month = month;
    }

    const payroll = await Payroll.find(query)
      .sort({ month: -1 })
      .populate('user', 'employeeId email');

    res.json(payroll);
  } catch (error) {
    console.error('Get payroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all payroll (Admin only)
// @route   GET /api/payroll/all
exports.getAllPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.find()
      .sort({ month: -1 })
      .populate('user', 'employeeId email profile');

    res.json(payroll);
  } catch (error) {
    console.error('Get all payroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or update payroll (Admin only)
// @route   POST /api/payroll
exports.createPayroll = async (req, res) => {
  try {
    const { userId, month, basicSalary, allowances, deductions } = req.body;

    // Check if payroll exists for this month
    let payroll = await Payroll.findOne({ user: userId, month });

    if (payroll) {
      // Update existing
      payroll.basicSalary = basicSalary;
      payroll.allowances = allowances;
      payroll.deductions = deductions;
      payroll.totalSalary = (basicSalary || 0) + (allowances || 0) - (deductions || 0);
      payroll.updatedAt = Date.now();
    } else {
      // Create new
      payroll = new Payroll({
        user: userId,
        month,
        basicSalary,
        allowances,
        deductions,
        totalSalary: (basicSalary || 0) + (allowances || 0) - (deductions || 0)
      });
    }

    await payroll.save();

    res.status(201).json({ message: 'Payroll processed successfully', payroll });
  } catch (error) {
    console.error('Create payroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update salary structure (Admin only)
// @route   PUT /api/payroll/salary-structure/:userId
exports.updateSalaryStructure = async (req, res) => {
  try {
    const { basic, allowances, deductions } = req.body;
    
    const profile = await EmployeeProfile.findOne({ user: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    profile.salaryStructure = { basic, allowances, deductions };
    profile.salary = (basic || 0) + (allowances || 0) - (deductions || 0);
    profile.updatedAt = Date.now();

    await profile.save();

    res.json({ message: 'Salary structure updated successfully', profile });
  } catch (error) {
    console.error('Update salary structure error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};