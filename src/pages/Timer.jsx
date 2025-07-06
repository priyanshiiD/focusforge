// src/pages/Timer.jsx
import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStop, FaRedo, FaPlus, FaMinus, FaHistory, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';

const POMODORO_TIMES = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

function Timer() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIMES.work);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [sessions, setSessions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [customTime, setCustomTime] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getTimerSessions();
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(POMODORO_TIMES[mode]);
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    try {
      const sessionData = {
        mode,
        duration: POMODORO_TIMES[mode] - timeLeft,
        completed: true,
        timestamp: new Date().toISOString(),
      };
      
      await apiService.createTimerSession(sessionData);
      await loadSessions();
      
      // Auto-switch to next mode
      if (mode === 'work') {
        setMode('shortBreak');
        setTimeLeft(POMODORO_TIMES.shortBreak);
      } else {
        setMode('work');
        setTimeLeft(POMODORO_TIMES.work);
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const setCustomTimer = () => {
    setTimeLeft(customTime * 60);
    setMode('custom');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = POMODORO_TIMES[mode] || (customTime * 60);
    return ((total - timeLeft) / total) * 100;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work': return 'from-red-500 to-orange-500';
      case 'shortBreak': return 'from-green-500 to-blue-500';
      case 'longBreak': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'work': return '💼';
      case 'shortBreak': return '☕';
      case 'longBreak': return '🌴';
      default: return '⏱️';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            ⏱️ Focus Timer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Stay focused, stay productive
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl">
              {/* Mode Display */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{getModeIcon()}</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                  {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : mode === 'longBreak' ? 'Long Break' : 'Custom Timer'}
                </h2>
              </div>

              {/* Timer Circle */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(156, 163, 175, 0.2)"
                    strokeWidth="4"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={`url(#${getModeColor().replace(/\s/g, '-')})`}
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id={getModeColor().replace(/\s/g, '-')} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={getModeColor().split(' ')[0].replace('from-', '')} />
                      <stop offset="100%" stopColor={getModeColor().split(' ')[1].replace('to-', '')} />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Time Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800 dark:text-gray-200 font-mono">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {Math.round(getProgress())}% Complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mb-6">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FaPlay className="text-sm" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FaPause className="text-sm" />
                    Pause
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FaRedo className="text-sm" />
                  Reset
                </button>
              </div>

              {/* Mode Buttons */}
              <div className="flex justify-center gap-3 flex-wrap">
                {Object.entries(POMODORO_TIMES).map(([key, seconds]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMode(key);
                      setTimeLeft(seconds);
                      setIsRunning(false);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      mode === key
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-600/50 border border-gray-200/50 dark:border-gray-600/50'
                    }`}
                  >
                    {key === 'work' ? 'Work' : key === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Custom Timer */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Custom Timer</h3>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setCustomTime(Math.max(1, customTime - 5))}
                  className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-500/50 transition-colors"
                >
                  <FaMinus className="text-sm" />
                </button>
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{customTime} min</span>
                <button
                  onClick={() => setCustomTime(customTime + 5)}
                  className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-500/50 transition-colors"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
              <button
                onClick={setCustomTimer}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Set Custom Timer
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-200/50 text-blue-700 dark:text-blue-300 hover:from-blue-600/30 hover:to-blue-700/30 transition-all duration-200"
                >
                  <span className="font-medium">Session History</span>
                  <FaHistory />
                </button>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-200/50 text-green-700 dark:text-green-300 hover:from-green-600/30 hover:to-green-700/30 transition-all duration-200"
                >
                  <span className="font-medium">Analytics</span>
                  <FaChartLine />
                </button>
              </div>
            </div>

            {/* Today's Stats */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Today's Focus</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sessions</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {sessions.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString()).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Time</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {Math.round(sessions
                      .filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString())
                      .reduce((acc, s) => acc + s.duration, 0) / 60)} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {sessions.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString() && s.completed).length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Session History */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Session History</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {sessions.slice(0, 10).map((session, index) => (
                  <div
                    key={session._id || index}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${
                        session.mode === 'work' ? 'text-red-500' :
                        session.mode === 'shortBreak' ? 'text-green-500' :
                        'text-purple-500'
                      }`}>
                        {session.mode === 'work' ? '💼' : session.mode === 'shortBreak' ? '☕' : '🌴'}
                      </span>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                          {session.mode === 'work' ? 'Work Session' : session.mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {Math.round(session.duration / 60)} min
                      </div>
                      <div className={`text-xs ${session.completed ? 'text-green-600' : 'text-red-600'}`}>
                        {session.completed ? 'Completed' : 'Interrupted'}
                      </div>
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No sessions yet. Start your first focus session!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Timer;
