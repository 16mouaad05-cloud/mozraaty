'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';

export default function Flock() {
  const [flockData, setFlockData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFlockData();
  }, []);

  const fetchFlockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/project');
      const transResponse = await axios.get('/api/transactions');
      setFlockData(response.data);
      setTransactions(transResponse.data || []);
    } catch (error) {
      toast.error('خطأ في تحميل بيانات القطيع');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !flockData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-600">جاري التحميل...</p>
        </div>
      </Layout>
    );
  }

  const { flock } = flockData;

  const flockTransactions = transactions.filter((t) =>
    ['purchase', 'birth', 'sale', 'death'].includes(t.type)
  );

  return (
    <Layout>
      <div dir="rtl">
        <h1 className="text-4xl font-bold text-primary-600 mb-8">🐑 إدارة القطيع</h1>

        {/* Flock Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-2">العدد الحالي</p>
            <p className="text-4xl font-bold text-blue-600">{flock.currentCount}</p>
            <p className="text-sm text-gray-500 mt-1">رأس</p>
          </div>
          <div className="bg-primary-50 border-2 border-primary-300 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-2">المشتريات</p>
            <p className="text-4xl font-bold text-primary-600">{flock.totalPurchases}</p>
          </div>
          <div className="bg-secondary-50 border-2 border-secondary-300 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-2">المواليد</p>
            <p className="text-4xl font-bold text-secondary-600">{flock.totalBirths}</p>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-2">المبيعات</p>
            <p className="text-4xl font-bold text-green-600">{flock.totalSales}</p>
          </div>
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-2">النفوق</p>
            <p className="text-4xl font-bold text-red-600">{flock.totalDeaths}</p>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">📈 نمو القطيع</h2>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-green-100 mb-2">نسبة النمو</p>
              <p className="text-5xl font-bold">{flock.growthPercentage.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">من {flock.currentCount - flock.totalBirths - flock.totalPurchases + flock.totalSales + flock.totalDeaths} إلى {flock.currentCount}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 سجل التغييرات</h2>
          {flockTransactions.length === 0 ? (
            <p className="text-center text-gray-600 py-8">لا توجد عمليات مسجلة حتى الآن</p>
          ) : (
            <div className="space-y-4">
              {flockTransactions.map((transaction: any, index: number) => {
                let icon = '📝';
                let color = 'gray';
                let change = 0;

                if (transaction.type === 'purchase') {
                  icon = '🛒';
                  color = 'blue';
                  change = transaction.quantity;
                } else if (transaction.type === 'birth') {
                  icon = '🐣';
                  color = 'green';
                  change = transaction.quantity;
                } else if (transaction.type === 'sale') {
                  icon = '💰';
                  color = 'purple';
                  change = -transaction.quantity;
                } else if (transaction.type === 'death') {
                  icon = '💀';
                  color = 'red';
                  change = -transaction.quantity;
                }

                return (
                  <div key={transaction.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <span className="text-3xl">{icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.transaction_date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold text-${color}-600`}>
                        {change > 0 ? '+' : ''}{change}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.notes || '-'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
