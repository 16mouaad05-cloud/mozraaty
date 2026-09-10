'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardCard from '@components/DashboardCard';
import RecentTransactions from '@components/RecentTransactions';
import FinancialChart from '@components/FinancialChart';
import FlockChart from '@components/FlockChart';
import toast from 'react-hot-toast';
import { DashboardData } from '@types/index';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl">🐑</div>
          <p className="mt-4 text-xl text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">لم يتم العثور على بيانات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-12 bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">مرحباً بك في مزرعتي 🐑</h1>
          <p className="text-lg text-gray-600">
            قطيعك ينمو خطوة بخطوة. من {dashboardData.flock.currentCount} رأس اليوم... إلى مشروع أكبر غداً.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <DashboardCard
            title="عدد الأغنام"
            value={dashboardData.flock.currentCount}
            icon="🐑"
            color="primary"
          />
          <DashboardCard
            title="المواليد"
            value={dashboardData.flock.totalBirths}
            icon="🐣"
            color="secondary"
          />
          <DashboardCard
            title="المشتريات"
            value={dashboardData.flock.totalPurchases}
            icon="🛒"
            color="blue"
          />
          <DashboardCard
            title="المبيعات"
            value={dashboardData.flock.totalSales}
            icon="💰"
            color="green"
          />
          <DashboardCard
            title="النفوق"
            value={dashboardData.flock.totalDeaths}
            icon="💀"
            color="red"
          />
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <DashboardCard
            title="رأس المال"
            value={`${dashboardData.financial.initialCapital.toLocaleString()} د.ج`}
            icon="💵"
            color="primary"
          />
          <DashboardCard
            title="المصاريف"
            value={`${dashboardData.financial.totalExpenses.toLocaleString()} د.ج`}
            icon="💸"
            color="red"
          />
          <DashboardCard
            title="المشتريات"
            value={`${dashboardData.financial.totalPurchases.toLocaleString()} د.ج`}
            icon="🛍️"
            color="blue"
          />
          <DashboardCard
            title="المبيعات"
            value={`${dashboardData.financial.totalSales.toLocaleString()} د.ج`}
            icon="💰"
            color="green"
          />
          <DashboardCard
            title="الرصيد"
            value={`${dashboardData.financial.currentBalance.toLocaleString()} د.ج`}
            icon="🏦"
            color={dashboardData.financial.currentBalance >= 0 ? 'green' : 'red'}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FlockChart data={dashboardData.monthlyTrend} />
          <FinancialChart data={dashboardData.monthlyTrend} />
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <RecentTransactions transactions={dashboardData.recentTransactions} />
        </div>
      </div>
    </div>
  );
}
