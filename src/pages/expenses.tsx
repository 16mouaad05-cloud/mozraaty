'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@components/Layout';
import toast from 'react-hot-toast';

interface ExpenseForm {
  amount: number;
  category: string;
  date: string;
  description: string;
  notes: string;
}

const categories = [
  { value: 'feed', label: '🌾 العلف' },
  { value: 'hay', label: '🌿 التبن' },
  { value: 'barley', label: '🌽 الشعير' },
  { value: 'medicine', label: '💊 الأدوية' },
  { value: 'vaccine', label: '💉 اللقاحات' },
  { value: 'veterinary', label: '🩺 الطبيب البيطري' },
  { value: 'transport', label: '🚚 النقل' },
  { value: 'water', label: '💧 الماء' },
  { value: 'electricity', label: '⚡ الكهرباء' },
  { value: 'barn', label: '🏠 الحظيرة' },
  { value: 'maintenance', label: '🔧 الصيانة' },
  { value: 'equipment', label: '🛠 المعدات' },
  { value: 'market_fees', label: '🛒 رسوم السوق' },
  { value: 'other', label: '📦 أخرى' },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [form, setForm] = useState<ExpenseForm>({
    amount: 0,
    category: 'feed',
    date: new Date().toISOString().split('T')[0],
    description: '',
    notes: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions?type=expense');
      setExpenses(response.data);
      const total = response.data.reduce((sum: number, exp: any) => sum + exp.amount, 0);
      setTotalExpenses(total);
    } catch (error) {
      toast.error('خطأ في تحميل المصاريف');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.amount <= 0) {
        toast.error('يجب أن يكون المبلغ أكبر من 0');
        return;
      }

      await axios.post('/api/expenses', form);
      toast.success('تم تسجيل المصروف بنجاح! 💸');
      setForm({
        amount: 0,
        category: 'feed',
        date: new Date().toISOString().split('T')[0],
        description: '',
        notes: '',
      });
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      toast.error('خطأ في تسجيل المصروف');
      console.error(error);
    }
  };

  const filteredExpenses = filterCategory
    ? expenses.filter((exp: any) => exp.category === filterCategory)
    : expenses;

  const getCategoryLabel = (value: string) => {
    return categories.find((cat) => cat.value === value)?.label || value;
  };

  return (
    <Layout>
      <div dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">💸 المصاريف</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            {showForm ? '❌ إلغاء' : '➕ مصروف جديد'}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-1">إجمالي المصاريف</p>
            <p className="text-4xl font-bold text-red-600">{totalExpenses.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">دج</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-1">عدد العمليات</p>
            <p className="text-4xl font-bold text-blue-600">{expenses.length}</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-1">المتوسط لكل مصروف</p>
            <p className="text-4xl font-bold text-purple-600">
              {expenses.length > 0 ? Math.round(totalExpenses / expenses.length).toLocaleString() : 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">دج</p>
          </div>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">تسجيل مصروف جديد</h2>
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
                  <label className="block text-gray-700 font-bold mb-2">المبلغ (دج)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none"
                    required
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">الفئة</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">الوصف</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none"
                    placeholder="مثال: علف جودة عالية"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">ملاحظات</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none"
                    placeholder="أي معلومات إضافية (اختيارية)"
                    rows={3}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition mt-6"
              >
                ✅ تسجيل المصروف
              </button>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <label className="block text-gray-700 font-bold mb-2">تصفية حسب الفئة:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterCategory === ''
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filterCategory === cat.value
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.label.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">سجل المصاريف</h2>
          {filteredExpenses.length === 0 ? (
            <p className="text-center text-gray-600 py-8">لا توجد مصاريف في هذه الفئة</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 border-b-2 border-red-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">التاريخ</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">الفئة</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">الوصف</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">المبلغ</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense: any) => (
                    <tr key={expense.id} className="border-b hover:bg-red-50 transition">
                      <td className="px-4 py-3 text-gray-600">{expense.date}</td>
                      <td className="px-4 py-3">{getCategoryLabel(expense.category)}</td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">{expense.description}</td>
                      <td className="px-4 py-3 text-gray-800 font-bold">{expense.amount.toLocaleString()} دج</td>
                      <td className="px-4 py-3 text-gray-600">{expense.notes || '-'}</td>
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
