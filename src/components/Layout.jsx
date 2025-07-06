import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout({ children }) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const noLayoutRoutes = ['/login', '/signup'];
  const isAuthPage = noLayoutRoutes.includes(location.pathname);

  if (isAuthPage) {
    return <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-black dark:text-white transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1 w-full px-2 sm:px-4 md:px-6 py-4 md:py-8">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
