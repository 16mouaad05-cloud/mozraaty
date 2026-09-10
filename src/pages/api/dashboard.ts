import type { NextApiRequest, NextApiResponse } = require('next');
import * as queries from '@/db/queries';
import { calculateFinancialSummary, calculateFlockSummary } from '@/utils/calculations';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'default-project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const project = await queries.getProjectById(PROJECT_ID);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const transactions = await queries.getTransactionsByProjectId(PROJECT_ID, 1000);
    const flock = await queries.getFlockByProjectId(PROJECT_ID);

    const flockSummary = calculateFlockSummary(project.initial_flock_size, transactions);
    const financialSummary = calculateFinancialSummary(
      project.initial_capital,
      transactions,
      50000 // estimated price per sheep
    );

    // Get recent transactions (last 10)
    const recentTransactions = transactions.slice(0, 10);

    // Calculate monthly trend
    const monthlyTrend = calculateMonthlyTrend(transactions);

    res.status(200).json({
      project,
      flock: flockSummary,
      financial: financialSummary,
      recentTransactions,
      monthlyTrend,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}

function calculateMonthlyTrend(transactions: any[]) {
  const monthlyData: Record<string, any> = {};

  transactions.forEach((t) => {
    const date = new Date(t.transaction_date);
    const month = date.toLocaleDateString('ar-DZ', { month: 'long', year: 'numeric' });

    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        expenses: 0,
        income: 0,
        flockChange: 0,
      };
    }

    if (t.type === 'expense' || t.type === 'purchase') {
      monthlyData[month].expenses += t.amount || 0;
    } else if (t.type === 'sale' || t.type === 'income') {
      monthlyData[month].income += t.amount || 0;
    }

    if (['birth', 'purchase'].includes(t.type)) {
      monthlyData[month].flockChange += t.quantity || 0;
    } else if (['sale', 'death'].includes(t.type)) {
      monthlyData[month].flockChange -= t.quantity || 0;
    }
  });

  return Object.values(monthlyData).reverse();
}
