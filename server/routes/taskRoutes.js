const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks,
  getTaskStats
} = require('../controllers/taskController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all tasks
router.get('/', getTasks);

// Get task statistics (must come before /:id routes)
router.get('/stats', getTaskStats);

// Reorder tasks (must come before /:id routes)
router.put('/reorder', reorderTasks);

// Create a new task
router.post('/', createTask);

// Update a task
router.put('/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

// Toggle task completion
router.patch('/:id/toggle', toggleTask);

module.exports = router; 