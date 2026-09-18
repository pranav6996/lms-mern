const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updateProfile, changePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/authValidator');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadImage.single('profileImage'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
