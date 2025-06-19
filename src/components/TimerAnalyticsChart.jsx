// src/components/TimerAnalyticsChart.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const data = {
  labels: ['Session 1', 'Session 2', 'Session 3'],
  datasets: [
    {
      label: 'Focus Minutes',
      data: [25, 30, 20],
      fill: true,
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.3,
      backgroundColor: 'rgba(75,192,192,0.2)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Pomodoro Session Analytics',
    },
  },
};

export default function TimerAnalyticsChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">📊 Analytics</h2>
      <Line data={data} options={options} />
    </div>
  );
}
