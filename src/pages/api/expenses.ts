import type { NextApiRequest, NextApiResponse } = require('next');
import * as queries from '@/db/queries';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'default-project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { amount, category, date, description, notes } = req.body;

      // Create expense transaction
      const transaction = await queries.createTransaction(
        PROJECT_ID,
        'expense',
        amount,
        null,
        description,
        category,
        new Date(date),
        notes
      );

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Create expense error:', error);
      res.status(500).json({ error: 'Failed to create expense' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
