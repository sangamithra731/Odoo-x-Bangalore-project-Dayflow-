const { body, validationResult } = require('express-validator');

// Validation rules for different operations

// User Registration Validation
const validateSignup = [
  body('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee ID must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Employee ID can only contain letters, numbers, hyphens, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .isLength({ max: 50 })
    .withMessage('Password cannot exceed 50 characters'),
  
  body('role')
    .optional()
    .isIn(['employee', 'hr'])
    .withMessage('Role must be either "employee" or "hr"'),
];

// User Login Validation
const validateSignin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Profile Update Validation
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number')
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters'),
  
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters')
    .trim()
    .escape(),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      const date = new Date(value);
      const age = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18) {
        throw new Error('Employee must be at least 18 years old');
      }
      if (age > 70) {
        throw new Error('Employee cannot be older than 70 years');
      }
      return true;
    }),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
];

// Leave Application Validation
const validateLeaveApplication = [
  body('leaveType')
    .isIn(['paid', 'sick', 'unpaid'])
    .withMessage('Leave type must be paid, sick, or unpaid'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  
  body('endDate')
    .isISO8601()
    .withMessage('Please provide a valid end date')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate < startDate) {
        throw new Error('End date must be after start date');
      }
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        throw new Error('Leave cannot exceed 30 days');
      }
      return true;
    }),
  
  body('remarks')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Remarks cannot exceed 500 characters')
    .trim()
    .escape(),
];

// Leave Approval Validation
const validateLeaveApproval = [
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be either approved or rejected'),
  
  body('adminComments')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comments cannot exceed 500 characters')
    .trim()
    .escape(),
];

// Payroll Validation
const validatePayroll = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  body('month')
    .notEmpty()
    .withMessage('Month is required')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format')
    .custom((value) => {
      const [year, month] = value.split('-').map(Number);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      if (year < 2000 || year > currentYear + 1) {
        throw new Error('Invalid year');
      }
      if (month < 1 || month > 12) {
        throw new Error('Invalid month');
      }
      return true;
    }),
  
  body('basicSalary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Basic salary must be a positive number'),
  
  body('allowances')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Allowances must be a positive number'),
  
  body('deductions')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Deductions must be a positive number'),
];

// Password Reset Validation
const validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

const validateNewPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .isLength({ max: 50 })
    .withMessage('Password cannot exceed 50 characters'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Employee Search Validation
const validateEmployeeSearch = [
  body('query')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .trim()
    .escape(),
  
  body('department')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Department cannot exceed 50 characters')
    .trim()
    .escape(),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'all'])
    .withMessage('Status must be active, inactive, or all'),
];

// Attendance Validation
const validateAttendance = [
  body('status')
    .optional()
    .isIn(['present', 'absent', 'half-day', 'leave'])
    .withMessage('Status must be present, absent, half-day, or leave'),
  
  body('remarks')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Remarks cannot exceed 200 characters')
    .trim()
    .escape(),
];

// Helper function to check validation results
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().forEach(err => {
      extractedErrors.push({
        field: err.param,
        message: err.msg,
      });
    });

    return res.status(400).json({
      success: false,
      errors: extractedErrors,
      message: 'Validation failed',
    });
  };
};

// Export all validation rules and helper
module.exports = {
  validateSignup,
  validateSignin,
  validateProfileUpdate,
  validateLeaveApplication,
  validateLeaveApproval,
  validatePayroll,
  validatePasswordReset,
  validateNewPassword,
  validateEmployeeSearch,
  validateAttendance,
  validate,
};