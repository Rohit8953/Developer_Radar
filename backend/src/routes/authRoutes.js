// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
//   protect,
  updatePassword,
//   logout
} = require('../controllers/authController'); // Make sure this path is correct

// Public routes
router.post('/register', register); // Ensure 'register' is a function
router.post('/login', login);
// router.post('/forgot-password', forgotPassword);
// router.patch('/reset-password/:token', resetPassword);

// Protected routes
// router.use(protect); // Must be a middleware function
// router.patch('/update-password', updatePassword);
// router.get('/logout', logout);

module.exports = router;