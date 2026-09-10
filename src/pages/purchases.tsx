'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';

interface PurchaseForm {
  quantity: number;
  amount: number;
  date: string;
  seller: string;
  transportCost: number;
  marketFees: number;
  additionalCosts: number;
  paymentMethod: string;
  amountPaid: number;
  notes: string;
}

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PurchaseForm>({
    quantity: 1,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    seller: '',
    transportCost: 0,
    marketFees: 0,
    additionalCosts: 0,
    paymentMethod: 'نقدي',
    amountPaid: 0,
    notes: '',
  });

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions?type=purchase');
      setPurchases(response.data);
    } catch (error) {
      toast.error('خطأ في تحميل المشتريات');
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

      await axios.post('/api/purchases', form);
      toast.success('تم تسجيل الشراء بنجاح! 🐑');
      setForm({
        quantity: 1,
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        seller: '',
        transportCost: 0,
        marketFees: 0,
        additionalCosts: 0,
        paymentMethod: 'نقدي',
        amountPaid: 0,
        notes: '',
      });
      setShowForm(false);
      fetchPurchases();
    } catch (error) {
      toast.error('خطأ في تسجيل الشراء');
      console.error(error);
    }
  };

  const pricePerSheep = form.quantity > 0 ? (form.amount / form.quantity).toFixed(0) : 0;
  const totalCost = form.amount + form.transportCost + form.marketFees + form.additionalCosts;

  return (
    <Layout>
      <div dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600">🛒 شراء الأغنام</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition"
          >
            {showForm ? '❌ إلغاء' : '➕ شراء جديد'}
          </button>
        </div>

        {/* Add Purchase Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">تسجيل عملية شراء جديدة</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">التاريخ</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">عدد الرؤوس</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
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
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                    required
                    min="0"
                  />
                  {pricePerSheep !== 0 && (
                    <p className="text-sm text-primary-600 mt-1">السعر للرأس: {pricePerSheep} دج</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">البائع</label>
                  <input
                    type="text"
                    value={form.seller}
                    onChange={(e) => setForm({ ...form, seller: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                    placeholder="اسم البائع (اختياري)"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">تكاليف النقل (دج)</label>
                  <input
                    type="number"
                    value={form.transportCost}
                    onChange={(e) => setForm({ ...form, transportCost: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">رسوم السوق (دج)</label>
                  <input
                    type="number"
                    value={form.marketFees}
                    onChange={(e) => setForm({ ...form, marketFees: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">مصاريف إضافية (دج)</label>
                  <input
                    type="number"
                    value={form.additionalCosts}
                    onChange={(e) => setForm({ ...form, additionalCosts: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">طريقة الدفع</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                  >
                    <option>نقدي</option>
                    <option>تحويل بنكي</option>
                    <option>شيك</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">المبلغ المدفوع (دج)</label>
                  <input
                    type="number"
                    value={form.amountPaid}
                    onChange={(e) => setForm({ ...form, amountPaid: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                    min="0"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">تكلفة الشراء الأساسية:</p>
                    <p className="text-2xl font-bold text-primary-600">{form.amount.toLocaleString()} دج</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">إجمالي التكاليف الإضافية:</p>
                    <p className="text-2xl font-bold text-red-600">
                      {(form.transportCost + form.marketFees + form.additionalCosts).toLocaleString()} دج
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">إجمالي المبلغ:</p>
                    <p className="text-2xl font-bold text-secondary-600">{totalCost.toLocaleString()} دج</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 mt-6">ملاحظات</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-600 outline-none"
                  placeholder="أي ملاحظات إضافية (اختيارية)"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition mt-6"
              >
                ✅ تسجيل الشراء
              </button>
            </form>
          </div>
        )}

        {/* Purchases List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">سجل المشتريات</h2>
          {purchases.length === 0 ? (
            <p className="text-center text-gray-600 py-8">لا توجد مشتريات حتى الآن</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-50 border-b-2 border-primary-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">التاريخ</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">عدد الرؤوس</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">المبلغ</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">البائع</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase: any) => (
                    <tr key={purchase.id} className="border-b hover:bg-primary-50 transition">
                      <td className="px-4 py-3 text-gray-600">{purchase.date}</td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">{purchase.quantity}</td>
                      <td className="px-4 py-3 text-gray-800 font-bold">{purchase.amount.toLocaleString()} دج</td>
                      <td className="px-4 py-3 text-gray-600">{purchase.seller || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{purchase.notes || '-'}</td>
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
