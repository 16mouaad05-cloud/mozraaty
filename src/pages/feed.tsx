'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';

interface FeedItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  unitPrice: number;
  totalCost: number;
}

export default function Feed() {
  const [feedTypes, setFeedTypes] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [feedName, setFeedName] = useState('');
  const [feedUnit, setFeedUnit] = useState('كغ');

  useEffect(() => {
    fetchFeedTypes();
  }, []);

  const fetchFeedTypes = async () => {
    try {
      setLoading(true);
      // Placeholder for feed types - in production this would fetch from API
      const mockData = [
        {
          id: '1',
          name: 'الشعير',
          unit: 'كغ',
          currentStock: 500,
          unitPrice: 50,
          totalCost: 25000,
        },
        {
          id: '2',
          name: 'التبن',
          unit: 'كغ',
          currentStock: 1000,
          unitPrice: 20,
          totalCost: 20000,
        },
      ];
      setFeedTypes(mockData);
    } catch (error) {
      toast.error('خطأ في تحميل بيانات العلف');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add feed logic here
      toast.success('تمت إضافة نوع علف جديد بنجاح!');
      setFeedName('');
      setFeedUnit('كغ');
      setShowForm(false);
      fetchFeedTypes();
    } catch (error) {
      toast.error('خطأ في إضافة العلف');
    }
  };

  return (
    <Layout>
      <div dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600">🌾 إدارة العلف والمواد الغذائية</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition"
          >
            {showForm ? '✕ إلغاء' : '➕ نوع علف جديد'}
          </button>
        </div>

        {/* Add Feed Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">إضافة نوع علف جديد</h2>
            <form onSubmit={handleAddFeed}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">اسم العلف</label>
                  <input
                    type="text"
                    value={feedName}
                    onChange={(e) => setFeedName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                    placeholder="مثال: الشعير، التبن، الدريس"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">وحدة القياس</label>
                  <select
                    value={feedUnit}
                    onChange={(e) => setFeedUnit(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                  >
                    <option>كغ</option>
                    <option>طن</option>
                    <option>كيس</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition mt-6"
              >
                ✅ إضافة العلف
              </button>
            </form>
          </div>
        )}

        {/* Feed Types Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {feedTypes.map((feed) => (
            <div key={feed.id} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{feed.name}</h3>
                  <p className="text-gray-600">وحدة القياس: {feed.unit}</p>
                </div>
                <span className="text-3xl">🌾</span>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">المخزون الحالي</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {feed.currentStock} {feed.unit}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">سعر الوحدة</p>
                  <p className="text-3xl font-bold text-green-600">{feed.unitPrice} دج</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">إجمالي التكلفة</p>
                  <p className="text-3xl font-bold text-purple-600">{feed.totalCost.toLocaleString()} دج</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 flex gap-2">
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition">
                  ➕ شراء
                </button>
                <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition">
                  📊 استهلاك
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feed Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 ملخص العلف</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <p className="text-gray-600 mb-2">إجمالي المخزون</p>
              <p className="text-4xl font-bold text-blue-600">
                {feedTypes.reduce((sum, f) => sum + f.currentStock, 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">كغ</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-gray-600 mb-2">إجمالي التكلفة</p>
              <p className="text-4xl font-bold text-green-600">
                {feedTypes.reduce((sum, f) => sum + f.totalCost, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">دج</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <p className="text-gray-600 mb-2">عدد الأنواع</p>
              <p className="text-4xl font-bold text-purple-600">{feedTypes.length}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
