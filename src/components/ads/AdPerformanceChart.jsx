import {
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

export default function AdPerformanceChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Clicks',
        data: [30, 50, 40, 60, 70, 80],
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Impressions',
        data: [100, 150, 130, 170, 200, 250],
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-2xl font-bold mb-4">Performance Analytics</h2>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}