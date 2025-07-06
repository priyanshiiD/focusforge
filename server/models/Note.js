const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  label: {
    type: String,
    enum: ['Work', 'Personal', 'Study', 'Idea'],
    default: 'Work'
  },
  pinned: {
    type: Boolean,
    default: false
  },
  archived: {
    type: Boolean,
    default: false
  },
  trashed: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: '#3B82F6'
  },
  order: {
    type: Number,
    default: 0
  },
  wordCount: {
    type: Number,
    default: 0
  },
  lastEdited: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
noteSchema.index({ user: 1, trashed: 1 });
noteSchema.index({ user: 1, archived: 1 });
noteSchema.index({ user: 1, pinned: 1 });
noteSchema.index({ user: 1, label: 1 });

// Pre-save middleware to update word count and last edited
noteSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
    this.lastEdited = new Date();
  }
  next();
});

// Virtual for excerpt
noteSchema.virtual('excerpt').get(function() {
  return this.content.length > 100 
    ? this.content.substring(0, 100) + '...' 
    : this.content;
});

// Method to pin/unpin note
noteSchema.methods.togglePin = function() {
  this.pinned = !this.pinned;
  return this.save();
};

// Method to archive/unarchive note
noteSchema.methods.toggleArchive = function() {
  this.archived = !this.archived;
  return this.save();
};

// Method to trash/restore note
noteSchema.methods.toggleTrash = function() {
  this.trashed = !this.trashed;
  return this.save();
};

// Static method to get user's notes
noteSchema.statics.getUserNotes = function(userId, filters = {}) {
  const query = { user: userId };
  
  if (filters.trashed !== undefined) {
    query.trashed = filters.trashed;
  }
  
  if (filters.archived !== undefined) {
    query.archived = filters.archived;
  }
  
  if (filters.pinned !== undefined) {
    query.pinned = filters.pinned;
  }
  
  if (filters.label) {
    query.label = filters.label;
  }
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { content: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return this.find(query).sort({ pinned: -1, order: 1, createdAt: -1 });
};

module.exports = mongoose.model('Note', noteSchema); 