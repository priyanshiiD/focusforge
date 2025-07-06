const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  toggleNotePin,
  toggleNoteArchive,
  toggleNoteTrash,
  reorderNotes,
  getNoteStats
} = require('../controllers/noteController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all notes
router.get('/', getNotes);

// Get note statistics (must come before /:id routes)
router.get('/stats', getNoteStats);

// Reorder notes (must come before /:id routes)
router.put('/reorder', reorderNotes);

// Create a new note
router.post('/', createNote);

// Update a note
router.put('/:id', updateNote);

// Delete a note
router.delete('/:id', deleteNote);

// Toggle note pin
router.patch('/:id/pin', toggleNotePin);

// Toggle note archive
router.patch('/:id/archive', toggleNoteArchive);

// Toggle note trash
router.patch('/:id/trash', toggleNoteTrash);

module.exports = router; 