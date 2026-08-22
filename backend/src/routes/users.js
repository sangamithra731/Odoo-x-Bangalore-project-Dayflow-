const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', protect, roleCheck('hr'), getAllUsers);
router.put('/:id/role', protect, roleCheck('hr'), updateUserRole);

module.exports = router;