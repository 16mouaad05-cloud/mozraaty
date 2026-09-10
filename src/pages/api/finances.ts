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

    const transactions = await queries.getTransactionsByProjectId(PROJECT_ID);

    const financial = calculateFinancialSummary(
      project.initial_capital,
      transactions,
      50000
    );

    res.status(200).json({ financial });
  } catch (error) {
    console.error('Finances error:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
}
