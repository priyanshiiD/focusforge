// src/pages/Timer.jsx
import { useEffect, useState, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MODES = {
  pomodoro: { label: "Pomodoro", minutes: 25 },
  shortBreak: { label: "Short Break", minutes: 5 },
  longBreak: { label: "Long Break", minutes: 15 },
};

const QUOTES = [
  "Stay focused and never give up.",
  "Discipline is the bridge between goals and accomplishment.",
  "Small steps every day lead to big changes.",
  "You’ve got this. Keep going!",
  "Don’t watch the clock; do what it does. Keep going.",
];

const Timer = () => {
  const [mode, setMode] = useState("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(MODES[mode].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [quote, setQuote] = useState("");
  const [sessionData, setSessionData] = useState({
    Pomodoro: 0,
    "Short Break": 0,
    "Long Break": 0,
  });

  const timerRef = useRef(null);

  const totalSeconds = MODES[mode].minutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, [mode]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      clearInterval(timerRef.current);
      autoSwitchMode();
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, secondsLeft]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setSecondsLeft(MODES[newMode].minutes * 60);
    setIsRunning(false);
  };

  const autoSwitchMode = () => {
    const currentLabel = MODES[mode].label;

    setSessionData((prev) => ({
      ...prev,
      [currentLabel]: prev[currentLabel] + 1,
    }));

    if (mode === "pomodoro") {
      const totalPomodoros = sessionData["Pomodoro"] + 1;
      const nextMode = totalPomodoros % 4 === 0 ? "longBreak" : "shortBreak";
      switchMode(nextMode);
      setIsRunning(true);
    } else {
      switchMode("pomodoro");
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setSecondsLeft(MODES[mode].minutes * 60);
    setIsRunning(false);
  };

  const chartData = {
    labels: ["Pomodoro", "Short Break", "Long Break"],
    datasets: [
      {
        label: "Completed Sessions",
        data: [
          sessionData["Pomodoro"],
          sessionData["Short Break"],
          sessionData["Long Break"],
        ],
        backgroundColor: ["#6366f1", "#10b981", "#f43f5e"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-sky-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">⏳ Focus Timer</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6 italic text-lg max-w-xl">{quote}</p>

      <div className="flex gap-4 mb-8">
        {Object.entries(MODES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-4 py-2 rounded-full transition-all font-semibold ${
              mode === key
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-64 h-64 mb-6">
        <CircularProgressbar
          value={percentage}
          text={`${minutes}:${seconds}`}
          styles={buildStyles({
            textColor: "#333",
            pathColor: "url(#gradient)",
            trailColor: "#ddd",
          })}
        />
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Reset
        </button>
      </div>

      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">📊 Session Analytics</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default Timer;
