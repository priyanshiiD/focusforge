const Task = require('../models/Task');

// Get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const { completed, category, status, search } = req.query;
    const filters = {};
    
    if (completed !== undefined) filters.completed = completed === 'true';
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const tasks = await Task.getUserTasks(req.user._id, filters);
    
    res.json({
      success: true,
      tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tasks',
      error: error.message
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, tags } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }
    
    // Get the highest order number for this user
    const lastTask = await Task.findOne({ user: req.user._id }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;
    
    const task = new Task({
      user: req.user._id,
      title: title.trim(),
      description: description?.trim() || '',
      category: category || 'Work',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      tags: tags || [],
      order
    });
    
    await task.save();
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const task = await Task.findOne({ _id: id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'category', 'priority', 'dueDate', 'tags', 'status'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    });
    
    await task.save();
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

// Toggle task completion
const toggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findOne({ _id: id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    if (task.completed) {
      await task.markIncomplete();
    } else {
      await task.markCompleted();
    }
    
    res.json({
      success: true,
      message: `Task ${task.completed ? 'completed' : 'marked incomplete'}`,
      task
    });
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle task',
      error: error.message
    });
  }
};

// Reorder tasks
const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    
    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: 'Tasks array is required'
      });
    }
    
    // Update order for each task
    const updatePromises = tasks.map((taskId, index) => {
      return Task.findOneAndUpdate(
        { _id: taskId, user: req.user._id },
        { order: index },
        { new: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({
      success: true,
      message: 'Tasks reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder tasks',
      error: error.message
    });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const now = new Date();
    let dateFilter = {};
    
    switch (period) {
      case 'today':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          }
        };
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: weekAgo } };
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        dateFilter = { createdAt: { $gte: monthAgo } };
        break;
    }
    
    const stats = await Task.aggregate([
      { $match: { user: req.user._id, ...dateFilter } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: ['$completed', 1, 0] } },
          pendingTasks: { $sum: { $cond: ['$completed', 0, 1] } },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$dueDate', null] },
                    { $eq: ['$completed', false] },
                    { $lt: ['$dueDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    
    const categoryStats = await Task.aggregate([
      { $match: { user: req.user._id, ...dateFilter } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } }
        }
      }
    ]);
    
    const result = {
      totalTasks: stats[0]?.totalTasks || 0,
      completedTasks: stats[0]?.completedTasks || 0,
      pendingTasks: stats[0]?.pendingTasks || 0,
      overdueTasks: stats[0]?.overdueTasks || 0,
      completionRate: stats[0]?.totalTasks > 0 
        ? Math.round((stats[0].completedTasks / stats[0].totalTasks) * 100) 
        : 0,
      categoryStats
    };
    
    res.json({
      success: true,
      stats: result
    });
  } catch (error) {
    console.error('Error getting task stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get task statistics',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks,
  getTaskStats
}; 