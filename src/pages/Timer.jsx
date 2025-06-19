// src/pages/Timer.jsx
import { useEffect, useState, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const MODES = {
  pomodoro: { label: "Pomodoro", minutes: 25 },
  shortBreak: { label: "Short Break", minutes: 5 },
  longBreak: { label: "Long Break", minutes: 15 },
};

const Timer = () => {
  const [mode, setMode] = useState("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(MODES[mode].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const totalSeconds = MODES[mode].minutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, secondsLeft]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setSecondsLeft(MODES[newMode].minutes * 60);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setSecondsLeft(MODES[mode].minutes * 60);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-sky-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        ⏳ Focus Timer
      </h1>

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
            pathColor: "url(#gradient)", // will define below
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

      <div className="flex gap-4">
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
    </div>
  );
};

export default Timer;
