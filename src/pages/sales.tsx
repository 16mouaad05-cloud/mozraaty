'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';

interface SaleForm {
  quantity: number;
  amount: number;
  date: string;
  buyer: string;
  saleCosts: number;
  transportCost: number;
  marketFees: number;
  amountReceived: number;
  notes: string;
}

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SaleForm>({
    quantity: 1,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    buyer: '',
    saleCosts: 0,
    transportCost: 0,
    marketFees: 0,
    amountReceived: 0,
    notes: '',
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions?type=sale');
      setSales(response.data);
    } catch (error) {
      toast.error('خطأ في تحميل المبيعات');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.quantity <= 0 || form.amount <= 0) {
        toast.error('يجب أن تكون الكمية والمبلغ أكبر من 0');
        return;
      }

      await axios.post('/api/sales', form);
      toast.success('تم تسجيل البيع بنجاح! 💰');
      setForm({
        quantity: 1,
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        buyer: '',
        saleCosts: 0,
        transportCost: 0,
        marketFees: 0,
        amountReceived: 0,
        notes: '',
      });
      setShowForm(false);
      fetchSales();
    } catch (error) {
      toast.error('خطأ في تسجيل البيع');
      console.error(error);
    }
  };

  const pricePerSheep = form.quantity > 0 ? (form.amount / form.quantity).toFixed(0) : 0;
  const netAmount = form.amount - (form.saleCosts + form.transportCost + form.marketFees);

  return (
    <Layout>
      <div dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-600">💰 بيع الأغنام</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            {showForm ? '❌ إلغاء' : '➕ بيع جديد'}
          </button>
        </div>

        {/* Add Sale Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">تسجيل عملية بيع جديدة</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">التاريخ</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">عدد الرؤوس</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">المبلغ الإجمالي (دج)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none"
                    required
                    min="0"
                  />
                  {pricePerSheep !== 0 && (
                    <p className="text-sm text-green-600 mt-1">السعر للرأس: {pricePerSheep} دج</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">المشتري</label>
                  <input
                    type="text"
                    value={form.buyer}
                    onChange={(e) => setForm({ ...form, buyer: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none"
                    placeholder="اسم المشتري (اختياري)"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">تكاليف البيع (دج)</label>
                  <input
                    type="number"
                    value={form.saleCosts}
                    onChange={(e) => setForm({ ...form, saleCosts: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">تكاليف النقل (دج)</label>
                  <input
                    type="number"
                    value={form.transportCost}
                    onChange={(e) => setForm({ ...form, transportCost: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">رسوم السوق (دج)</label>
                  <input
                    type="number"
                    value={form.marketFees}
                    onChange={(e) => setForm({ ...form, marketFees: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">المبلغ المستلم (دج)</label>
                  <input
                    type="number"
                    value={form.amountReceived}
                    onChange={(e) => setForm({ ...form, amountReceived: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none"
                    min="0"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">المبلغ الإجمالي:</p>
                    <p className="text-2xl font-bold text-green-600">{form.amount.toLocaleString()} دج</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">إجمالي التكاليف:</p>
                    <p className="text-2xl font-bold text-red-600">
                      {(form.saleCosts + form.transportCost + form.marketFees).toLocaleString()} دج
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">الصافي:</p>
                    <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {netAmount.toLocaleString()} دج
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 mt-6">ملاحظات</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none"
                  placeholder="أي ملاحظات إضافية (اختيارية)"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition mt-6"
              >
                ✅ تسجيل البيع
              </button>
            </form>
          </div>
        )}

        {/* Sales List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">سجل المبيعات</h2>
          {sales.length === 0 ? (
            <p className="text-center text-gray-600 py-8">لم تتم أي مبيعات حتى الآن</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50 border-b-2 border-green-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">التاريخ</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">عدد الرؤوس</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">المبلغ</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">المشتري</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale: any) => (
                    <tr key={sale.id} className="border-b hover:bg-green-50 transition">
                      <td className="px-4 py-3 text-gray-600">{sale.date}</td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">{sale.quantity}</td>
                      <td className="px-4 py-3 text-gray-800 font-bold">{sale.amount.toLocaleString()} دج</td>
                      <td className="px-4 py-3 text-gray-600">{sale.buyer || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{sale.notes || '-'}</td>
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
