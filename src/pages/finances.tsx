'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';
import DashboardCard from '@components/DashboardCard';

export default function Finances() {
  const [financialData, setFinancialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/finances');
      setFinancialData(response.data);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات المالية');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !financialData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl">💰</div>
            <p className="mt-4 text-xl text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { financial, flock } = financialData;
  const isProfit = financial.netResult >= 0;

  return (
    <Layout>
      <div dir="rtl">
        <h1 className="text-4xl font-bold text-primary-600 mb-8">💰 أموال المشروع</h1>

        {/* Main Financial Summary */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-primary-100 mb-2">رأس المال الأولي</p>
              <p className="text-4xl font-bold">{financial.initialCapital.toLocaleString()} دج</p>
            </div>
            <div>
              <p className="text-primary-100 mb-2">الرصيد النقدي الحالي</p>
              <p className={`text-4xl font-bold ${
                financial.currentBalance >= 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                {financial.currentBalance.toLocaleString()} دج
              </p>
            </div>
            <div>
              <p className="text-primary-100 mb-2">إجمالي قيمة المشروع</p>
              <p className="text-4xl font-bold">
                {(financial.currentBalance + financial.estimatedFlockValue).toLocaleString()} دج
              </p>
            </div>
          </div>
        </div>

        {/* Income and Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-600">
            <h2 className="text-2xl font-bold text-green-600 mb-6">✅ الأموال الداخلة</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b-2">
                <span className="text-gray-700 font-semibold">من بيع الأغنام:</span>
                <span className="text-2xl font-bold text-green-600">
                  {financial.totalSales.toLocaleString()} دج
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b-2">
                <span className="text-gray-700 font-semibold">إجمالي الدخل:</span>
                <span className="text-2xl font-bold text-green-600">
                  {financial.totalIncome.toLocaleString()} دج
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-600">
            <h2 className="text-2xl font-bold text-red-600 mb-6">❌ الأموال الخارجة</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b-2">
                <span className="text-gray-700 font-semibold">شراء الأغنام:</span>
                <span className="text-2xl font-bold text-red-600">
                  {financial.totalPurchases.toLocaleString()} دج
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b-2">
                <span className="text-gray-700 font-semibold">مصاريف أخرى:</span>
                <span className="text-2xl font-bold text-red-600">
                  {financial.totalExpenses.toLocaleString()} دج
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-700 font-bold text-lg">إجمالي المصاريف:</span>
                <span className="text-3xl font-bold text-red-600">
                  {(financial.totalPurchases + financial.totalExpenses).toLocaleString()} دج
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assets and Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">💵 الأصول</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>القطيع الحالي:</span>
                <span className="font-bold">{flock.currentCount} رأس</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-3">
                <span className="font-bold">القيمة المقدرة للقطيع:</span>
                <span className="font-bold text-blue-700">
                  {financial.estimatedFlockValue.toLocaleString()} دج
                </span>
              </div>
            </div>
          </div>

          <div
            className={`border-2 rounded-lg p-8 ${
              isProfit
                ? 'bg-green-50 border-green-300'
                : 'bg-yellow-50 border-yellow-300'
            }`}
          >
            <h3 className={`text-2xl font-bold mb-4 ${
              isProfit ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {isProfit ? '📈 النتيجة المالية' : '⚠️ الوضع المالي'}
            </h3>
            <div className="space-y-3">
              <div className={`text-4xl font-bold ${
                isProfit ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {isProfit ? '+' : ''}{financial.netResult.toLocaleString()} دج
              </div>
              <div className="text-sm text-gray-600 pt-3 border-t">
                {isProfit
                  ? `🎉 مشروعك يحقق أرباحًا بنسبة ${financial.profitMargin.toFixed(1)}%`
                  : `⏳ المشروع في مراحله الأولى، استمر في العمل`}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 تفصيل المالية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-700 mb-4">المعادلة المالية:</h3>
              <div className="space-y-2 text-sm">
                <div>رأس المال: <span className="font-bold">{financial.initialCapital.toLocaleString()}</span> دج</div>
                <div>+ الدخل: <span className="font-bold text-green-600">+{financial.totalIncome.toLocaleString()}</span> دج</div>
                <div>- المصاريف: <span className="font-bold text-red-600">-{financial.totalExpenses.toLocaleString()}</span> دج</div>
                <div>- الشراء: <span className="font-bold text-red-600">-{financial.totalPurchases.toLocaleString()}</span> دج</div>
                <div className="border-t-2 pt-2 font-bold">
                  = الرصيد الحالي: <span className={isProfit ? 'text-green-600' : 'text-red-600'}>
                    {financial.currentBalance.toLocaleString()}
                  </span> دج
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-700 mb-4">قيمة المشروع الكلية:</h3>
              <div className="space-y-2 text-sm">
                <div>الرصيد النقدي: <span className="font-bold">{financial.currentBalance.toLocaleString()}</span> دج</div>
                <div>+ القطيع ({flock.currentCount} رأس): <span className="font-bold text-blue-600">+{financial.estimatedFlockValue.toLocaleString()}</span> دج</div>
                <div className="border-t-2 pt-2 font-bold">
                  = إجمالي القيمة:
                  <span className="text-primary-600 ml-2">
                    {(financial.currentBalance + financial.estimatedFlockValue).toLocaleString()}
                  </span>
                  دج
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
