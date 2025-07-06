import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaStickyNote, FaStopwatch, FaQuoteLeft } from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const MOTIVATIONAL_QUOTES = [
  "Stay focused and never give up!",
  "Small steps every day lead to big results.",
  "Productivity is never an accident.",
  "You are capable of amazing things.",
  "Discipline is the bridge between goals and accomplishment.",
  "Dream big. Start small. Act now."
];

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });
  const [noteStats, setNoteStats] = useState({ total: 0, pinned: 0 });
  const [pomodoroStats, setPomodoroStats] = useState({ sessions: 0 });
  const { user } = useAuth();
  const quote = MOTIVATIONAL_QUOTES[(user?.name?.length || 0) % MOTIVATIONAL_QUOTES.length];

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const pomos = JSON.parse(localStorage.getItem("pomodoroSessions")) || [];

    setTaskStats({
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
    });

    setNoteStats({
      total: notes.filter(n => !n.trashed).length,
      pinned: notes.filter(n => n.pinned && !n.trashed).length,
    });

    setPomodoroStats({ sessions: pomos.length });
  }, []);

  const taskChart = {
    labels: ["Total", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [taskStats.total, taskStats.completed],
        backgroundColor: ["#60a5fa", "#4ade80"],
      },
    ],
  };

  const noteChart = {
    labels: ["Pinned", "Others"],
    datasets: [
      {
        label: "Notes",
        data: [noteStats.pinned, noteStats.total - noteStats.pinned],
        backgroundColor: ["#f472b6", "#c4b5fd"],
      },
    ],
  };

  const pomoChart = {
    labels: ["Pomodoro Sessions"],
    datasets: [
      {
        data: [pomodoroStats.sessions],
        backgroundColor: ["#a78bfa"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-2 sm:p-4 md:p-6 bg-gradient-to-br from-rose-50 to-sky-50 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white"
    >
      {/* Welcome Message & Motivational Widget */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            Welcome, {user?.name ? user.name.split(' ')[0] : 'Productive Human'}! 👋
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium">
            Here’s your productivity snapshot for today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 rounded-2xl px-4 py-2 shadow border border-white/20 dark:border-gray-700/20 backdrop-blur-md">
          <FaQuoteLeft className="text-purple-400 text-lg" />
          <span className="italic text-sm text-gray-700 dark:text-gray-200">{quote}</span>
        </div>
      </motion.div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/tasks">
          <motion.div 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 backdrop-blur-lg transition flex flex-col items-start hover:shadow-2xl group"
          >
            <FaTasks className="text-3xl text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold text-blue-700 mb-1 dark:text-blue-400">Tasks</h2>
            <p className="text-sm">Plan and manage your goals efficiently.</p>
            <p className="text-sm text-blue-400 mt-2 font-medium">Go to Tasks →</p>
          </motion.div>
        </Link>

        <Link to="/notes">
          <motion.div 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 backdrop-blur-lg transition flex flex-col items-start hover:shadow-2xl group"
          >
            <FaStickyNote className="text-3xl text-pink-600 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold text-pink-700 mb-1 dark:text-pink-400">Notes</h2>
            <p className="text-sm">Write down your thoughts and ideas.</p>
            <p className="text-sm text-pink-400 mt-2 font-medium">Go to Notes →</p>
          </motion.div>
        </Link>

        <Link to="/timer">
          <motion.div 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 backdrop-blur-lg transition flex flex-col items-start hover:shadow-2xl group"
          >
            <FaStopwatch className="text-3xl text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold text-purple-700 mb-1 dark:text-purple-400">Pomodoro</h2>
            <p className="text-sm">Boost your focus using sessions.</p>
            <p className="text-sm text-purple-400 mt-2 font-medium">Start Timer →</p>
          </motion.div>
        </Link>
      </div>

      {/* Stats & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 backdrop-blur-lg"
        >
          <h3 className="font-bold mb-2 text-blue-600 dark:text-blue-400">Task Overview</h3>
          <Bar data={taskChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 backdrop-blur-lg"
        >
          <h3 className="font-bold mb-2 text-pink-600 dark:text-pink-400">Notes</h3>
          <Doughnut data={noteChart} options={{ responsive: true }} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 backdrop-blur-lg"
        >
          <h3 className="font-bold mb-2 text-purple-600 dark:text-purple-400">Pomodoro Stats</h3>
          <Doughnut data={pomoChart} options={{ responsive: true }} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
