const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const {
  applyLeave,
  getLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');

router.post('/', protect, applyLeave);
router.get('/', protect, getLeaves);
router.get('/all', protect, roleCheck('hr'), getAllLeaves);
router.put('/:id/status', protect, roleCheck('hr'), updateLeaveStatus);

module.exports = router;