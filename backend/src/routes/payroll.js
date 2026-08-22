const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const {
  getPayroll,
  getAllPayroll,
  createPayroll,
  updateSalaryStructure
} = require('../controllers/payrollController');

router.get('/', protect, getPayroll);
router.get('/all', protect, roleCheck('hr'), getAllPayroll);
router.post('/', protect, roleCheck('hr'), createPayroll);
router.put('/salary-structure/:userId', protect, roleCheck('hr'), updateSalaryStructure);

module.exports = router;