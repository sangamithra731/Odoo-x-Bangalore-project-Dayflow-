const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { sendLeaveStatusEmail } = require('../utils/emailService');

// @desc    Apply for leave
// @route   POST /api/leaves
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, remarks } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    // Check for overlapping leave requests
    const existingRequest = await LeaveRequest.findOne({
      user: req.user.id,
      status: 'pending',
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending leave request for this period' });
    }

    const leaveRequest = await LeaveRequest.create({
      user: req.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      remarks
    });

    res.status(201).json({ message: 'Leave request submitted successfully', leaveRequest });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user leaves
// @route   GET /api/leaves
exports.getLeaves = async (req, res) => {
  try {
    const { userId } = req.query;
    const targetUserId = userId && req.user.role === 'hr' ? userId : req.user.id;

    const leaves = await LeaveRequest.find({ user: targetUserId })
      .sort({ createdAt: -1 })
      .populate('user', 'employeeId email');

    res.json(leaves);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all leave requests (Admin only)
// @route   GET /api/leaves/all
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .sort({ createdAt: -1 })
      .populate('user', 'employeeId email profile');

    res.json(leaves);
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update leave status (Admin only)
// @route   PUT /api/leaves/:id/status
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminComments } = req.body;
    
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.status = status;
    leaveRequest.adminComments = adminComments || '';
    leaveRequest.approvedBy = req.user.id;
    leaveRequest.updatedAt = Date.now();

    await leaveRequest.save();

    // Send email notification
    await sendLeaveStatusEmail(leaveRequest, status);

    res.json({ message: `Leave request ${status} successfully`, leaveRequest });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};