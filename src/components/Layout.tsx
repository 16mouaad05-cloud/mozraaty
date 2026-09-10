'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: '📊' },
    { path: '/flock', label: 'القطيع', icon: '🐑' },
    { path: '/purchases', label: 'الشراء', icon: '🛒' },
    { path: '/births', label: 'الولادات', icon: '🐣' },
    { path: '/sales', label: 'البيع', icon: '💰' },
    { path: '/deaths', label: 'النفوق', icon: '💀' },
    { path: '/expenses', label: 'المصاريف', icon: '💸' },
    { path: '/feed', label: 'العلف', icon: '🌾' },
    { path: '/finances', label: 'أموال المشروع', icon: '💵' },
    { path: '/reports', label: 'التقارير', icon: '📈' },
    { path: '/project', label: 'مشروعي', icon: '🏠' },
  ];

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-6 border-b-2 border-primary-200">
          <h1 className="text-2xl font-bold text-primary-600">🐑 مزرعتي</h1>
        </div>
        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-3 mb-2 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-primary-600 text-white font-bold'
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
            >
              <span className="ml-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white shadow sticky top-0 z-10 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">إدارة المشروع</h2>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/settings" className="text-primary-600 hover:text-primary-700">
              ⚙️ الإعدادات
            </Link>
            <button className="text-gray-600 hover:text-gray-800" onClick={() => router.push('/')}>
              🚪 خروج
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
