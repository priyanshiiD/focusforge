const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getTimerSessions,
  createTimerSession,
  updateTimerSession,
  deleteTimerSession,
  completeSession,
  interruptSession,
  getTimerStats,
  getDailyFocus
} = require('../controllers/timerController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all timer sessions
router.get('/', getTimerSessions);

// Get timer statistics (must come before /:id routes)
router.get('/stats', getTimerStats);

// Get daily focus data (must come before /:id routes)
router.get('/daily-focus', getDailyFocus);

// Create a new timer session
router.post('/', createTimerSession);

// Update a timer session
router.put('/:id', updateTimerSession);

// Delete a timer session
router.delete('/:id', deleteTimerSession);

// Complete a timer session
router.patch('/:id/complete', completeSession);

// Interrupt a timer session
router.patch('/:id/interrupt', interruptSession);

module.exports = router; 