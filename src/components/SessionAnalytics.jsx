// src/components/SessionAnalytics.jsx
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

const SessionAnalytics = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '{}');
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const labels = last7Days;
    const values = last7Days.map(date => sessions[date] || 0);

    setData({
      labels,
      datasets: [{
        label: 'Pomodoro Sessions',
        data: values,
        backgroundColor: 'rgba(59,130,246,0.6)', // Tailwind blue-500
        borderRadius: 5,
      }]
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">📊 Weekly Productivity</h2>
      <Bar data={data} />
    </div>
  );
};

export default SessionAnalytics;
