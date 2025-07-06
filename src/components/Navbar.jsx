// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md p-4 flex justify-between items-center border-b border-white/20 dark:border-gray-700/20"
    >
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
      >
        FocusForge
      </Link>

      <div className="flex items-center gap-4 text-sm md:text-base">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="text-xl text-gray-700 dark:text-gray-300 hover:text-purple-500 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Toggle Theme"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </motion.button>

        {/* Logout Button */}
        {isAuthenticated && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Logout"
            >
            <FaSignOutAlt />
            <span className="hidden md:block">Logout</span>
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}

export default Navbar;
