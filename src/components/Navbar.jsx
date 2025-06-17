// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

function Navbar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, [location]);

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

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
      >
        FocusForge
      </Link>

      <div className="flex items-center gap-4 text-sm md:text-base">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-xl text-gray-700 dark:text-gray-300 hover:text-purple-500 transition"
          title="Toggle Theme"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Show Login/Signup only if not logged in */}
        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
