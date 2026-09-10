'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface FlockChartProps {
  data: {
    month: string;
    expenses: number;
    income: number;
    flockChange: number;
  }[];
}

export default function FlockChart({ data }: FlockChartProps) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'تغير عدد القطيع',
        data: data.map((d) => d.flockChange),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📈 نمو القطيع</h2>
      <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
    </div>
  );
}
