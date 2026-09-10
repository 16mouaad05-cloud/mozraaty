'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';

interface BirthForm {
  quantity: number;
  maleCount: number;
  femaleCount: number;
  date: string;
  notes: string;
}

export default function Births() {
  const [births, setBirths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BirthForm>({
    quantity: 1,
    maleCount: 0,
    femaleCount: 1,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchBirths();
  }, []);

  const fetchBirths = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions?type=birth');
      setBirths(response.data);
    } catch (error) {
      toast.error('خطأ في تحميل الولادات');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.quantity <= 0) {
        toast.error('يجب أن تكون عدد المواليد أكبر من 0');
        return;
      }

      if (form.maleCount + form.femaleCount !== form.quantity) {
        toast.error('عدد الذكور والإناث يجب أن يساوي العدد الكلي');
        return;
      }

      await axios.post('/api/births', form);
      toast.success('تم تسجيل الولادة بنجاح! 🐣');
      setForm({
        quantity: 1,
        maleCount: 0,
        femaleCount: 1,
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setShowForm(false);
      fetchBirths();
    } catch (error) {
      toast.error('خطأ في تسجيل الولادة');
      console.error(error);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setForm({
      ...form,
      quantity: newQuantity,
      maleCount: Math.floor(newQuantity / 2),
      femaleCount: newQuantity - Math.floor(newQuantity / 2),
    });
  };

  return (
    <Layout>
      <div dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-secondary-600">🐣 الولادات</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-secondary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary-700 transition"
          >
            {showForm ? '❌ إلغاء' : '➕ تسجيل ولادة'}
          </button>
        </div>

        {/* Add Birth Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">تسجيل ولادة جديدة</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">التاريخ</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">عدد المواليد الكلي</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-600 outline-none"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">عدد الذكور 🐏</label>
                  <input
                    type="number"
                    value={form.maleCount}
                    onChange={(e) => setForm({ ...form, maleCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-600 outline-none"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">عدد الإناث 🐑</label>
                  <input
                    type="number"
                    value={form.femaleCount}
                    onChange={(e) => setForm({ ...form, femaleCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-600 outline-none"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="bg-secondary-50 border-2 border-secondary-200 rounded-lg p-6 mt-6">
                <p className="text-gray-700">
                  الإجمالي: <span className="font-bold text-2xl text-secondary-600">{form.maleCount + form.femaleCount}</span> مولود
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 mt-6">ملاحظات</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-secondary-600 outline-none"
                  placeholder="أي ملاحظات عن الولادة (اختيارية)"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-secondary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary-700 transition mt-6"
              >
                ✅ تسجيل الولادة
              </button>
            </form>
          </div>
        )}

        {/* Births List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">سجل الولادات</h2>
          {births.length === 0 ? (
            <p className="text-center text-gray-600 py-8">لم تحدث أي ولادات حتى الآن</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b-2 border-secondary-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">التاريخ</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">المجموع</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">ذكور</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">إناث</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {births.map((birth: any) => (
                    <tr key={birth.id} className="border-b hover:bg-secondary-50 transition">
                      <td className="px-4 py-3 text-gray-600">{birth.date}</td>
                      <td className="px-4 py-3 text-gray-800 font-bold text-lg">{birth.quantity}</td>
                      <td className="px-4 py-3 text-gray-800">🐏 {birth.maleCount}</td>
                      <td className="px-4 py-3 text-gray-800">🐑 {birth.femaleCount}</td>
                      <td className="px-4 py-3 text-gray-600">{birth.notes || '-'}</td>
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
