import { FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        <Link to="/">FocusForge</Link>
      </h1>

      <div className="flex gap-4 items-center">
        <Link
          to="/login"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline"
        >
          Signup
        </Link>

        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? (
            <FaSun className="text-yellow-500" />
          ) : (
            <FaMoon className="text-blue-500" />
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
