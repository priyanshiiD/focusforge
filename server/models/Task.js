const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Study', 'Fitness'],
    default: 'Work'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
taskSchema.index({ user: 1, completed: 1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

// Method to mark as completed
taskSchema.methods.markCompleted = function() {
  this.completed = true;
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to mark as incomplete
taskSchema.methods.markIncomplete = function() {
  this.completed = false;
  this.status = 'pending';
  this.completedAt = null;
  return this.save();
};

// Static method to get user's tasks
taskSchema.statics.getUserTasks = function(userId, filters = {}) {
  const query = { user: userId };
  
  if (filters.completed !== undefined) {
    query.completed = filters.completed;
  }
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  return this.find(query).sort({ order: 1, createdAt: -1 });
};

module.exports = mongoose.model('Task', taskSchema); 