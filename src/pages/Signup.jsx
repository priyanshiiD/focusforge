// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await register(formData.name, formData.email, formData.password);
      navigate('/login');
    } catch {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 px-4"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20"
      >
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6"
        >
          Create Account
        </motion.h2>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block mb-1 text-gray-600 dark:text-gray-300 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className={`w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all ${
                validationErrors.name 
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-400' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-400'
              }`}
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              disabled={isLoading}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block mb-1 text-gray-600 dark:text-gray-300 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              className={`w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all ${
                validationErrors.email 
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-400' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-400'
              }`}
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              disabled={isLoading}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
            )}
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block mb-1 text-gray-600 dark:text-gray-300 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              className={`w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all ${
                validationErrors.password 
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-400' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-purple-400'
              }`}
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
            )}
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block mb-1 text-gray-600 dark:text-gray-300 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className={`w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all ${
                validationErrors.confirmPassword 
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-400' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-purple-400'
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
            )}
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default Signup;
