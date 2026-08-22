const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, signin, verifyEmail } = require('../controllers/authController');

// Validation rules
const signupValidation = [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['employee', 'hr']).withMessage('Invalid role')
];

const signinValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/signup', signupValidation, signup);
router.post('/signin', signinValidation, signin);
router.get('/verify/:token', verifyEmail);

module.exports = router;