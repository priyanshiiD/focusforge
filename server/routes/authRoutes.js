const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  changePassword,
  logout
} = require('../controllers/authController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/change-password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logout);

module.exports = router;
