// src/components/Sidebar.jsx
import { FaTasks, FaStickyNote, FaStopwatch, FaHome, FaUserCircle, FaQuoteLeft, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { name: 'Dashboard', icon: <FaHome />, to: '/' },
  { name: 'Tasks', icon: <FaTasks />, to: '/tasks' },
  { name: 'Notes', icon: <FaStickyNote />, to: '/notes' },
  { name: 'Timer', icon: <FaStopwatch />, to: '/timer' },
];

const MOTIVATIONAL_QUOTES = [
  "Stay focused and never give up!",
  "Small steps every day lead to big results.",
  "Productivity is never an accident.",
  "You are capable of amazing things.",
  "Discipline is the bridge between goals and accomplishment.",
  "Dream big. Start small. Act now."
];

function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation();
  const { user } = useAuth();
  const quote = MOTIVATIONAL_QUOTES[(user?.name?.length || 0) % MOTIVATIONAL_QUOTES.length];

  // Sidebar content
  const sidebarContent = (
    <div className="w-72 min-h-screen bg-gradient-to-br from-blue-200/80 via-purple-100/80 to-pink-100/80 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 text-gray-900 dark:text-white backdrop-blur-2xl border-r border-white/20 dark:border-gray-700/20 flex flex-col relative">
      {/* Close button for mobile */}
      {onClose && (
        <button
          className="absolute top-4 right-4 md:hidden text-2xl text-gray-700 dark:text-gray-200 bg-white/40 dark:bg-gray-800/40 rounded-full p-2 z-20 hover:bg-white/70 dark:hover:bg-gray-700/70 transition"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      )}
      {/* User Profile */}
      <div className="flex flex-col items-center mb-8 mt-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center shadow-lg mb-2 border-4 border-white/40 dark:border-gray-700/40">
          {user?.name ? (
            <span className="text-4xl font-bold text-white drop-shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <FaUserCircle className="text-5xl text-white/80" />
          )}
        </div>
        <span className="font-semibold text-lg text-gray-800 dark:text-white mt-1">
          {user?.name || 'User'}
        </span>
      </div>
      {/* Navigation Links */}
      <nav className="space-y-3 flex-1 w-full">
        {links.map((link, index) => (
          <motion.div
            key={link.name}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.08 }}
          >
            <Link
              to={link.to}
              className={`flex items-center gap-4 p-3 rounded-2xl transition-all text-lg font-medium group shadow-sm backdrop-blur-md border border-white/20 dark:border-gray-700/20
                ${location.pathname === link.to
                  ? 'bg-gradient-to-r from-blue-400/80 to-purple-400/80 text-white shadow-lg scale-105'
                  : 'bg-white/40 dark:bg-gray-800/40 hover:bg-gradient-to-r hover:from-blue-200/80 hover:to-purple-200/80 dark:hover:from-gray-700/60 dark:hover:to-gray-800/60 hover:text-blue-800 dark:hover:text-blue-200'}
              `}
              onClick={onClose}
            >
              <span className="text-2xl">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          </motion.div>
        ))}
      </nav>
      {/* Motivational Quote */}
      <div className="mt-8 mb-4 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 shadow flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 border border-white/20 dark:border-gray-700/20">
        <FaQuoteLeft className="text-purple-400 text-lg" />
        <span className="italic">{quote}</span>
      </div>
    </div>
  );

  // Desktop sidebar
  return (
    <>
      {/* Desktop: show sidebar always */}
      <div className="hidden md:block h-full">
        {sidebarContent}
      </div>
      {/* Mobile: show sidebar as drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 flex md:hidden"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
              onClick={onClose}
            />
            {/* Sidebar drawer */}
            <div className="relative z-40 h-full">
              {sidebarContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
