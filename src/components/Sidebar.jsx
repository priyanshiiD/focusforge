// src/components/Sidebar.jsx
import { FaTasks, FaStickyNote, FaStopwatch, FaHome } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { name: 'Dashboard', icon: <FaHome />, to: '/' },
  { name: 'Tasks', icon: <FaTasks />, to: '/tasks' },
  { name: 'Notes', icon: <FaStickyNote />, to: '/notes' },
  { name: 'Timer', icon: <FaStopwatch />, to: '/timer' },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">FocusForge</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 dark:text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
  className={`${
    isOpen ? 'block' : 'hidden'
  } md:flex flex-col w-64 p-6 shadow-xl rounded-tr-3xl rounded-br-3xl transition-all 
     fixed md:static top-0 h-full z-40 bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 
     dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white`}
>

        <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
  FocusForge
</h2>

        <nav className="space-y-4">
          {links.map((link) => (
            <Link
  key={link.name}
  to={link.to}
  onClick={() => setIsOpen(false)}
  className={`flex items-center gap-3 p-3 rounded-xl transition-all text-lg font-medium ${
    location.pathname === link.to
      ? 'bg-white/60 dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow'
      : 'hover:bg-white/30 dark:hover:bg-gray-700 hover:text-blue-800 dark:hover:text-blue-300'
  }`}
>

              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
