// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert('Passwords do not match!');
      return;
    }
    // Here you'd call your API or Firebase to register the user
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full space-y-6"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Create Account
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={handleChange}
          className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <button
          type="submit"
          className="w-full p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md font-semibold hover:opacity-90 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
