'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';

interface DeathForm {
  quantity: number;
  date: string;
  cause: string;
  notes: string;
}

export default function Deaths() {
  const [deaths, setDeaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DeathForm>({
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    cause: '',
    notes: '',
  });

  useEffect(() => {
    fetchDeaths();
  }, []);

  const fetchDeaths = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions?type=death');
      setDeaths(response.data);
    } catch (error) {
      toast.error('خطأ في تحميل النفوق');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.quantity <= 0) {
        toast.error('يجب أن يكون عدد النفوق أكبر من 0');
        return;
      }

      await axios.post('/api/deaths', form);
      toast.success('تم تسجيل النفوق بنجاح');
      setForm({
        quantity: 1,
        date: new Date().toISOString().split('T')[0],
        cause: '',
        notes: '',
      });
      setShowForm(false);
      fetchDeaths();
    } catch (error) {
      toast.error('خطأ في تسجيل النفوق');
      console.error(error);
    }
  };

  const commonCauses = ['مرض', 'حادث', 'نقص تغذية', 'عدوى', 'شيخوخة', 'أخرى'];

  return (
    <Layout>
      <div dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">💀 النفوق</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            {showForm ? '❌ إلغاء' : '➕ تسجيل نفوق'}
          </button>
        </div>

        {/* Add Death Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">تسجيل حالة نفوق</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">التاريخ</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">عدد النفوق</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none"
                    required
                    min="1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">السبب</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {commonCauses.map((cause) => (
                      <button
                        key={cause}
                        type="button"
                        onClick={() => setForm({ ...form, cause })}
                        className={`px-3 py-1 rounded-lg font-semibold transition ${
                          form.cause === cause
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {cause}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={form.cause}
                    onChange={(e) => setForm({ ...form, cause: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none"
                    placeholder="أو أدخل السبب يدويًا"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 mt-6">ملاحظات</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none"
                  placeholder="أي ملاحظات إضافية (اختيارية)"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition mt-6"
              >
                ✅ تسجيل النفوق
              </button>
            </form>
          </div>
        )}

        {/* Deaths List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">سجل النفوق</h2>
          {deaths.length === 0 ? (
            <p className="text-center text-gray-600 py-8">لحسن الحظ، لا توجد حالات نفوق مسجلة</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 border-b-2 border-red-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">التاريخ</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">العدد</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">السبب</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {deaths.map((death: any) => (
                    <tr key={death.id} className="border-b hover:bg-red-50 transition">
                      <td className="px-4 py-3 text-gray-600">{death.date}</td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">{death.quantity}</td>
                      <td className="px-4 py-3 text-gray-600">{death.cause || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{death.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
