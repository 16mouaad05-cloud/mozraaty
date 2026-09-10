import type { NextApiRequest, NextApiResponse } = require('next');
import * as queries from '@/db/queries';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'default-project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { type } = req.query;

      const transactions = await queries.getTransactionsByProjectId(PROJECT_ID);
      const filtered = type ? transactions.filter((t: any) => t.type === type) : transactions;

      res.status(200).json(filtered);
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
