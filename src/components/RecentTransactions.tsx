'use client';

import React from 'react';
import { Transaction } from '@types/index';
import { formatDate } from '@utils/date';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const typeIcons: Record<string, string> = {
  purchase: '🛒',
  birth: '🐣',
  sale: '💰',
  death: '💀',
  expense: '💸',
  income: '💵',
};

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 آخر العمليات</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary-50 border-b-2 border-primary-200">
            <tr>
              <th className="px-4 py-3 text-right font-bold text-gray-700">التاريخ</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">العملية</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">الوصف</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">الكمية</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">المبلغ</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-primary-50 transition">
                <td className="px-4 py-3 text-gray-600">{formatDate(transaction.date)}</td>
                <td className="px-4 py-3 text-2xl">{typeIcons[transaction.type] || '📌'}</td>
                <td className="px-4 py-3 text-gray-800 font-semibold">{transaction.description}</td>
                <td className="px-4 py-3 text-gray-600">{transaction.quantity || '-'}</td>
                <td className="px-4 py-3 text-gray-800 font-bold">
                  {transaction.amount.toLocaleString()} د.ج
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
