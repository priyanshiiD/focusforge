// src/pages/Notes.jsx
import { useEffect, useState } from 'react';
import { FaTrash, FaDownload, FaFileExport, FaThumbtack, FaArchive } from 'react-icons/fa';
import { marked } from 'marked';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  Work: 'bg-blue-200 dark:bg-blue-600',
  Personal: 'bg-green-200 dark:bg-green-600',
  Study: 'bg-purple-200 dark:bg-purple-600',
  Idea: 'bg-yellow-200 dark:bg-yellow-600',
};

const QUOTES = [
  "Productivity is never an accident.",
  "Focus on being productive instead of busy.",
  "Do something today that your future self will thank you for.",
  "Success usually comes to those who are too busy to be looking for it.",
];

function Notes() {
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem('notes');
    return stored ? JSON.parse(stored) : [];
  });

  const [newNote, setNewNote] = useState('');
  const [label, setLabel] = useState('Work');
  const [filter, setFilter] = useState('All');
  const [showPreview, setShowPreview] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      content: newNote,
      label,
      pinned: false,
      archived: false,
      trashed: false,
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const togglePin = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const archiveNote = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, archived: !note.archived } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, trashed: true } : note
    ));
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">🗒️ Notes</h1>

      <div className="text-center text-md italic text-purple-600 dark:text-purple-300 mb-4">
        {QUOTES[quoteIndex]}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm text-white font-semibold">
        <div className="bg-blue-400 p-3 rounded-lg">Total: {analytics.total}</div>
        <div className="bg-green-400 p-3 rounded-lg">Active: {analytics.active}</div>
        <div className="bg-purple-400 p-3 rounded-lg">Archived: {analytics.archived}</div>
        <div className="bg-red-400 p-3 rounded-lg">Trashed: {analytics.trashed}</div>
      </div>

      {/* New note + search */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <textarea
          rows="3"
          placeholder="Write a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-3 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <div className="flex flex-col gap-2">
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {labelOptions.map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <button
            onClick={addNote}
            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-purple-600 hover:underline mt-1"
          >
            {showPreview ? "Hide Preview" : "Preview Markdown"}
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-3 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['All', 'Pinned', 'Archived', ...labelOptions].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${
              filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notes list */}
      <AnimatePresence>
        {filteredNotes.map(note => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`mb-4 p-4 rounded shadow ${COLORS[note.label]} text-gray-800 dark:text-white`}
          >
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: showPreview
                      ? marked.parse(note.content)
                      : `<p>${note.content.replace(/\n/g, "<br/>")}</p>`,
                  }}
                />
                <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  🏷 {note.label}
                </div>
              </div>
              <div className="flex gap-2 items-start ml-4">
                <button onClick={() => togglePin(note.id)} title="Pin">
                  <FaThumbtack className={note.pinned ? "text-yellow-500" : "text-gray-400"} />
                </button>
                <button onClick={() => archiveNote(note.id)} title="Archive">
                  <FaArchive className="text-purple-400" />
                </button>
                <button onClick={() => deleteNote(note.id)} title="Trash">
                  <FaTrash className="text-red-400" />
                </button>
                <button onClick={() => exportNote(note.content)} title="Export as TXT">
                  <FaDownload className="text-blue-400" />
                </button>
                <button onClick={() => exportNote(note.content, 'md')} title="Export as Markdown">
                  <FaFileExport className="text-green-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Notes;
