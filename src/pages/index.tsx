'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary-600">🐑 مزرعتي</h1>
          <div className="space-x-4 space-x-reverse">
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
              لوحة التحكم
            </Link>
            <Link href="/settings" className="text-primary-600 hover:text-primary-700 font-medium">
              الإعدادات
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            🐑 مزرعتي
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            تطبيق متكامل لإدارة مشروع تربية الأغنام الخاص بك
          </p>
          <p className="text-lg text-gray-500 mb-12">
            راقب نمو قطيعك، وتحكم في أموالك، وابنِ مشروعاً يستمر في النمو
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-5xl mb-4">🐑</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">إدارة القطيع</h3>
              <p className="text-gray-600">
                تتبع عدد الأغنام والولادات والمبيعات والنفوق بسهولة
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">إدارة الأموال</h3>
              <p className="text-gray-600">
                احسب الأرباح والخسائر وتابع رأس المال والمصاريف
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">التقارير</h3>
              <p className="text-gray-600">
                احصل على تقارير شاملة ورسوم بيانية لنمو مشروعك
              </p>
            </div>
          </div>

          <div className="space-x-4 space-x-reverse">
            <Link
              href="/dashboard"
              className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-700 transition"
            >
              ابدأ الآن
            </Link>
            <Link
              href="/setup"
              className="inline-block bg-secondary-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-secondary-700 transition"
            >
              إعداد المشروع
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-12">المميزات الرئيسية</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4 space-x-reverse">
              <span className="text-3xl">✅</span>
              <div>
                <h4 className="text-xl font-bold mb-2">حساب تلقائي للعدد</h4>
                <p className="text-gray-600">يتم حساب عدد الأغنام تلقائياً مع كل عملية شراء أو ولادة أو بيع أو نفوق</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 space-x-reverse">
              <span className="text-3xl">✅</span>
              <div>
                <h4 className="text-xl font-bold mb-2">سجل كامل للعمليات</h4>
                <p className="text-gray-600">احفظ تاريخ كل حدث مع تفاصيل كاملة وملاحظات</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 space-x-reverse">
              <span className="text-3xl">✅</span>
              <div>
                <h4 className="text-xl font-bold mb-2">حسابات مالية دقيقة</h4>
                <p className="text-gray-600">اعرف الفرق بين الرصيد النقدي وقيمة القطيع</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 space-x-reverse">
              <span className="text-3xl">✅</span>
              <div>
                <h4 className="text-xl font-bold mb-2">تعديل وحذف آمن</h4>
                <p className="text-gray-600">عدّل أي عملية في أي وقت وسيتم تحديث الحسابات تلقائياً</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 مزرعتي - جميع الحقوق محفوظة</p>
          <p className="text-sm text-gray-400 mt-2">تطبيق متخصص لإدارة مشاريع تربية الأغنام</p>
        </div>
      </footer>
    </div>
  );
}
