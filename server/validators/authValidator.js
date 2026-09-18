const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidator = [
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
];

const resetPasswordValidator = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

module.exports = { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator };
