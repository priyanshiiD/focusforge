import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Fake login
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-300">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
