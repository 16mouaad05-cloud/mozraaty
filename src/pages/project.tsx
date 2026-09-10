'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';

export default function ProjectPage() {
  const [project, setProject] = useState<any>(null);
  const [flock, setFlock] = useState<any>(null);
  const [financial, setFinancial] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/project');
      const { project, flock, financial } = response.data;
      setProject(project);
      setFlock(flock);
      setFinancial(financial);
    } catch (error) {
      toast.error('خطأ في تحميل بيانات المشروع');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !project) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-600">جاري التحميل...</p>
        </div>
      </Layout>
    );
  }

  const daysActive = Math.floor(
    (new Date().getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Layout>
      <div dir="rtl">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg shadow-lg p-12 mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4">🏠 {project.name}</h1>
          <p className="text-xl opacity-90">{project.description}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-600 text-center">
            <p className="text-gray-600 mb-2">🐑 عدد الأغنام الحالي</p>
            <p className="text-4xl font-bold text-primary-600">{flock.currentCount}</p>
            <p className="text-sm text-gray-500 mt-2">
              تم ببدء المشروع بـ {project.initial_flock_size} رؤوس
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-secondary-600 text-center">
            <p className="text-gray-600 mb-2">📅 مدة المشروع</p>
            <p className="text-4xl font-bold text-secondary-600">{daysActive}</p>
            <p className="text-sm text-gray-500 mt-2">يوم</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600 text-center">
            <p className="text-gray-600 mb-2">📈 نمو القطيع</p>
            <p className="text-4xl font-bold text-green-600">{flock.growthPercentage.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-2">
              من {project.initial_flock_size} إلى {flock.currentCount}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 text-center">
            <p className="text-gray-600 mb-2">💰 الاستثمار</p>
            <p className="text-4xl font-bold text-blue-600">{project.initial_capital.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">دج</p>
          </div>
        </div>

        {/* Flock Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-primary-600 mb-6">🐑 إحصائيات القطيع</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-gray-600 mb-2">المشتريات</p>
              <p className="text-3xl font-bold text-primary-600">{flock.total_purchases}</p>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <p className="text-gray-600 mb-2">المواليد</p>
              <p className="text-3xl font-bold text-secondary-600">{flock.total_births}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-gray-600 mb-2">المبيعات</p>
              <p className="text-3xl font-bold text-green-600">{flock.total_sales}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-gray-600 mb-2">النفوق</p>
              <p className="text-3xl font-bold text-red-600">{flock.total_deaths}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600 mb-2">الحالي</p>
              <p className="text-3xl font-bold text-blue-600">{flock.current_count}</p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-green-600 mb-6">💰 الملخص المالي</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2">رأس المال والاستثمار</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>رأس المال الأولي:</span>
                  <span className="font-bold">{financial.initialCapital.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between">
                  <span>إجمالي الشراء:</span>
                  <span className="font-bold text-red-600">{financial.totalPurchases.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between">
                  <span>الرصيد الحالي:</span>
                  <span className={`font-bold ${
                    financial.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {financial.currentBalance.toLocaleString()} دج
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2">الدخل والمصاريف</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>إجمالي المبيعات:</span>
                  <span className="font-bold text-green-600">{financial.totalSales.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between">
                  <span>إجمالي المصاريف:</span>
                  <span className="font-bold text-red-600">{financial.totalExpenses.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between border-t-2 pt-3">
                  <span className="font-bold">الصافي:</span>
                  <span className={`font-bold text-lg ${
                    financial.netResult >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {financial.netResult >= 0 ? '+' : ''}{financial.netResult.toLocaleString()} دج
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Value */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">📊 إجمالي قيمة المشروع</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-blue-100 mb-2">الرصيد النقدي</p>
              <p className="text-3xl font-bold">{financial.currentBalance.toLocaleString()} دج</p>
            </div>
            <div>
              <p className="text-blue-100 mb-2">+ قيمة القطيع</p>
              <p className="text-3xl font-bold">{financial.estimatedFlockValue.toLocaleString()} دج</p>
            </div>
            <div>
              <p className="text-blue-100 mb-2">= الإجمالي</p>
              <p className="text-4xl font-bold">
                {(financial.currentBalance + financial.estimatedFlockValue).toLocaleString()} دج
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
