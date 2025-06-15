import { Link } from "react-router-dom";
import { FaTasks, FaStickyNote, FaStopwatch } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="p-6 min-h-screen font-sans transition-colors duration-300
  bg-gradient-to-br from-rose-50 to-sky-50 
  dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Welcome to FocusForge 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* TASKS */}
        <Link to="/tasks">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <FaTasks className="text-3xl text-blue-600 mb-3" />
            <h2 className="text-xl font-semibold text-blue-700 mb-1">Tasks</h2>
            <p className="text-gray-600 text-sm">Plan and manage your goals efficiently.</p>
            <p className="text-sm text-blue-400 mt-2">Go to Tasks →</p>
          </div>
        </Link>

        {/* NOTES */}
        <Link to="/notes">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <FaStickyNote className="text-3xl text-pink-600 mb-3" />
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Notes</h2>
            <p className="text-gray-600 text-sm">Write down your thoughts and ideas.</p>
            <p className="text-sm text-pink-400 mt-2">Go to Notes →</p>
          </div>
        </Link>

        {/* TIMER */}
        <Link to="/timer">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <FaStopwatch className="text-3xl text-purple-600 mb-3" />
            <h2 className="text-xl font-semibold text-purple-700 mb-1">Pomodoro Timer</h2>
            <p className="text-gray-600 text-sm">Boost your focus using Pomodoro sessions.</p>
            <p className="text-sm text-purple-400 mt-2">Start Timer →</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
