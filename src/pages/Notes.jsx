// src/pages/Notes.jsx
import { useEffect, useState } from 'react';
import { FaTrash, FaDownload, FaFileExport, FaThumbtack, FaArchive, FaSearch, FaPlus } from 'react-icons/fa';
import { marked } from 'marked';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';

const COLORS = {
  Work: 'from-blue-500/20 to-blue-600/20 border-blue-200/50',
  Personal: 'from-green-500/20 to-green-600/20 border-green-200/50',
  Study: 'from-purple-500/20 to-purple-600/20 border-purple-200/50',
  Idea: 'from-yellow-500/20 to-yellow-600/20 border-yellow-200/50',
};

const QUOTES = [
  "Productivity is never an accident.",
  "Focus on being productive instead of busy.",
  "Do something today that your future self will thank you for.",
  "Success usually comes to those who are too busy to be looking for it.",
];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [label, setLabel] = useState('Work');
  const [filter, setFilter] = useState('All');
  const [showPreview, setShowPreview] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getNotes();
      setNotes(response.notes || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const noteData = {
        content: newNote,
        label,
        pinned: false,
        archived: false,
        trashed: false,
      };
      
      const response = await apiService.createNote(noteData);
      setNotes([response.note, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const togglePin = async (id) => {
    try {
      await apiService.toggleNotePin(id);
      setNotes(notes.map(note =>
        note._id === id ? { ...note, pinned: !note.pinned } : note
      ));
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const archiveNote = async (id) => {
    try {
      await apiService.updateNote(id, { archived: !notes.find(n => n._id === id)?.archived });
      setNotes(notes.map(note =>
        note._id === id ? { ...note, archived: !note.archived } : note
      ));
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await apiService.deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const exportNote = (content, format = 'txt') => {
    const blob = new Blob([content], {
      type: format === 'md' ? 'text/markdown' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const labelOptions = Object.keys(COLORS);

  const filteredNotes = notes.filter(note => {
    if (note.trashed) return false;
    if (filter === 'All') return !note.archived;
    if (filter === 'Pinned') return note.pinned && !note.archived;
    if (filter === 'Archived') return note.archived;
    return note.label === filter && !note.archived;
  }).filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const analytics = {
    total: notes.length,
    active: notes.filter(n => !n.archived && !n.trashed).length,
    archived: notes.filter(n => n.archived).length,
    trashed: notes.filter(n => n.trashed).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📝 Notes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 italic">
            {QUOTES[quoteIndex]}
          </p>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-lg border border-blue-200/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{analytics.total}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Notes</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-lg border border-green-200/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{analytics.active}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Active</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-lg border border-purple-200/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{analytics.archived}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Archived</div>
          </div>
          <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-lg border border-red-200/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">{analytics.trashed}</div>
            <div className="text-sm text-red-600 dark:text-red-400">Trashed</div>
          </div>
        </motion.div>

        {/* New Note Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/50 dark:border-gray-700/50 rounded-3xl p-6 mb-8 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <textarea
                rows="4"
                placeholder="Write your thoughts, ideas, or reminders..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all resize-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all"
              >
                {labelOptions.map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <button
                onClick={addNote}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="text-sm" />
                Add Note
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                {showPreview ? "Hide Preview" : "Preview Markdown"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-6"
        >
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search your notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 mb-6 flex-wrap"
        >
          {['All', 'Pinned', 'Archived', ...labelOptions].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                filter === f
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-600/50 border border-gray-200/50 dark:border-gray-600/50'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Notes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredNotes.map(note => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`bg-gradient-to-br ${COLORS[note.label]} backdrop-blur-lg border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {note.label}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => togglePin(note._id)}
                      className={`p-2 rounded-full transition-all ${
                        note.pinned
                          ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                          : 'bg-gray-200/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 hover:bg-yellow-500/20 hover:text-yellow-600 dark:hover:text-yellow-400'
                      }`}
                    >
                      <FaThumbtack className="text-sm" />
                    </button>
                    <button
                      onClick={() => archiveNote(note._id)}
                      className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                    >
                      <FaArchive className="text-sm" />
                    </button>
                    <button
                      onClick={() => exportNote(note.content)}
                      className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 hover:bg-green-500/20 hover:text-green-600 dark:hover:text-green-400 transition-all"
                    >
                      <FaDownload className="text-sm" />
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <div
                    className="text-gray-800 dark:text-gray-200 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: showPreview
                        ? marked.parse(note.content)
                        : note.content.replace(/\n/g, '<br>')
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm ? 'No notes found matching your search.' : 'No notes yet. Start writing!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Notes;
