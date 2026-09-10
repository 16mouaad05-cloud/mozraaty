'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';

export default function Reports() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reports?period=${selectedPeriod}`);
      setReportData(response.data);
    } catch (error) {
      toast.error('خطأ في تحميل التقارير');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !reportData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-600">جاري التحميل...</p>
        </div>
      </Layout>
    );
  }

  const { flock, financial, monthlyData } = reportData;

  return (
    <Layout>
      <div dir="rtl">
        <h1 className="text-4xl font-bold text-primary-600 mb-8">📈 التقارير</h1>

        {/* Period Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <label className="block text-gray-700 font-bold mb-4">اختر الفترة:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedPeriod('all');
                fetchReports();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedPeriod === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => {
                setSelectedPeriod('month');
                fetchReports();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedPeriod === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              هذا الشهر
            </button>
            <button
              onClick={() => {
                setSelectedPeriod('year');
                fetchReports();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedPeriod === 'year'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              هذه السنة
            </button>
          </div>
        </div>

        {/* Flock Report */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-primary-600 mb-6">🐑 تقرير القطيع</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">العدد الحالي</p>
              <p className="text-4xl font-bold text-primary-600">{flock.currentCount}</p>
              <p className="text-sm text-gray-500 mt-1">رأس</p>
            </div>
            <div className="bg-secondary-50 border-2 border-secondary-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">المواليد</p>
              <p className="text-4xl font-bold text-secondary-600">{flock.totalBirths}</p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">المشتريات</p>
              <p className="text-4xl font-bold text-blue-600">{flock.totalPurchases}</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">المبيعات</p>
              <p className="text-4xl font-bold text-green-600">{flock.totalSales}</p>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">النفوق</p>
              <p className="text-4xl font-bold text-red-600">{flock.totalDeaths}</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <span className="font-bold">نمو القطيع:</span>
              <span className={`ml-2 font-bold ${
                flock.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {flock.growthPercentage >= 0 ? '+' : ''}{flock.growthPercentage.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>

        {/* Financial Report */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-green-600 mb-6">💰 التقرير المالي</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 pb-2">الأموال الداخلة ✅</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>المبيعات:</span>
                  <span className="font-bold text-green-600">{financial.totalSales.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between border-t-2 pt-3">
                  <span className="font-bold">الإجمالي:</span>
                  <span className="font-bold text-green-600 text-lg">{financial.totalIncome.toLocaleString()} دج</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 pb-2">الأموال الخارجة ❌</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>شراء الأغنام:</span>
                  <span className="font-bold text-red-600">{financial.totalPurchases.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between">
                  <span>مصاريف أخرى:</span>
                  <span className="font-bold text-red-600">{financial.totalExpenses.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between border-t-2 pt-3">
                  <span className="font-bold">الإجمالي:</span>
                  <span className="font-bold text-red-600 text-lg">
                    {(financial.totalPurchases + financial.totalExpenses).toLocaleString()} دج
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-8 p-6 rounded-lg ${
            financial.netResult >= 0
              ? 'bg-green-50 border-2 border-green-300'
              : 'bg-yellow-50 border-2 border-yellow-300'
          }`}>
            <p className={`text-2xl font-bold ${
              financial.netResult >= 0 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {financial.netResult >= 0 ? '📈 النتيجة النهائية (ربح)' : '⏳ النتيجة النهائية'}
            </p>
            <p className={`text-4xl font-bold mt-2 ${
              financial.netResult >= 0 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {financial.netResult >= 0 ? '+' : ''}{financial.netResult.toLocaleString()} دج
            </p>
            <p className="text-gray-600 mt-2">
              نسبة الربح: <span className="font-bold">{financial.profitMargin.toFixed(1)}%</span>
            </p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        {monthlyData && monthlyData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-primary-600 mb-6">📅 التفصيل الشهري</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-50 border-b-2 border-primary-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">الشهر</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">الدخل</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">المصاريف</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">صافي</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">نمو القطيع</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month: any) => (
                    <tr key={month.month} className="border-b hover:bg-primary-50 transition">
                      <td className="px-4 py-3 font-bold">{month.month}</td>
                      <td className="px-4 py-3 text-green-600 font-bold">{month.income.toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-600 font-bold">{month.expenses.toLocaleString()}</td>
                      <td className={`px-4 py-3 font-bold ${
                        month.income - month.expenses >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(month.income - month.expenses).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{month.flockChange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
