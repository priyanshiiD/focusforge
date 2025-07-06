const Note = require('../models/Note');

// Get all notes for a user
const getNotes = async (req, res) => {
  try {
    const { trashed, archived, pinned, label, search } = req.query;
    const filters = {};
    
    if (trashed !== undefined) filters.trashed = trashed === 'true';
    if (archived !== undefined) filters.archived = archived === 'true';
    if (pinned !== undefined) filters.pinned = pinned === 'true';
    if (label) filters.label = label;
    if (search) filters.search = search;
    
    const notes = await Note.getUserNotes(req.user._id, filters);
    
    res.json({
      success: true,
      notes,
      count: notes.length
    });
  } catch (error) {
    console.error('Error getting notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notes',
      error: error.message
    });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, label, color, tags } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }
    
    // Get the highest order number for this user
    const lastNote = await Note.findOne({ user: req.user._id }).sort({ order: -1 });
    const order = lastNote ? lastNote.order + 1 : 0;
    
    const note = new Note({
      user: req.user._id,
      title: title?.trim() || '',
      content: content.trim(),
      label: label || 'Work',
      color: color || '#3B82F6',
      tags: tags || [],
      order
    });
    
    await note.save();
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create note',
      error: error.message
    });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const note = await Note.findOne({ _id: id, user: req.user._id });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    // Update allowed fields
    const allowedUpdates = ['title', 'content', 'label', 'color', 'tags'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        note[field] = updates[field];
      }
    });
    
    await note.save();
    
    res.json({
      success: true,
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update note',
      error: error.message
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete note',
      error: error.message
    });
  }
};

// Toggle note pin
const toggleNotePin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findOne({ _id: id, user: req.user._id });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    await note.togglePin();
    
    res.json({
      success: true,
      message: `Note ${note.pinned ? 'pinned' : 'unpinned'}`,
      note
    });
  } catch (error) {
    console.error('Error toggling note pin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle note pin',
      error: error.message
    });
  }
};

// Toggle note archive
const toggleNoteArchive = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findOne({ _id: id, user: req.user._id });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    await note.toggleArchive();
    
    res.json({
      success: true,
      message: `Note ${note.archived ? 'archived' : 'unarchived'}`,
      note
    });
  } catch (error) {
    console.error('Error toggling note archive:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle note archive',
      error: error.message
    });
  }
};

// Toggle note trash
const toggleNoteTrash = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findOne({ _id: id, user: req.user._id });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    await note.toggleTrash();
    
    res.json({
      success: true,
      message: `Note ${note.trashed ? 'moved to trash' : 'restored'}`,
      note
    });
  } catch (error) {
    console.error('Error toggling note trash:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle note trash',
      error: error.message
    });
  }
};

// Reorder notes
const reorderNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (!Array.isArray(notes)) {
      return res.status(400).json({
        success: false,
        message: 'Notes array is required'
      });
    }
    
    // Update order for each note
    const updatePromises = notes.map((noteId, index) => {
      return Note.findOneAndUpdate(
        { _id: noteId, user: req.user._id },
        { order: index },
        { new: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({
      success: true,
      message: 'Notes reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder notes',
      error: error.message
    });
  }
};

// Get note statistics
const getNoteStats = async (req, res) => {
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
    
    const stats = await Note.aggregate([
      { $match: { user: req.user._id, ...dateFilter } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          pinnedNotes: { $sum: { $cond: ['$pinned', 1, 0] } },
          archivedNotes: { $sum: { $cond: ['$archived', 1, 0] } },
          trashedNotes: { $sum: { $cond: ['$trashed', 1, 0] } },
          totalWords: { $sum: '$wordCount' }
        }
      }
    ]);
    
    const labelStats = await Note.aggregate([
      { $match: { user: req.user._id, ...dateFilter } },
      {
        $group: {
          _id: '$label',
          count: { $sum: 1 },
          totalWords: { $sum: '$wordCount' }
        }
      }
    ]);
    
    const result = {
      totalNotes: stats[0]?.totalNotes || 0,
      pinnedNotes: stats[0]?.pinnedNotes || 0,
      archivedNotes: stats[0]?.archivedNotes || 0,
      trashedNotes: stats[0]?.trashedNotes || 0,
      totalWords: stats[0]?.totalWords || 0,
      labelStats
    };
    
    res.json({
      success: true,
      stats: result
    });
  } catch (error) {
    console.error('Error getting note stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get note statistics',
      error: error.message
    });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  toggleNotePin,
  toggleNoteArchive,
  toggleNoteTrash,
  reorderNotes,
  getNoteStats
}; 