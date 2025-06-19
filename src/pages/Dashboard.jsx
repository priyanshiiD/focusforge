import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaStickyNote, FaStopwatch } from "react-icons/fa";
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

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });
  const [noteStats, setNoteStats] = useState({ total: 0, pinned: 0 });
  const [pomodoroStats, setPomodoroStats] = useState({ sessions: 0 });

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
    <div className="p-6 min-h-screen bg-gradient-to-br from-rose-50 to-sky-50 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Link to="/tasks">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <FaTasks className="text-3xl text-blue-600 mb-3" />
            <h2 className="text-xl font-semibold text-blue-700 mb-1 dark:text-blue-400">Tasks</h2>
            <p className="text-sm">Plan and manage your goals efficiently.</p>
            <p className="text-sm text-blue-400 mt-2">Go to Tasks →</p>
          </div>
        </Link>

        <Link to="/notes">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <FaStickyNote className="text-3xl text-pink-600 mb-3" />
            <h2 className="text-xl font-semibold text-pink-700 mb-1 dark:text-pink-400">Notes</h2>
            <p className="text-sm">Write down your thoughts and ideas.</p>
            <p className="text-sm text-pink-400 mt-2">Go to Notes →</p>
          </div>
        </Link>

        <Link to="/timer">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <FaStopwatch className="text-3xl text-purple-600 mb-3" />
            <h2 className="text-xl font-semibold text-purple-700 mb-1 dark:text-purple-400">Pomodoro</h2>
            <p className="text-sm">Boost your focus using sessions.</p>
            <p className="text-sm text-purple-400 mt-2">Start Timer →</p>
          </div>
        </Link>
      </div>

      {/* Stats & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="font-bold mb-2 text-blue-600 dark:text-blue-400">Task Overview</h3>
          <Bar data={taskChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="font-bold mb-2 text-pink-600 dark:text-pink-400">Notes</h3>
          <Doughnut data={noteChart} options={{ responsive: true }} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="font-bold mb-2 text-purple-600 dark:text-purple-400">Pomodoro Stats</h3>
          <Doughnut data={pomoChart} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
