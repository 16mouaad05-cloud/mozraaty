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

    const flock = await queries.getFlockByProjectId(PROJECT_ID);
    const transactions = await queries.getTransactionsByProjectId(PROJECT_ID);

    const flockSummary = calculateFlockSummary(project.initial_flock_size, transactions);
    const financial = calculateFinancialSummary(project.initial_capital, transactions);

    res.status(200).json({
      project,
      flock: { ...flock, ...flockSummary },
      financial,
    });
  } catch (error) {
    console.error('Project error:', error);
    res.status(500).json({ error: 'Failed to fetch project data' });
  }
}
