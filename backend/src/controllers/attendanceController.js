const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');

// @desc    Check-in
// @route   POST /api/attendance/checkin
exports.checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = await Attendance.create({
      user: req.user.id,
      date: new Date(),
      checkIn: new Date(),
      status: 'present'
    });

    res.status(201).json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check-out
// @route   POST /api/attendance/checkout
exports.checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today }
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No check-in found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.json({ message: 'Checked out successfully', attendance });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user attendance
// @route   GET /api/attendance
exports.getAttendance = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    // If userId is provided and user is admin, get that user's attendance
    // Otherwise get current user's attendance
    const targetUserId = userId && req.user.role === 'hr' ? userId : req.user.id;

    const query = { user: targetUserId };
    
    if (startDate) {
      query.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.date = { ...query.date, $lte: new Date(endDate) };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('user', 'employeeId email');

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all attendance (Admin only)
// @route   GET /api/attendance/all
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .sort({ date: -1 })
      .populate('user', 'employeeId email profile');
      
    res.json(attendance);
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};