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
    return <main>{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      <Sidebar />
      <div className="flex-1">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
