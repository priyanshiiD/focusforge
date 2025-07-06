const mongoose = require('mongoose');

const timerSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: ['work', 'shortBreak', 'longBreak', 'custom'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  interrupted: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  productivity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  }
}, {
  timestamps: true
});

// Index for efficient queries
timerSessionSchema.index({ user: 1, createdAt: -1 });
timerSessionSchema.index({ user: 1, mode: 1 });
timerSessionSchema.index({ user: 1, completed: 1 });
timerSessionSchema.index({ user: 1, startTime: 1 });

// Virtual for session duration in minutes
timerSessionSchema.virtual('durationMinutes').get(function() {
  return Math.round(this.duration / 60);
});

// Virtual for actual duration if session was completed
timerSessionSchema.virtual('actualDuration').get(function() {
  if (!this.endTime) return this.duration;
  return Math.floor((this.endTime - this.startTime) / 1000);
});

// Method to complete session
timerSessionSchema.methods.completeSession = function() {
  this.completed = true;
  this.endTime = new Date();
  return this.save();
};

// Method to interrupt session
timerSessionSchema.methods.interruptSession = function() {
  this.interrupted = true;
  this.endTime = new Date();
  return this.save();
};

// Static method to get user's sessions
timerSessionSchema.statics.getUserSessions = function(userId, filters = {}) {
  const query = { user: userId };
  
  if (filters.mode) {
    query.mode = filters.mode;
  }
  
  if (filters.completed !== undefined) {
    query.completed = filters.completed;
  }
  
  if (filters.dateFrom) {
    query.startTime = { $gte: new Date(filters.dateFrom) };
  }
  
  if (filters.dateTo) {
    query.startTime = { ...query.startTime, $lte: new Date(filters.dateTo) };
  }
  
  return this.find(query).sort({ startTime: -1 });
};

// Static method to get session statistics
timerSessionSchema.statics.getUserStats = function(userId, period = 'all') {
  const now = new Date();
  let dateFilter = {};
  
  switch (period) {
    case 'today':
      dateFilter = {
        startTime: {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
        }
      };
      break;
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { startTime: { $gte: weekAgo } };
      break;
    case 'month':
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      dateFilter = { startTime: { $gte: monthAgo } };
      break;
    default:
      // all time - no date filter
      break;
  }
  
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), ...dateFilter } },
    {
      $group: {
        _id: '$mode',
        totalSessions: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        completedSessions: {
          $sum: { $cond: ['$completed', 1, 0] }
        },
        avgProductivity: { $avg: '$productivity' }
      }
    }
  ]);
};

module.exports = mongoose.model('TimerSession', timerSessionSchema); 