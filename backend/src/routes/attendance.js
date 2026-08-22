const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const {
  checkIn,
  checkOut,
  getAttendance,
  getAllAttendance
} = require('../controllers/attendanceController');

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/', protect, getAttendance);
router.get('/all', protect, roleCheck('hr'), getAllAttendance);

module.exports = router;