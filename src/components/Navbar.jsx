// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, [location]); // re-check login status on route change

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
      >
        FocusForge
      </Link>

      <div className="space-x-4 text-sm md:text-base flex items-center">
        {!isLoggedIn ? (
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
        ) : (
          <>
            <img
              src="/src/assets/default-avatar.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-blue-400"
            />
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
