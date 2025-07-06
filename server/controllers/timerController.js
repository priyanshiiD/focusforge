const TimerSession = require('../models/TimerSession');

// Get all timer sessions for a user
const getTimerSessions = async (req, res) => {
  try {
    const { mode, completed, dateFrom, dateTo } = req.query;
    const filters = {};
    
    if (mode) filters.mode = mode;
    if (completed !== undefined) filters.completed = completed === 'true';
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    
    const sessions = await TimerSession.getUserSessions(req.user._id, filters);
    
    res.json({
      success: true,
      sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Error getting timer sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get timer sessions',
      error: error.message
    });
  }
};

// Create a new timer session
const createTimerSession = async (req, res) => {
  try {
    const { mode, duration, completed, notes, tags, productivity } = req.body;
    
    if (!mode || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Mode and duration are required'
      });
    }
    
    const session = new TimerSession({
      user: req.user._id,
      mode,
      duration,
      completed: completed || false,
      notes: notes || '',
      tags: tags || [],
      productivity: productivity || 5,
      startTime: new Date(),
      endTime: completed ? new Date() : null
    });
    
    await session.save();
    
    res.status(201).json({
      success: true,
      message: 'Timer session created successfully',
      session
    });
  } catch (error) {
    console.error('Error creating timer session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create timer session',
      error: error.message
    });
  }
};

// Update a timer session
const updateTimerSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const session = await TimerSession.findOne({ _id: id, user: req.user._id });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Timer session not found'
      });
    }
    
    // Update allowed fields
    const allowedUpdates = ['notes', 'tags', 'productivity', 'completed'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        session[field] = updates[field];
      }
    });
    
    // If marking as completed, set end time
    if (updates.completed && !session.endTime) {
      session.endTime = new Date();
    }
    
    await session.save();
    
    res.json({
      success: true,
      message: 'Timer session updated successfully',
      session
    });
  } catch (error) {
    console.error('Error updating timer session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update timer session',
      error: error.message
    });
  }
};

// Delete a timer session
const deleteTimerSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await TimerSession.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Timer session not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Timer session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting timer session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete timer session',
      error: error.message
    });
  }
};

// Complete a timer session
const completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await TimerSession.findOne({ _id: id, user: req.user._id });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Timer session not found'
      });
    }
    
    await session.completeSession();
    
    res.json({
      success: true,
      message: 'Timer session completed successfully',
      session
    });
  } catch (error) {
    console.error('Error completing timer session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete timer session',
      error: error.message
    });
  }
};

// Interrupt a timer session
const interruptSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await TimerSession.findOne({ _id: id, user: req.user._id });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Timer session not found'
      });
    }
    
    await session.interruptSession();
    
    res.json({
      success: true,
      message: 'Timer session interrupted',
      session
    });
  } catch (error) {
    console.error('Error interrupting timer session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to interrupt timer session',
      error: error.message
    });
  }
};

// Get timer session statistics
const getTimerStats = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    const stats = await TimerSession.getUserStats(req.user._id, period);
    
    // Calculate totals
    const totals = {
      totalSessions: 0,
      totalDuration: 0,
      completedSessions: 0,
      avgProductivity: 0
    };
    
    stats.forEach(stat => {
      totals.totalSessions += stat.totalSessions;
      totals.totalDuration += stat.totalDuration;
      totals.completedSessions += stat.completedSessions;
    });
    
    if (totals.totalSessions > 0) {
      totals.avgProductivity = stats.reduce((sum, stat) => sum + (stat.avgProductivity * stat.totalSessions), 0) / totals.totalSessions;
    }
    
    const result = {
      period,
      totals,
      modeStats: stats,
      completionRate: totals.totalSessions > 0 
        ? Math.round((totals.completedSessions / totals.totalSessions) * 100) 
        : 0,
      totalHours: Math.round(totals.totalDuration / 3600 * 10) / 10
    };
    
    res.json({
      success: true,
      stats: result
    });
  } catch (error) {
    console.error('Error getting timer stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get timer statistics',
      error: error.message
    });
  }
};

// Get daily focus time for the last 7 days
const getDailyFocus = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const dailyStats = await TimerSession.aggregate([
      {
        $match: {
          user: req.user._id,
          startTime: { $gte: sevenDaysAgo },
          mode: 'work'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$startTime" }
          },
          totalDuration: { $sum: '$duration' },
          sessions: { $sum: 1 },
          completedSessions: { $sum: { $cond: ['$completed', 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Fill in missing days with zero values
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayStats = dailyStats.find(stat => stat._id === dateStr);
      
      result.push({
        date: dateStr,
        totalDuration: dayStats?.totalDuration || 0,
        sessions: dayStats?.sessions || 0,
        completedSessions: dayStats?.completedSessions || 0,
        hours: Math.round((dayStats?.totalDuration || 0) / 3600 * 10) / 10
      });
    }
    
    res.json({
      success: true,
      dailyFocus: result
    });
  } catch (error) {
    console.error('Error getting daily focus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get daily focus data',
      error: error.message
    });
  }
};

module.exports = {
  getTimerSessions,
  createTimerSession,
  updateTimerSession,
  deleteTimerSession,
  completeSession,
  interruptSession,
  getTimerStats,
  getDailyFocus
}; 