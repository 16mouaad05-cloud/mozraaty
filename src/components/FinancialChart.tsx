'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FinancialChartProps {
  data: {
    month: string;
    expenses: number;
    income: number;
    flockChange: number;
  }[];
}

export default function FinancialChart({ data }: FinancialChartProps) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'الدخل',
        data: data.map((d) => d.income),
        backgroundColor: '#22c55e',
      },
      {
        label: 'المصاريف',
        data: data.map((d) => d.expenses),
        backgroundColor: '#ef4444',
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 الأموال الداخلة والخارجة</h2>
      <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
    </div>
  );
}
