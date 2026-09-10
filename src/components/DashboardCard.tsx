'use client';

import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'primary' | 'secondary' | 'blue' | 'green' | 'red';
}

const colorClasses = {
  primary: 'bg-primary-100 text-primary-600 border-primary-300',
  secondary: 'bg-secondary-100 text-secondary-600 border-secondary-300',
  blue: 'bg-blue-100 text-blue-600 border-blue-300',
  green: 'bg-green-100 text-green-600 border-green-300',
  red: 'bg-red-100 text-red-600 border-red-300',
};

export default function DashboardCard({ title, value, icon, color }: DashboardCardProps) {
  return (
    <div className={`rounded-lg border-2 p-6 text-center shadow-md transition hover:shadow-lg ${colorClasses[color]}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-sm font-semibold opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
